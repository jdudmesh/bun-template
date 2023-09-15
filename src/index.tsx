import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"
import { cookie } from "@elysiajs/cookie"
import "@kitajs/html/register"
import Html from "@kitajs/html"
import { createId } from "@paralleldrive/cuid2"

import { LocalDatabase as CreateDatabase } from "./lib/database"
import { HomePage } from "./home"
import { LoginPage } from "./login"
import { SignupPage } from "./signup"
import { AuthButtons } from "./components/authbuttons"
// TODO: share with client, don't duplicate
import { LoginSchema, SignupSchema } from "./lib/auth_schema"
import { ZodError } from "zod"

// Because of the Typescript gymnastics in ElysiaJS it's not possible to write separate handler functions
// ElysiaJS html() is nasty. It overwrites whatever headers you set

const databasePath = ":memory:"

function PageTemplate({ children }: Html.PropsWithChildren) {
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bun Template</title>
      <script src="/static/dist/js/main.js" defer></script>
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png"/>
      <style>
        [x-cloak] { display: none !important; }
      </style>
    </head>
    <body x-cloak class="w-screen h-screen flex flex-col justify-stretch items-stretch">
      ${children}
    </body>
  </html>`
}

export const html = () =>
  new Elysia({
    name: "html",
  }).derive(({ set }) => ({
    html(value: string) {
      const headers: Record<string, string> = {
        "content-type": "text/html; charset=utf8",
      }
      Object.entries(set.headers).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          headers[k] = v.join(" ")
        } else {
          headers[k] = v
        }
      })
      return new Response(value, {
        headers: headers,
      })
    },
  }))

const session = () =>
  new Elysia({
    name: "session",
  })
    .use(cookie())
    .decorate("db", CreateDatabase(databasePath))
    .derive((ctx) => {
      if (ctx.request.url.startsWith("/static")) {
        return { sessionID: null, userID: null, csrfToken: null }
      }
      let sessionID = ctx.cookie.session
      let userID: string | null = null
      let csrfToken: string | null = null
      let shouldCreateSession = true
      const now = Math.floor(Date.now().valueOf() / 1000)

      const existing = ctx.db.FindSession(sessionID)
      if (existing) {
        if (existing.expiresAt > now) {
          userID = existing.userID
          csrfToken = existing.csrfToken
          shouldCreateSession = false
        } else {
          ctx.db.DeleteSession(sessionID)
        }
      }

      if (shouldCreateSession) {
        sessionID = createId()
        ctx.db.InsertSession(sessionID, null)
      } else {
        ctx.db.UpdateSessionExpiry(sessionID)
      }

      ctx.setCookie("session", sessionID, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: 86400,
      })
      return { sessionID, userID, csrfToken }
    })

const app = new Elysia()
  .use(staticPlugin({ assets: "./static", prefix: "/static" }))
  .use(session())
  .use(html())
  .get("/", ({ html }) =>
    html(
      <PageTemplate>
        <HomePage />
      </PageTemplate>
    )
  )
  .get("/login", ({ html, set, userID }) => {
    if (userID) {
      set.redirect = "/"
      return
    }
    return html(
      <PageTemplate>
        <LoginPage />
      </PageTemplate>
    )
  })
  .get("/signup", ({ html, set, userID }) => {
    if (userID) {
      set.redirect = "/"
      return
    }
    return html(
      <PageTemplate>
        <SignupPage />
      </PageTemplate>
    )
  })
  .get("/components/auth", ({ html, userID }) => {
    return html(<AuthButtons isLoggedIn={!!userID} />)
  })
  .get("/api/csrf", ({ set, sessionID, db }) => {
    const csrfToken = db.RotateCSRFToken(sessionID)
    return { csrfToken }
  })
  .post("/api/signup", async ({ body, set, sessionID, userID, csrfToken, db }) => {
    if (userID) {
      const nextCSRFToken = db.RotateCSRFToken(sessionID)
      set.status = 400
      return { error: "Already logged in", csrfToken: nextCSRFToken }
    }

    try {
      const params = SignupSchema.parse(body)
      if (!params.csrfToken) {
        set.status = 400
        return { error: "CSRF token missing" }
      }

      if (csrfToken !== params.csrfToken) {
        const nextCSRFToken = db.RotateCSRFToken(sessionID)
        set.status = 400
        return { error: "Invalid CSRF token", csrfToken: nextCSRFToken }
      }

      const existing = db.FindUserByEmail(params.email)
      if (existing) {
        const nextCSRFToken = db.RotateCSRFToken(sessionID)
        set.status = 400
        return { error: "User already exists", csrfToken: nextCSRFToken }
      }

      const userID = createId()
      const password = await Bun.password.hash(params.password)

      db.InsertUser(userID, params.name, params.email, password)
      db.UpdateSessionWithUserID(sessionID, userID)

      set.status = 201
      return { userID, name: params.name, email: params.email }
    } catch (e) {
      const nextCSRFToken = db.RotateCSRFToken(sessionID)
      if (e instanceof ZodError) {
        const zerr = e as ZodError
        set.status = 400
        return { error: zerr.message, csrfToken: nextCSRFToken }
      }
      set.status = 500
      return { error: "Request failed", csrfToken: nextCSRFToken }
    }
  })
  .post("/api/login", async ({ body, set, sessionID, db }) => {
    try {
      const params = LoginSchema.parse(body)
      const existing = db.FindUserByEmail(params.email)
      if (!existing) {
        set.status = 400
        return { error: "Invalid email address or password" }
      }

      const passwordValid = await Bun.password.verify(params.password, existing.password)
      if (!passwordValid) {
        set.status = 400
        return { error: "Invalid email address or password" }
      }

      db.UpdateSessionWithUserID(sessionID, existing.id)

      set.status = 200
      set.headers = { "HX-Trigger": "user-logged-in" }

      return { id: existing.id, name: existing.name, email: existing.email }
    } catch (e) {
      if (e instanceof ZodError) {
        const zerr = e as ZodError
        set.status = 400
        return { error: zerr.message }
      }
      set.status = 500
      return { error: "Request failed" }
    }
  })
  .post("/api/logout", async ({ set, sessionID, removeCookie, db }) => {
    db.DeleteSession(sessionID)
    removeCookie("session")
    set.status = 200
    set.headers = { "HX-Trigger": "user-logged-out" }
  })
  .listen(3000)

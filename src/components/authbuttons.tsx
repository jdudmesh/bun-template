import * as elements from "typed-html"

export function AuthButtons({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div class="flex flex-row-reverse gap-2 grow">
      {isLoggedIn ? (
        <button class="btn btn-secondary" hx-post="/api/logout">
          Logout
        </button>
      ) : (
        <button class="btn btn-primary" x-on:click="window.location.href='/login'">
          Login
        </button>
      )}
      {!isLoggedIn ? (
        <button class="btn btn-primary" x-on:click="window.location.href='/signup'">
          Sign up
        </button>
      ) : null}
    </div>
  )
}

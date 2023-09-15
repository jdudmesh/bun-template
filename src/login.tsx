export function LoginPage() {
  return (
    <main>
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <div class="text-center lg:text-left w-[30rem]">
            <h1 class="text-5xl font-bold">Log in</h1>
            <p class="py-6">
              Log in to your account. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              pharetra varius mi, quis auctor lacus eleifend nec. Nam ultrices accumsan porttitor.
              Sed erat dui, tincidunt ut sem non, rutrum dignissim sem. Morbi sed auctor lorem.
              Pellentesque semper magna a iaculis consectetur. Fusce pharetra molestie tellus sed
              consequat. Phasellus imperdiet leo odio. Aliquam commodo libero sit amet nulla semper,
              rutrum interdum ex pharetra. Sed venenatis interdum dignissim. Donec a pharetra leo.
              Aliquam erat volutpat. Phasellus maximus tortor urna. Nam dapibus tincidunt libero ac
              vehicula. Etiam posuere nibh at ligula facilisis, vel eleifend ex pharetra.
            </p>
            <p>
              <a href="/" class="link link-primary">
                ← Home
              </a>
            </p>
          </div>
          <div class="card flex-shrink-0 shadow-2xl bg-base-100 w-[30rem]">
            <form x-data="login">
              <div class="card-body">
                <div class="form-control">
                  <label class="label" for="email">
                    <span class="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Your email address..."
                    autocomplete="email"
                    name="email"
                    class="input input-bordered"
                    x-model="email"
                    required=""
                  />
                  <label class="label h-6" for="email">
                    <span class="label-text text-error" x-text="emailErr"></span>
                  </label>
                </div>
                <div class="form-control">
                  <label class="label" for="password">
                    <span class="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Your password..."
                    autocomplete="new-password"
                    name="password"
                    class="input input-bordered"
                    x-model="password"
                    required=""
                  />
                  <label class="label h-6" for="password">
                    <span class="label-text text-error" x-text="passwordErr"></span>
                  </label>
                </div>
                <button type="button" class="btn btn-primary" x-on:click="submit">
                  Log In
                </button>
                <div class="text-sm">
                  Don't have an account?
                  <a href="/signup" class="link-primary">
                    Click here to sign up.
                  </a>
                </div>
                <label class="label h-6">
                  <span class="label-text text-error" x-text="submitErr"></span>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

import * as elements from "typed-html"

export function SignupPage() {
  return (
    <main>
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <div class="text-center lg:text-left w-[30rem]">
            <h1 class="text-5xl font-bold">Register now</h1>
            <p class="py-6">
              Sign up for a free account. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nunc pharetra varius mi, quis auctor lacus eleifend nec. Nam ultrices accumsan
              porttitor. Sed erat dui, tincidunt ut sem non, rutrum dignissim sem. Morbi sed auctor
              lorem. Pellentesque semper magna a iaculis consectetur. Fusce pharetra molestie tellus
              sed consequat. Phasellus imperdiet leo odio. Aliquam commodo libero sit amet nulla
              semper, rutrum interdum ex pharetra. Sed venenatis interdum dignissim. Donec a
              pharetra leo. Aliquam erat volutpat. Phasellus maximus tortor urna. Nam dapibus
              tincidunt libero ac vehicula. Etiam posuere nibh at ligula facilisis, vel eleifend ex
              pharetra.
            </p>
            <p>
              <a href="/" class="link link-primary">
                ← Home
              </a>
            </p>
          </div>
          <div class="card flex-shrink-0 shadow-2xl bg-base-100 w-[30rem]">
            <form x-data="signup">
              <div class="card-body">
                <div class="form-control">
                  <label class="label" for="name">
                    <span class="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name..."
                    autocomplete="name"
                    name="name"
                    class="input input-bordered"
                    x-model="name"
                    required=""
                  />
                  <label class="label h-6" for="name">
                    <span class="label-text text-error" x-text="nameErr"></span>
                  </label>
                </div>
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
                    placeholder="Choose a new password..."
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
                <div class="form-control">
                  <label class="label" for="password2">
                    <span class="label-text">Confirm password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter your password..."
                    autocomplete="new-password"
                    name="password2"
                    class="input input-bordered"
                    x-model="password2"
                    required=""
                  />
                  <label class="label h-6" for="password2">
                    <span class="label-text text-error" x-text="password2Err"></span>
                  </label>
                </div>
                <button type="button" class="btn btn-primary" x-on:click="submit">
                  Sign Up
                </button>
                <div class="text-sm">
                  Already have an account?
                  <a href="/login" class="link-primary">
                    Click here to sign in.
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

export function HomePage() {
  return (
    <div class="grow flex flex-col bg-slate-200 gap-4 justify-stretch">
      <Navbar />
      <main class="grow flex flex-col ml-4 mr-4 justify-center items-center">
        <div class="-mt-24">
          <div class="text-4xl font-bold">Welcome to Bun!</div>
        </div>
      </main>
    </div>
  )
}
export function Navbar() {
  return (
    <nav class="h-24 grow-0 w-full flex flex-row p-4 items-center">
      <div class="grow-0 text-xl font-bold">Bun/ElysiaJS/HTMX/AlpineJS/Sqlite Template</div>
      <div class="grow" hx-get="/components/auth" hx-trigger="load"></div>
    </nav>
  )
}

# Bun Template

## Overview

I built this after watching [Ethan Niser's BETH Stack YouTube Video](https://www.youtube.com/watch?v=cpzowDDJj24). This is a more complete example which bundles HTMX + Alpine.JS + Tailwind + DaisyUI + Zod and custom fonts with Webpack on the client side. On the server side it has very simple session cookie based auth auth and serves the client bundle using the static plugin. It uses `@kitajs/html` instead of `typed-html`.

## How to run

### Client Side

To install and run:

```bash
cd client && pnpm install && pnpm run watch
```

### Server Side

To install dependencies:

```bash
bun install
```

By default the SQLite session database is run in-memory. Change in
To run:

```bash
bun run dev
```

You can now browse to http://localhost:3000

## Caddy
There is also a Docker + Caddy configuration in `infrastructure/local`. You will need to manually install the root certificate from `infrastructure/local/caddy/data/caddy/pki/authorities/local`.

If you have `task` install you can simply run `task docker/start` to fire up the Docker image. You can then browse to https://bun-template.local.
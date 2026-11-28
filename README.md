# Behind the Endpoint

Start with what a backend does and follow a book request through its lifecycle. Learn Node.js, choose JavaScript or TypeScript for a validation exercise, then practice storing books in MongoDB or PostgreSQL. The course also includes 18 backend lessons with runnable examples, practice questions, and animated traces for selected concepts.

[Open the live app](https://behind-the-endpoint.vercel.app) · [Start the guided course](https://behind-the-endpoint.vercel.app/guide/backend)

## Two requests, one order

What happens if the server creates an order but the client never receives the confirmation? This 21-second animation follows the retry and shows how an idempotency key lets the server return the original order.

[![Animated walkthrough showing the client, orders API, and database](public/videos/safe-retries.gif)](public/videos/safe-retries.mp4)

[Play the full-resolution video (MP4)](public/videos/safe-retries.mp4) · [Try the safe retries lesson](https://behind-the-endpoint.vercel.app/learn/15/1)

## Explore the course

Step through request handling, API design, databases, identity and access, background jobs, and service operations. Each lesson includes an example you can run with different inputs. The request lab lets you send simulated GET and POST requests, and the searchable cheatsheets make it easy to revisit a concept.

## Run locally

With Node.js 22 and npm installed, run these commands from the repository root.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Run `npm run typecheck` to check TypeScript or `npm run build` to generate the production build.

Built with Next.js App Router, TypeScript, Tailwind CSS, and Three.js.

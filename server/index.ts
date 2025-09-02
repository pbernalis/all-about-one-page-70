import path from "path";
import express from "express";
import compression from "compression";
import pagesApiPlugin from "../plugins/pagesApiPlugin"; // we'll reuse its handler logic

const app = express();
app.use(compression());

// static assets
const dist = path.join(process.cwd(), "dist");
app.use(express.static(dist, { index: false }));

// attach the same middleware used in vite (quick shim)
const fakeVite = {
  middlewares: { use: (fn: any) => app.use(fn) }
} as any;
(pagesApiPlugin() as any).configureServer?.(fakeVite);

// SPA fallback
app.use((_req, res) => res.sendFile(path.join(dist, "index.html")));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on :${port}`));
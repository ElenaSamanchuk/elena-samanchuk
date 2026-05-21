import type { Plugin } from "vite";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  renderRobotsTxt,
  renderSeoHeadHtml,
  renderSitemapXml,
  renderWebManifest,
  renderNoscriptHtml,
  resolveSiteUrls,
  SITE_REPO,
} from "./src/data/siteMeta";

type SeoPluginOptions = {
  siteUrl: string;
  basePath: string;
};

export function seoInjectPlugin(options: SeoPluginOptions): Plugin {
  const urls = resolveSiteUrls(options);
  const manifestHref = `${urls.basePath}site.webmanifest`.replace(/\/{2,}/g, "/");

  return {
    name: "seo-inject",
    transformIndexHtml(html) {
      return html
        .replace("<!-- SEO:HEAD -->", renderSeoHeadHtml(urls))
        .replace("<!-- SEO:NOSCRIPT -->", renderNoscriptHtml())
        .replace('href="/site.webmanifest"', `href="${manifestHref}"`);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/robots.txt") {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end(renderRobotsTxt(urls));
          return;
        }
        if (req.url === "/sitemap.xml") {
          res.setHeader("Content-Type", "application/xml; charset=utf-8");
          res.end(renderSitemapXml(urls));
          return;
        }
        if (req.url === "/site.webmanifest") {
          res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
          res.end(renderWebManifest(urls));
          return;
        }
        next();
      });
    },
    closeBundle() {
      const outDir = resolve(process.cwd(), "dist");
      writeFileSync(resolve(outDir, "robots.txt"), renderRobotsTxt(urls), "utf8");
      writeFileSync(resolve(outDir, "sitemap.xml"), renderSitemapXml(urls), "utf8");
      writeFileSync(resolve(outDir, "site.webmanifest"), renderWebManifest(urls), "utf8");
    },
  };
}

export function defaultProductionBase(): string {
  return `/${SITE_REPO}/`;
}

export function defaultProductionSiteUrl(basePath: string): string {
  const trimmed = basePath.replace(/^\/|\/$/g, "");
  return `https://elenasamanchuk.github.io/${trimmed}/`;
}

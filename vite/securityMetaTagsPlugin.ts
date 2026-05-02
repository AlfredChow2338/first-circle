import type { Plugin } from "vite";

/**
 * Injects Referrer-Policy, Permissions-Policy, and Content-Security-Policy via &lt;meta&gt;
 * during **production builds only** (skipped in dev so HMR / eval are not blocked).
 *
 * **GitHub Pages** cannot set HTTP response headers for static files; meta tags cover
 * most CSP and referrer behavior, but **`frame-ancestors` and `X-Frame-Options` only
 * take effect as HTTP headers**, so clickjacking hardening requires a CDN/proxy or a host
 * that supports header config (e.g. Cloudflare, Netlify `_headers`).
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const META_BLOCK = `
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), usb=()" />
    <meta http-equiv="Content-Security-Policy" content="${CSP}" />
`;

export function securityMetaTagsPlugin(): Plugin {
  return {
    name: "security-meta-tags",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (ctx.server) {
          return html;
        }
        /* After charset keeps the encoding declaration in the first 1024 bytes. */
        const charsetMeta = html.match(
          /<meta\s+charset=["']UTF-8["']\s*\/?>/i,
        );
        if (!charsetMeta) {
          return html;
        }
        const tag = charsetMeta[0];
        return html.replace(tag, `${tag}${META_BLOCK}`);
      },
    },
  };
}

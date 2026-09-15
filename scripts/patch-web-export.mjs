#!/usr/bin/env node
/**
 * Post-export step for the hosted web build.
 *
 * The exported build is served from a sub-path whose entry document has to be
 * requested explicitly, i.e. the address ends in `/index.html`. Expo Router
 * derives the active route from the URL, so that trailing `index.html` segment
 * is treated as a route name, matches nothing, and the app opens on its
 * "Unmatched Route" screen.
 *
 * This script injects a small, dependency-free bootstrap into the exported
 * `index.html` that rewrites a trailing `index.html` segment away before the
 * application bundle runs, so the entry address resolves to the root route
 * exactly as it would on a host that serves the directory index implicitly.
 *
 * The rewrite is a `history.replaceState`, so no navigation or reload occurs
 * and no history entry is added.
 *
 * It is idempotent: running it twice is a no-op.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ENTRY_HTML = path.join('dist', 'index.html');
const MARKER = 'id="url-normalisation"';

const BOOTSTRAP = `    <script id="url-normalisation">
      // The entry document is requested as "<base>/index.html". Drop that
      // trailing segment so the router resolves the root route.
      (function () {
        var suffix = '/index.html';
        var pathname = window.location.pathname;
        if (pathname.length < suffix.length) return;
        if (pathname.slice(-suffix.length) !== suffix) return;
        window.history.replaceState(
          null,
          '',
          pathname.slice(0, -suffix.length) + '/' + window.location.search + window.location.hash
        );
      })();
    </script>
`;

const source = readFileSync(ENTRY_HTML, 'utf8');

if (source.includes(MARKER)) {
  console.log('url normalisation already present in dist/index.html');
  process.exit(0);
}

const anchor = '  <script src=';
const anchorIndex = source.indexOf(anchor);

if (anchorIndex === -1) {
  throw new Error('could not locate the bundle <script> tag in dist/index.html');
}

const patched =
  source.slice(0, anchorIndex) + BOOTSTRAP + source.slice(anchorIndex);

writeFileSync(ENTRY_HTML, patched);
console.log('url normalisation injected into dist/index.html');

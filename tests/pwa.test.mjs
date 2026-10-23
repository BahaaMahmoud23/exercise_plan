import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
test('production manifest, icons and offline worker are emitted without precaching video', () => {
 assert.ok(existsSync('dist/manifest.webmanifest'),'build must emit manifest');
 const manifest=JSON.parse(readFileSync('dist/manifest.webmanifest','utf8'));
 assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'/');assert.equal(manifest.scope,'/');
 for(const size of ['192x192','512x512']) {
  const icon=manifest.icons.find(i=>i.sizes===size);assert.ok(icon);assert.ok(existsSync('dist'+icon.src));
 }
 const sw=readFileSync('dist/sw.js','utf8');
 assert.ok(!sw.match(/const ASSETS = .*\.mp4/),'video library must never be precached');
 const html=readFileSync('dist/index.html','utf8');
 assert.match(html,/manifest.webmanifest/);assert.match(html,/apple-touch-icon/);assert.match(html,/theme-color/);
});

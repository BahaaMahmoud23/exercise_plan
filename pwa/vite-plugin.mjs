import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Keep the worker and its content-addressed shell in the same atomic Vite build.
export function offlineShell() {
  return {
    name: 'workout-offline-shell',
    apply: 'build',
    generateBundle(_, bundle) {
      const entries = Object.entries(bundle).filter(([name]) => name === 'index.html' || /\.(js|css)$/.test(name));
      const assets = ['/index.html', '/manifest.webmanifest', '/icons/icon-180.png', '/icons/icon-192.png', '/icons/icon-512.png', ...entries.filter(([name]) => name !== 'index.html').map(([name]) => '/' + name)];
      const template = readFileSync(new URL('./service-worker.js', import.meta.url), 'utf8');
      const hash = createHash('sha256').update(template);
      for (const [,entry] of entries) hash.update(entry.type === 'chunk' ? entry.code : entry.source);
      for (const name of ['manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png']) hash.update(readFileSync(new URL('../public/' + name,import.meta.url)));
      const source = template.replace('__SHELL_CACHE__',JSON.stringify('bahaa-app-shell-' + hash.digest('hex').slice(0,16))).replace('__SHELL_ASSETS__',JSON.stringify(assets));
      this.emitFile({type:'asset',fileName:'sw.js',source});
    },
  };
}

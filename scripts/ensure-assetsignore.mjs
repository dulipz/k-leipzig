// Nach dem Build: verhindert, dass der Server-Code (_worker.js) als
// öffentliche Datei hochgeladen wird (Cloudflare-Workers-Deploy via wrangler).
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
if (!existsSync('dist')) mkdirSync('dist');
writeFileSync('dist/.assetsignore', '_worker.js\n_routes.json\n');
console.log('[postbuild] dist/.assetsignore geschrieben (_worker.js, _routes.json)');

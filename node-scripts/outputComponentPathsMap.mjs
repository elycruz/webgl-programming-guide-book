import configAppNav from "../src/components/app/config.app.nav";
import fs from 'fs';
import path from 'path';

const pushPaths = (cfg, out = []) => {
    if (cfg.componentFilePath) {
      out.push(cfg.componentFilePath);
    }
    if (cfg.items) {
      cfg.items.forEach(item => {
        pushPaths(item, out);
      });
    }
  },

  extractComponentPaths = (config, out = []) => {
    pushPaths(config, out);
    return out;
  },

  viewsMapOutput = (paths =>
      `import React from 'react';\n\nexport default {\n${
        paths.map(p => `'${p}': React.lazy(() => import('${p}'))`).join(',\n')
      }\n}`
  )
  (extractComponentPaths(configAppNav))
;

fs.writeFile(path.resolve('./src/components/app/config.views.map.tsx'), viewsMapOutput, {encoding: 'utf8'}, err => {
  if (err) {
    throw err;
  }
  console.info('Operation succeeded.');
});

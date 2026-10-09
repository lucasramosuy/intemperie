import {mkdir,copyFile,readFile} from 'node:fs/promises';
const snapshot=JSON.parse(await readFile('weather.json'));
if(!snapshot.points?.length)throw Error('No hay snapshot real; ejecutar pnpm snapshot');
await mkdir('dist',{recursive:true});
for(const f of ['index.html','404.html','style.css','app.mjs','paint.mjs','weather.mjs','weather.json','departments.json','favicon.svg'])await copyFile(f,'dist/'+f);

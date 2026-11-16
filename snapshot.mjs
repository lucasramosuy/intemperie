import {readFile,writeFile} from 'node:fs/promises';
import {weatherURL,normalize} from './weather.mjs';
const departments=JSON.parse(await readFile(new URL('./departments.json',import.meta.url)));
async function fetchConReintentos(url,intentos=3){
  let ultimoError;
  for(let i=0;i<intentos;i++){
    let r;
    try{
      r=await fetch(url,{signal:AbortSignal.timeout(30000)});
    }catch(e){
      ultimoError=e;
    }
    if(r&&r.ok)return r;
    if(r){
      ultimoError=Error(`Open-Meteo: ${r.status}`);
      if(r.status<500&&r.status!==408&&r.status!==429)throw ultimoError;
    }
    if(i<intentos-1){
      const espera=(i+1)*15000;
      console.log(`Intento ${i+1}/${intentos} a Open-Meteo falló: ${ultimoError.message}. Reintento en ${espera/1000}s.`);
      await new Promise(res=>setTimeout(res,espera));
    }
  }
  throw ultimoError;
}
const response=await fetchConReintentos(weatherURL(departments));
const snapshot=normalize(await response.json(),departments);
await writeFile(new URL('./weather.json',import.meta.url),JSON.stringify(snapshot));
console.log(`Snapshot real: ${snapshot.points.length} capitales, ${snapshot.generatedAt}`);

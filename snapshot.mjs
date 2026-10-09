import {readFile,writeFile} from 'node:fs/promises';
import {weatherURL,normalize} from './weather.mjs';
const departments=JSON.parse(await readFile(new URL('./departments.json',import.meta.url)));
const response=await fetch(weatherURL(departments),{signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error(`Open-Meteo: ${response.status}`);
const snapshot=normalize(await response.json(),departments);
await writeFile(new URL('./weather.json',import.meta.url),JSON.stringify(snapshot));
console.log(`Snapshot real: ${snapshot.points.length} capitales, ${snapshot.generatedAt}`);

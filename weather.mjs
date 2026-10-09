export const fields=['temperature_2m','precipitation','cloud_cover','wind_speed_10m','wind_direction_10m','weather_code'];
export function weatherURL(departments){const u=new URL('https://api.open-meteo.com/v1/forecast');u.search=new URLSearchParams({latitude:departments.map(d=>d.latitude).join(','),longitude:departments.map(d=>d.longitude).join(','),current:fields.join(','),timezone:'America/Montevideo',forecast_days:'1'});return u;}
export function normalize(raw,departments,now=Date.now()){
 if(!Array.isArray(raw)||raw.length!==departments.length)throw Error('Cantidad de puntos incorrecta');
 return {generatedAt:new Date(now).toISOString(),source:'Open-Meteo',points:raw.map((r,i)=>{
 const c=r.current;if(!c||fields.some(k=>typeof c[k]!=='number'||!Number.isFinite(c[k])))throw Error('Datos incompletos: '+departments[i].name);
 if(c.cloud_cover<0||c.cloud_cover>100||c.precipitation<0||c.wind_speed_10m<0||!Number.isFinite(r.utc_offset_seconds))throw Error('Datos fuera de rango');
 const time=new Date(Date.parse(c.time+'Z')-r.utc_offset_seconds*1000).toISOString();
 if(!Number.isFinite(Date.parse(time)))throw Error('Hora inválida');
 if(Math.abs(Date.parse(time)-now)>3*3600000)throw Error('El proveedor devolvió datos viejos');
 return {...departments[i],...c,time,interval:c.interval};})};
}
export function condition(code){if(code===0)return 'Despejado';if(code<=3)return code===1?'Casi despejado':'Nublado';if(code<=48)return 'Niebla';if(code>=95)return 'Tormenta';if(code>=71&&code<=77||code>=85&&code<=86)return 'Nieve';if(code>=51&&code<=57)return 'Llovizna';return 'Lluvia';}
export function ageState(snapshot,now=Date.now()){const age=now-Date.parse(snapshot.generatedAt);return age>3*3600000?'stale':'fresh';}
export function paintParams(p){return {warm:Math.max(0,Math.min(1,(p.temperature_2m+5)/40)),cloud:p.cloud_cover/100,rain:Math.min(1,p.precipitation/4),speed:Math.min(1,p.wind_speed_10m/60),angle:p.wind_direction_10m*Math.PI/180};}

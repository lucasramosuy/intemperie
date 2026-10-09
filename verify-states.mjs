import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';
await mkdir('test-output',{recursive:true});
const snapshot=JSON.parse(await readFile('weather.json'));
await mkdir('test-output',{recursive:true});
const server=createServer(async(req,res)=>{try{const f=req.url==='/'?'index.html':req.url.slice(1);res.setHeader('Content-Type',f.endsWith('.mjs')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(await readFile('dist/'+f));}catch{res.statusCode=404;res.end();}}).listen(8766);
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome-stable',args:['--no-sandbox']});
try{const page=await browser.newPage({viewport:{width:390,height:844}});await page.route('**/weather.json',r=>r.abort());await page.goto('http://localhost:8766/');await page.getByText('El cielo no llegó todavía.').waitFor();assert.equal(await page.locator('.painting').count(),0);console.log('empty error no fabricated painting',await page.locator('.painting').count());await page.screenshot({path:'test-output/real-error.png'});
const stale=structuredClone(snapshot);stale.generatedAt=new Date(Date.now()-5*3600000).toISOString();await page.evaluate(s=>localStorage.setItem('intemperie:weather',JSON.stringify(s)),stale);await page.reload();await page.locator('.painting').first().waitFor();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Sin conexión'));assert.match(await page.locator('#status').textContent(),/quedó viejo/);console.log('offline stale',await page.locator('#status').textContent());await page.screenshot({path:'test-output/real-stale.png'});
}finally{await browser.close();server.close();}

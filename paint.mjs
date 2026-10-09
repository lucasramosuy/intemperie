import {paintParams} from './weather.mjs';
const paper=[238,234,225];
function seedFor(id){let n=2166136261;for(const c of id)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function random(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function renderPainting(canvas,p,{mini=false}={}){
 const w=mini?180:540,h=mini?166:580;canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d'),r=random(seedFor(p.id)),v=paintParams(p);
 const pigment=[110+v.warm*90,142-v.warm*38,139-v.warm*62];
 const col=pigment.map((n,i)=>n*(1-v.cloud*.58)+[70,77,73][i]*v.cloud*.58);
 const image=ctx.createImageData(w,h);const forms=Array.from({length:5},()=>({x:.33+r()*.34,y:.28+r()*.43,rx:.12+r()*.18,ry:.1+r()*.17,phase:r()*6}));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const nx=x/w,ny=y/h;let alpha=0;
  for(const f of forms){const dx=(nx-f.x+.025*Math.sin(ny*19+f.phase))/f.rx,dy=(ny-f.y+.02*Math.sin(nx*16+f.phase))/f.ry;
  const d=dx*dx+dy*dy;alpha=Math.max(alpha,Math.max(0,Math.min(.84+v.cloud*.12,(1.14-d)*2)));}
  const grain=(r()-.5)*(4+v.rain*12),k=(y*w+x)*4;
  for(let c=0;c<3;c++)image.data[k+c]=paper[c]*(1-alpha)+col[c]*alpha+grain;
  image.data[k+3]=255;
 }
 ctx.putImageData(image,0,0);
 const flecks=mini?260:1300+Math.round(v.rain*1400);ctx.fillStyle='rgba(48,45,37,.12)';
 for(let n=0;n<flecks;n++){const x=(.12+r()*.75)*w,y=(.14+r()*.72)*h;ctx.fillRect(x,y,mini?.65:1,mini?.65:1);}
 const marks=80+Math.round(v.rain*120+v.speed*90);
 for(let n=0;n<marks;n++){
 const x=(.15+r()*.68)*w,y=(.22+r()*.64)*h,len=(.016+r()*.11)*(v.rain>.1?h:w);
 const angle=v.rain>.1?Math.PI/2+.35*Math.sin(v.angle):v.angle-Math.PI/2;
 ctx.strokeStyle=`rgba(247,237,213,${.15+r()*.45})`;ctx.lineWidth=.6+r()*1.1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*len,y+Math.sin(angle)*len);ctx.stroke();
 }
 return v;
}

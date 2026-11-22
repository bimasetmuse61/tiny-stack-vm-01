// Tiny stack VM: faithful interpreter of make.fun's tiny stack ISA v1 (kit: generator/subject/ISA.md).
// One run answers i001..i040: /input/<id>/program.bin+input.bin -> /output/<id>/stdout.bin+exit.txt.
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
function run(p,q){
const n=p.length,D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
let s=0,c=0,x=0,t=0,l=0,i=0;
const d=e=>[o.subarray(0,l),e];
for(;;){
if(t===1e6)return d(10);
if(x<0||x>=n)return d(9);
const a=p[x],v=a<=7||a>=0x30&&a<=0x34||a===0x40||a===0x41||a>=0x50&&a<=0x53||a>=0x10&&a<=0x22&&a!==0x1f;
if(!v)return d(5);
const m=a===1?1:a===2?4:a>=0x30&&a<=0x33?2:0;
if(x+m>=n)return d(9);
let f=0,g=0;
if(a===1||a===2||a===0x52)g=1;
else if(a===4){f=1;g=2}else if(a===5){f=2;g=2}else if(a===6){f=2;g=3}else if(a===7){f=3;g=3}
else if(a===3||a===0x17||a===0x1b||a===0x31||a===0x32||a===0x40||a===0x50||a===0x51||a===0x53)f=1;
else if(a>=0x10&&a<=0x22){f=2;g=1}else if(a===0x41)f=2;
t++;const y=x+1+m;
if(s<f)return d(2);
if(s-f+g>256)return d(3);
x=y;
switch(a){
case 0:return d(0);
case 1:D[s++]=(p[y-1]<<24)>>24;break;
case 2:D[s++]=p[y-4]|p[y-3]<<8|p[y-2]<<16|p[y-1]<<24;break;
case 3:s--;break;
case 4:D[s]=D[s-1];s++;break;
case 5:{const z=D[s-1];D[s-1]=D[s-2];D[s-2]=z;break;}
case 6:D[s]=D[s-2];s++;break;
case 7:{const z=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=z;break;}
case 0x17:D[s-1]=-D[s-1]|0;break;
case 0x1b:D[s-1]=~D[s-1];break;
case 0x10:case 0x11:case 0x12:case 0x13:case 0x14:case 0x15:case 0x16:case 0x18:case 0x19:case 0x1a:case 0x1c:case 0x1d:case 0x1e:case 0x20:case 0x21:case 0x22:{
const b=D[s-1],e=D[s-2];let r;
if(a===0x10)r=e+b|0;else if(a===0x11)r=e-b|0;else if(a===0x12)r=Math.imul(e,b);
else if(a===0x13){if(!b)return d(4);r=e===-2147483648&&b===-1?e:e/b|0;}
else if(a===0x14){if(!b)return d(4);r=b===-1?0:e%b|0;}
else if(a===0x15){if(!b)return d(4);r=Math.floor((e>>>0)/(b>>>0))|0;}
else if(a===0x16){if(!b)return d(4);r=(e>>>0)%(b>>>0)|0;}
else if(a===0x18)r=e&b;else if(a===0x19)r=e|b;else if(a===0x1a)r=e^b;
else if(a===0x1c)r=e<<(b&31);else if(a===0x1d)r=e>>(b&31);else if(a===0x1e)r=e>>>(b&31)|0;
else if(a===0x20)r=e===b?1:0;else if(a===0x21)r=e<b?1:0;else r=(e>>>0)<(b>>>0)?1:0;
s-=2;D[s++]=r;break;}
case 0x30:case 0x31:case 0x32:{
const z=(p[y-2]|p[y-1]<<8)<<16>>16;let k=1;
if(a!==0x30){const w=D[--s];k=a===0x31?w===0:w!==0;}
if(k)x=y+z;break;}
case 0x33:
if(c===64)return d(7);
C[c++]=y;x=p[y-2]|p[y-1]<<8;break;
case 0x34:
if(!c)return d(8);
x=C[--c];break;
case 0x40:{const z=D[s-1];if(z<0||z>255)return d(6);D[s-1]=M[z];break;}
case 0x41:{const z=D[s-1],w=D[s-2];if(z<0||z>255)return d(6);s-=2;M[z]=w;break;}
case 0x50:{const z=String(D[s-1]);if(l+z.length>65536)return d(11);s--;for(let j=0;j<z.length;j++)o[l++]=z.charCodeAt(j);break;}
case 0x51:
if(l+1>65536)return d(11);
o[l++]=D[--s]&255;break;
case 0x52:D[s++]=i<q.length?q[i++]:-1;break;
case 0x53:return d(D[--s]&255);
}}
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
let o=new Uint8Array(0),e=0;
try{[o,e]=run(new Uint8Array(readFileSync(join(I,id,'program.bin'))),new Uint8Array(readFileSync(join(I,id,'input.bin'))));}catch{}
mkdirSync(join(O,id),{recursive:true});
writeFileSync(join(O,id,'stdout.bin'),o);
writeFileSync(join(O,id,'exit.txt'),e+'\n');
}

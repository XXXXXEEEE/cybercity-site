// One registered photograph grows from a populated district into its skyline.
// The static opening poster is rendered from this exact component at time zero.
import { MINTS, RESPONSE_DELAY } from './build-timeline.js?v=continuous-12';
const W=1672,H=941;
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{const p=clamp(v);return p*p*(3-2*p);};
function surface(){const c=document.createElement('canvas');c.width=W;c.height=H;return c;}
const skyline=[
 [0,.109,0],[.109,.148,.083],[.148,.181,.20],[.181,.218,.17],[.218,.225,.293],
 [.225,.298,0],[.298,.322,.046],[.322,.334,.10],[.334,.35,.32],[.35,.367,.29],
 [.367,.399,.173],[.399,.416,.307],[.416,.434,.218],[.434,.45,.30],[.45,.476,.20],
 [.476,.49,.28],[.49,.516,.28],[.516,.542,.31],[.542,.584,.06],[.584,.603,.37],
 [.603,.65,.254],[.65,.664,.21],[.664,.69,.285],[.69,.73,.235],[.73,.742,.35],
 [.742,.774,.27],[.774,.787,.33],[.787,.803,.259],[.803,.828,.325],[.828,.85,.285],
 [.85,.866,.36],[.866,.912,.222],[.912,.94,.35],[.94,.977,.337],[.977,1,.37]
];
export class DrawnCity {
 constructor(canvas,city){
  this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});
  if(!this.ctx)throw new Error('Canvas is unavailable');
  this.city=city;this.draft=surface();this.mask=surface();this.layer=surface();
  const draft=this.draft.getContext('2d');
  draft.filter='grayscale(.45) brightness(.85)';draft.drawImage(city,0,0,W,H);
  this.blocks=skyline.map(([a,b,roof],i)=>{
   const center=(a+b)/2,isTower=center>=.35&&center<=.65;
   const mint=MINTS.find(event=>event.key===(isTower?'towers':'district'));
   const stagger=(i%4)*.065;
   return {x:Math.floor(a*W),w:Math.ceil(b*W)-Math.floor(a*W),roof:Math.max(0,roof*H-8),bottom:H*.86,
    start:mint.at+RESPONSE_DELAY+stagger,span:mint.duration-stagger,seed:isTower?.55:.68+(i%3)*.025};
  });
 }
 resize(width,height){
  this.width=width;this.height=height;
  this.ratio=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1500000/(width*height)));
  this.canvas.width=Math.round(width*this.ratio);this.canvas.height=Math.round(height*this.ratio);
  this.ctx.imageSmoothingEnabled=true;this.ctx.imageSmoothingQuality='high';
 }
 compose(frame){
  const mask=this.mask.getContext('2d');mask.clearRect(0,0,W,H);mask.fillStyle='#fff';
  mask.fillRect(0,H*.86,W,H*.14);
  for(const b of this.blocks){
   const progress=frame.reduced?1:smooth((frame.elapsed-b.start)/b.span);
   const built=b.seed+(1-b.seed)*progress;
   const top=(b.bottom-(b.bottom-b.roof)*built)*(1-progress**4);
   const feather=70*(1-progress);
   // A continuous alpha ramp follows each building, without discrete scan bands.
   if(feather>.01){const fade=mask.createLinearGradient(0,top,0,top+feather);fade.addColorStop(0,'transparent');fade.addColorStop(1,'#fff');mask.fillStyle=fade;}
   else mask.fillStyle='#fff';
   mask.fillRect(b.x,top,b.w,H-top);
  }
  const layer=this.layer.getContext('2d');layer.clearRect(0,0,W,H);
  const light=.55+.45*smooth(frame.scene.light);
  layer.globalCompositeOperation='source-over';layer.globalAlpha=1-light;layer.drawImage(this.draft,0,0);
  layer.globalCompositeOperation='lighter';layer.globalAlpha=light;layer.drawImage(this.city,0,0,W,H);
  layer.globalAlpha=1;layer.globalCompositeOperation='destination-in';layer.drawImage(this.mask,0,0);
  layer.globalCompositeOperation='source-over';
 }
 traffic(frame){
  const time=frame.elapsed,strength=.18+.32*smooth(frame.scene.transit)+.5*smooth(frame.scene.complete);
  const c=this.ctx;c.save();c.globalCompositeOperation='screen';
  for(let i=0;i<10;i++){
   const p=((time*.055+i*.099)%1)**1.5,lane=i%2?.009:-.009;
   const x=W*(.568+p*.022+lane*(.2+p)),y=H*(.576+p*.278);
   c.strokeStyle=i%2?'rgba(220,136,178,'+strength*.6+')':'rgba(189,230,244,'+strength*.65+')';
   c.lineWidth=.7+p;c.beginPath();c.moveTo(x,y);c.lineTo(x+.3,y+2+p*5);c.stroke();
  }
  c.restore();
 }
 render(frame){
  const c=this.ctx;c.setTransform(this.ratio,0,0,this.ratio,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.clearRect(0,0,this.width,this.height);
  // Match the poster's object-fit:cover and object-position:58% 100% exactly.
  const scale=Math.max(this.width/W,this.height/H);
  c.translate((this.width-W*scale)*.58,this.height-H*scale);c.scale(scale,scale);
  if(frame.reduced||frame.scene.light>=1)c.drawImage(this.city,0,0,W,H);
  else{this.compose(frame);c.drawImage(this.layer,0,0);}
  if(!frame.reduced)this.traffic(frame);
  c.globalAlpha=1;
 }
}

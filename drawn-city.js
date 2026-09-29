// First draw the entire blue city; only then materialize its photograph.
import { MINTS, RESPONSE_DELAY, BLUEPRINT_END, REALITY_START } from './build-timeline.js?v=quick-flow-16';
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
 constructor(canvas,city,blueprint){
  this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});
  if(!this.ctx||!blueprint)throw new Error('City drawing is unavailable');
  this.city=city;this.blueprint=blueprint;
  this.unlit=surface();this.mask=surface();this.material=surface();this.layer=surface();
  this.ghost=surface();this.drawMask=surface();this.drawing=surface();
  const ghost=this.ghost.getContext('2d');
  ghost.filter='blur(1.7px) brightness(.3)';ghost.drawImage(blueprint,0,0,W,H);
  const unlit=this.unlit.getContext('2d');
  unlit.filter='saturate(.7) brightness(.68)';unlit.drawImage(city,0,0,W,H);
  this.blocks=skyline.map(([a,b,roof],i)=>{
   const center=(a+b)/2,isTower=center>=.35&&center<=.65;
   const mint=MINTS.find(event=>event.key===(isTower?'towers':'district'));
   const stagger=(i%4)*.04,x=Math.floor(a*W);
   return {x,w:Math.floor(b*W)-x,roof:Math.max(0,roof*H-8),
    start:mint.at+RESPONSE_DELAY+stagger,span:mint.duration-stagger,
    realStart:REALITY_START+RESPONSE_DELAY+Math.abs(center-.58)*.42+(isTower?.14:0),
    realSpan:isTower?1.6:1.35};
  });
 }
 resize(width,height){
  this.width=width;this.height=height;
  this.ratio=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1500000/(width*height)));
  this.canvas.width=Math.round(width*this.ratio);this.canvas.height=Math.round(height*this.ratio);
  this.ctx.imageSmoothingEnabled=true;this.ctx.imageSmoothingQuality='high';
 }
 composeBlueprint(frame){
  const drawing=this.drawing.getContext('2d');drawing.clearRect(0,0,W,H);
  drawing.globalCompositeOperation='source-over';
  if(frame.elapsed>=BLUEPRINT_END){drawing.drawImage(this.blueprint,0,0,W,H);return;}
  const mask=this.drawMask.getContext('2d');mask.clearRect(0,0,W,H);
  const roads=smooth(frame.scene.network),energy=smooth(frame.scene.energy);
  // Trace the ground plane first; each building has its own rising drawing front.
  const ground=mask.createLinearGradient(0,H*.76,0,H*.91);
  ground.addColorStop(0,'transparent');ground.addColorStop(1,`rgba(255,255,255,${roads})`);
  mask.fillStyle=ground;mask.fillRect(0,H*.76,W*(.16+.84*energy),H*.24);
  const fronts=[];
  for(const b of this.blocks){
   const progress=smooth((frame.elapsed-b.start)/b.span);
   if(progress===0)continue;
   const top=(H-(H-b.roof)*progress)*(1-progress**4),feather=18*(1-progress)+1;
   const fade=mask.createLinearGradient(0,top,0,top+feather);
   fade.addColorStop(0,'transparent');fade.addColorStop(1,'white');
   mask.fillStyle=fade;mask.fillRect(b.x,top,b.w,H-top);
   if(progress<.98)fronts.push({x:b.x,y:top+feather*.65,w:b.w,h:7});
  }
  // Cover residual sky-edge details continuously, without a pop at the blue hold.
  const finish=smooth((frame.elapsed-(BLUEPRINT_END-.22))/.22);
  if(finish>0){mask.fillStyle=`rgba(255,255,255,${finish})`;mask.fillRect(0,0,W,H);}
  drawing.drawImage(this.blueprint,0,0,W,H);
  drawing.globalCompositeOperation='destination-in';drawing.drawImage(this.drawMask,0,0);
  const ghost=this.material.getContext('2d');ghost.clearRect(0,0,W,H);
  ghost.globalCompositeOperation='source-over';ghost.drawImage(this.ghost,0,0);
  ghost.globalCompositeOperation='destination-out';ghost.drawImage(this.drawMask,0,0);
  ghost.globalCompositeOperation='source-over';
  drawing.globalCompositeOperation='lighter';drawing.drawImage(this.material,0,0);
  // The advancing highlight is clipped to the real architectural texture.
  // No arbitrary neon skyline is drawn over the city.
  if(fronts.length){
   drawing.save();drawing.beginPath();
   for(const front of fronts)drawing.rect(front.x,front.y,front.w,front.h);
   drawing.clip();drawing.globalAlpha=.65*(1-finish);
   drawing.drawImage(this.blueprint,0,0,W,H);drawing.restore();
  }
  drawing.globalCompositeOperation='source-over';
 }
 compose(frame){
  this.composeBlueprint(frame);
  const layer=this.layer.getContext('2d');layer.clearRect(0,0,W,H);
  layer.globalCompositeOperation='source-over';
  // Nothing photographic can appear until the entire blue drawing is finished.
  if(frame.elapsed<=REALITY_START){layer.drawImage(this.drawing,0,0);return;}
  const mask=this.mask.getContext('2d');mask.clearRect(0,0,W,H);
  const completion=smooth(frame.scene.complete),solid=.84+.16*completion;
  const realTime=frame.elapsed-REALITY_START;
  const roads=smooth(realTime/.65),energy=smooth(realTime/.9);
  const ground=mask.createLinearGradient(0,H*.72,0,H*.9);
  ground.addColorStop(0,'transparent');ground.addColorStop(1,`rgba(255,255,255,${roads*(.55+.25*energy)})`);
  mask.fillStyle=ground;mask.fillRect(0,0,W,H);
  for(const b of this.blocks){
   const progress=smooth((frame.elapsed-b.realStart)/b.realSpan);
   if(progress===0)continue;
   const top=(H-(H-b.roof)*progress)*(1-progress**4),feather=65*(1-progress)+1;
   const fade=mask.createLinearGradient(0,top,0,top+feather);
   fade.addColorStop(0,'transparent');fade.addColorStop(1,`rgba(255,255,255,${solid})`);
   mask.fillStyle=fade;
   mask.fillRect(b.x,top,b.w,H-top);
  }
  const transit=smooth((realTime-.3)/.8);
  if(transit>0){
   const bridge=mask.createLinearGradient(0,H*.79,0,H*.9);
   bridge.addColorStop(0,'transparent');bridge.addColorStop(.55,`rgba(255,255,255,${transit*.65})`);bridge.addColorStop(1,'transparent');
   mask.fillStyle=bridge;mask.fillRect(0,H*.79,W,H*.11);
  }
  if(completion>0){mask.fillStyle=`rgba(255,255,255,${completion})`;mask.fillRect(0,0,W,H);}
  const material=this.material.getContext('2d'),light=smooth(frame.scene.light);
  material.clearRect(0,0,W,H);material.globalCompositeOperation='source-over';
  material.globalAlpha=1-light;material.drawImage(this.unlit,0,0);
  material.globalCompositeOperation='lighter';material.globalAlpha=light;material.drawImage(this.city,0,0,W,H);
  material.globalAlpha=1;material.globalCompositeOperation='destination-in';material.drawImage(this.mask,0,0);
  material.globalCompositeOperation='source-over';
  // Complementary premultiplied-alpha masks retain the silhouette throughout.
  layer.drawImage(this.drawing,0,0);
  layer.globalCompositeOperation='destination-out';layer.drawImage(this.mask,0,0);
  layer.globalCompositeOperation='lighter';layer.drawImage(this.material,0,0);
  layer.globalCompositeOperation='source-over';
 }
 traffic(frame){
  if(frame.elapsed<=REALITY_START)return;
  const time=frame.elapsed,strength=smooth((time-REALITY_START)/.9)*(.45+.55*smooth(frame.scene.complete));
  const c=this.ctx;c.save();c.globalCompositeOperation='screen';
  for(let i=0;i<10;i++){
   const p=((time*.055+i*.099)%1)**1.5,lane=i%2?.009:-.009;
   const x=W*(.568+p*.022+lane*(.2+p)),y=H*(.576+p*.278);
   c.strokeStyle=i%2?'rgba(220,136,178,'+strength*.6+')':'rgba(124,208,255,'+strength*.65+')';
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
  if(frame.reduced||frame.progress>=1)c.drawImage(this.city,0,0,W,H);
  else{this.compose(frame);c.drawImage(this.layer,0,0);}
  if(!frame.reduced)this.traffic(frame);
  c.globalAlpha=1;
 }
}

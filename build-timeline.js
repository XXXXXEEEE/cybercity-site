// An illustrative mint sequence, not wallet activity or on-chain transactions.
// A single event definition drives both the receipt and its visible city response.
export const DURATION=8;
export const PLAYBACK_RATE=1;
export const RESPONSE_DELAY=.1;
export const MINTS=[
 {at:0,key:'network',name:'Road Grid',effect:'The first district is connected',duration:1.2},
 {at:.35,key:'energy',name:'Energy Bus',effect:'Power reaches the district',duration:1.4},
 {at:.6,key:'district',name:'Smart Block',effect:'The neighborhood grows',duration:3},
 {at:1.1,key:'towers',name:'Tower Core',effect:'The skyline rises',duration:3.6},
 {at:2.8,key:'transit',name:'Sky Transit',effect:'Connections cross the city',duration:1.9},
 {at:3.5,key:'light',name:'Adaptive Lighting',effect:'Windows come alive',duration:3},
 {at:6,key:'complete',name:'City Link',effect:'A city, working together',duration:1.9}
];
export const PHASES=[
 ...MINTS.map((mint,index)=>({start:mint.at,end:MINTS[index+1]?.at??DURATION,key:mint.key,title:mint.effect}))
];
const clamp=v=>Math.max(0,Math.min(1,v));
export function buildFrame(time,reduced=false){
 const elapsed=reduced?DURATION:Math.max(0,time);
 const found=PHASES.findIndex(phase=>elapsed<phase.end),index=found<0?PHASES.length-1:found;
 const scene=Object.fromEntries(MINTS.map(mint=>[mint.key,clamp((elapsed-mint.at-RESPONSE_DELAY)/mint.duration)]));
 const visible=MINTS.filter(mint=>mint.at<=elapsed);
 return {elapsed,reduced,phase:PHASES[index],index,progress:clamp(elapsed/DURATION),scene,mint:visible[visible.length-1]||null};
}
export function visibleMints(frame){return MINTS.filter(mint=>mint.at<=frame.elapsed).slice(-3);}

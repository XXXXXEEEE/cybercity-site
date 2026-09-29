// An illustrative mint sequence, not wallet activity or on-chain transactions.
// A single event definition drives both the receipt and its visible city response.
export const DURATION=4.4;
export const PLAYBACK_RATE=1;
export const RESPONSE_DELAY=.055;
// Finish the blue drawing, then move directly into the living city.
export const BLUEPRINT_END=1.85;
export const REALITY_START=1.93;
export const MINTS=[
 {at:0,key:'network',name:'Road Grid',effect:'The first connections take shape',duration:.58},
 {at:.12,key:'energy',name:'Energy Bus',effect:'Power lines trace the district',duration:.7},
 {at:.22,key:'district',name:'Smart Block',effect:'A neighborhood, line by line',duration:1.25},
 {at:.55,key:'towers',name:'Tower Core',effect:'The skyline takes shape',duration:1.24},
 {at:1.2,key:'transit',name:'Sky Transit',effect:'The city blueprint connects',duration:.595},
 {at:1.93,key:'light',name:'Adaptive Lighting',effect:'The blueprint becomes a living city',duration:1.6},
 {at:3.22,key:'complete',name:'City Link',effect:'A city, working together',duration:1.125}
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
 const stage=elapsed<BLUEPRINT_END?'drawing':elapsed<REALITY_START?'blueprint':elapsed<DURATION?'materializing':'complete';
 return {elapsed,reduced,stage,phase:PHASES[index],index,progress:clamp(elapsed/DURATION),scene,mint:visible[visible.length-1]||null};
}
export function visibleMints(frame){return MINTS.filter(mint=>mint.at<=frame.elapsed).slice(-3);}

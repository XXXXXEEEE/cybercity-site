const stages=[
 {title:'The first light',kicker:'THE FIRST SPARK',image:'assets/cyberpunk-foundation-plate.png',alt:'Stage one: roads and building sites begin to glow on a rainy night',description:'A city starts with simple, reliable decisions. Access rules, clocks, lighting, and start permissions give its first infrastructure a logic of its own.',unlocks:['Access with clear rules','Lighting that responds to people','Reliable device timing'],next:'Grow the neighborhood'},
 {title:'A neighborhood comes alive',kicker:'A NEIGHBORHOOD AWAKENS',image:'assets/cyberpunk-origin.png',alt:'Stage two: buildings rise as lights and transport connect a growing neighborhood',description:'Circuits become devices, and buildings come to life. Lighting, ventilation, access, and elevators work together, while energy and water support everyday life.',unlocks:['Responsive buildings','Coordinated access','Facilities that work together'],next:'Build the city together'},
 {title:'A city we build together',kicker:'THE CITY WE BUILD TOGETHER',image:'assets/cyberpunk-metropolis.png',alt:'Stage three: neon lights, towers, and elevated transit form a complete cyber city',description:'As more designs connect, buildings, transport, logistics, and energy begin to work together. One person’s circuit becomes an essential part of someone else’s building or street.',unlocks:['Connected city systems','Links between sky and street','A city that keeps growing'],next:'Back to the first circuit'}
];
let currentStage=0;
let swapTimer;
const $=id=>document.getElementById(id);
function setCityStage(index){
 if(!Number.isInteger(index)||index<0||index>=stages.length)throw new Error('The city stage must be 0, 1, or 2.');
 currentStage=index;const stage=stages[index];
 document.querySelectorAll('[data-stage]').forEach(button=>{const active=Number(button.dataset.stage)===index;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 $('growth-title').textContent=stage.title;$('growth-kicker').textContent=stage.kicker;$('growth-number').textContent=String(index+1).padStart(2,'0');$('growth-index').textContent=String(index+1).padStart(2,'0')+' / 03';
 $('growth-description').textContent=stage.description;$('growth-next').textContent=stage.next;
 $('growth-unlocks').replaceChildren(...stage.unlocks.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 const image=$('growth-image');clearTimeout(swapTimer);image.classList.add('changing');
 const apply=()=>{image.src=stage.image;image.alt=stage.alt;image.classList.remove('changing');};
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)apply();else swapTimer=setTimeout(apply,140);
 return {stage:index,title:stage.title,mode:'concept-demo',realChainTransaction:false};
}
document.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>setCityStage(Number(button.dataset.stage))));
$('growth-next').addEventListener('click',()=>setCityStage((currentStage+1)%stages.length));
window.CyberCity={setCityStage,getStage:()=>({stage:currentStage,title:stages[currentStage].title,mode:'concept-demo'})};

const systems={
 building:{id:127,title:'Smart Office',description:'Lighting, climate, ventilation, and occupancy work together so the building can sense how a space is used and respond.',tags:'Smart spaces / Indoor comfort / Connected systems',parts:[[65,'Adaptive Lighting','Lights respond when people arrive.'],[66,'Climate Control','Balance heating and cooling requests.'],[67,'Fresh Air','Bring fresh air into the room.']]},
 mobility:{id:121,title:'Air Courier',description:'Flight clearance, return logic, and cargo handoff work together to guide a virtual drone through departure, delivery, and its return home.',tags:'Low-altitude flight / Delivery logistics / Safe handoff',parts:[[41,'Flight Clearance','Check the conditions before every takeoff.'],[46,'Return Safeguard','Battery and connection status determine when to return.'],[48,'Cargo Handoff','Release the package at the right moment.']]},
 infrastructure:{id:133,title:'Smart Water Station',description:'Tank status, pressure control, and alternating pumps turn separate device requests into coordinated water supply control.',tags:'City water / Device interlocks / Fault handling',parts:[[100,'Dual-Tank Control','Coordinate refilling, supply, and overflow protection.'],[98,'Pressure Control','Adjust water supply requests within defined limits.'],[99,'Pump Rotation','Alternate duty and standby pumps.']]}
};
const systemImages={
 building:{src:'assets/adaptive-lighting.webp',alt:'A smart office with coordinated zoned lighting, ventilation, and climate control'},
 mobility:{src:'assets/delivery-drone.webp',alt:'A cargo drone hovering over a city rooftop landing pad'},
 infrastructure:{src:'assets/water-station.webp',alt:'A smart water station with parallel pumps, pressure lines, and water storage'}
};
function setSystem(key){
 const system=systems[key];if(!system)throw new Error('Unknown city system.');
 document.querySelectorAll('[data-system]').forEach(b=>{const active=b.dataset.system===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $('assembly-inputs').replaceChildren(...system.parts.map(([id,title,description])=>{const card=document.createElement('div');card.className='assembly-chip';const code=document.createElement('span');code.className='mono';code.textContent='CC-'+String(id).padStart(3,'0');const name=document.createElement('strong');name.textContent=title;const text=document.createElement('small');text.textContent=description;card.append(code,name,text);return card;}));
 $('assembly-id').textContent='CC-'+system.id;$('assembly-title').textContent=system.title;$('assembly-description').textContent=system.description;$('assembly-tags').textContent=system.tags;
 const visual=systemImages[key];$('assembly-image').src=visual.src;$('assembly-image').alt=visual.alt;
}
document.querySelectorAll('[data-system]').forEach(b=>b.addEventListener('click',()=>setSystem(b.dataset.system)));

const circuits=[
 {id:65,title:'Adaptive Lighting',category:'building',categoryLabel:'Smart Buildings',symbol:'0 / 1',description:'Sense occupancy and light levels to illuminate a space when needed.',nand:85,latch:0,page:142,inputs:'Occupancy, current and target light levels, and automatic or forced on/off modes.',purpose:'Generate lighting requests for a virtual room as a building block for the lighting system.'},
 {id:73,title:'Door Interlock',category:'building',categoryLabel:'Smart Buildings',symbol:'AND',description:'Check car doors, landing doors, and operating conditions before every trip.',nand:19,latch:0,page:158,inputs:'Car and landing door states, door lock confirmation, run requests, overload, and emergency stop signals.',purpose:'Combine door states and run permissions into an interlock for a virtual elevator control system.'},
 {id:41,title:'Flight Clearance',category:'mobility',categoryLabel:'Future Mobility',symbol:'ARM',description:'Give a drone clear rules from arming to takeoff.',nand:23,latch:1,page:94,inputs:'Armed state, takeoff clearance, takeoff and stop requests, and fault signals.',purpose:'Generate controlled motor run permissions for a drone, then connect with thrust mixing, landing, and cargo modules.'},
 {id:55,title:'Active Aero',category:'mobility',categoryLabel:'Future Mobility',symbol:'V / F',description:'Adjust a virtual supercar’s rear wing in response to speed, braking, and faults.',nand:27,latch:0,page:122,inputs:'Vehicle speed, braking state, and fault signals.',purpose:'Select from fixed rear wing settings as part of a virtual vehicle’s control system.'},
 {id:90,title:'Charge Interlock',category:'infrastructure',categoryLabel:'Infrastructure',symbol:'+ / −',description:'Coordinate charging, discharging, and standby for orderly energy flow.',nand:65,latch:2,page:192,inputs:'Charge and discharge requests, battery level, and device fault signals.',purpose:'Prevent simultaneous charging and discharging, and coordinate energy storage mode changes.'},
 {id:99,title:'Pump Rotation',category:'infrastructure',categoryLabel:'Infrastructure',symbol:'A / B',description:'Alternate two pumps and switch on faults to support the city’s water supply.',nand:36,latch:1,page:212,inputs:'Run requests, availability of both pumps, cycle completion, and reset signals.',purpose:'Enable an available pump and connect it with tank and pressure modules to form a water supply system.'}
];
const circuitImages={
 65:{src:'adaptive-lighting',alt:'A smart office lighting system illuminating one zone at a time'},
 73:{src:'access-elevator',alt:'Metal elevator doors and an access card reader'},
 41:{src:'delivery-drone',alt:'A cargo drone ready for takeoff'},
 55:{src:'active-aero',alt:'An active aerodynamic rear wing on a supercar'},
 90:{src:'energy-storage',alt:'Modular battery storage units and power lines'},
 99:{src:'water-station',alt:'Parallel alternating pumps in a city water station'}
};
let selectedFilter='all';
let previousDialogFocus;
function renderCircuits(filter){
 selectedFilter=filter;
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 const shown=circuits.filter(c=>filter==='all'||c.category===filter);
 $('catalog-count').textContent=String(shown.length).padStart(2,'0')+' / 160 DESIGNS';
 const cards=shown.map(c=>{
  const article=document.createElement('article');article.className='circuit-card';article.dataset.category=c.category;
  const top=document.createElement('div');top.className='card-top';const id=document.createElement('span');id.className='mono';id.textContent='CC-'+String(c.id).padStart(3,'0');const category=document.createElement('span');category.className='card-category';category.textContent=c.categoryLabel;top.append(id,category);
  const content=document.createElement('div');content.className='card-content';const visual=circuitImages[c.id];const image=document.createElement('img');image.className='circuit-image';image.src='assets/'+visual.src+'.webp';image.alt=visual.alt;image.width=1600;image.height=900;image.loading='lazy';image.decoding='async';const title=document.createElement('h3');title.textContent=c.title;const description=document.createElement('p');description.textContent=c.description;content.append(image,title,description);
  const foot=document.createElement('div');foot.className='card-footer';const count=document.createElement('span');count.className='resource-count';count.textContent=c.nand+' NAND / '+c.latch+' LATCH';const button=document.createElement('button');button.type='button';button.textContent='View design';button.setAttribute('aria-label','View '+c.title+' design');button.addEventListener('click',()=>openCircuit(c.id));foot.append(count,button);article.append(top,content,foot);return article;
 });
 $('circuit-grid').replaceChildren(...cards);
}
function openCircuit(id){
 const circuit=circuits.find(c=>c.id===id);if(!circuit)throw new Error('Circuit design not found.');
 previousDialogFocus=document.activeElement;
 $('dialog-id').textContent='CC-'+String(id).padStart(3,'0')+' / '+circuit.categoryLabel;$('dialog-title').textContent=circuit.title;$('dialog-description').textContent=circuit.description;
 $('dialog-resources').textContent=circuit.nand+' NAND   /   '+circuit.latch+' LATCH';$('dialog-inputs').textContent=circuit.inputs;$('dialog-purpose').textContent=circuit.purpose;
 $('dialog-report').href='assets/cybercity-design-report.pdf#page='+circuit.page;
 const dialog=$('circuit-dialog');
 if(typeof dialog.showModal==='function')dialog.showModal();
 else{dialog.setAttribute('open','');dialog.classList.add('dialog-fallback');dialog.setAttribute('aria-modal','true');}
 $('dialog-close').focus();
}
function closeCircuit(){const dialog=$('circuit-dialog');if(typeof dialog.close==='function')dialog.close();else{dialog.removeAttribute('open');dialog.classList.remove('dialog-fallback');previousDialogFocus?.focus();}}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>renderCircuits(b.dataset.filter)));
$('dialog-close').addEventListener('click',closeCircuit);
$('circuit-dialog').addEventListener('click',event=>{if(event.target===$('circuit-dialog')){const r=$('circuit-dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeCircuit();}});
$('circuit-dialog').addEventListener('keydown',event=>{if(!$('circuit-dialog').classList.contains('dialog-fallback'))return;if(event.key==='Escape'){event.preventDefault();closeCircuit();}if(event.key==='Tab'){const first=$('dialog-close'),last=$('dialog-report');if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
$('circuit-dialog').addEventListener('close',()=>previousDialogFocus?.focus());
renderCircuits('all');

function updatePermission(){
 const level=Number($('permission-level').value),required=Number($('permission-required').value),authenticated=$('permission-auth').checked;
 const permit=authenticated&&level>=required;
 $('permission-result').classList.toggle('denied',!permit);$('permission-bit').textContent=permit?'1':'0';$('permission-title').textContent=permit?'Access granted':'Access denied';
 $('permission-reason').textContent=!authenticated?'Verify your identity to enter, even if your access level is high enough.':level<required?'Your identity is verified, but your access level is too low.':'Your identity is verified and your access level meets the requirement.';
 return {level,required,authenticated,permit:Number(permit),mode:'local-demo'};
}
for(const id of ['permission-level','permission-required','permission-auth'])$(id).addEventListener('change',updatePermission);
updatePermission();

const modelContext=document.modelContext;
if(modelContext?.registerTool){
 const lifecycle=new AbortController();
 Promise.resolve(modelContext.registerTool({name:'preview_city_stage',title:'Preview city building stage',description:'Switch the page’s city growth concept preview. This does not change any real city, on-chain record, or wallet. Use 0 for the foundation, 1 for the neighborhood, or 2 for the complete city vision.',inputSchema:{type:'object',properties:{stage:{type:'integer',enum:[0,1,2]}},required:['stage'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){if(!input||typeof input!=='object'||Object.keys(input).some(k=>k!=='stage'))throw new Error('Only the stage field is accepted.');const result=setCityStage(input.stage);await new Promise(resolve=>setTimeout(resolve,180));return result;}},{signal:lifecycle.signal})).catch(()=>{});
 addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

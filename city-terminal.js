import { visibleMints } from './build-timeline.js?v=quick-flow-16';

export class CityTerminal {
 constructor(root){this.root=root;this.key=null;}
 update(frame){
  const events=visibleMints(frame),key=events.map(event=>event.key).join(',');
  if(key!==this.key){
   this.root.replaceChildren(...events.map((event,index)=>{
    const row=document.createElement('div');row.className='mint-item'+(index===events.length-1?' current':'');row.dataset.mint=event.key;
    const command=document.createElement('div');command.className='mint-command';
    const prefix=document.createElement('span');prefix.textContent='mint';
    const name=document.createElement('strong');name.textContent=event.name;
    command.append(prefix,name);
    const effect=document.createElement('span');effect.className='mint-effect';effect.textContent=event.effect;
    row.append(command,effect);return row;
   }));
   this.key=key;
  }
  this.root.dataset.event=frame.mint?.key||'boot';
  this.root.dataset.phase=frame.phase.key;
 }
}

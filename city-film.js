import { DrawnCity } from './drawn-city.js?v=quick-flow-16';
import { buildFrame, PLAYBACK_RATE, REALITY_START, DURATION } from './build-timeline.js?v=quick-flow-16';
import { CityTerminal } from './city-terminal.js?v=quick-flow-16';

const root = document.getElementById('hero-city');
const canvas = document.getElementById('hero-city-canvas');
const terminal = new CityTerminal(document.getElementById('terminal-output'));
const hero = root.closest('.shell-hero');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let scene, elapsed = 0, inView = true, failed = false;
let frame = 0, lastTime = 0, lastPaint = 0, fpsTime = 0, fpsFrames = 0;

function paint() {
  const state=buildFrame(elapsed,motionPreference.matches||failed);
  if(scene)scene.render(state);
  terminal.update(state);
  const p=state.progress;
  const reality=Math.max(0,Math.min(1,(state.elapsed-REALITY_START)/(DURATION-REALITY_START)));
  root.style.setProperty('--city-saturation',String(1.15-.43*reality));
  root.dataset.progress = String(Math.round(p*100));
  root.dataset.phase = state.phase.key;
  root.dataset.elapsed = elapsed.toFixed(2);
  root.dataset.mint = state.mint?.key||'boot';
  root.dataset.stage = state.stage;
}
function resize() {
  if(!scene) return;
  const bounds = root.getBoundingClientRect();
  scene.resize(Math.max(1,bounds.width),Math.max(1,bounds.height));
  paint();
}
function canPlay() { return scene&&!motionPreference.matches&&!document.hidden&&inView; }
function tick(now) {
  frame = 0;
  if(!canPlay()) return;
  if(!lastTime) lastTime = now;
  elapsed += Math.min((now-lastTime)/1000,.1)*PLAYBACK_RATE;
  lastTime = now;
  if(now-lastPaint>=15.5) {
    paint(); lastPaint = now; fpsFrames++;
    if(now-fpsTime>1200) {
      root.dataset.renderFps = String(Math.round(fpsFrames*1000/(now-fpsTime)));
      fpsFrames = 0; fpsTime = now;
    }
  }
  frame = requestAnimationFrame(tick);
}
function synchronize() {
  cancelAnimationFrame(frame); frame = 0; lastTime = 0; lastPaint = 0;
  fpsTime = performance.now(); fpsFrames = 0;
  root.dataset.playback = failed ? 'fallback' : motionPreference.matches ? 'reduced' : canPlay() ? 'playing' : 'suspended';
  hero.dataset.playback=root.dataset.playback;
  paint();
  if(canPlay()) frame = requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange',synchronize);
if(motionPreference.addEventListener)motionPreference.addEventListener('change',synchronize);
else if(motionPreference.addListener)motionPreference.addListener(synchronize);
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;synchronize();},{threshold:.01}).observe(root);
if('ResizeObserver' in window)new ResizeObserver(resize).observe(root);
else window.addEventListener('resize',resize,{passive:true});

function decodeImage(image){
  if(image.decode)return image.decode();
  if(image.complete)return image.naturalWidth?Promise.resolve():Promise.reject(new Error('Image unavailable'));
  return new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',reject,{once:true});});
}

async function prepare() {
  try {
    const plate = root.querySelector('.film-poster');
    const city = new Image(); city.src = new URL('./assets/cyberpunk-city-cutout.webp',import.meta.url).href;
    const blueprint = new Image(); blueprint.src = new URL('./assets/cybercity-blueprint.webp',import.meta.url).href;
    await Promise.all([decodeImage(city),decodeImage(blueprint),decodeImage(plate)]);
    scene = new DrawnCity(canvas,city,blueprint);
    root.dataset.animation = 'draw-blueprint-then-city';
    resize(); root.classList.add('film-ready'); synchronize();
  } catch(error) {
    // Keep the complete photographic poster if canvas or image decoding fails.
    scene = null; failed=true;root.classList.remove('film-ready');
    const poster = root.querySelector('.film-poster');
    poster.src = 'assets/cyberpunk-metropolis.png'; poster.alt = 'A completed cyberpunk city at night';
    synchronize();
    console.warn('City construction animation unavailable.',error);
  }
}
prepare();

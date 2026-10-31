/* Reference: user-provided React Bits HoloCard. CSS foil adapter for the existing sleeve. */
(()=>{
 const intro=document.querySelector('#portfolioIntro'),front=intro?.querySelector('.sleeve-front'),stage=intro?.querySelector('.sleeve-stage');if(!front)return;
 for(const name of ['foil','glare','edge']){const layer=document.createElement('span');layer.className='sleeve-holo-'+name;layer.setAttribute('aria-hidden','true');front.append(layer);}
 const reduce=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');let frame=0,x=.5,y=.5;
 function paint(){frame=0;front.style.setProperty('--holo-x',(x*100).toFixed(2)+'%');front.style.setProperty('--holo-y',(y*100).toFixed(2)+'%');front.style.setProperty('--holo-shift',(15+x*70).toFixed(2)+'%');}
 function reset(){front.classList.remove('is-holo-hover');x=y=.5;if(frame)cancelAnimationFrame(frame);paint();}
 front.addEventListener('pointermove',e=>{if(reduce.matches||!fine.matches||stage.classList.contains('is-composed'))return;const r=front.getBoundingClientRect();x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));front.classList.add('is-holo-hover');if(!frame)frame=requestAnimationFrame(paint);},{passive:true});
 front.addEventListener('pointerleave',reset);front.addEventListener('click',reset);front.addEventListener('blur',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});reduce.addEventListener('change',reset);fine.addEventListener('change',reset);
})();

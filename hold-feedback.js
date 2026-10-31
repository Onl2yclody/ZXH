/* Native HoldButton visual adapter. Existing click and keyboard actions retain ownership. */
(()=>{
 if(window.portfolioHoldFeedback)return;window.portfolioHoldFeedback=true;
 const selector='button,a[href],summary,[role="button"],input[type="button"],input[type="submit"]';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let current=null;
 function targetOf(event){const el=event.target instanceof Element?event.target.closest(selector):null;return el&&!el.matches(':disabled,[aria-disabled="true"]')&&!el.closest('[inert]')?el:null;}
 function place(state){if(!state.target.isConnected)return false;const visual=state.target.querySelector('.sleeve-logo-lift')||state.target,r=visual.getBoundingClientRect();if(!r.width||!r.height)return false;
  Object.assign(state.layer.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});return true;
 }
 function finish(){const state=current;if(!state)return;current=null;cancelAnimationFrame(state.frame);
  state.scale?.cancel();if(!reduced.matches&&state.target.isConnected)state.target.animate([{scale:.97},{scale:1}],{duration:180,easing:'cubic-bezier(.23,1,.32,1)'});
  const from=state.progress;let start;
  function retract(now){if(start===undefined)start=now;const t=Math.min(1,(now-start)/180);state.layer.style.setProperty('--hold-progress',String(from*Math.pow(1-t,3)));state.layer.style.opacity=String(1-t);if(t<1)requestAnimationFrame(retract);else state.layer.remove();}
  requestAnimationFrame(retract);
 }
 function begin(target,pointerId,x,y,key){finish();const layer=document.createElement('span');layer.className='hold-feedback';layer.setAttribute('aria-hidden','true');
  const art=target.matches('.sleeve-front,.sleeve-record,.sleeve-hotspot,.studio-disc button,.overview-card')||!!target.querySelector('img');
  if(art)layer.classList.add('hold-feedback--art');
  const style=getComputedStyle(target);layer.style.borderRadius=target.matches('.studio-disc button,.sleeve-record')?'50%':style.borderRadius||'5px';
  const lift=target.querySelector('.sleeve-logo-lift');if(lift){layer.style.maskImage=getComputedStyle(lift).maskImage;layer.style.maskSize='100% 100%';}
  layer.innerHTML='<span class="hold-feedback__fill"></span><span class="hold-feedback__wave"></span>';document.body.append(layer);
  const state={target,layer,pointerId,key,x,y,start:performance.now(),progress:.06,frame:0,scale:null};current=state;
  if(!reduced.matches)state.scale=target.animate([{scale:1},{scale:.97}],{duration:110,fill:'forwards',easing:'ease-out'});
  function tick(now){if(current!==state||!place(state)){if(current===state)finish();return;}state.progress=Math.min(1,.06+(now-state.start)/1300);layer.style.setProperty('--hold-progress',state.progress.toFixed(4));if(state.progress>=1){layer.classList.add('is-complete');return;}state.frame=requestAnimationFrame(tick);}
  if(!place(state)){finish();return;}state.frame=requestAnimationFrame(tick);
 }
 document.addEventListener('pointerdown',e=>{if(e.button!==0)return;const target=targetOf(e);if(target)begin(target,e.pointerId,e.clientX,e.clientY);},{capture:true,passive:true});
 document.addEventListener('pointermove',e=>{if(current&&current.pointerId===e.pointerId&&Math.hypot(e.clientX-current.x,e.clientY-current.y)>12)finish();},{passive:true});
 for(const name of ['pointerup','pointercancel'])document.addEventListener(name,e=>{if(current?.pointerId===e.pointerId)finish();},true);
 document.addEventListener('keydown',e=>{if(e.repeat||!['Enter',' '].includes(e.key))return;const target=targetOf(e);if(target)begin(target,null,0,0,e.key);},true);
 document.addEventListener('keyup',e=>{if(current?.key===e.key)finish();},true);
 window.addEventListener('blur',finish);window.addEventListener('scroll',finish,{capture:true,passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});reduced.addEventListener('change',finish);
})();

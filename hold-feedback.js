/* HoldButton-inspired feedback painted inside the actual control, never in a detached overlay. */
(()=>{
 if(window.portfolioHoldFeedback)return;window.portfolioHoldFeedback=true;
 const selector='button,a[href],summary,[role="button"],input[type="button"],input[type="submit"]';
 const art='.sleeve-front,.sleeve-record,.sleeve-hotspot,.sleeve-side-trigger,.sleeve-spine-link,.studio-disc button,.overview-card';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let current=null;
 function finish(){const s=current;if(!s)return;current=null;cancelAnimationFrame(s.frame);s.motion?.cancel();s.target.style.backgroundImage=s.originalImage;if(!reduced.matches&&s.target.isConnected)s.target.animate([{scale:.97},{scale:1}],{duration:160,easing:'cubic-bezier(.23,1,.32,1)'});}
 function begin(target,pointerId,x,y,key){finish();if(target.matches(art)||target.closest('.sleeve-model')||target.querySelector('img'))return;
  const old=target.style.backgroundImage,computed=getComputedStyle(target).backgroundImage;
  const s={target,pointerId,x,y,key,start:performance.now(),originalImage:old,base:computed==='none'?'':','+computed,frame:0,motion:null};current=s;
  if(!reduced.matches)s.motion=target.animate([{scale:1},{scale:.97}],{duration:100,fill:'forwards',easing:'ease-out'});
  function tick(now){if(current!==s)return;if(!target.isConnected){finish();return;}const p=Math.min(100,6+(now-s.start)/13);target.style.backgroundImage='linear-gradient(90deg,rgba(180,151,207,.28) '+p+'%,transparent '+p+'%)'+s.base;if(p<100)s.frame=requestAnimationFrame(tick);}
  s.frame=requestAnimationFrame(tick);
 }
 function getTarget(e){const target=e.target instanceof Element?e.target.closest(selector):null;return target&&!target.matches(':disabled,[aria-disabled="true"]')&&!target.closest('[inert]')?target:null;}
 document.addEventListener('pointerdown',e=>{if(e.button!==0)return;const target=getTarget(e);if(target)begin(target,e.pointerId,e.clientX,e.clientY);},{capture:true,passive:true});
 document.addEventListener('pointermove',e=>{if(current?.pointerId===e.pointerId&&Math.hypot(e.clientX-current.x,e.clientY-current.y)>12)finish();},{passive:true});
 for(const event of ['pointerup','pointercancel'])document.addEventListener(event,e=>{if(current?.pointerId===e.pointerId)finish();},true);
 document.addEventListener('keydown',e=>{if(e.repeat||!['Enter',' '].includes(e.key))return;const target=getTarget(e);if(target)begin(target,null,0,0,e.key);},true);
 document.addEventListener('keyup',e=>{if(current?.key===e.key)finish();},true);
 for(const event of ['blur','pagehide'])window.addEventListener(event,finish);window.addEventListener('scroll',finish,{capture:true,passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});reduced.addEventListener('change',finish);
})();

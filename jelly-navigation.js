/* Native adaptation of the user-supplied React Bits JellyRadio motion reference. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 document.querySelectorAll('.intro-navigation,.studio-navigation').forEach(nav=>{
  const items=[...nav.children].map(e=>e.matches('details')?e.querySelector('summary'):e).filter(e=>e?.matches('a,button,summary'));
  nav.classList.add('jelly-navigation');let selected=items[0],active=selected;const motions=new Map();
  function paint(target,instant=false){const chosen=items.indexOf(target);if(chosen<0)return;active=target;
   items.forEach((item,index)=>{item.dataset.jellyOn=String(item===target);const distance=Math.abs(index-chosen),direction=Math.sign(index-chosen);const x=direction*3.5,sx=item===target?1.055:.985,sy=item===target?1.035:.985;
    const from=getComputedStyle(item).transform;motions.get(item)?.cancel();const to='translateX('+x+'px) scale('+sx+','+sy+')';item.style.transform=to;
    if(instant||reduce.matches)return;
    const wide=item===target?'translateX(0px) scale(1.13,.95)':'translateX('+(x*1.4)+'px) scale(.97,.99)';
    motions.set(item,item.animate([{transform:from==='none'?'none':from},{transform:wide,offset:.33},{transform:item===target?'translateX(0) scale(1.035,1.07)':'translateX('+x+'px) scale(.99,.98)',offset:.7},{transform:to}],{duration:430+distance*18,delay:distance*14,easing:'cubic-bezier(.22,.7,.25,1)'}));
   });
  }
  items.forEach((item,index)=>{item.addEventListener('pointerenter',()=>{if(active!==item)paint(item);});item.addEventListener('focus',()=>paint(item));item.addEventListener('click',()=>{selected=item;paint(item);});item.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();items[e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowRight'?1:-1)+items.length)%items.length].focus();});});
  nav.addEventListener('pointerleave',()=>paint(items.includes(document.activeElement)?document.activeElement:selected));nav.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!nav.contains(document.activeElement))paint(selected);}));paint(selected,true);
 });
})();

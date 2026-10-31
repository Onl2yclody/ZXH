/* Motion reference: user-supplied React Bits RubberSegment. Native DOM adapter. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.overview-filters').forEach(nav=>{
  const items=[...nav.children].map(e=>e.matches('details')?e.querySelector('summary'):e).filter(e=>e?.matches('a,button,summary'));
  if(!items.length)return;
  nav.classList.add('rubber-navigation');
  const thumb=document.createElement('span');thumb.className='rubber-thumb';thumb.setAttribute('aria-hidden','true');nav.prepend(thumb);
  let selected=items.find(e=>e.getAttribute('aria-pressed')==='true')||items[0],active=selected,animation=null;
  function slot(item){return {left:item.offsetLeft,width:item.offsetWidth,top:item.offsetTop,height:item.offsetHeight};}
  function move(item,instant=false){
   active=item;const target=slot(item);if(!target.width){thumb.hidden=true;return;}thumb.hidden=false;
   const current={left:parseFloat(getComputedStyle(thumb).left)||target.left,width:thumb.getBoundingClientRect().width||target.width};
   animation?.cancel();thumb.style.left=target.left+'px';thumb.style.width=target.width+'px';thumb.style.top=target.top+'px';thumb.style.height=target.height+'px';thumb.style.bottom='auto';
   if(instant||reduced.matches)return;
   const left=Math.min(current.left,target.left),right=Math.max(current.left+current.width,target.left+target.width);
   const direction=target.left>=current.left?1:-1;
   animation=thumb.animate([{left:current.left+'px',width:current.width+'px',offset:0},{left:left+'px',width:(right-left)+'px',offset:.34},{left:(target.left+direction*2)+'px',width:target.width+'px',offset:.8},{left:target.left+'px',width:target.width+'px',offset:1}],{duration:460,easing:'cubic-bezier(.23,1,.32,1)'});
  }
  items.forEach((item,index)=>{
   item.addEventListener('pointerenter',()=>move(item));item.addEventListener('focus',()=>move(item));
   item.addEventListener('click',()=>{selected=item;move(item);});
   item.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowRight'?1:-1)+items.length)%items.length;items[next].focus();});
  });
  nav.addEventListener('pointerleave',()=>move(nav.contains(document.activeElement)&&items.includes(document.activeElement)?document.activeElement:selected));
  nav.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!nav.contains(document.activeElement))move(selected);}));
  new ResizeObserver(()=>move(active,true)).observe(nav);document.fonts.ready.then(()=>move(active,true));move(selected,true);
 });
})();

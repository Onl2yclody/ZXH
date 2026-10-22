/* One layout decision for CSS, the sleeve, carousel and player. No UA sniffing. */
(()=>{
 'use strict';
 const root=document.documentElement,key='portfolio-display-mode',modes=['auto','desktop','compact'];
 const hover=window.matchMedia('(hover:hover) and (pointer:fine)');
 let mode='auto',state,queued=false;
 try{const saved=window.localStorage.getItem(key);if(modes.includes(saved))mode=saved;}catch{}
 function refresh(){
  const width=window.innerWidth,height=window.innerHeight;
  // Short landscape windows retain the phone controls instead of a tiny desktop.
  const automatic=width<=760||(height<=500&&width<=1000)?'phone':width<=1100?'tablet':'desktop';
  const layout=mode==='auto'?automatic:mode==='compact'?'phone':'desktop';
  const next={mode,layout,width,height,hover:hover.matches,landscape:width>height};
  const changed=!state||Object.keys(next).some(k=>next[k]!==state[k]);
  state=Object.freeze(next);
  root.setAttribute('data-layout',layout);root.setAttribute('data-display-mode',mode);
  root.setAttribute('data-orientation',next.landscape?'landscape':'portrait');
  root.setAttribute('data-short-landscape',String(next.landscape&&height<=560));
  root.setAttribute('data-narrow',String(width<=760));
  if(changed)window.dispatchEvent(new CustomEvent('portfolio:layoutchange',{detail:state}));
 }
 const api={get state(){return state},refresh,setMode(value){if(!modes.includes(value))return;mode=value;try{window.localStorage.setItem(key,mode)}catch{}refresh()}};
 window.PortfolioLayout=api;refresh();
 window.addEventListener('resize',()=>{if(queued)return;queued=true;window.requestAnimationFrame(()=>{queued=false;refresh()})});
 hover.addEventListener('change',refresh);
 window.addEventListener('storage',event=>{if(event.key!==key)return;mode=modes.includes(event.newValue)?event.newValue:'auto';refresh()});
})();

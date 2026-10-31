/* ScrambledText reference: React Bits / Tom Miller. Native DOM adaptation. */
(()=>{
 const intro=document.querySelector('#portfolioIntro');if(!intro)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const scene=document.querySelector('.disc-studio'),overlay=document.querySelector('.vinyl-browser');
 const selector='#portfolioIntro .intro-wordmark,#portfolioIntro .intro-corner-tl strong,#portfolioIntro .intro-corner-bl p,.disc-studio .studio-meta h1,.disc-studio .studio-meta dd';
 const glyphs='.:/01';const registry=new Map();let frame=0;
 function restore(){for(const entry of registry.values())for(const c of entry.chars){c.glyph.textContent=c.original;c.node.classList.remove('is-scrambling');c.until=0;}}
 function active(el){return !document.documentElement.dataset.portfolioTransition&&!document.hidden&&(intro.contains(el)?!intro.hidden&&!intro.classList.contains('is-exiting'):!!scene&&intro.hidden&&(!overlay||overlay.hidden)&&!scene.classList.contains('studio-loading'));}
 function visible(){return !document.hidden&&(!intro.hidden||!!scene&&(!overlay||overlay.hidden));}
 function reveal(){for(const [el,entry] of registry)if(!entry.revealed&&active(el)){entry.revealed=true;trigger(entry);}}
 function wake(){if(!frame&&visible()&&!reduced.matches)frame=requestAnimationFrame(tick);}
 function tick(now){frame=0;if(!visible()||reduced.matches){restore();return;}let busy=false;
  for(const [el,entry] of registry){if(!el.isConnected){registry.delete(el);continue;}if(!active(el)){for(const c of entry.chars){c.glyph.textContent=c.original;c.node.classList.remove('is-scrambling');c.until=0;}continue;}for(const c of entry.chars){if(c.until>now){busy=true;if(now>=c.next){c.glyph.textContent=glyphs[Math.floor(Math.random()*glyphs.length)];c.node.classList.add('is-scrambling');c.next=now+75;}}else if(c.until){c.glyph.textContent=c.original;c.node.classList.remove('is-scrambling');c.until=0;}}}
  if(busy)frame=requestAnimationFrame(tick);
 }
 function trigger(entry,point,burst=false){if(!entry||reduced.matches||!active(entry.el))return;const now=performance.now();let index=0;
  for(const c of entry.chars){const r=c.node.getBoundingClientRect(),distance=point?Math.hypot(r.x+r.width/2-point.x,r.y+r.height/2-point.y):0;
   if(point&&!burst&&distance>100)continue;
   c.until=now+(point?(burst?220+distance*.9:220+(1-distance/100)*380):260+index/entry.chars.length*440);c.next=0;index++;
  }wake();
 }
 function attach(el){if(el.querySelector('.scramble-char'))return;if(registry.has(el))registry.delete(el);
  const text=el.textContent;if(!text.trim())return;
  const entry={chars:[],el,revealed:false};registry.set(el,entry);el.classList.add('scramble-text');
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){const fragment=document.createDocumentFragment();for(const char of Array.from(node.nodeValue)){if(/\s/.test(char)){fragment.append(document.createTextNode(char));continue;}
   const span=document.createElement('span');span.className='scramble-char';const sizer=document.createElement('span');sizer.className='scramble-sizer';sizer.textContent=char;
   const glyph=document.createElement('span');glyph.className='scramble-glyph';glyph.textContent=char;glyph.setAttribute('aria-hidden','true');span.append(sizer,glyph);fragment.append(span);entry.chars.push({node:span,glyph,original:char,until:0,next:0});}
   node.replaceWith(fragment);
  }
  // Handlers are assigned once per live element; dynamic category text is re-split.
  el.onpointermove=e=>trigger(registry.get(el),{x:e.clientX,y:e.clientY});
  el.onpointerdown=e=>{if(e.button===0)trigger(registry.get(el),{x:e.clientX,y:e.clientY},true);};
  if(!reduced.matches)setTimeout(reveal,380);
 }
 function scan(){document.querySelectorAll(selector).forEach(attach);reveal();}
 scan();new MutationObserver(records=>{if(records.some(r=>r.target instanceof Element&&r.target.matches('.intro-corner,.intro-corner-tl strong,.intro-corner-bl p,.studio-meta,.studio-meta h1,.studio-meta dd')))scan();}).observe(document.body,{childList:true,subtree:true});
 new MutationObserver(()=>{if(!visible())restore();else reveal();}).observe(intro,{attributes:true,attributeFilter:['hidden','class']});
 if(overlay)new MutationObserver(()=>{if(overlay.hidden)reveal();else restore();}).observe(overlay,{attributes:true,attributeFilter:['hidden']});
 window.addEventListener('portfolio:view-transition',e=>{restore();if(e.detail.phase==='end')for(const entry of registry.values())entry.revealed=true;});
 reduced.addEventListener('change',restore);document.addEventListener('visibilitychange',()=>{if(document.hidden)restore();});
})();

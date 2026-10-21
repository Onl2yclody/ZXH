/* Same suitcase, rendered from the original model; artwork remains project-specific. */
(()=>{
 let dispose=()=>{};
 window.disposeStaticSuitcase=()=>dispose();
 window.mountStaticSuitcase=(host,art)=>{
  dispose();host.classList.add('has-webgl','is-static-suitcase');
  const wrap=document.createElement('div');wrap.className='static-suitcase';
  wrap.innerHTML='<img class="static-case" src="suitcase-fallback.png" alt="猫头手提箱唱片机静态预览"><div class="static-art"><img alt="当前项目封面"></div>';
  host.append(wrap);const image=wrap.querySelector('.static-art img');
  const sync=()=>{image.src=art.src;};sync();
  const obs=new MutationObserver(sync);obs.observe(art,{attributes:true,attributeFilter:['src']});
  const resize=()=>{const s=Math.min(host.clientWidth/1000,host.clientHeight/900);wrap.style.transform='translate(-50%,-50%) scale('+s+')';};
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  dispose=()=>{obs.disconnect();ro.disconnect();wrap.remove();host.classList.remove('has-webgl','is-static-suitcase');dispose=()=>{};};
 };
})();

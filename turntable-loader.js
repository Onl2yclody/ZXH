/* Load the original suitcase only when a project is opened. */
(()=>{
 let pending=null;
 const load=src=>new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=src;
  const timeout=setTimeout(()=>{script.remove();reject(new Error('3D loading timed out'));},20000);
  script.onload=()=>{clearTimeout(timeout);resolve();};
  script.onerror=()=>{clearTimeout(timeout);script.remove();reject(new Error('3D loading failed'));};
  document.head.append(script);
 });
 window.ensureTurntable3D=()=>{
  if(window.mountTurntable3D)return Promise.resolve();
  if(!pending)pending=(async()=>{
   if(!window.THREE)await load('vendor/three.min.js');
   if(!window.createRedSuitcase)await load('red-suitcase-model.js?v=4');
   if(!window.mountTurntable3D)await load('suitcase-player.js?v=26');
  })().catch(error=>{pending=null;throw error;});
  return pending;
 };
 // Browsing intent, not homepage load, prepares scripts. Do not mount a
 // renderer or build the model here; the selected project's host owns that.
 let scheduled=false;
 function warmOnIntent(event){
  if(window.PortfolioLayout?.state?.layout==='phone')return;
  if(scheduled||pending||window.mountTurntable3D||document.hidden||window.navigator?.connection?.saveData)return;
  if(!event.target.closest?.('.studio-disc button,.sleeve-hotspot,.sleeve-record,[data-overview-category]'))return;
  scheduled=true;
  const prepare=()=>{scheduled=false;if(!document.hidden&&!window.navigator?.connection?.saveData)window.ensureTurntable3D().catch(()=>{});};
  if(window.requestIdleCallback)window.requestIdleCallback(prepare,{timeout:1000});
  else setTimeout(prepare,150);
 }
 for(const type of ['pointerover','focusin','pointerdown'])document.addEventListener(type,warmOnIntent,{passive:true});
})();

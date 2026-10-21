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
   if(!window.createRedSuitcase)await load('red-suitcase-model.js?v=3');
   if(!window.mountTurntable3D)await load('suitcase-player.js?v=22');
  })().catch(error=>{pending=null;throw error;});
  return pending;
 };
})();

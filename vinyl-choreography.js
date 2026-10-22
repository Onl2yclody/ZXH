/* Continuous sleeve → docking → playback timeline. */
(()=>{
 const clamp=v=>Math.max(0,Math.min(1,v)),mix=(a,b,t)=>a+(b-a)*t;
 const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
 const rectPose=r=>({x:r.left+r.width/2,y:r.top+r.height/2,a:r.width/200,b:0,c:0,d:r.height/200});
 window.playVinylDocking=({flight,start,stage,host,disc,reveal,complete,fromRail=false})=>{
 // Rail transfers own a foreground layer until the record is fully seated.
 if(fromRail){document.body.append(flight);flight.style.zIndex='400';flight.style.isolation='isolate';flight.hidden=false;}
 const player=window.getTurntable3D?.();player?.setCompositionProgress?.(0);player?.setPlaying(false);player?.setDiscVisible(false);player?.setLidProgress?.(0);
 player?.setTransferActive?.(true);
 const physicalDrop=typeof player?.setRecordLift==='function';
 if(physicalDrop){player.setRecordLift(12);player.setArmProgress?.(0);}
 const initial=rectPose(start),box=host.getBoundingClientRect();
 const dx=innerWidth*.47-box.left-box.width/2,dy=innerHeight*.54-box.top-box.height/2;
 // Capture the untransformed viewport pose once; do not force layout after
 // writing a moving host transform on every animation frame.
 const dockingPose=player?.getDiscPose?.();
 const target=dockingPose?{...dockingPose,x:dockingPose.x+dx,y:dockingPose.y+dy}:rectPose(disc.getBoundingClientRect());
 // Match the incoming velocity to the physical descent, rather than stopping
 // both layers at their boundary. Sample projection only during setup.
 const lowerPose=physicalDrop&&dockingPose?player.getDiscPose(11.9):null;
 const railDropPoses=fromRail&&physicalDrop?Array.from({length:61},(_,i)=>player.getDiscPose(i/5)):null;
 const endVelocity={};for(const k of ['x','y','a','b','c','d'])endVelocity[k]=lowerPose?(lowerPose[k]-dockingPose[k])/.1*(24/550):0;
 const compact=1,startTime=performance.now();let revealed=false,docked=false,swapped=false;
 // Fix the layout box once. Only compositor transforms move the flying disc.
 Object.assign(flight.style,{left:'0px',top:'0px',width:'200px',height:'200px',willChange:'transform'});
 function prepareLabel(inset){const label=flight.querySelector?.('.vinyl-label');if(label)Object.assign(label.style,{inset:inset+'%',width:'auto',height:'auto',transform:'none'});}
 prepareLabel(16);
 const control={x:initial.x-start.width*.65,y:Math.max(80,Math.min(initial.y,target.y)-innerHeight*.12)};
 host.style.transform=`translate(-50%,-50%) translate(${dx}px,${innerHeight+box.height*.6}px) scale(${compact})`;
 stage?.animate([{translate:'0px 0px'},{translate:innerWidth*1.25+'px 0px'}],{duration:450,easing:'cubic-bezier(.35,0,.65,1)',fill:'forwards'});
 function pose(p,flip,spin){flight.style.transform=`translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%) matrix(${p.a},${p.b},${p.c},${p.d},0,0) scaleX(${Math.max(.018,Math.abs(Math.cos(flip*Math.PI)))}) rotate(${spin}deg)`;}
 function tick(now){
 const elapsed=(now-startTime)*1.2;
 const rise=smooth((elapsed-540)/700),settle=smooth((elapsed-(physicalDrop?2050:1550))/750);
 // Open during the upward arrival; fully clear the record before docking at 1500 ms.
 player?.setLidProgress?.(smooth((elapsed-300)/700));
 host.style.transform=`translate(-50%,-50%) translate(${dx*(1-settle)}px,${mix(innerHeight+box.height*.6,dy,rise)*(1-settle)}px) scale(${mix(compact,1,settle)})`;
 if(elapsed>=540&&!revealed){revealed=true;document.body.append(flight);flight.style.zIndex='400';reveal();}
 if(!docked){
 // A single cubic path, with no phase boundary or restart at 620ms.
 // The endpoint is stationary, never the player's off-screen entrance pose.
 const t=clamp(elapsed/1500),u=1-t,e=smooth(t),turn=smooth((elapsed-80)/1120);
 const p={};for(const k of ['x','y','a','b','c','d']){const c1=k==='x'||k==='y'?control[k]:initial[k],c2=target[k]-endVelocity[k]*1500/3;p[k]=u*u*u*initial[k]+3*u*u*t*c1+3*u*t*t*c2+t*t*t*target[k];}
 if(turn>=.5&&!swapped){flight.innerHTML=disc.innerHTML;flight.classList.add('is-catalog-disc');swapped=true;prepareLabel((1-9.3/11.65)*50);}
 pose(p,turn,22*Math.sin(Math.PI*t)*Math.pow(1-t,2));
 // Match the 3D label's 9.3 / 11.65 radius before handing off at docking.
 // Switch proportions only while edge-on, then hold them through the handoff.
 if(t>=1){docked=true;if(!fromRail){flight.hidden=true;player?.setDiscVisible(true);disc.style.visibility='';}}
 }
  // Record seats at 2050 ms. Hold the parked arm for 200 ms, then perform
  // a distinct lift → swing → lower motion before starting playback.
  if(physicalDrop&&elapsed>=1500){player.setRecordLift(12*Math.pow(1-clamp((elapsed-1500)/550),2));player.setArmProgress?.(clamp((elapsed-2250)/1300));player.setCompositionProgress?.(smooth((elapsed-2050)/750));}
 if(fromRail&&docked){
  if(railDropPoses&&elapsed<2050){const height=12*Math.pow(1-clamp((elapsed-1500)/550),2),sample=height*5,lo=Math.floor(sample),hi=Math.min(60,lo+1),seat={};for(const k of ['x','y','a','b','c','d'])seat[k]=mix(railDropPoses[lo][k],railDropPoses[hi][k],sample-lo);pose({...seat,x:seat.x+dx,y:seat.y+dy},1,0);}
  else{flight.hidden=true;player?.setDiscVisible(true);disc.style.visibility='';}
 }
 if(elapsed<(physicalDrop?3550:2300)){requestAnimationFrame(tick);return;}
 host.style.transform='';player?.setTransferActive?.(false);player?.setDiscVisible(true);player?.setPlaying(true);flight.hidden=true;flight.remove?.();complete();
 }
 requestAnimationFrame(tick);
 };
})();

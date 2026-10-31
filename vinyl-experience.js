(() => {
 'use strict';
 const intro=document.querySelector('#portfolioIntro'),enter=document.querySelector('#introEnter');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const finish=enter.onclick;intro.onclick=null;enter.onclick=null;enter.hidden=true;
 const albumNav=intro.querySelector('[data-enter-albums]');if(albumNav)albumNav.onclick=()=>finish?.();
 if(new URLSearchParams(location.search).has('albums'))queueMicrotask(()=>{intro.dataset.directEntry='true';finish?.();});
 const oldDisc=intro.querySelector('.intro-disc-position');if(oldDisc)oldDisc.hidden=true;
 const stage=intro.querySelector('.sleeve-stage')||document.createElement('div');stage.className='sleeve-stage';
 if(!stage.querySelector('.sleeve-model'))stage.innerHTML='<div class="sleeve-model"><button class="sleeve-record" aria-label="抽出黑胶，进入作品集"><span class="vinyl-surface"><span class="vinyl-label">ZHONG XI HAN<br>PORTFOLIO<br>2026</span><span class="vinyl-enter-label">点击进入<br>专辑作品集 <b>↗</b></span></span></button><div class="sleeve-panel sleeve-back"><img class="sleeve-texture" src="sleeve-back-v2.png.webp" width="3131" height="3131" alt="作品集专辑背面" decoding="sync" fetchpriority="high" draggable="false"></div><div class="sleeve-spine"></div><div class="sleeve-edge"></div><div class="sleeve-edge bottom"></div><div class="sleeve-panel sleeve-front"><img class="sleeve-texture" src="sleeve-front-v2.png.webp" width="3131" height="3131" alt="作品集专辑正面" decoding="sync" fetchpriority="high" draggable="false"></div></div><p class="sleeve-hint">点击专辑正面 · 翻到背面选择分类</p>';
 intro.append(stage);const model=stage.querySelector('.sleeve-model'),record=stage.querySelector('button');let entering=false;

 let flipped=false,flipping=false,sideView=false,selected='graphic',angleX=-3,angleY=-8,angleZ=0,targetZ=0,targetX=-3,targetY=-8,motionFrame=0,lastMotion=0,modelScale=1,targetScale=1;
 const front=stage.querySelector('.sleeve-front'),back=stage.querySelector('.sleeve-back');
 // Vector bars traced from the original artwork; keep lettering independent of the cover bitmap.
 const barcode=document.createElement('img');barcode.className='sleeve-barcode-vector';barcode.src='sleeve-barcode.svg';barcode.alt='';barcode.setAttribute('aria-hidden','true');back.append(barcode);
 const hint=stage.querySelector('.sleeve-hint');
 const coverReturn=document.createElement('button');coverReturn.className='sleeve-cover-return';coverReturn.textContent='‹ 返回封面';coverReturn.hidden=true;intro.append(coverReturn);
 coverReturn.onclick=returnToCover;
 intro.addEventListener('keydown',e=>{if(e.key==='Escape'&&!intro.hidden&&flipped){e.preventDefault();returnToCover();}});
 function returnToCover(){
 if(sideView){returnFromSpine();return;}
 if(!flipped||flipping||entering)return;
 flipping=true;coverReturn.disabled=true;record.disabled=true;record.tabIndex=-1;hotspots.forEach(b=>b.tabIndex=-1);
 cancelAnimationFrame(motionFrame);motionFrame=0;targetX=angleX;targetY=angleY;targetZ=angleZ;
 stage.classList.add('is-retracting');stage.classList.remove('is-back');
 // Keep the sleeve still until the 650ms record slide has finished.
 setTimeout(()=>{
 flipped=false;targetX=-3;targetY=-8;targetZ=0;stage.classList.remove('is-composed');coverReturn.hidden=true;
 if(reduced){angleX=targetX;angleY=targetY;angleZ=0;model.style.transform='rotateZ(0deg) rotateX(-3deg) rotateY(-8deg)';}else wakeMotion();
 setTimeout(()=>{flipping=false;coverReturn.disabled=false;stage.classList.remove('is-retracting');front.tabIndex=0;hint.firstChild&&(hint.firstChild.textContent='点击专辑正面 · 翻到背面选择分类');front.focus({preventScroll:true});},reduced?0:1500);
 },reduced?0:680);
 }
 front.setAttribute('role','button');front.setAttribute('tabindex','0');front.setAttribute('aria-label','翻转专辑，选择设计分类');
 record.disabled=true;record.tabIndex=-1;
 const limit=(v,a,b)=>Math.max(a,Math.min(b,v));
 function motion(now){motionFrame=0;if(entering)return;const dt=Math.min(40,now-(lastMotion||now-16));lastMotion=now;const blend=1-Math.exp(-dt/230);angleX+=(targetX-angleX)*blend;angleY+=(targetY-angleY)*blend;angleZ+=(targetZ-angleZ)*blend;modelScale+=(targetScale-modelScale)*blend;model.style.transform=`scale(${modelScale}) rotateZ(${angleZ}deg) rotateX(${angleX}deg) rotateY(${angleY}deg)`;if(Math.abs(targetX-angleX)+Math.abs(targetY-angleY)+Math.abs(targetZ-angleZ)+Math.abs(targetScale-modelScale)>.025)motionFrame=requestAnimationFrame(motion);}
 function wakeMotion(){if(!motionFrame){lastMotion=0;motionFrame=requestAnimationFrame(motion);}}
 intro.addEventListener('pointermove',e=>{if(entering||flipping||sideView||reduced||!window.PortfolioLayout.state.hover)return;if(!flipped){const r=front.getBoundingClientRect(),over=e.target.closest?.('.sleeve-front');const x=limit((e.clientX-r.left)/r.width-.5,-.5,.5),y=limit((e.clientY-r.top)/r.height-.5,-.5,.5);targetX=over?-3-y*22:-3;targetY=over?-8+x*28:-8;targetScale=over?1.025:1;}else{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;targetX=26-limit(y*4,-2,2);targetY=180+limit(x*4,-2,2);targetScale=1;}wakeMotion();});
 intro.addEventListener('pointerleave',()=>{if(!entering&&!flipping&&!sideView){targetX=flipped?26:-3;targetY=flipped?180:-8;targetScale=1;wakeMotion();}});
 function flip(){if(flipped||flipping||entering)return;
 if(window.PortfolioLayout.state.layout==='phone'){
  entering=true;front.tabIndex=-1;
  cancelAnimationFrame(motionFrame);motionFrame=0;
  // Phones enter the already-built album browser directly. This removes the
  // costly sleeve/record hand-off that could expose an occluded middle frame.
  intro.dataset.directEntry='true';
  finish?.();
  return;
 }
 flipping=true;flipped=true;front.tabIndex=-1;targetScale=1;targetX=26;targetY=180;targetZ=17;stage.classList.add('is-composed');
 if(reduced){angleX=targetX;angleY=targetY;angleZ=targetZ;model.style.transform='rotateZ(17deg) rotateX(26deg) rotateY(180deg)';}else wakeMotion();
 setTimeout(()=>{flipping=false;stage.classList.add('is-back');coverReturn.hidden=false;record.disabled=false;record.tabIndex=0;hotspots.forEach(b=>b.tabIndex=0);hotspots[0].focus({preventScroll:true});hint.firstChild && (hint.firstChild.textContent='移向小猫切换黑胶 · 点击小猫进入项目目录');},reduced?0:850);}
 front.onclick=flip;front.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip();}});
 const layouts=[['graphic',1],['identity',2],['keyvisual',3],['packaging',4],['extended',5],['uiux',6],['illustration',7]];
 // Hit regions follow each printed cat. Non-overlapping source regions
 // preserve the artwork while allowing individual icons to lift.
 const logoBounds={graphic:[7.7,41.8,26.5,15.9],identity:[25.2,24.6,25.1,19.3],keyvisual:[58.5,16.3,25.7,19.2],packaging:[40,48.2,23,15.8],extended:[44.2,72.7,23.1,16],uiux:[67.8,61.4,22.4,15.3],illustration:[13.5,64,23.6,16.5]};
 const catImageReady=[];
 const hotspots=layouts.map(([category,n])=>{
  const b=document.createElement('button'),[x,y,w,h]=logoBounds[category];
  b.className='sleeve-hotspot';b.dataset.album=category;b.tabIndex=-1;
  b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
  b.setAttribute('aria-label',String(n).padStart(2,'0')+' '+window.albumProjects[category].title);b.title=window.albumProjects[category].title;
  const tile=document.createElement('span');tile.className='sleeve-cat-art';tile.setAttribute('aria-hidden','true');
  const shape=window.portfolioCatMasks?.[category];
  if(shape){const shapeMask='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+shape.width+' '+shape.height+'" preserveAspectRatio="none"><path fill="white" d="'+shape.path+'"/></svg>')+'")';tile.style.maskImage=tile.style.webkitMaskImage=shapeMask;tile.style.maskSize=tile.style.webkitMaskSize='100% 100%';tile.style.maskRepeat='no-repeat';}
  const image=document.createElement('img');image.className='sleeve-cat-art-image';image.alt='';image.draggable=false;image.src=back.querySelector('.sleeve-texture').getAttribute('src');
  image.style.cssText=`width:${137.5/w*100}%;height:${140/h*100}%;left:${-(x+18.75)/w*100}%;top:${-(y+20.8)/h*100}%`;
  tile.append(image);b.append(tile);catImageReady.push(image.decode());
  b.onpointerenter=b.onfocus=()=>{if(flipped&&!flipping&&!entering){select(category);warmCatalogCover(category);}};
  b.onclick=()=>{if(flipped&&!flipping)launch(category);};back.append(b);return b;
 });
 // Split the existing print into non-overlapping tiles. Each visible source
 // pixel has one owner, avoiding the double image that plagued the old lift.
 const sheet=back.querySelector('.sleeve-texture');
 const holes=Object.entries(logoBounds).map(([category,[x,y,w,h]])=>{const shape=window.portfolioCatMasks?.[category];if(!shape)return '';return '<g transform="translate('+((x+18.75)/137.5*100)+' '+((y+20.8)/140*100)+') scale('+(w/137.5*100/shape.width)+' '+(h/140*100/shape.height)+')"><path d="'+shape.path+'" fill="black"/></g>';}).join('');
 const mask='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="white"/>'+holes+'</svg>')+'")';
 Promise.all(catImageReady).then(()=>{if(!window.portfolioCatMasks||Object.keys(logoBounds).some(key=>!window.portfolioCatMasks[key]))return;sheet.style.maskImage=mask;sheet.style.webkitMaskImage=mask;sheet.style.maskSize=sheet.style.webkitMaskSize='100% 100%';sheet.style.maskMode='luminance';sheet.style.maskRepeat='no-repeat';back.classList.add('has-cat-layers');}).catch(()=>{back.classList.remove('has-cat-layers');});
 // Keep a decoded label on screen while the next category loads. Do not
 // rebuild the record on hover: this also preserves the 3D image layer.
 const catalogCoverCache=new Map();
 function warmCatalogCover(category){const p=window.albumProjects[category]?.series[0],src=p?.cover||p?.images?.[0];if(!src)return Promise.resolve();if(!catalogCoverCache.has(src)){const image=new Image();image.src=src;catalogCoverCache.set(src,image.decode().catch(()=>null));}return catalogCoverCache.get(src);}
 function prepareCover(category){return Promise.race([warmCatalogCover(category),new Promise(resolve=>setTimeout(resolve,500))]);}
 const labelCache=new Map(),highLabelCache=new Map();let labelRequest=0;
 record.innerHTML='<span class="vinyl-surface"><span class="vinyl-label"></span><span class="sleeve-record-title"><small></small><strong></strong></span><em class="sleeve-record-count"></em></span>';
 const recordLabel=record.querySelector('.vinyl-label');
 function labelSource(category){const p=window.albumProjects[category];return ({graphic:'lin-chang-fa-hui-exhibition-poster.png.webp',packaging:'half-a-whisper/brand-packaging-merchandise-final.png.webp',keyvisual:'imprint-static-01.png.webp'})[category]||p.series[0].cover||p.series[0].images[0];}
 function loadLabel(category){
  if(labelCache.has(category))return labelCache.get(category);
  const promise=(async()=>{
   for(const src of ['assets/record-labels/'+category+'.webp',labelSource(category)]){
    try{const img=new Image();img.alt=window.albumProjects[category].title+'作品预览';img.decoding='async';img.loading='eager';
     await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{img.onload=img.onerror=null;reject(new Error('Artwork loading timed out'));},8000);img.onload=()=>{clearTimeout(timer);resolve();};img.onerror=()=>{clearTimeout(timer);reject(new Error('Artwork loading failed'));};img.src=src;});
     await img.decode();return img;
    }catch(error){/* Fall back to the original artwork if a thumbnail fails. */}
   }
   throw new Error('Record artwork unavailable: '+category);
  })();labelCache.set(category,promise);promise.catch(()=>labelCache.delete(category));return promise;
 }
 function select(category){
  selected=category;const p=window.albumProjects[category],n=layouts.find(row=>row[0]===category)[1],request=++labelRequest;
  record.querySelector('.sleeve-record-title small').textContent=String(n).padStart(2,'0')+' / DESIGN COLLECTION';
  record.querySelector('.sleeve-record-title strong').textContent=p.title;
  record.querySelector('.sleeve-record-count').textContent=p.series.length+' PROJECTS';
  record.setAttribute('aria-label','进入'+p.title+'项目目录');hotspots.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.album===category)));
  loadLabel(category).then(img=>{if(request===labelRequest){recordLabel.replaceChildren(img);recordLabel.dataset.category=category;
   if(!highLabelCache.has(category)){const high=new Image();high.src=labelSource(category);high.alt=img.alt;high.decoding='async';highLabelCache.set(category,high.decode().then(()=>high).catch(()=>null));}
   highLabelCache.get(category).then(high=>{if(high&&request===labelRequest&&recordLabel.dataset.category===category)recordLabel.replaceChildren(high);});}}).catch(()=>{/* Retain the last successfully decoded artwork. A later hover retries. */});
 }
 // Warm only the small preview assets, leaving full project images on demand.
 const warmLabels=()=>layouts.forEach(([category])=>loadLabel(category).catch(()=>{}));
 if('requestIdleCallback' in window)requestIdleCallback(warmLabels,{timeout:1800});else setTimeout(warmLabels,600);
 async function launch(category){
 if(entering||!flipped||flipping)return;
 select(category);entering=true;coverReturn.disabled=true;record.disabled=true;
 await Promise.all([preparePlayer(),prepareCover(category)]);
 cancelAnimationFrame(motionFrame);motionFrame=0;
 window.selectVinylCategory?.(category);
 openAlbum(category);
 await slideToCatalog(intro);startNeedleIntro();
 intro.dataset.directEntry='true';finish();intro.hidden=true;
 coverReturn.disabled=false;record.disabled=false;entering=false;
 }
 // A shared rhythm for entering/leaving all three portfolio scenes.
 const pageMotion={duration:740,easing:'cubic-bezier(.65,0,.35,1)',fill:'both'};
 const readyToPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 function pageMotionState(direction,phase){if(phase==='start')document.documentElement.dataset.portfolioTransition=direction;else delete document.documentElement.dataset.portfolioTransition;window.dispatchEvent(new CustomEvent('portfolio:view-transition',{detail:{direction,phase}}));}
 async function slideToCatalog(previous){
  if(reduced)return;
  entryTransition=true;pageMotionState('to-catalog','start');
  const oldNext=overlay.style.willChange,oldPrevious=previous?.style.willChange;
  const oldInert=overlay.inert;overlay.inert=true;overlay.style.willChange='transform';overlay.style.transform='translate3d(0,100svh,0)';if(previous)previous.style.willChange='transform';
  let incoming,outgoing;
  try{
   await readyToPaint();
   incoming=overlay.animate([{transform:'translate3d(0,100svh,0)'},{transform:'translate3d(0,0,0)'}],pageMotion);
   outgoing=previous?.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(0,-100svh,0)'}],pageMotion);
   await incoming.finished;
  }catch(error){}finally{
   if(previous){if(previous===intro)previous.hidden=true;previous.style.willChange=oldPrevious||'';}
   overlay.style.transform='';outgoing?.cancel();incoming?.cancel();overlay.style.willChange=oldNext;overlay.inert=oldInert;entryTransition=false;pageMotionState('to-catalog','end');
  }
 }
 record.onclick=()=>launch(selected);
 const spine=model.querySelector('.sleeve-spine'),spineLinks=[];
 for(const [title,url,top] of [['个人介绍','portfolio-profile.html#about',1],['个人简历','portfolio-profile.html#resume',41],['工作经验','portfolio-profile.html#experience',80]]){
  const a=document.createElement('a');a.className='sleeve-spine-link';a.href=url;a.setAttribute('aria-label',title);a.title=title;a.textContent=title;a.tabIndex=-1;spine.append(a);spineLinks.push(a);
 }
 const sideNote=document.createElement('button');sideNote.className='sleeve-side-note';sideNote.textContent='点击专辑右侧 · 查看个人资料';sideNote.onclick=openSpine;intro.append(sideNote);
 const sideTriggers=['right'].map(position=>{
  const b=document.createElement('button');b.className='sleeve-side-trigger sleeve-side-trigger-'+position;b.setAttribute('aria-label','收起唱片，查看专辑侧面的个人资料');b.title='查看个人介绍、简历与工作经验';b.onclick=openSpine;back.append(b);return b;
 });
 function orientSpine(x,y,z){targetX=x;targetY=y;targetZ=z;if(reduced){angleX=x;angleY=y;angleZ=z;modelScale=targetScale;model.style.transform=`scale(${modelScale}) rotateZ(${z}deg) rotateX(${x}deg) rotateY(${y}deg)`;}else wakeMotion();}
 function fitSpine(){const mobile=window.PortfolioLayout.state.layout!=='desktop',w=innerWidth-(mobile?0:340),h=mobile?innerHeight*.58-56:innerHeight-72;stage.style.setProperty('--spine-size',Math.min(620,w*.72,h*.9)+'px');stage.style.setProperty('--spine-left',w*.52+'px');stage.style.setProperty('--spine-top',(mobile?56:72)+h*.60+'px');}
 window.addEventListener('resize',()=>{if(sideView)fitSpine();});
 function openSpine(){
  if(!flipped||flipping||entering||sideView)return;
  sideView=true;flipping=true;record.disabled=true;record.tabIndex=-1;hotspots.forEach(b=>b.tabIndex=-1);
  cancelAnimationFrame(motionFrame);motionFrame=0;
  stage.classList.add('is-retracting');stage.classList.remove('is-back');
  hint.textContent='收起黑胶 · 转向专辑侧面';
  setTimeout(()=>{
   fitSpine();stage.classList.add('is-spine');targetScale=1;
   // Studio uses XYZ; the live sleeve uses ZXY. These Euler angles give
   // exactly the same rotation matrix as studio (99°,18°,5°).
   orientSpine(7.714655846791057,98.63486149610034,-72.95818795766489);
   setTimeout(()=>{flipping=false;stage.classList.add('is-spine-ready');spineLinks.forEach(a=>a.tabIndex=0);spineLinks[0].focus({preventScroll:true});hint.textContent='点击侧面文字进入个人资料 · 鼠标右键 / Esc 返回专辑';},reduced?0:1100);
  },reduced?0:680);
 }
 function returnFromSpine(){
  if(flipping||!sideView)return;flipping=true;stage.classList.remove('is-spine-ready');spineLinks.forEach(a=>a.tabIndex=-1);
  stage.classList.remove('is-spine');targetScale=1;orientSpine(26,180,17);
  setTimeout(()=>{sideView=false;flipping=false;stage.classList.remove('is-retracting');stage.classList.add('is-back');record.disabled=false;record.tabIndex=0;hotspots.forEach(b=>b.tabIndex=0);hint.textContent='移向小猫切换黑胶 · 点击右侧留白查看个人资料';sideTriggers[0].focus({preventScroll:true});intro.scrollTop=0;intro.scrollLeft=0;},reduced?0:1100);
 }
 select('graphic');
 const data=window.albumProjects;const overlay=document.createElement('section');overlay.className='vinyl-browser';overlay.hidden=true;overlay.setAttribute('aria-label','专辑项目浏览');document.body.append(overlay);
 let key='graphic',projectIndex=0,returnFocus=null;
 const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cover=p=>p.cover||p.images?.[0]||'';
 const button=(text,fn)=>{const b=document.createElement('button');b.textContent=text;b.onclick=fn;return b;};

 let closing=false,entryTransition=false,previewActive=false,needleIntroPlayed=false,needleFrame=0;
 async function close(){
 if(closing||entryTransition||overlay.hidden)return;closing=true;cancelAnimationFrame(needleFrame);needleFrame=0;
 const destination=window.selectVinylCategory?.(key),scene=document.querySelector('.disc-studio');
 window.scrollTo({top:0,behavior:'instant'});
 overlay.querySelectorAll('video').forEach(video=>video.pause());
 window.getTurntable3D?.()?.setPlaying?.(false);
 let outgoing,incoming;overlay.inert=true;const oldSceneWillChange=scene?.style.willChange,oldOverlayWillChange=overlay.style.willChange;
 try{
  if(!reduced&&scene){
   pageMotionState('to-albums','start');overlay.style.willChange='transform';scene.style.willChange='transform';scene.style.transform='translate3d(0,-100svh,0)';
   await readyToPaint();
   outgoing=overlay.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(0,100svh,0)'}],pageMotion);
   incoming=scene.animate([{transform:'translate3d(0,-100svh,0)'},{transform:'translate3d(0,0,0)'}],pageMotion);
   await Promise.all([outgoing.finished,incoming.finished]);
  }
 }catch(error){/* A cancelled transition must still leave a usable archive. */}
 finally{
  window.disposeTurntable3D?.();window.disposeStaticSuitcase?.();
  overlay.hidden=true;overlay.replaceChildren();overlay.classList.remove('is-returning');
  if(scene){scene.style.transform='';scene.style.willChange=oldSceneWillChange||'';}outgoing?.cancel();incoming?.cancel();overlay.style.willChange=oldOverlayWillChange;overlay.inert=false;closing=false;pageMotionState('to-albums','end');
  (destination||returnFocus)?.focus({preventScroll:true});
 }
 }
 function startNeedleIntro(){
  const player=window.getTurntable3D?.();if(reduced||needleIntroPlayed||!player?.setArmProgress||overlay.hidden||previewActive)return;
  needleIntroPlayed=true;player.setTransferActive?.(true);let started;
  function move(now){needleFrame=0;if(closing||overlay.hidden||previewActive||window.getTurntable3D?.()!==player)return;if(started===undefined)started=now;const p=Math.max(0,Math.min(1,(now-started-120)/1100));player.setArmProgress(p);if(p<1)needleFrame=requestAnimationFrame(move);else{player.setTransferActive?.(false);player.setPlaying(true);}}
  needleFrame=requestAnimationFrame(move);
 }
 function bar(back){const el=document.createElement('header');el.className='vinyl-bar';const previous=button('',back?catalog:close);previous.innerHTML='<span class="bar-desktop-label">‹ '+(back?'项目目录':'全部专辑')+'</span><span class="bar-phone-label">'+(back?'返回项目目录':'返回全部专辑')+'</span>';el.append(previous);const title=document.createElement('span');title.textContent=data[key].number;const home=button('',close);home.innerHTML='<span class="bar-desktop-label">返回首页 ↗</span><span class="bar-phone-label">返回首页</span>';el.append(title,home);overlay.append(el);}
 function catalog(){window.disposeTurntable3D?.();window.disposeStaticSuitcase?.();previewActive=false;overlay.replaceChildren();overlay.scrollTop=0;bar(false);const grid=document.createElement('div');grid.className='vinyl-catalog';grid.innerHTML='<div class="vinyl-feature"><div class="turntable-model"><div class="vinyl-large"><div class="vinyl-surface"><span class="vinyl-label"><img alt="项目封面"></span></div></div></div></div><div class="vinyl-directory"><small>SELECT A PROJECT / 项目目录</small><h1>'+escape(data[key].title)+'</h1><div class="vinyl-tracks"></div></div>';overlay.append(grid);const image=grid.querySelector('img');image.src=cover(data[key].series[projectIndex]||data[key].series[0]);data[key].series.forEach((p,i)=>{const b=button(String(i+1).padStart(2,'0')+'  '+p.title+'  ↗',()=>preview(i));b.innerHTML='<span class="track-number">'+String(i+1).padStart(2,'0')+'</span><span class="track-name">'+escape(p.title)+'</span><span class="track-arrow" aria-hidden="true">↗</span>';b.onpointerenter=b.onfocus=()=>{projectIndex=i;image.src=cover(p);image.alt=p.title;};grid.querySelector('.vinyl-tracks').append(b);});const modelHost=grid.querySelector('.turntable-model');let mounted;try{mounted=window.mountTurntable3D?.(modelHost,image);}catch(error){console.warn('3D unavailable',error);}if(!mounted)window.mountStaticSuitcase(modelHost,image);mounted?.setLidProgress?.(1);mounted?.setRecordLift?.(0);mounted?.setCompositionProgress?.(1);const firstPlay=!needleIntroPlayed&&!reduced&&!!mounted?.setArmProgress;mounted?.setArmProgress?.(firstPlay?0:1);mounted?.setDiscVisible?.(true);mounted?.setPlaying?.(!firstPlay);overlay.querySelector('button').focus({preventScroll:true});}
 function preview(i){window.disposeTurntable3D?.();window.disposeStaticSuitcase?.();previewActive=true;projectIndex=i;const p=data[key].series[i];overlay.replaceChildren();overlay.scrollTop=0;bar(true);const grid=document.createElement('div');grid.className='project-view';grid.innerHTML='<div class="project-media"><div class="project-main-media"></div><div class="project-thumbs"></div></div><div class="project-copy"><small>'+escape(data[key].number)+'</small><h1>'+escape(p.title)+'</h1><dl><dt>主题 / THEME</dt><dd>'+escape(p.theme||p.title)+'</dd><dt>作者 / AUTHOR</dt><dd>'+escape(p.author||'钟锡汉 ZHONGXIHAN')+'</dd><dt>项目描述 / DESCRIPTION</dt><dd>'+escape(p.description)+'</dd></dl></div>';overlay.append(grid);const details={'山野来信':'shan-ye-details.html','半句花语':'half-a-whisper-details.html','灶楼 · 煲仔饭':'zaolou-details.html','HELLO PAW':'hello-paw.html','艾草信息可视化':'mugwort.html','大广赛赤尾避孕套':'redtail-details.html','THE GIANT SHOW':'giant-show.html','臨場發揮主题展':'lin-chang-fa-hui.html','昆虫世界展':'insect-world.html','印迹':'keyvisual.html','GREEN BOOK':'uiux.html','奇艺之旅':'extended.html','聊斋志异·聂小倩':'illustration.html','北京理工大学珠海学院艺悦楼导视设计':'identity.html'};const detailSection=document.createElement('section');detailSection.className='project-inline-details';detailSection.setAttribute('aria-label',p.title+'项目细节');detailSection.innerHTML='<header class="inline-detail-heading"><small>PROJECT ARCHIVE / 项目档案</small><h2>'+escape(p.title)+'</h2></header>'+(window.inlineProjectDetails?.[details[p.title]]||'<div class="process"><section><h2>作品完整展示</h2><p>'+escape(p.description)+'</p><div class="gallery">'+(p.images||[]).map((src,j)=>'<figure><img src="'+escape(src)+'" alt="'+escape(p.title)+' '+(j+1)+'" loading="lazy"><figcaption>'+String(j+1).padStart(2,'0')+' / '+escape(p.title)+'</figcaption></figure>').join('')+(p.videos||[]).map(src=>'<video controls playsinline preload="none" src="'+escape(src)+'"></video>').join('')+'</div></section></div>');overlay.append(detailSection);const media=[...(p.images||[]).map(src=>({src,type:'img'})),...(p.videos||[]).map(src=>({src,type:'video'}))];if(!media.length&&p.cover)media.push({src:p.cover,type:'img'});const thumbs=grid.querySelector('.project-thumbs');const show=(m,j)=>{const area=grid.querySelector('.project-main-media');area.replaceChildren();const el=document.createElement(m.type);el.src=m.src;if(m.type==='video'){el.controls=true;el.playsInline=true;}else el.alt=p.title;area.append(el);Array.from(thumbs.children).forEach((b,k)=>b.setAttribute('aria-pressed',String(j===k)));};media.forEach((m,j)=>{const b=button('',()=>show(m,j));b.setAttribute('aria-label','查看第 '+(j+1)+' 张作品');if(m.type==='img'){const im=document.createElement('img');im.src=m.src;im.alt='';b.append(im);}else b.textContent='▶';thumbs.append(b);});if(media.length)show(media[0],0);overlay.querySelector('button').focus({preventScroll:true});}
 function openAlbum(category,source){
 if(!data[category]||entryTransition||closing)return;
 key=category;projectIndex=0;returnFocus=document.activeElement;
 overlay.hidden=false;overlay.scrollTop=0;catalog();
 };
 window.portfolioGoBack=()=>{
  if(entering&&intro.hidden&&!entryTransition&&!closing)entering=false;
  if(entryTransition||closing||flipping)return true;
  if(!overlay.hidden){if(previewActive)catalog();else close();return true;}
  if(!intro.hidden){if(flipped)returnToCover();return true;}
  intro.hidden=false;intro.classList.remove('is-exiting','is-extracting','is-bridging');
  intro.scrollTop=0;intro.scrollLeft=0;
  stage.getAnimations?.().forEach(a=>a.cancel());stage.style.translate='';
  record.style.visibility='';record.disabled=!flipped;record.tabIndex=flipped?0:-1;entering=false;coverReturn.disabled=false;
  window.scrollTo({top:0,behavior:'instant'});front.focus({preventScroll:true});return true;
 };
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();window.portfolioGoBack();return;}if(e.key==='Tab'){const items=Array.from(overlay.querySelectorAll('button,select,video[controls]'));const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus({preventScroll:true});}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus({preventScroll:true});}}});
 let loadingEntry=false;
 async function preparePlayer(){
  let notice=document.querySelector('.player-loading');
  if(!window.mountTurntable3D){notice=document.createElement('div');notice.className='player-loading';notice.setAttribute('role','status');notice.textContent='正在加载唱片机…';document.body.append(notice);}
  try{await window.ensureTurntable3D();}catch(error){console.warn(error);}finally{notice?.remove();}
 }
 window.openVinylAlbum=async(category,source)=>{
  if(loadingEntry||entryTransition||closing||!data[category])return;
  loadingEntry=true;
  try{await Promise.all([preparePlayer(),prepareCover(category)]);if(source&&!source.isConnected)return;openAlbum(category,source);await slideToCatalog(window.scrollY>innerHeight*.6?document.querySelector('#collection'):document.querySelector('.disc-studio'));startNeedleIntro();}finally{loadingEntry=false;}
 };
 document.querySelectorAll('[data-overview-category]').forEach(a=>{const category=data[a.dataset.overviewCategory];const index=document.createElement('span');index.className='archive-index';index.textContent='ARCHIVE '+category.number.slice(0,2)+' / '+String(category.series.length).padStart(2,'0')+' PROJECTS / 2026';a.append(index);a.addEventListener('click',e=>{e.preventDefault();window.openVinylAlbum(a.dataset.overviewCategory);});});
 const returnAlbum=(location.search||'').match(/[?&]album=([a-z]+)/)?.[1];
 if(returnAlbum&&data[returnAlbum]){finish();intro.hidden=true;window.selectVinylCategory?.(returnAlbum);window.openVinylAlbum(returnAlbum);}
})();

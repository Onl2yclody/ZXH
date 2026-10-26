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
 intro.addEventListener('pointermove',e=>{if(entering||flipping||sideView||reduced||!window.PortfolioLayout.state.hover)return;const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;targetX=(flipped?26:-3)-limit(y*4,-2,2);targetY=(flipped?180:-8)+limit(x*(flipped?4:16),flipped?-2:-8,flipped?2:8);wakeMotion();});
 intro.addEventListener('pointerleave',()=>{if(!entering&&!flipping&&!sideView){targetX=flipped?26:-3;targetY=flipped?180:-8;wakeMotion();}});
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
 flipping=true;flipped=true;front.tabIndex=-1;targetX=26;targetY=180;targetZ=17;stage.classList.add('is-composed');
 if(reduced){angleX=targetX;angleY=targetY;angleZ=targetZ;model.style.transform='rotateZ(17deg) rotateX(26deg) rotateY(180deg)';}else wakeMotion();
 setTimeout(()=>{flipping=false;stage.classList.add('is-back');coverReturn.hidden=false;record.disabled=false;record.tabIndex=0;hotspots.forEach(b=>b.tabIndex=0);hotspots[0].focus({preventScroll:true});hint.firstChild && (hint.firstChild.textContent='移向小猫切换黑胶 · 点击小猫进入项目目录');},reduced?0:850);}
 front.onclick=flip;front.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip();}});
 const layouts=[['graphic',1,3,36,30,23],['identity',2,25,21,29,23],['keyvisual',3,58,15,29,25],['packaging',4,39,44,26,20],['extended',5,43,66,26,23],['uiux',6,67,57,25,21],['illustration',7,13,59,25,23]];
 // Tight logo-only bounds in the cropped sleeve coordinate system.
 const logoBounds={graphic:[7.7,41.8,26.5,15.9],identity:[25.2,24.6,25.1,19.3],keyvisual:[58.5,16.3,25.7,19.2],packaging:[40,48.2,23,15.8],extended:[44.2,72.7,23.1,16],uiux:[67.8,61.4,22.4,15.3],illustration:[13.5,64,23.6,16.5]};
 // Vector silhouettes exclude nearby route strokes even when those strokes
 // are as dark as the logo. Coordinates are local to each logo crop.
 const logoSilhouettes={
 graphic:'M1 58 L6 34 L6 14 L12 9 L28 17 L69 7 L78 0 L85 2 L90 22 L98 38 L99 66 L90 83 L75 93 L22 98 L9 87 L2 75 Z',
 identity:'M1 50 Q0 40 5 29 L12 9 Q16 0 23 1 L33 10 L52 9 L72 15 Q82 5 90 14 Q94 19 94 32 L100 51 L93 82 Q91 91 76 98 L24 88 Q13 85 4 74 Z',
 extended:'M1 48 L7 30 L10 3 L16 0 L27 12 L54 9 L73 15 L85 4 L91 6 L94 30 L100 48 L95 84 L83 98 L39 97 L15 88 L3 73 Z',
 keyvisual:'M1 57 L7 36 L12 11 Q14 0 21 0 L36 12 L52 12 L72 17 L87 11 Q92 10 93 17 L94 37 L100 52 L94 77 L88 90 L72 99 L22 85 L7 72 Z',
 packaging:'M1 56 L8 31 L10 5 L15 0 L29 9 L65 8 L80 2 L90 18 L95 39 L100 55 L94 83 L84 94 L65 99 L25 94 L8 79 Z',
 uiux:'M1 55 L7 35 L9 9 L16 0 L27 13 L46 10 L66 14 L86 4 L91 10 L92 32 L99 48 L95 70 L83 90 L62 99 L34 94 L13 82 L3 69 Z',
 illustration:'M2 57 L6 47 L2 39 L11 32 L9 16 L13 3 L20 0 L29 14 L40 10 L46 16 L54 9 L60 15 L69 11 L77 15 L84 6 L90 7 L91 23 L87 30 L95 36 L92 44 L100 49 L93 56 L96 66 L91 72 L91 84 L82 84 L78 96 L67 92 L60 99 L51 94 L44 98 L37 92 L29 95 L22 86 L13 86 L12 77 L4 71 L7 63 Z'
 };
 const filterDefs=document.createElement('div');filterDefs.setAttribute('aria-hidden','true');
 filterDefs.innerHTML='<svg width="0" height="0" style="position:absolute;pointer-events:none"><defs><filter id="sleeve-logo-cutout" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -5 -5 -5 12 0"/></filter></defs></svg>';
 intro.append(filterDefs);
 const hotspots=layouts.map(([category,n,x,y,w,h])=>{const b=document.createElement('button');b.className='sleeve-hotspot';b.dataset.album=category;b.tabIndex=-1;b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;b.setAttribute('aria-label',String(n).padStart(2,'0')+' '+window.albumProjects[category].title);const bounds=logoBounds[category];if(bounds){const [lx,ly,lw,lh]=bounds;const lift=document.createElement('span');lift.className='sleeve-logo-lift';lift.setAttribute('aria-hidden','true');const mask='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path fill="white" d="'+logoSilhouettes[category]+'"/></svg>')+'")';lift.style.cssText=`left:${(lx-x)/w*100}%;top:${(ly-y)/h*100}%;width:${lw/w*100}%;height:${lh/h*100}%`;lift.style.maskImage=mask;lift.style.webkitMaskImage=mask;lift.style.backgroundSize=`${13750/lw}% ${14000/lh}%`;lift.style.backgroundPosition=`${(lx+18.75)/(137.5-lw)*100}% ${(ly+20.8)/(140-lh)*100}%`;if(category==='packaging'||category==='uiux'){const cover=document.createElement('span');cover.className='sleeve-logo-base-cover';cover.setAttribute('aria-hidden','true');cover.style.cssText=lift.style.cssText;cover.style.backgroundImage='none';cover.style.maskImage=mask;cover.style.webkitMaskImage=mask;b.append(cover);}b.append(lift);}b.title=window.albumProjects[category].title;b.onpointerenter=b.onfocus=()=>{if(flipped&&!flipping&&!entering)select(category);};b.onclick=()=>{if(flipped&&!flipping)launch(category);};back.append(b);return b;});
 // Keep the bright facial details outside the dark-pixel cutout filter.
 const identityEyes='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><filter id="soft-eye" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="1.7"/></filter></defs><g fill="white" filter="url(#soft-eye)"><rect x="24" y="40" width="12" height="14" rx="3"/><rect x="65" y="48" width="12" height="14" rx="3"/><rect x="46" y="61" width="6" height="5" rx="2"/></g></svg>';
 function addIdentityEyes(parent,box){const eyes=document.createElement('span');eyes.className='sleeve-identity-eyes';eyes.setAttribute('aria-hidden','true');eyes.style.cssText=`left:${box[0]}%;top:${box[1]}%;width:${box[2]}%;height:${box[3]}%`;eyes.innerHTML=identityEyes;parent.append(eyes);}
 const identityButton=hotspots.find(b=>b.dataset.album==='identity');
 const [ex,ey,ew,eh]=logoBounds.identity;
 addIdentityEyes(identityButton,[(ex-25)/29*100,(ey-21)/23*100,ew/29*100,eh/23*100]);
 addIdentityEyes(front,[ex,ey+3.2,ew,eh]);
 function select(category){selected=category;const p=window.albumProjects[category],n=layouts.find(row=>row[0]===category)[1];const src=({graphic:'lin-chang-fa-hui-exhibition-poster.png.webp',packaging:'half-a-whisper/brand-packaging-merchandise-final.png.webp',keyvisual:'imprint-static-01.png.webp'})[category]||p.series[0].cover||p.series[0].images[0];
 record.innerHTML='<span class="vinyl-surface"><span class="vinyl-label"><img src="'+src+'" alt=""></span><span class="sleeve-record-title"><small>'+String(n).padStart(2,'0')+' / DESIGN COLLECTION</small><strong>'+p.title+'</strong></span><em class="sleeve-record-count">'+p.series.length+' PROJECTS</em></span>';
 record.setAttribute('aria-label','进入'+p.title+'项目目录');hotspots.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.album===category)));}
 async function launch(category){
 if(entering||!flipped||flipping)return;
 select(category);entering=true;coverReturn.disabled=true;record.disabled=true;
 await preparePlayer();
 cancelAnimationFrame(motionFrame);motionFrame=0;
 window.selectVinylCategory?.(category);
 if(reduced||window.PortfolioLayout.state.layout!=='desktop'){finish();intro.hidden=true;openAlbum(category);if(!reduced)overlay.animate([{opacity:0,transform:"translateY(24px)"},{opacity:1,transform:"none"}],{duration:450,easing:"ease-out"});return;}
 const r=record.getBoundingClientRect(),flight=document.createElement('div');
 flight.className='vinyl-transfer';flight.setAttribute('aria-hidden','true');flight.innerHTML=record.innerHTML;
 flight.style.cssText=`left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
 intro.append(flight);record.style.visibility='hidden';intro.classList.add('is-extracting');

 openAlbum(category);if(!window.getTurntable3D?.()){flight.remove();record.style.visibility='';finish();intro.hidden=true;return;}entryTransition=true;overlay.classList.add('is-entering');
 const destination=overlay.querySelector('.vinyl-large');
 destination.style.visibility='hidden';
 window.playVinylDocking({flight,start:r,stage,host:overlay.querySelector('.turntable-model'),disc:destination,
 reveal:()=>{finish();intro.hidden=true;},
 complete:()=>{entryTransition=false;overlay.classList.remove('is-entering');}});
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

 let closing=false,entryTransition=false,previewActive=false,returnArtwork='';
 function close(){
 if(closing||entryTransition||overlay.hidden)return;closing=true;
 const source=overlay.querySelector(previewActive?'.project-main-media':'.vinyl-large');
 const r=source?.getBoundingClientRect();
 const destination=window.selectVinylCategory?.(key);window.scrollTo({top:0,behavior:'instant'});
 requestAnimationFrame(()=>{
 const done=()=>{if(destination)destination.style.visibility='';document.body.classList.remove('vinyl-returning');destination?.parentElement?.classList.remove('is-return-target');window.disposeTurntable3D?.();window.disposeStaticSuitcase?.();overlay.hidden=true;overlay.replaceChildren();overlay.classList.remove('is-returning');overlay.style.opacity='';closing=false;(destination||returnFocus)?.focus({preventScroll:true});};
 if(reduced||window.PortfolioLayout.state.layout!=='desktop'||!r||!destination){if(!reduced)overlay.animate([{opacity:1},{opacity:0}],{duration:220});setTimeout(done,reduced?0:220);return;}
 const t=destination.getBoundingClientRect();
 // Move the live record outside the isolated rail stacking context.
 // A child z-index cannot put it above the fixed player overlay.
 const recordNode=destination.parentElement,railParent=recordNode?.parentElement;
 const nextRecord=recordNode?.nextSibling,recordStyle=recordNode?.getAttribute('style');
 if(recordNode&&railParent){
  const bounds=recordNode.getBoundingClientRect();
  document.body.append(recordNode);
  recordNode.dataset.returnFlight='true';
  recordNode.style.position='fixed';recordNode.style.left=(bounds.left+bounds.width/2)+'px';
  recordNode.style.top=(bounds.top+bounds.height/2)+'px';recordNode.style.width=bounds.width+'px';
  recordNode.style.zIndex='400';recordNode.style.pointerEvents='none';
 }
 const base=window.getComputedStyle?.(destination).transform||destination.style.transform||'none';
 const pose=base==='none'?'':base;
 const dx=r.left+r.width/2-t.left-t.width/2,dy=r.top+r.height/2-t.top-t.height/2;
 const sx=r.width/t.width,sy=r.height/t.height;
 overlay.classList.add('is-returning');document.body.classList.add('vinyl-returning');destination.parentElement?.classList.add('is-return-target');
 overlay.querySelectorAll('video').forEach(video=>video.pause());
 window.getTurntable3D?.()?.setPlaying(false);window.getTurntable3D?.()?.setDiscVisible(false);
 const host=overlay.querySelector('.turntable-model');
 // A close-up is intentionally cropped at the canvas edge. Pull the camera
 // back inside its viewport before translating that viewport off screen.
 // Otherwise the crop becomes a visible horizontal cut through the lid.
 const returningPlayer=window.getTurntable3D?.();
 if(returningPlayer?.setCompositionProgress){
  let pullbackStart;
  const pullback=now=>{if(!closing||window.getTurntable3D?.()!==returningPlayer)return;if(pullbackStart===undefined)pullbackStart=now;const t=Math.min(1,(now-pullbackStart)/320);returningPlayer.setCompositionProgress(1-t*t*(3-2*t));if(t<1)requestAnimationFrame(pullback);};
  requestAnimationFrame(pullback);
 }
 host?.animate([{transform:'translate(-50%,-50%)',opacity:1},{transform:'translate(-50%,-50%) translateY('+innerHeight+'px)',opacity:0}],{delay:360,duration:700,easing:'cubic-bezier(.4,0,.7,1)',fill:'forwards'});
 overlay.querySelector('.project-view')?.animate([{opacity:1},{opacity:0}],{duration:260,fill:'forwards'});
 // Blue → edge-on yellow → red are successive poses of ONE record.
 // Use the live rail button so the last frame is exactly the existing layout.
 const motion=destination.animate([
 {transform:`translate(${dx}px,${dy}px) scale(${sx},${sy}) ${pose}`,opacity:0,offset:0},
 {opacity:1,offset:.07},
 {transform:`translate(${dx*.55}px,${Math.min(dy,0)-innerHeight*.22}px) scale(${(sx+1)/2},${(sy+1)/2}) rotateY(86deg) rotateZ(140deg) ${pose}`,opacity:1,offset:.48},
 {transform:`translate(${dx*.1}px,${-innerHeight*.06}px) scale(.97) rotateY(16deg) rotateZ(325deg) ${pose}`,opacity:1,offset:.83},
 {transform:base,opacity:1,offset:1}
 ],{duration:1350,easing:'cubic-bezier(.35,0,.25,1)',fill:'both'});
 setTimeout(()=>{
  motion?.cancel?.();overlay.getAnimations?.().forEach(animation=>animation.cancel());
  if(recordNode&&railParent){
   railParent.insertBefore(recordNode,nextRecord||null);
   delete recordNode.dataset.returnFlight;
   if(recordStyle===null)recordNode.removeAttribute('style');else recordNode.setAttribute('style',recordStyle);
  }
  done();
 },1350);
 });
 }

 function bar(back){const el=document.createElement('header');el.className='vinyl-bar';const previous=button('',back?catalog:close);previous.innerHTML='<span class="bar-desktop-label">‹ '+(back?'项目目录':'全部专辑')+'</span><span class="bar-phone-label">'+(back?'返回项目目录':'返回全部专辑')+'</span>';el.append(previous);const title=document.createElement('span');title.textContent=data[key].number;const home=button('',close);home.innerHTML='<span class="bar-desktop-label">返回首页 ↗</span><span class="bar-phone-label">返回首页</span>';el.append(title,home);overlay.append(el);}
 function catalog(){window.disposeTurntable3D?.();window.disposeStaticSuitcase?.();previewActive=false;overlay.replaceChildren();overlay.scrollTop=0;bar(false);const grid=document.createElement('div');grid.className='vinyl-catalog';grid.innerHTML='<div class="vinyl-feature"><div class="turntable-model"><div class="vinyl-large"><div class="vinyl-surface"><span class="vinyl-label"><img alt="项目封面"></span></div></div></div></div><div class="vinyl-directory"><small>SELECT A PROJECT / 项目目录</small><h1>'+escape(data[key].title)+'</h1><div class="vinyl-tracks"></div></div>';overlay.append(grid);const player=document.createElement('div');player.className='turntable-hardware';player.setAttribute('aria-hidden','true');player.innerHTML='<div class="turntable-plinth"></div><div class="turntable-arm"></div><span class="turntable-speed">33⅓</span>';const deck=grid.querySelector('.vinyl-feature');grid.querySelector('.turntable-model').append(player);deck.onpointermove=e=>{if(reduced)return;const box=deck.getBoundingClientRect();const x=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width));deck.style.setProperty('--metal-light',(58+x*12)+'%');};deck.onpointerleave=()=>deck.style.setProperty('--metal-light','64%');const image=grid.querySelector('img');image.src=cover(data[key].series[projectIndex]||data[key].series[0]);returnArtwork=image.src;data[key].series.forEach((p,i)=>{const b=button(String(i+1).padStart(2,'0')+'  '+p.title+'  ↗',()=>preview(i));b.innerHTML='<span class="track-number">'+String(i+1).padStart(2,'0')+'</span><span class="track-name">'+escape(p.title)+'</span><span class="track-arrow" aria-hidden="true">↗</span>';b.onpointerenter=b.onfocus=()=>{projectIndex=i;image.src=cover(p);returnArtwork=image.src;image.alt=p.title;};grid.querySelector('.vinyl-tracks').append(b);});const modelHost=grid.querySelector('.turntable-model');let mounted;try{mounted=window.mountTurntable3D?.(modelHost,image);}catch(error){console.warn('3D unavailable',error);}if(!mounted)window.mountStaticSuitcase(modelHost,image);mounted?.setLidProgress?.(1);mounted?.setRecordLift?.(0);mounted?.setCompositionProgress?.(1);mounted?.setArmProgress?.(1);mounted?.setDiscVisible?.(true);mounted?.setPlaying?.(true);overlay.querySelector('button').focus({preventScroll:true});}
 function preview(i){window.disposeTurntable3D?.();window.disposeStaticSuitcase?.();previewActive=true;projectIndex=i;const p=data[key].series[i];overlay.replaceChildren();overlay.scrollTop=0;bar(true);const grid=document.createElement('div');grid.className='project-view';grid.innerHTML='<div class="project-media"><div class="project-main-media"></div><div class="project-thumbs"></div></div><div class="project-copy"><small>'+escape(data[key].number)+'</small><h1>'+escape(p.title)+'</h1><dl><dt>主题 / THEME</dt><dd>'+escape(p.theme||p.title)+'</dd><dt>作者 / AUTHOR</dt><dd>'+escape(p.author||'钟锡汉 ZHONGXIHAN')+'</dd><dt>项目描述 / DESCRIPTION</dt><dd>'+escape(p.description)+'</dd></dl></div>';overlay.append(grid);const details={'山野来信':'shan-ye-details.html','半句花语':'half-a-whisper-details.html','灶楼 · 煲仔饭':'zaolou-details.html','HELLO PAW':'hello-paw.html','艾草信息可视化':'mugwort.html','大广赛赤尾避孕套':'redtail-details.html','THE GIANT SHOW':'giant-show.html','臨場發揮主题展':'lin-chang-fa-hui.html','昆虫世界展':'insect-world.html','印迹':'keyvisual.html','GREEN BOOK':'uiux.html','奇艺之旅':'extended.html','聊斋志异·聂小倩':'illustration.html','北京理工大学珠海学院艺悦楼导视设计':'identity.html'};const detailSection=document.createElement('section');detailSection.className='project-inline-details';detailSection.setAttribute('aria-label',p.title+'项目细节');detailSection.innerHTML='<header class="inline-detail-heading"><small>PROJECT ARCHIVE / 项目档案</small><h2>'+escape(p.title)+'</h2></header>'+(window.inlineProjectDetails?.[details[p.title]]||'<div class="process"><section><h2>作品完整展示</h2><p>'+escape(p.description)+'</p><div class="gallery">'+(p.images||[]).map((src,j)=>'<figure><img src="'+escape(src)+'" alt="'+escape(p.title)+' '+(j+1)+'" loading="lazy"><figcaption>'+String(j+1).padStart(2,'0')+' / '+escape(p.title)+'</figcaption></figure>').join('')+(p.videos||[]).map(src=>'<video controls playsinline preload="none" src="'+escape(src)+'"></video>').join('')+'</div></section></div>');overlay.append(detailSection);const media=[...(p.images||[]).map(src=>({src,type:'img'})),...(p.videos||[]).map(src=>({src,type:'video'}))];if(!media.length&&p.cover)media.push({src:p.cover,type:'img'});const thumbs=grid.querySelector('.project-thumbs');const show=(m,j)=>{returnArtwork=m.type==='img'?m.src:cover(p);const area=grid.querySelector('.project-main-media');area.replaceChildren();const el=document.createElement(m.type);el.src=m.src;if(m.type==='video'){el.controls=true;el.playsInline=true;}else el.alt=p.title;area.append(el);Array.from(thumbs.children).forEach((b,k)=>b.setAttribute('aria-pressed',String(j===k)));};media.forEach((m,j)=>{const b=button('',()=>show(m,j));b.setAttribute('aria-label','查看第 '+(j+1)+' 张作品');if(m.type==='img'){const im=document.createElement('img');im.src=m.src;im.alt='';b.append(im);}else b.textContent='▶';thumbs.append(b);});if(media.length)show(media[0],0);overlay.querySelector('button').focus({preventScroll:true});}
 function openAlbum(category,source){
 if(!data[category]||entryTransition||closing)return;
 const start=source?.getBoundingClientRect();
 key=category;projectIndex=0;returnFocus=document.activeElement;overlay.hidden=false;catalog();
 if(start&&!reduced&&window.PortfolioLayout.state.layout==='desktop'&&window.getTurntable3D?.()){
 entryTransition=true;overlay.classList.add('is-entering');
 const flight=document.createElement('div');flight.className='vinyl-transfer';flight.innerHTML=source.innerHTML;flight.setAttribute('aria-hidden','true');flight.style.cssText=`left:${start.left}px;top:${start.top}px;width:${start.width}px;height:${start.height}px;z-index:400`;document.body.append(flight);
 const sourceVisibility=source.style.visibility;source.style.visibility='hidden';
 window.playVinylDocking({flight,start,fromRail:true,host:overlay.querySelector('.turntable-model'),disc:overlay.querySelector('.vinyl-large'),reveal:()=>{},complete:()=>{source.style.visibility=sourceVisibility;entryTransition=false;overlay.classList.remove('is-entering');}});
 }
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
  try{await preparePlayer();if(source&&!source.isConnected)return;openAlbum(category,source);}finally{loadingEntry=false;}
 };
 document.querySelectorAll('[data-overview-category]').forEach(a=>{const category=data[a.dataset.overviewCategory];const index=document.createElement('span');index.className='archive-index';index.textContent='ARCHIVE '+category.number.slice(0,2)+' / '+String(category.series.length).padStart(2,'0')+' PROJECTS / 2026';a.append(index);a.addEventListener('click',e=>{e.preventDefault();window.openVinylAlbum(a.dataset.overviewCategory);});});
 const returnAlbum=(location.search||'').match(/[?&]album=([a-z]+)/)?.[1];
 if(returnAlbum&&data[returnAlbum]){finish();intro.hidden=true;window.selectVinylCategory?.(returnAlbum);window.openVinylAlbum(returnAlbum);}
})();

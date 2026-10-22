(() => {
 'use strict';
 const data=window.albumProjects, keys=Object.keys(data), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const pad=n=>String(n).padStart(2,'0'), clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const initial=location.hash.slice(1).split('/');
 const profileTarget=['about','experience','resume','honours'].includes(initial[0])?initial[0]:null;
 if(profileTarget){location.replace('portfolio-profile.html#'+profileTarget);return;}
 let profileMode=false;
 let category=keys.includes(initial[0])?initial[0]:'graphic';
 const albums=keys.map(key=>({key,title:data[key].title,number:data[key].number,count:data[key].series.length}));
 let index=keys.indexOf(category),position=index,target=index;
 let nodes=[],hover=-1,px=0,py=0,drag=null,suppressClick=false,lastFrame=0,raf=0,infoTimer,captionTimer,wheelTimer,wheelLocked=false;
 let phase='loading',phaseStart=performance.now(),pendingCategory=null;
 const intro=document.querySelector('#portfolioIntro'),enter=document.querySelector('#introEnter');
 function finishIntro(){
 if(phase!=='loading')return;
 phase='bridging';phaseStart=performance.now();
 window.scrollTo({top:0,behavior:'instant'});
 const duration=reduced||intro?.dataset.directEntry==='true'?0:350;
 if(intro&&!reduced&&intro.querySelector('.intro-disc-position')&&intro.querySelector('.intro-disc-tilt')){
 const disc=intro.querySelector('.intro-disc-position'),tilt=intro.querySelector('.intro-disc-tilt');
 const w=scene.clientWidth,h=scene.clientHeight,unit=Math.min(h*.60,w*(w<700?.60:.30));
 const current=getComputedStyle(disc),currentTilt=getComputedStyle(tilt).transform;
 const from={left:current.left,top:current.top,width:current.width,transform:current.transform};
 intro.classList.add('is-bridging');
 const timing={duration,easing:'cubic-bezier(.2,.65,.25,1)',fill:'forwards'};
 disc.animate([from,{left:(w*.515)+'px',top:(h*(w<700?.53:.51))+'px',width:unit+'px',transform:'translate(-50%,-50%) rotateZ(32deg) rotateY(38deg) rotateZ(-32deg)'}],timing);
 tilt.style.animation='none';
 tilt.animate([{transform:currentTilt},{transform:'none'}],timing);
 }
 wake();
 setTimeout(()=>{
 phase='ready';scene.classList.remove('studio-loading');scene.classList.add('studio-arriving');
 intro?.classList.add('is-exiting');
 if(intro)setTimeout(()=>{intro.hidden=true;enter?.blur?.();},100);
 setTimeout(()=>scene.classList.remove('studio-arriving'),220);wake();
 },duration);
 }
 if(intro)intro.onclick=finishIntro;
 if(enter)enter.onclick=finishIntro;
 const scene=document.createElement('section');scene.className='disc-studio'+(reduced?'':' studio-loading');scene.setAttribute('aria-label','视觉专辑浏览');
 scene.innerHTML=`<header class="studio-header"><a class="studio-home" href="#graphic/0">ZHONG XI HAN</a><nav class="studio-navigation" aria-label="主导航"><details><summary>设计专辑</summary><div class="studio-categories"></div></details><a href="#collection">项目总览</a><a href="portfolio-profile.html#about">个人介绍</a><a href="portfolio-profile.html#experience">工作经历</a><a href="portfolio-profile.html#resume">个人简历</a></nav><span class="studio-edition">VISUAL RECORDS<br>2026</span></header><aside class="studio-meta" aria-live="polite"><h1></h1><dl><div><dt>专辑 / ALBUM</dt><dd class="meta-album"></dd></div><div><dt>作者 / AUTHOR</dt><dd>钟锡汉</dd></div><div><dt>分类 / CATEGORY</dt><dd class="meta-count"></dd></div></dl></aside><div class="studio-rail" aria-label="滚轮或拖动切换碟片"></div><div class="studio-caption"><p><small>★★★★★</small><span class="caption-title"></span></p><p><small>★★★★★</small><span class="caption-category"></span></p></div><div class="studio-controls"><span>SCROLL TO EXPLORE / 滚动浏览</span><div><button class="studio-prev" aria-label="上一张碟片">←</button><span class="studio-count"></span><button class="studio-next" aria-label="下一张碟片">→</button></div></div><div class="studio-progress" aria-hidden="true"></div><div class="studio-status" role="status"></div>`;
 const sidePrev=document.createElement('button'),sideNext=document.createElement('button');
 sidePrev.className='studio-side-arrow studio-side-prev';sideNext.className='studio-side-arrow studio-side-next';
 sidePrev.textContent='←';sideNext.textContent='→';sidePrev.setAttribute('aria-label','上一张专辑');sideNext.setAttribute('aria-label','下一张专辑');
 scene.append(sidePrev,sideNext);sidePrev.onclick=()=>go(index-1);sideNext.onclick=()=>go(index+1);
 document.querySelector('.disc-preview').replaceWith(scene);
 const returnButton=document.createElement('button');returnButton.className='studio-return';returnButton.textContent='↑ 返回碟片首页';returnButton.hidden=true;document.body.append(returnButton);
 returnButton.onclick=()=>{profileMode=true;history.replaceState(null,'','#'+category+'/0');window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});};
 scene.querySelectorAll('.studio-navigation > a').forEach(a=>a.addEventListener('click',()=>{profileMode=true;returnButton.hidden=false;}));
 window.addEventListener('scroll',()=>{const away=(window.scrollY||0)>8;returnButton.hidden=!away;if(!away)profileMode=false;},{passive:true});
 const $=s=>scene.querySelector(s),rail=$('.studio-rail'),meta=$('.studio-meta'),caption=$('.studio-caption'),progress=$('.studio-progress');
 keys.forEach((key,i)=>{const b=document.createElement('button');b.textContent=pad(i+1)+' / '+data[key].title;b.dataset.category=key;b.onclick=()=>switchCategory(key);$('.studio-categories').append(b);});
 const paths=['M235 9 C353 -2 471 77 488 215 C502 330 422 475 284 489 C145 511 20 415 11 280 C-2 155 71 28 203 12','M294 6 C424 24 498 126 487 270 C476 420 368 499 223 485 C78 473 -2 355 14 216 C27 94 109 8 240 12','M42 117 C100 15 212 -9 325 23 C448 61 500 171 478 301 C459 420 368 490 254 493'];
 function build(){rail.replaceChildren();nodes=albums.map((p,i)=>{const node=document.createElement('div');node.className='studio-disc';const button=document.createElement('button');button.setAttribute('aria-label',p.title+'，选择碟片');button.innerHTML='<span class="studio-face"></span><span class="studio-hub"></span><svg class="studio-lines" viewBox="0 0 500 500" aria-hidden="true">'+paths.map((d,j)=>`<path d="${d}" stroke-dasharray="${j===0?'700 80 200 50':j===1?'320 100 500 220':'470 130 200 180'}"/>`).join('')+'</svg>';const face=button.querySelector('.studio-face');const project=data[p.key].series[0],art=document.createElement('img');art.className='studio-category-art';art.src=({graphic:'lin-chang-fa-hui-exhibition-poster.png.webp',packaging:'half-a-whisper/brand-packaging-merchandise-final.png.webp',keyvisual:'imprint-static-01.png.webp'})[p.key]||project.cover||project.images[0];art.alt='';art.decoding='async';art.draggable=false;face.append(art);const label=document.createElement('span');label.className='studio-album-label';label.innerHTML='<small>'+pad(i+1)+' / DESIGN COLLECTION</small><strong>'+p.title+'</strong><em>'+p.count+' PROJECTS</em>';face.append(label);node.append(button);rail.append(node);
 button.addEventListener('pointerenter',()=>{hover=i;node.classList.add('is-hovered');wake();});button.addEventListener('pointerleave',()=>{hover=-1;px=py=0;node.classList.remove('is-hovered');});button.addEventListener('pointermove',e=>{const r=button.getBoundingClientRect();px=clamp((e.clientX-r.left)/r.width-.5,-.5,.5);py=clamp((e.clientY-r.top)/r.height-.5,-.5,.5);});
 button.onfocus=()=>{hover=i;wake();};button.onblur=()=>{hover=-1;};button.onclick=()=>{if(suppressClick||phase!=='ready')return;go(i);window.openVinylAlbum?.(p.key,button);};
 return {node,button,lines:button.querySelectorAll('path')};});hover=-1;update(true);}
 function update(immediate=false){clearTimeout(infoTimer);clearTimeout(captionTimer);meta.classList.add('is-changing');caption.classList.add('is-changing');category=keys[index];const p=albums[index];
 const write=()=>{$('.studio-meta h1').textContent=p.title;$('.meta-album').textContent=p.count+' 个项目';$('.meta-count').textContent=pad(index+1)+' / '+pad(nodes.length);meta.classList.remove('is-changing');};
 const writeCaption=()=>{$('.caption-title').textContent=p.title;$('.caption-category').textContent=p.count+' 个项目';caption.classList.remove('is-changing');};
 if(immediate){write();writeCaption();}else{infoTimer=setTimeout(write,220);captionTimer=setTimeout(writeCaption,390);}
 $('.studio-count').textContent=pad(index+1)+' / '+pad(nodes.length);$('.studio-prev').disabled=sidePrev.disabled=index===0;$('.studio-next').disabled=sideNext.disabled=index===nodes.length-1;
 scene.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
 history.replaceState(null,'','#'+category+'/0');
 }
 function go(i){if(phase!=='ready')return;const next=clamp(i,0,nodes.length-1);if(next===index)return;index=next;target=index;update();wake();}
 function switchCategory(key){$('.studio-navigation details').open=false;if(keys.includes(key))go(keys.indexOf(key));}
 window.selectVinylCategory=(key)=>{if(!keys.includes(key))return null;index=keys.indexOf(key);position=target=index;category=key;update(true);wake();return nodes[index].button;};
 function wake(){if(!raf)raf=requestAnimationFrame(frame);}
 const ease=t=>1-Math.pow(1-clamp(t,0,1),3);
 function frame(now){raf=0;const dt=Math.min(40,now-(lastFrame||now));lastFrame=now;let spread=1,flip=0,loadScale=1;
 if(phase==='loading'){spread=0;loadScale=.65;flip=88;progress.hidden=true;}
 else if(phase==='bridging'){progress.hidden=true;}
 else if(phase==='closing'){const t=reduced?1:clamp((now-phaseStart)/460,0,1);spread=1-ease(t);flip=ease(t)*88;loadScale=1-.35*ease(t);if(t===1){category=pendingCategory;pendingCategory=null;index=0;position=target=0;build();phase='opening';phaseStart=now;}}
 else if(phase==='opening'){const t=reduced?1:clamp((now-phaseStart)/700,0,1);spread=ease(t);flip=(1-ease(t))*88;loadScale=.65+.35*ease(t);if(t===1)phase='ready';}
 if(!drag){position+=(target-position)*(reduced?1:1-Math.exp(-dt/105));if(Math.abs(target-position)<.001)position=target;}
 const w=scene.clientWidth,h=scene.clientHeight,layout=window.PortfolioLayout.state.layout,mobile=layout!=='desktop',phone=layout==='phone',unit=Math.min(h*(phone?.44:mobile?.43:.60),w*(phone?.84:mobile?.50:.30)),spacing=mobile?w*.86:w*.315;
 nodes.forEach(({node,button,lines},i)=>{if(node.dataset.returnFlight==='true')return;const d=i-position,visible=d>-2.1&&d<2.1;node.style.visibility=visible?'visible':'hidden';node.style.pointerEvents=visible&&phase==='ready'?'auto':'none';if(!visible)return;
 const diameter=unit*clamp(1+.18*d,.45,1.40)*loadScale;
 const x=w*.515+spacing*d*spread,y=h*(mobile?.60:.51)-(mobile?0:h*.225*d*spread);
 node.style.width=diameter+'px';node.style.left=x+'px';node.style.top=y+'px';node.style.opacity=String(i===index?1:spread);node.style.zIndex=String(10+Math.round(d*2));
 const active=hover===i&&phase==='ready'&&!reduced&&window.PortfolioLayout.state.hover,osc=active?Math.sin(now*.012)*.65:0;
 const rz=32-7*d,ry=clamp(38-8*d,15,60)+flip+(active?px*5+osc:0),rx=active?py*-4+Math.cos(now*.01)*.5:0;
 button.style.transform=`rotateZ(${rz}deg) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${-rz+osc*.3}deg)`;
 if(active)lines.forEach((path,j)=>{path.style.strokeDashoffset=String(Math.sin(now*.0018+j*2)*28);path.style.transform=`rotate(${Math.sin(now*.003+j)*.8}deg)`;path.style.transformOrigin='250px 250px';});
 button.setAttribute('aria-pressed',String(i===index));
 });
 if(phase!=='ready'||position!==target||hover>=0&&!reduced&&window.PortfolioLayout.state.hover||drag)wake();
 }
 $('.studio-prev').onclick=()=>go(index-1);$('.studio-next').onclick=()=>go(index+1);
 rail.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey||profileMode||(window.scrollY||0)>8)return;const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(!d)return;e.preventDefault();clearTimeout(wheelTimer);if(!wheelLocked&&phase==='ready'){wheelLocked=true;go(index+Math.sign(d));}wheelTimer=setTimeout(()=>wheelLocked=false,140);},{passive:false});
 rail.addEventListener('pointerdown',e=>{if(e.button!==0||phase!=='ready')return;drag={id:e.pointerId,x:e.clientX,start:position};suppressClick=false;});
 window.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>7){suppressClick=true;rail.classList.add('is-dragging');position=clamp(drag.start-dx/(scene.clientWidth*(window.PortfolioLayout.state.layout==='desktop'?.315:.86)),0,nodes.length-1);wake();}});
 function end(){if(!drag)return;drag=null;rail.classList.remove('is-dragging');if(suppressClick){index=Math.round(position);target=index;update();wake();setTimeout(()=>suppressClick=false,0);}}
 window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
 document.addEventListener('keydown',e=>{if(e.target.closest('select,input,textarea'))return;if(!scene.contains(document.activeElement)&&document.activeElement!==document.body)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1));}if(e.key==='Escape')$('.studio-navigation details').open=false;});
 document.addEventListener('pointerdown',e=>{if(!$('.studio-navigation details').contains(e.target))$('.studio-navigation details').open=false;});
 window.addEventListener('hashchange',()=>{const [key,n]=location.hash.slice(1).split('/');if(!keys.includes(key))return;scene.scrollIntoView({behavior:'smooth'});if(key!==category)switchCategory(key);else go(keys.indexOf(key));});
 window.addEventListener('portfolio:layoutchange',()=>{drag=null;rail.classList.remove('is-dragging');position=target=index;wake();});window.addEventListener('resize',wake);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{lastFrame=0;wake();}});
 build();wake();
 document.querySelectorAll('[data-overview-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.overviewFilter;
 document.querySelectorAll('[data-overview-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 document.querySelectorAll('[data-overview-category]').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.overviewCategory!==filter;});
 }));
})();

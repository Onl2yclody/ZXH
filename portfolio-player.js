(()=>{
 const bar=document.createElement('footer');bar.className='portfolio-player';bar.setAttribute('aria-label','作品集播放与层级导航');
 const icon={back:'<path d="M6 5h2v14H6zm12 0v14L8 12z"/>',next:'<path d="M16 5h2v14h-2zM6 5l10 7-10 7z"/>',play:'<path d="M8 5v14l12-7z"/>',pause:'<path d="M7 5h4v14H7zm7 0h4v14h-4z"/>'};
 const svg=k=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+icon[k]+'</svg>';
 bar.innerHTML='<div class="player-identity"><span class="player-record" aria-hidden="true"></span><span class="player-title">ZXH_2026_PORTFOLIO</span></div><nav class="player-controls" aria-label="层级导航"><button type="button" data-player="back" aria-label="返回上一级" title="返回上一级">'+svg('back')+'</button><button type="button" class="player-toggle" data-player="play" aria-label="播放" aria-pressed="false" title="播放视频或黑胶动画">'+svg('play')+'</button><button type="button" data-player="next" aria-label="前往下一级" title="前往下一级">'+svg('next')+'</button></nav><span class="player-note">PORTFOLIO / 2026</span>';
 document.body.append(bar);let playing=false;const toggle=bar.querySelector('[data-player="play"]');
 const restorePhoneHeading=()=>{
  if(window.PortfolioLayout?.state.layout!=='phone')return;
  const heading=document.querySelector('#portfolioIntro:not(.is-browsing-sleeve) .intro-corner-tl strong');
  if(!heading)return;
  if(heading.querySelector('.scramble-char')||heading.textContent.replace(/\s/g,'')!=='视觉有声。设计有形。')heading.innerHTML='视觉有声。<br>设计有形。';
  heading.style.setProperty('font','800 28px/1.35 Arial, "Microsoft YaHei", sans-serif','important');
  heading.style.setProperty('letter-spacing','-.03em','important');
 };
 restorePhoneHeading();window.addEventListener('portfolio:layoutchange',restorePhoneHeading);
 const visible=el=>el&&!el.hidden&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
 const forward=bar.querySelector('[data-player="next"]');
 const canAdvance=()=>{
  const intro=document.querySelector('#portfolioIntro');
  if(visible(intro))return !intro.querySelector('.sleeve-stage.is-spine, .sleeve-stage.is-retracting');
  const overlay=document.querySelector('.vinyl-browser');
  if(visible(overlay))return !!overlay.querySelector('.vinyl-tracks button');
  return !!document.querySelector('.studio-disc button');
 };
 const syncForward=()=>{restorePhoneHeading();const enabled=canAdvance();forward.disabled=!enabled;forward.setAttribute('aria-disabled',String(!enabled));forward.title=enabled?'前往下一级':'已到最后一级';};
 const navigationObserver=new MutationObserver(syncForward);
 navigationObserver.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
 syncForward();
 bar.querySelector('[data-player="back"]').onclick=()=>window.portfolioGoBack?.();
 bar.querySelector('[data-player="next"]').onclick=event=>{
  event.preventDefault();event.stopPropagation();
  if(!canAdvance()){syncForward();return;}
  if(window.portfolioAdvanceSleeve?.())return;
  const overlay=document.querySelector('.vinyl-browser');
  if(visible(overlay)){overlay.querySelector('.vinyl-tracks button')?.click();return;}
  const intro=document.querySelector('#portfolioIntro');if(visible(intro)){const stage=intro.querySelector('.sleeve-stage');if(stage?.classList.contains('is-spine'))return;if(!stage?.classList.contains('is-back'))intro.querySelector('.sleeve-front')?.click();else intro.querySelector('.sleeve-side-note')?.click();return;}
  document.querySelector('.studio-disc.is-active button, .studio-disc.active button, .studio-disc button')?.click();
 };
 toggle.onclick=async()=>{const video=[...document.querySelectorAll('video')].find(visible);const next=!playing;if(video){if(next){try{await video.play();}catch{return;}}else video.pause();}window.getTurntable3D?.()?.setPlaying?.(next);playing=next;bar.classList.toggle('player-playing',playing);toggle.innerHTML=svg(playing?'pause':'play');toggle.setAttribute('aria-label',playing?'暂停':'播放');toggle.setAttribute('aria-pressed',String(playing));};
})();

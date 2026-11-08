(()=>{
 const bar=document.createElement('footer');bar.className='portfolio-player';bar.setAttribute('aria-label','作品集播放与层级导航');
 const icon={back:'<path d="M6 5h2v14H6zm12 0v14L8 12z"/>',next:'<path d="M16 5h2v14h-2zM6 5l10 7-10 7z"/>',play:'<path d="M8 5v14l12-7z"/>',pause:'<path d="M7 5h4v14H7zm7 0h4v14h-4z"/>'};
 const svg=k=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+icon[k]+'</svg>';
 bar.innerHTML='<div class="player-identity"><span class="player-record" aria-hidden="true"></span><span class="player-title">ZXH_2026_PORTFOLIO</span></div><nav class="player-controls" aria-label="层级导航"><button type="button" data-player="back" aria-label="返回上一级" title="返回上一级">'+svg('back')+'</button><button type="button" class="player-toggle" data-player="play" aria-label="播放" aria-pressed="false" title="播放视频或黑胶动画">'+svg('play')+'</button><button type="button" data-player="next" aria-label="前往下一级" title="前往下一级">'+svg('next')+'</button></nav><span class="player-note">PORTFOLIO / 2026</span>';
 document.body.append(bar);let playing=false;const toggle=bar.querySelector('[data-player="play"]');
 const visible=el=>el&&!el.hidden&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
 bar.querySelector('[data-player="back"]').onclick=()=>window.portfolioGoBack?.();
 bar.querySelector('[data-player="next"]').onclick=()=>{
  const overlay=document.querySelector('.vinyl-browser');
  if(visible(overlay)){const track=overlay.querySelector('.vinyl-tracks button');if(track){track.click();return;}const thumbs=[...overlay.querySelectorAll('.project-thumbs button')];const i=thumbs.findIndex(b=>b.getAttribute('aria-pressed')==='true');if(thumbs.length)thumbs[(i+1)%thumbs.length].click();return;}
  const intro=document.querySelector('#portfolioIntro');if(visible(intro)){const stage=intro.querySelector('.sleeve-stage');if(!stage?.classList.contains('is-back'))intro.querySelector('.sleeve-front')?.click();else intro.querySelector('.sleeve-record:not(:disabled)')?.click();return;}
  document.querySelector('.studio-disc.is-active button, .studio-disc.active button, .studio-disc button')?.click();
 };
 toggle.onclick=async()=>{const video=[...document.querySelectorAll('video')].find(visible);const next=!playing;if(video){if(next){try{await video.play();}catch{return;}}else video.pause();}window.getTurntable3D?.()?.setPlaying?.(next);playing=next;bar.classList.toggle('player-playing',playing);toggle.innerHTML=svg(playing?'pause':'play');toggle.setAttribute('aria-label',playing?'暂停':'播放');toggle.setAttribute('aria-pressed',String(playing));};
})();

/* A touch-first view sharing the desktop project data and detail renderer. */
(()=>{
 const data=window.albumProjects;if(!data)return;
 const root=document.createElement('section');root.className='mobile-portfolio';root.setAttribute('aria-label','手机作品集');
 root.innerHTML='<header class="mobile-header"><a href="#" class="mobile-wordmark">ZHONG XI HAN</a><span>PORTFOLIO / 2026</span><nav><a href="#mobile-collections">设计专辑</a><a href="portfolio-profile.html#about">个人介绍</a><a href="portfolio-profile.html#experience">工作经历</a><a href="portfolio-profile.html#resume">个人简历</a></nav></header><div class="mobile-introduction"><small>VISUAL & DIGITAL DESIGN</small><h1>视觉有声。<br>设计有形。</h1><p>平面 · 品牌 · 插画 · 数字设计</p><a class="mobile-explore" href="#mobile-collections">浏览 7 个设计专辑 <span>↓</span></a></div><section id="mobile-collections"><div class="mobile-section-title"><h2>设计专辑</h2><span>SELECTED WORKS / 07</span></div><div class="mobile-albums"></div></section><footer class="mobile-contact"><small>LET’S CONNECT</small><h2>让想法，成为作品。</h2><a href="mailto:15976429951@163.com">15976429951@163.com</a><a href="tel:+8615976429951">+86 159 7642 9951</a><p>ZHONG XI HAN © 2026</p></footer>';
 const grid=root.querySelector('.mobile-albums');
 Object.entries(data).forEach(([key,album],i)=>{
  const button=document.createElement('button');button.className='mobile-album';
  const img=document.createElement('img');const first=album.series[0];img.src=first.cover||first.images?.[0]||'';img.alt=album.title+'作品预览';img.loading='lazy';img.decoding='async';
  const caption=document.createElement('span');caption.className='mobile-album-caption';
  const number=document.createElement('small');number.textContent=String(i+1).padStart(2,'0')+' / '+album.series.length+' 个项目';
  const title=document.createElement('strong');title.textContent=album.title;
  caption.append(number,title);button.append(img,caption);button.setAttribute('aria-label','查看'+album.title+'专辑');
  button.onclick=()=>{window.mobileAlbumTrigger=button;window.openVinylAlbum(key,button);};grid.append(button);
 });
 document.body.append(root);
 const mq=matchMedia('(max-width: 760px)');
 function sync(){document.documentElement.classList.toggle('mobile-portfolio-active',mq.matches);if(mq.matches){document.querySelector('[data-enter-albums]')?.click();}}
 mq.addEventListener('change',sync);sync();
})();

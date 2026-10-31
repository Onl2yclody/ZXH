/* Transparent CD cases keep category links and filters intact. */
(()=>{
 const projects=window.albumProjects;if(!projects)return;
 const covers={graphic:'lin-chang-fa-hui-exhibition-poster.png.webp',identity:'wayfinding-01-system-web-transparent.png.webp',keyvisual:'imprint-static-01.png.webp',packaging:'half-a-whisper/brand-packaging-merchandise-final.png.webp',uiux:'green-book-cover-cutout.png.webp',extended:'wonder-journey-cover-cutout.png.webp',illustration:'nie-xiaoqian-01-characters-web.jpg.webp'};
 document.querySelectorAll('.overview-card[data-overview-category]').forEach((card,index)=>{
  const key=card.dataset.overviewCategory,p=projects[key];if(!p)return;card.classList.add('cd-case-card');
  const shell=document.createElement('span');shell.className='overview-cd-case';shell.setAttribute('aria-hidden','true');
  const hinge=document.createElement('span');hinge.className='cd-case-hinge';
  const tray=document.createElement('span');tray.className='cd-case-tray';
  const disc=document.createElement('span');disc.className='cd-case-disc';
  const eyebrow=document.createElement('small');eyebrow.className='cd-disc-eyebrow';eyebrow.textContent=String(index+1).padStart(2,'0')+' / DESIGN COLLECTION';
  const title=document.createElement('strong');title.className='cd-disc-title';title.textContent=p.title;
  const art=document.createElement('span');art.className='cd-disc-art';const image=document.createElement('img');image.src=covers[key]||p.series[0].cover||p.series[0].images[0];image.alt='';image.loading='lazy';image.decoding='async';art.append(image);
  const hub=document.createElement('span');hub.className='cd-disc-hub';const count=document.createElement('em');count.className='cd-disc-count';count.textContent=p.series.length+' PROJECTS';
  disc.append(eyebrow,title,art,hub,count);tray.append(disc);
  const gloss=document.createElement('span');gloss.className='cd-case-gloss';for(const edge of ['top','bottom']){const clip=document.createElement('span');clip.className='cd-case-clip cd-case-clip-'+edge;shell.append(clip);}
  shell.append(hinge,tray,gloss);
  const caption=document.createElement('span');caption.className='cd-case-caption';const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');const heading=document.createElement('h2');heading.textContent=p.title;const total=document.createElement('small');total.textContent=String(p.series.length).padStart(2,'0')+' PROJECTS';caption.append(number,heading,total);
  card.replaceChildren(shell,caption);
 });
})();

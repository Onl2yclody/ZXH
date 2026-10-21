/* Presentation layer only: catalog navigation and choreography retain ownership. */
(() => {
 'use strict';
 const pad=n=>String(n).padStart(2,'0');
 function decorate(){
  const catalog=document.querySelector('.vinyl-catalog');
  const panel=catalog?.querySelector('.vinyl-directory');
  if(!panel||panel.dataset.archiveReady)return;
  panel.dataset.archiveReady='true';
  const tracks=[...panel.querySelectorAll('.vinyl-tracks button')];
  const art=catalog.querySelector('.vinyl-label img');
  const category=document.querySelector('.vinyl-browser .vinyl-bar span')?.textContent||'';
  const notes=[['top','SELECTED COLLECTION / 2026',category,'视觉与数字设计 · 项目专辑'],['bottom','EXPLORE THE COLLECTION','从一张唱片开始','悬停目录切换封面，点击项目查看详情。'],['credit','DESIGNED BY','钟锡汉 / ZHONG XI HAN','PORTFOLIO — 2026']];
  for(const [position,label,title,description] of notes){const note=document.createElement('aside');note.className='catalog-edge-note catalog-edge-'+position;for(const [tag,text] of [['small',label],['strong',title],['span',description]]){const el=document.createElement(tag);el.textContent=text;note.append(el);}catalog.append(note);}
  const kicker=panel.querySelector('small');
  kicker.textContent='DESIGN ARCHIVE / 专辑档案';
  const code=document.createElement('div');code.className='archive-category';code.textContent=category;
  panel.querySelector('h1').after(code);
  const meta=document.createElement('div');meta.className='archive-facts';
  meta.innerHTML='<div><span>COLLECTION / 收录</span><strong>'+pad(tracks.length)+' 个项目</strong></div><div><span>AUTHOR / 作者</span><strong>钟锡汉</strong></div>';
  code.after(meta);
  const heading=document.createElement('div');heading.className='archive-track-heading';
  heading.innerHTML='<span>INDEX / 项目目录</span><span>01 — '+pad(tracks.length)+'</span>';
  panel.querySelector('.vinyl-tracks').before(heading);
  const footer=document.createElement('div');footer.className='archive-current';
  const state=document.createElement('span');state.textContent='ON RECORD / 当前作品';
  const name=document.createElement('strong');footer.append(state,name);panel.append(footer);
  const masthead=document.createElement('div');masthead.className='archive-masthead';
  const issue=document.createElement('span');issue.className='archive-issue';issue.textContent=category.match(/^\d+/)?.[0]||'01';issue.setAttribute('aria-hidden','true');
  const titles=document.createElement('div');titles.className='archive-titles';
  panel.prepend(masthead);titles.append(kicker,panel.querySelector('h1'),code);masthead.append(issue,titles);
  const counter=document.createElement('span');counter.className='archive-current-index';counter.setAttribute('aria-hidden','true');footer.prepend(counter);
  state.textContent='ON THE RECORD / 封面预览';
  const instruction=document.createElement('p');instruction.className='archive-instruction';instruction.textContent='移入切换封面 · 点击展开作品 ↗';panel.append(instruction);
  function select(button){
   tracks.forEach(row=>{const selected=row===button;row.setAttribute('data-current',String(selected));if(selected)row.setAttribute('aria-current','true');else row.removeAttribute('aria-current');});
   name.textContent=button?.querySelector('.track-name')?.textContent||'';
   const projectNote=catalog.querySelector('.catalog-edge-top');
   projectNote.querySelector('small').textContent='ON THE RECORD / 当前项目';
   projectNote.querySelector('strong').textContent=name.textContent;
   projectNote.querySelector('span').textContent=category;
   counter.textContent=pad(Math.max(0,tracks.indexOf(button))+1);
  }
  tracks.forEach(button=>{
   button.addEventListener('pointerenter',()=>select(button));
   button.addEventListener('focus',()=>select(button));
  });
  select(tracks.find(row=>row.querySelector('.track-name')?.textContent===art?.alt)||tracks[0]);
  // A restrained, sufficiently dark accent; file-origin canvas restrictions fall back safely.
  function color(){
   panel.style.setProperty('--archive-accent','#535b61');
   if(!art?.naturalWidth)return;
   try{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=24;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(art,0,0,24,24);
    const pixels=ctx.getImageData(0,0,24,24).data,bins=new Map();
    for(let i=0;i<pixels.length;i+=4){
     const rgb=[pixels[i],pixels[i+1],pixels[i+2]],hi=Math.max(...rgb),lo=Math.min(...rgb);
     if(hi-lo<45||hi<65||pixels[i+3]<200)continue;
     const key=rgb.map(v=>Math.round(v/48)).join(',');
     const bin=bins.get(key)||{n:0,r:0,g:0,b:0};bin.n++;bin.r+=rgb[0];bin.g+=rgb[1];bin.b+=rgb[2];bins.set(key,bin);
    }
    const best=[...bins.values()].sort((a,b)=>b.n-a.n)[0];if(!best)return;
    let rgb=[best.r,best.g,best.b].map(v=>v/best.n);
    const luminance=()=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    while(luminance()>.17)rgb=rgb.map(v=>v*.94);
    panel.style.setProperty('--archive-accent',`rgb(${rgb.map(Math.round).join(',')})`);
   }catch{/* Local file canvases may be tainted; never interrupt navigation. */}
  }
  art?.addEventListener('load',color);color();
 }
 const root=document.querySelector('.vinyl-browser');
 if(root){new MutationObserver(decorate).observe(root,{childList:true,subtree:true});decorate();}
})();

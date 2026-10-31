/* One monochrome hierarchy for both the profile entry and the full CV. */
(()=>{
 document.querySelectorAll('h3,b,p').forEach(el=>{if(el.innerHTML.includes('UE5 全流程培训'))el.innerHTML=el.innerHTML.replaceAll('UE5 全流程培训','UE5 全流程实训');});
 const profileHonours=document.querySelector('#honours');
 if(profileHonours){
  const rows=[...profileHonours.querySelectorAll('.honour-row')];
  for(const [title,authors] of [['反走私','钟锡汉、麦铭健'],['未来设计师','钟锡汉、冯健钊'],['大学生艺术季','钟锡汉']]){const row=rows.find(r=>r.textContent.includes(title)),p=row?.querySelector('p');if(p&&!p.textContent.includes('作者：'))p.innerHTML+='<br>作者：'+authors;}
  if(!profileHonours.textContent.includes('岭南风华'))profileHonours.insertAdjacentHTML('beforeend','<article class="honour-row"><time>项目制</time><h3>可口可乐策划案比赛<br>入围奖</h3><p>《岭南风华》<br>作者：钟锡汉、梁钧雄、李炬豪</p></article>');
  profileHonours.querySelector('.profile-heading span').textContent='SELECTED HONOURS / '+String(profileHonours.querySelectorAll('.honour-row').length).padStart(2,'0');
 }
 document.querySelectorAll('.skill-tags').forEach(el=>el.remove());
 const summary=document.querySelector('#resume');
 if(summary){
  document.querySelector('main').prepend(summary);
  const nav=document.querySelector('.profile-navigation nav'),link=nav?.querySelector('[href="#resume"]');if(link){nav.prepend(link);link.classList.add('resume-primary');}
  const heading=summary.querySelector('h2');heading.textContent='个人简历';
  const intro=document.createElement('div');intro.className='cv-identity';intro.innerHTML='<p class="cv-kicker">CURRICULUM VITAE / 2026</p><h1>钟锡汉<span>ZHONG XI HAN</span></h1><p class="cv-role">视觉传达设计 · 平面与品牌视觉</p>';
  summary.querySelector('.profile-heading').after(intro);
  const full=summary.querySelector('.resume-link');full.remove();
 }else{
  const main=document.querySelector('.page');if(!main)return;
  main.querySelector('h1').innerHTML='钟锡汉<span>ZHONG XI HAN</span>';
  const role=document.createElement('p');role.className='cv-role';role.textContent='视觉传达设计 · 平面与品牌视觉';main.querySelector('h1').after(role);
  const label=main.querySelector('.label');label.textContent='个人简历 / CURRICULUM VITAE — 2026';
  const nav=document.querySelector('.nav');nav.classList.add('cv-navigation');nav.innerHTML='<a class="cv-wordmark" href="zhong-xi-han-portfolio-preview.html">ZHONG XI HAN</a><div><a href="portfolio-profile.html#about">个人介绍</a><a href="portfolio-profile.html#resume" aria-current="page">个人简历</a><a href="portfolio-profile.html#experience">工作经验</a><a href="portfolio-profile.html#honours">获奖与认可</a></div><span>PORTFOLIO / 2026</span>';
  main.classList.add('cv-image-page');
  document.body.classList.add('cv-fit-screen');
  main.innerHTML='<h1 class="cv-image-title">个人简历</h1><img class="cv-resume-image" src="resume-full.webp" alt="钟锡汉平面设计师简历，包含联系方式、教育背景、实践经历、获奖经历、个人优势与专业技能">';
  return;
  // A legacy enhancement appended the same award into the experience list.
  const headings=[...document.querySelectorAll('.heading')],honours=headings.find(h=>h.textContent.includes('获奖'));
  document.querySelectorAll('.award').forEach(row=>{if(row.textContent.includes('岭南风华')&&row.parentElement!==honours?.nextElementSibling)row.remove();});
  if(honours){const count=honours.nextElementSibling.querySelectorAll('.award').length;honours.querySelector('.mono').textContent='SELECTED HONOURS / '+String(count).padStart(2,'0');}
 }
})();


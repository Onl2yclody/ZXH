(()=>{
 const touch=()=>matchMedia('(max-width:1100px), (pointer:coarse)').matches;
 const intro=document.querySelector('#portfolioIntro'),stage=document.querySelector('.sleeve-stage');
 function sync(){
  if(!stage)return;
  const back=stage.classList.contains('is-back');
  const hint=stage.querySelector('.sleeve-hint');
  if(hint&&!stage.classList.contains('is-spine')){
   hint.textContent=back?(touch()?'点击小猫 · 进入对应项目目录':'移向小猫切换黑胶 · 点击小猫进入项目目录'):(matchMedia('(max-width:760px)').matches?'点击封面 · 向上抽出黑胶，浏览设计专辑':'点击专辑正面 · 翻面选择设计分类');
   const line=document.createElement('span');line.style.display='block';line.style.fontWeight='400';line.textContent=touch()?'点击「返回」回到上一级':'鼠标右键 / Esc 返回上一级';hint.append(line);
  }
  if(back){const p=intro.querySelector('.intro-corner-br p');if(p)p.innerHTML=touch()?'<strong>点击小猫：查看项目</strong><br>点击「返回封面」：回到首页':'<strong>点击小猫：进入项目目录</strong><br><strong>点击专辑右侧：查看个人资料</strong><br>鼠标右键 / Esc：返回上一级';}
 }
 if(stage)new MutationObserver(sync).observe(stage,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',sync);sync();
 const nav=document.querySelector('.profile-navigation');if(nav&&!nav.querySelector('.profile-return')){const a=document.createElement('a');a.className='profile-return';a.href='index.html?albums=1';a.textContent='← 返回专辑项目';nav.append(a);}
 const summary=document.querySelector('#resume .contact-grid>div');if(summary&&!summary.querySelector('.resume-link')){const a=document.createElement('a');a.className='resume-link';a.href='resume.html';a.textContent='查看完整简历 →';summary.append(a);}
 if(new URLSearchParams(location.search).has('albums'))document.querySelector('[data-enter-albums]')?.click();
})();

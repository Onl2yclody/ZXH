/* Directional edge copy follows sleeve state without changing sleeve interaction. */
(()=>{
 const intro=document.querySelector('#portfolioIntro'),stage=intro?.querySelector('.sleeve-stage');if(!stage)return;
 const corners=['tl','tr','bl','br'].map(p=>intro.querySelector('.intro-corner-'+p));
 const original=corners.map(el=>el.innerHTML);let back=false,selected='graphic';
 const notes=document.createElement('aside');notes.className='spine-secondary';notes.setAttribute('aria-label','个人档案浏览说明');
 notes.innerHTML='<div class="spine-meta"><small>BEHIND THE WORK / 作品之外</small><strong>个人档案</strong><span>ZHONG XI HAN · PORTFOLIO 2026</span></div><div class="spine-index"><small>PROFILE INDEX / 档案索引</small><p><b>01 / 个人介绍</b><span>认识作者与设计方向</span></p><p><b>02 / 个人简历</b><span>教育背景、技能与获奖经历</span></p><p><b>03 / 工作经验</b><span>设计实践与项目经历</span></p></div><div class="spine-help"><small>READ THE SPINE / 从侧面了解</small><p>点击专辑侧面的栏目，<br>展开对应个人资料。</p><span>鼠标右键 / Esc · 返回专辑</span></div>';
 intro.append(notes);
 function selection(){
  if(!back)return;const data=window.albumProjects?.[selected];if(!data)return;
  corners[0].querySelector('strong').textContent=data.title;
  corners[0].querySelector('span').textContent=data.number;
  corners[1].querySelector('b').textContent=String(data.series.length).padStart(2,'0');
 }
 function sync(){intro.classList.toggle('is-viewing-spine',stage.classList.contains('is-spine'));const next=stage.classList.contains('is-composed');if(next===back)return;back=next;
  intro.classList.toggle('is-browsing-sleeve',back);
  if(back){
   corners[0].innerHTML='<small>ON THE SLEEVE / 正在浏览</small><strong></strong><span></span>';
   corners[1].innerHTML='<b></b><span>PROJECTS IN THIS COLLECTION<br>当前专辑收录作品</span>';
   corners[2].innerHTML='<small>01 — PREVIEW / 预览</small><p>移向小猫，<br>切换一张设计唱片。</p>';
   corners[3].innerHTML='<small>02 — EXPLORE / 深入</small><p>点击小猫进入项目目录。<br>点击专辑右侧空白，查看个人资料 ↗<br>鼠标右键 / Esc 返回上一级。</p>';
   selection();
  }else corners.forEach((el,i)=>el.innerHTML=original[i]);
 }
 intro.querySelectorAll('.sleeve-hotspot').forEach(button=>{for(const event of ['pointerenter','focus'])button.addEventListener(event,()=>{selected=button.dataset.album;selection();});});
 new MutationObserver(sync).observe(stage,{attributes:true,attributeFilter:['class']});sync();
})();

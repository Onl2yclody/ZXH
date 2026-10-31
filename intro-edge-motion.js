/* Directional edge copy follows sleeve state without changing sleeve interaction. */
(()=>{
 const intro=document.querySelector('#portfolioIntro'),stage=intro?.querySelector('.sleeve-stage');if(!stage)return;
 const corners=['tl','tr','bl','br'].map(p=>intro.querySelector('.intro-corner-'+p));
 const original=corners.map(el=>el.innerHTML);let back=false,selected='graphic';
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');const counters=new WeakMap();
 function updateCounter(node,value,force=false){
  if(!node)return;const text=String(value).padStart(2,'0'),old=counters.get(node);if(!force&&old?.value===text)return;
  if(old?.timer)clearInterval(old.timer);node.getAnimations().forEach(a=>a.cancel());
  const state={value:text,timer:0};counters.set(node,state);node.setAttribute('aria-label',text);node.setAttribute('aria-live','off');
  if(reduce.matches){node.textContent=text;return;}
  const start=performance.now();node.textContent=text;
  state.timer=setInterval(()=>{if(!node.isConnected||reduce.matches||performance.now()-start>=360){clearInterval(state.timer);state.timer=0;node.textContent=text;return;}node.textContent=String(Math.floor(Math.random()*10)).padStart(2,'0');},65);
  node.animate([{opacity:.3,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:460,easing:'cubic-bezier(.23,1,.32,1)'});
 }
 const initialCounter=corners[1].querySelector('b');setTimeout(()=>{if(initialCounter?.isConnected)updateCounter(initialCounter,7,true);},420);

 const notes=document.createElement('aside');notes.className='spine-secondary';notes.setAttribute('aria-label','个人档案浏览说明');
 notes.innerHTML='<div class="spine-meta"><small>BEHIND THE WORK / 作品之外</small><strong>个人档案</strong><span>ZHONG XI HAN · PORTFOLIO 2026</span></div><div class="spine-index"><small>PROFILE INDEX / 档案索引</small><p><b>01 / 个人介绍</b><span>认识作者与设计方向</span></p><p><b>02 / 个人简历</b><span>教育背景、技能与获奖经历</span></p><p><b>03 / 工作经验</b><span>设计实践与项目经历</span></p></div><div class="spine-help"><small>READ THE SPINE / 从侧面了解</small><p>点击专辑侧面的栏目，<br>展开对应个人资料。</p><span>鼠标右键 / Esc · 返回专辑</span></div>';
 intro.append(notes);
 function selection(){
  if(!back)return;const data=window.albumProjects?.[selected];if(!data)return;
  corners[0].querySelector('strong').textContent=data.title;
  corners[0].querySelector('span').textContent=data.number;
  updateCounter(corners[1].querySelector('b'),data.series.length);
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

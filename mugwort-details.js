(() => {
  const sections = [
    {title:'01 / 主题立项', text:'以艾草为研究对象，从历史文化、植物特征与日常应用切入，探索如何将分散的中医药资料转化为清晰、亲近的科普视觉表达。通过图文结合的信息结构，让读者从熟悉的植物进入中医药文化的阅读。', images:[['mugwort-research-topic.png.webp','选题来源']]},
    {title:'02 / 制作过程', text:'资料调研 → 思维导图分类 → 图文占位草图 → 主体线稿 → AI 风格与配色探索 → 板绘上色及二次修改 → 成品整合。先尝试多种图文布局，再用深绿色信息块与浅色背景确定主次关系；主体插画逐步完成叶片色块、明暗层次和肌理。', images:[['mugwort-mind-map.png.webp','信息分类与思维导图'],['mugwort-layout-process.png.webp','版式占位草图与布局方案'],['mugwort-painting-process.png.webp','主体插画的线稿、上色与肌理过程']]},
    {title:'03 / 设计思路', text:'以思维导图建立内容层级，将基础知识、中药特点、主要成分、现代研究等内容组织成信息模块。以草本绿色作为主要视觉线索，深绿强化信息层级，浅黄绿色辅助组织背景。植物插画保留叶片轮廓和层叠关系，再以平面色块与颗粒肌理进行视觉转译，使主体插画成为阅读入口。', images:[['mugwort-sketch-final.png.webp','主体线稿与终稿对照']]},
    {title:'04 / 遇到的问题与解决', text:'插画风格选择：需要把写实植物参考转化为适合科普版面的动漫平面画风，并找到合适的配色方向。解决方法是先寻找参考图并绘制线稿，再使用即梦 AI 将写实参考转换为动漫平面风格，参考生成后的颜色进行板绘上色与二次修改。AI 用于风格和配色探索，线稿与最终上色由作者完成。\n\n资料整理：通过思维导图将资料划分为基础知识、主要功效、现代研究、中药特点、主要成分和特殊人群注意事项，再转化为版面中的信息模块。具体资料整理困难及处理细节待进一步补充。', images:[['mugwort-ai-process.png.webp','即梦 AI 风格探索记录']]},
    {title:'05 / 成品展示', text:'两张艾草科普可视化成品，将植物主体插画、分组知识与绿色信息层级整合，呈现从资料整理、版式探索到板绘制作的成果。', images:[['mugwort-visualization-01.jpg.webp','艾草可视化成品一'],['mugwort-visualization-02.jpg.webp','艾草可视化成品二']]}
  ];
  const style = document.createElement('style');
  style.textContent = '.mugwort-case{margin-top:24px;border-top:1px solid currentColor}.mugwort-case section{padding:24px 0;border-bottom:1px solid rgba(17,17,17,.2)}.mugwort-case h3{font-size:19px;letter-spacing:0;margin:0 0 12px}.mugwort-case p{font-size:14px;line-height:1.85;white-space:pre-line;margin:0 0 18px}.mugwort-case figure{margin:16px 0}.mugwort-case img{display:block;width:100%;height:auto;object-fit:contain}.mugwort-case figcaption{font-size:11px;opacity:.65;margin-top:8px}.mugwort-case .case-note{font-size:12px;opacity:.7;margin:20px 0}';
  document.head.append(style);
  const standalone = document.querySelector('.process');
  const description = document.querySelector('#description') || document.querySelector('#projectDescription') || (standalone && [...document.querySelectorAll('.info .field p')].at(-1));
  const title = document.querySelector('#title') || document.querySelector('#projectTitle') || (standalone && document.querySelector('.info h1'));
  if (!description || !title) return;
  const panel = document.createElement('div');
  panel.className = 'mugwort-case';
  sections.forEach(data => {
    const section = document.createElement('section');
    const heading = document.createElement('h3'); heading.textContent = data.title;
    const paragraph = document.createElement('p'); paragraph.textContent = data.text;
    section.append(heading, paragraph);
    data.images.forEach(([src,caption]) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img'); image.src=src; image.alt=caption; image.loading='lazy';
      const label=document.createElement('figcaption'); label.textContent=caption;
      figure.append(image,label); section.append(figure);
    });
    panel.append(section);
  });
  const note=document.createElement('p'); note.className='case-note'; note.textContent='本页为设计过程展示；调研截图中的医学内容仅作为原始资料记录，不构成诊疗或用药建议，正式科普发布前需进行来源核对与专业审校。'; panel.append(note);
  if (standalone) {
    standalone.replaceChildren(panel);
    const hero=document.querySelector('.visual');
    const image=document.createElement('img'); image.src='mugwort-visualization-01.jpg.webp'; image.alt='艾草科普可视化成品'; image.style.cssText='width:100%;height:auto;object-fit:contain'; hero.replaceChildren(image);
    description.textContent='以草本绿色与平面植物插画，将艾草相关资料组织为清晰的科普信息模块。下方展示主题立项、制作过程、设计思路、问题与解决及成品。';
    const oldNote=document.querySelector('.info .note'); if(oldNote) oldNote.remove();
  } else { description.parentElement.append(panel); }
  const update=()=>{panel.hidden=!title.textContent.includes('艾草');};
  new MutationObserver(update).observe(title,{childList:true,characterData:true,subtree:true});
  update();
})();

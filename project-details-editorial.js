/* Scope enhancements to each dynamically opened case study, including fallbacks. */
(()=>{
 function decorate(root){
  root.querySelectorAll('.project-inline-details table').forEach(table=>{
   if(table.parentElement.classList.contains('case-table-scroll'))return;
   const frame=document.createElement('div');frame.className='case-table-scroll';
   frame.tabIndex=0;frame.setAttribute('role','region');
   frame.setAttribute('aria-label',(table.closest('section')?.querySelector('h2')?.textContent||'项目规范')+'表格，可横向滚动');
   table.before(frame);frame.append(table);
  });
 }
 const observer=new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length))decorate(document);});
 observer.observe(document.body,{childList:true,subtree:true});decorate(document);
})();

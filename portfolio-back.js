/* Right-click goes back one portfolio level; Shift-right-click keeps native menus. */
(()=>{
 let last=-Infinity;
 document.addEventListener('contextmenu',event=>{
  if(event.shiftKey||event.target.closest?.('input,textarea,[contenteditable="true"]'))return;
  event.preventDefault();
  const now=performance.now();if(now-last<400)return;last=now;
  if(window.portfolioGoBack?.())return;
  // Prefer the actual previous document (including scroll/hash state).
  // A directly opened page has a deterministic portfolio-home fallback.
  if(history.length>1)history.back();
  else location.href='zhong-xi-han-portfolio-preview.html';
 });
})();

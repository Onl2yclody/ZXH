/* Reserve image space and wake lazy images inside the project scroll container. */
(()=>{
 const map=window.projectImagePreviews||{};
 window.prepareProjectMarkup=html=>html.replace(/<img\b[^>]*>/gi,tag=>tag.replace(/src="([^"]+)"/i,(all,src)=>map[src]?'src="'+map[src]+'" data-original-src="'+src+'"':all));
 const seen=new WeakSet();const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.loading='eager';io.unobserve(e.target);}},{rootMargin:'800px'});
 function scan(root){for(const img of root.querySelectorAll('img')){if(seen.has(img)||!img.closest('.project-inline-details,.project-main-media,.project-thumbs'))continue;seen.add(img);const src=img.getAttribute('src');if(map[src]){img.dataset.originalSrc=src;img.src=map[src];}img.decoding='async';img.style.minHeight='1px';io.observe(img);}}
 new MutationObserver(()=>scan(document)).observe(document.body,{childList:true,subtree:true});scan(document);
})();
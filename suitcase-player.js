/* Portfolio adapter: preserve the docking/return API while using the suitcase model. */
(()=>{
let active=null;
window.getTurntable3D=()=>active;
window.disposeTurntable3D=()=>{active?.dispose();active=null;};
window.mountTurntable3D=(host,art)=>{
 window.disposeTurntable3D();const T=window.THREE;if(!T||!window.createRedSuitcase)return null;
 let renderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){console.warn('Suitcase WebGL unavailable',e);return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0xffffff,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 const canvas=renderer.domElement;canvas.className='turntable-webgl';canvas.setAttribute('role','img');canvas.setAttribute('aria-label','猫头标志黑白灰手提箱唱片机');host.append(canvas);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,500),built=window.createRedSuitcase(T),model=built.model,record=built.record;scene.add(model);
 // Reference view: elevated front-left three-quarter perspective. Framing below
 // adjusts zoom only, preserving this angle throughout the lid/record sequence.
 camera.position.set(-19.72336,52.95312,30.15378);camera.lookAt(0,10,0);camera.updateMatrixWorld();
 const room=new T.Scene();room.add(new T.Mesh(new T.BoxGeometry(250,250,250),new T.MeshBasicMaterial({color:0x888888,side:T.BackSide})));
 for(const [x,y,z,w,h] of [[-65,60,40,45,90],[65,40,-20,35,75],[0,95,-45,90,50]]){const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:0xffffff}));p.position.set(x,y,z);p.lookAt(0,0,0);room.add(p);}
 const pmrem=new T.PMREMGenerator(renderer),env=pmrem.fromScene(room,.1);scene.environment=env.texture;pmrem.dispose();room.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 scene.add(new T.HemisphereLight(0xffffff,0x666666,1.5));const key=new T.DirectionalLight(0xffffff,3.1);key.position.set(-25,60,35);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-40,right:40,top:50,bottom:-40,near:1,far:150});key.shadow.normalBias=.07;scene.add(key);const fill=new T.DirectionalLight(0xffffff,1.1);fill.position.set(35,20,-35);scene.add(fill);
 const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=-.1;floor.receiveShadow=true;scene.add(floor);
 // Replace decorative label by portfolio artwork, still taking 70% of disc diameter.
 for(const o of record.children){if(o.name==='Red record label'||o.name==='Label ornament approximation'||o.geometry.type==='TorusGeometry'&&o.geometry.parameters.radius<9.4)o.visible=false;}
 // Transparent artwork reveals the record itself, not a grey label backing.
 const label=document.createElement('div');label.className='turntable-3d-label';label.setAttribute('aria-hidden','true');const image=document.createElement('img');image.alt='';label.append(image);host.append(label);
 const source=host.querySelector('.vinyl-large'),observer=new MutationObserver(()=>{image.src=art.src;});observer.observe(art,{attributes:true,attributeFilter:['src']});image.src=art.src;
 let renderDirty=true,maskDirty=true;
 let w=1,h=1,frame=0,last=0,angle=0,playing=true,disposed=false;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let lidStart=null,lidControlled=false,lidAngle=reduce?104:0,discVisible=true,recordLift=0,composition=0,fitZoom=1,centerX=0,centerY=0,transferActive=false;
 function compose(){const desktop=w/h>1&&!matchMedia('(max-width:1400px), (pointer:coarse)').matches,closeup=desktop?1.85:1;camera.zoom=fitZoom*(1+(closeup-1)*composition);camera.updateProjectionMatrix();const ox=centerX*camera.zoom*w/2,oy=-centerY*camera.zoom*h/2;camera.setViewOffset(w,h,ox,oy,w,h);
  // Final framing follows the seated vinyl, not the tall lid. Keep the opening
  // sequence fully framed, then move the deck up into the visual focal area.
  if(desktop&&composition){const p=new T.Vector3(-5.1,6.01,.4).applyMatrix4(model.matrixWorld).project(camera);camera.setViewOffset(w,h,ox+((p.x*.5+.5)-.51)*w*composition,oy+((.5-p.y*.5)-.64)*h*composition,w,h);}
 }
 function lidProgress(progress){const next=104*Math.max(0,Math.min(1,progress));if(next===lidAngle&&lidProgress.ready)return;lidProgress.ready=true;renderDirty=true;if(next!==lidAngle&&!transferActive)renderer.shadowMap.needsUpdate=true;lidAngle=next;built.setOpen(lidAngle);label.style.visibility=discVisible&&lidAngle>=90?'':'hidden';}
 lidProgress(reduce?1:0);
 function project(x,z,lift=recordLift){const v=new T.Vector3(x,6.01+lift,z);model.localToWorld(v);v.project(camera);return {x:(v.x*.5+.5)*w,y:(.5-v.y*.5)*h};}
 function pose(radius,lift=recordLift){const p=project(-5.1,.4,lift),a=project(-5.1+radius,.4,lift),b=project(-5.1,.4+radius,lift);return {p,a,b};}
 const labelInverse=new T.Matrix3();
 function projectLabel(){
  // Keep homogeneous W: an affine ellipse cannot match a perspective camera.
  const vp=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).multiply(model.matrixWorld),radius=9.3,step=radius/512;
  const c=new T.Vector4(-5.1-radius,6.01+recordLift,.4-radius,1).applyMatrix4(vp);
  const u=new T.Vector4(step,0,0,0).applyMatrix4(vp),v=new T.Vector4(0,0,step,0).applyMatrix4(vp);
  const screen=q=>[(q.x+q.w)*w/2,(q.w-q.y)*h/2,q.w],U=screen(u),V=screen(v),C=screen(c),k=C[2];
  const a=U[0]/k,b=V[0]/k,tx=C[0]/k,d=U[1]/k,e=V[1]/k,ty=C[1]/k,g=U[2]/k,j=V[2]/k;
  label.style.transformOrigin='0 0';
  label.style.transform=`matrix3d(${a},${d},0,${g},${b},${e},0,${j},0,0,1,0,${tx},${ty},0,1)`;
  labelInverse.set(a,b,tx,d,e,ty,g,j,1).invert();
 }
 function layout(){const key=[w,h,composition,recordLift,fitZoom].join('/');if(layout.key===key)return;layout.key=key;renderDirty=true;maskDirty=true;model.updateMatrixWorld(true);projectLabel();const points=Array.from({length:32},(_,i)=>{const t=i*Math.PI/16;return project(-5.1+11.65*Math.cos(t),.4+11.65*Math.sin(t));});const xs=points.map(p=>p.x),ys=points.map(p=>p.y);Object.assign(source.style,{left:Math.min(...xs)+'px',top:Math.min(...ys)+'px',width:Math.max(...xs)-Math.min(...xs)+'px',height:Math.max(...ys)-Math.min(...ys)+'px',transform:'none',aspectRatio:'auto'});}
 function maskCartridge(){
   // The DOM artwork has no depth buffer. Mask the union of the tube and
   // cartridge triangles, not just the head, to reveal the real 3D arm.
   label.style.clipPath='';
   if(recordLift>.1){label.style.maskImage=label.style.webkitMaskImage='';maskCartridge.key='';return;}
   const key=[w,h,composition,recordLift,fitZoom,built.arm.rotation.x,built.arm.rotation.y].join('/');
   if(maskCartridge.key===key)return;
   maskCartridge.key=key;
   model.updateMatrixWorld(true);
   const polygons=[];
   const hull=points=>{const sorted=[...points].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]),lo=[],hi=[];for(const p of sorted){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),p)<=0)lo.pop();lo.push(p);}for(const p of sorted.reverse()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),p)<=0)hi.pop();hi.push(p);}return lo.slice(0,-1).concat(hi.slice(0,-1));};
   for(const name of ['Polished tonearm','Cartridge']){
    const mesh=model.getObjectByName(name);if(!mesh)continue;
    const attr=mesh.geometry.attributes.position,index=mesh.geometry.index,points=[];
    for(let i=0;i<attr.count;i++){
     const v=new T.Vector3().fromBufferAttribute(attr,i).applyMatrix4(mesh.matrixWorld).project(camera);
     const q=new T.Vector3((v.x*.5+.5)*w,(.5-v.y*.5)*h,1).applyMatrix3(labelInverse);
     points.push([q.x/q.z,q.y/q.z]);
    }
    // One convex silhouette per short tube segment instead of 512 SVG triangles.
    const stride=(mesh.geometry.parameters.radialSegments||0)+1;
    const shapes=name==='Polished tonearm'?Array.from({length:mesh.geometry.parameters.tubularSegments},(_,i)=>hull(points.slice(i*stride,(i+2)*stride))):[hull(points)];
    for(const tri of shapes){
     if(tri.every(p=>p[0]<0)||tri.every(p=>p[0]>1024)||tri.every(p=>p[1]<0)||tri.every(p=>p[1]>1024))continue;
     polygons.push('<polygon points="'+tri.map(p=>p.map(n=>n.toFixed(2)).join(',')).join(' ')+'"/>');
    }
   }
   const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><mask id="arm" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><rect width="1024" height="1024" fill="white"/><g fill="black" stroke="black" stroke-width=".5">'+polygons.join('')+'</g></mask><rect width="1024" height="1024" fill="white" mask="url(#arm)"/></svg>';
   label.style.maskImage=label.style.webkitMaskImage='url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
   label.style.maskSize=label.style.webkitMaskSize='100% 100%';
 }
 function resize(){const rect=host.getBoundingClientRect(),nw=Math.max(1,host.clientWidth||rect.width),nh=Math.max(1,host.clientHeight||rect.height);if(resize.ready&&w===nw&&h===nh)return;resize.ready=true;w=nw;h=nh;renderer.setSize(w,h,false);camera.clearViewOffset();camera.aspect=w/h;camera.zoom=1;camera.updateProjectionMatrix();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  // One stable camera contains the entire lid sweep and the raised 3D record.
  for(const degrees of [0,26,52,78,104]){
   built.setOpen(degrees);record.position.y=17.9;model.updateMatrixWorld(true);
   // Cache local geometry bounds, then project eight corners instead of every
   // vertex for each of the five lid poses on every resize/mount.
   model.traverse(o=>{if(!o.isMesh)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const v=new T.Vector3(x,y,z).applyMatrix4(o.matrixWorld).project(camera);minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);}});
  }
  fitZoom=Math.min(1.88/(maxX-minX),1.88/(maxY-minY));centerX=(minX+maxX)/2;centerY=(minY+maxY)/2;compose();
  record.position.y=5.9+recordLift;
  built.setOpen(lidAngle);layout();
 }
 const ro=new ResizeObserver(resize);ro.observe(host);
 function tick(t){if(disposed)return;if(!host.isConnected){api.dispose();return;}frame=requestAnimationFrame(tick);const dt=Math.min((t-last)/1000,.05);last=t;if(document.hidden)return;if(!lidControlled&&!reduce){if(lidStart===null)lidStart=t;const p=Math.min(1,(t-lidStart)/1050);lidProgress(p*p*(3-2*p));}if(playing&&!reduce&&lidAngle>=90){angle-=dt*Math.PI/12;record.rotation.y=angle;image.style.transform=`rotate(${-angle}rad)`;renderDirty=true;}if(maskDirty){maskCartridge();maskDirty=false;}if(renderDirty){renderer.render(scene,camera);renderDirty=false;}}
 const api={scene,model,setPlaying(v){playing=v;},setDiscVisible(v){renderDirty=true;record.visible=v;label.style.visibility=v?'':'hidden';},getDiscPose(lift=recordLift){const rect=host.getBoundingClientRect(),sx=rect.width/w,sy=rect.height/h,{p,a,b}=pose(11.65,lift);return{x:rect.left+p.x*sx,y:rect.top+p.y*sy,a:(a.x-p.x)*sx/100,b:(a.y-p.y)*sy/100,c:(b.x-p.x)*sx/100,d:(b.y-p.y)*sy/100};},dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);ro.disconnect();observer.disconnect();const geos=new Set(),mats=new Set(),textures=new Set();scene.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)mats.add(o.material);});mats.forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v);});m.dispose();});geos.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());env.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();label.remove();host.classList.remove('has-webgl');}};
 api.setCompositionProgress=p=>{const next=Math.max(0,Math.min(1,p));if(next===composition)return;composition=next;compose();layout();};
 api.setLidProgress=p=>{lidControlled=true;lidProgress(reduce?1:p);};
 // Skip the expensive dynamic shadow pass during the rapid transfer. Restore
 // a fresh stationary shadow once the record and arm reach their resting pose.
 api.setTransferActive=active=>{transferActive=active;renderDirty=true;renderer.shadowMap.needsUpdate=!active;};
 api.setRecordLift=height=>{const next=Math.max(0,height);if(next===recordLift)return;recordLift=next;record.position.y=5.9+recordLift;if(!transferActive)renderer.shadowMap.needsUpdate=true;layout();};
 api.setArmProgress=p=>{
  const t=Math.max(0,Math.min(1,p)),ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
  // Stay on the right rest, lift the needle, swing over the seated record,
  // then lower it. The pivot stays anchored rather than translating the base.
  const y=.5*(1-ease((t-.2)/.6)),x=-.065*ease(t/.2)*(1-ease((t-.8)/.2));
  if(!transferActive&&(y!==built.arm.rotation.y||x!==built.arm.rotation.x))renderer.shadowMap.needsUpdate=true;
  if(y!==built.arm.rotation.y||x!==built.arm.rotation.x){maskDirty=true;renderDirty=true;}built.arm.rotation.y=y;built.arm.rotation.x=x;
 };
 const setDisc=api.setDiscVisible;api.setDiscVisible=v=>{discVisible=v;setDisc(v);lidProgress(lidAngle/104);};
 active=api;host.classList.add('has-webgl');resize();frame=requestAnimationFrame(tick);return api;
};
})();

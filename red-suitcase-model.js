/* Reference-based reconstruction. Units are nominal centimetres, not measured dimensions. */
(function(root,factory){if(typeof module==='object')module.exports=factory;else root.createRedSuitcase=factory;})(globalThis,function(T){
 const model=new T.Group();model.name='Monochrome suitcase turntable — reference reconstruction';
 model.userData={reference:'User supplied four-view collage',dimensions:'Estimated 35 x 26 x 11 cm closed; not measured',accuracy:'Visible details reconstructed; unseen rear and branding approximated'};
 const mat=(color,metalness=0,roughness=.5)=>new T.MeshStandardMaterial({color,metalness,roughness});
 const red=mat(0x353535,.05,.55),lining=mat(0xaaaaaa,0,.85),edge=mat(0x505050,.05,.48),silver=mat(0xd5d5d5,.9,.22),black=mat(0x101010,0,.53),rubber=mat(0x181818,0,.84),vinyl=mat(0x090909,.25,.3),label=mat(0xd0d0d0,0,.64),cream=mat(0x555555,0,.68);
 const leather=new Uint8Array(128*128*4);let seed=71;for(let i=0;i<leather.length;i+=4){seed=(seed*1664525+1013904223)>>>0;let v=100+(seed>>>25);leather[i]=leather[i+1]=leather[i+2]=v;leather[i+3]=255;}
 const grain=new T.DataTexture(leather,128,128);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(8,8);grain.needsUpdate=true;red.bumpMap=grain;red.bumpScale=.025;edge.bumpMap=grain;edge.bumpScale=.015;
 function mesh(g,m,x,y,z,p=model,name=''){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;o.name=name;p.add(o);return o;}
 const box=(w,h,d,m,x,y,z,p=model,name='')=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,p,name);
 const cyl=(r,h,m,x,y,z,p=model,name='')=>mesh(new T.CylinderGeometry(r,r,h,64),m,x,y,z,p,name);
 function rounded(w,d,h,r,m,x,y,z,p=model,name=''){
  const s=new T.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
  const g=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSize:.1,bevelThickness:.1,bevelSegments:3,curveSegments:10});g.rotateX(-Math.PI/2);return mesh(g,m,x,y,z,p,name);
 }
 function tube(points,r,m,p=model,name=''){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),Math.max(16,points.length*8),r,8,false),m,0,0,0,p,name);}
 function torus(r,t,m,x,y,z,p=model){const o=mesh(new T.TorusGeometry(r,t,6,100),m,x,y,z,p);o.rotation.x=Math.PI/2;return o;}
 function screw(x,y,z,p=model,front=false){const o=cyl(.13,.06,silver,x,y,z,p,'Slotted screw');if(front)o.rotation.x=Math.PI/2;const slot=box(.14,.015,.025,black,x,y+.034,z,p);if(front){slot.position.set(x,y,z+.034);slot.rotation.x=Math.PI/2;}}
 rounded(35,26,4.6,.85,red,0,.55,0,model,'Red leather base');
 rounded(33.7,24.7,.13,.55,lining,0,5.12,0,model,'Recessed inner lip');
 rounded(32.8,23.8,.13,.38,black,0,5.27,0,model,'Black recessed deck');
 for(const x of [-14.5,14.5])for(const z of [-10,10])cyl(.85,.65,rubber,x,.25,z,model,'Rubber foot');
 // Silver wrapping corner protectors: top/bottom face and two vertical folds.
 function cap(x,y,z,p=model){
  rounded(2.2,2.2,.12,.38,silver,x,y,z,p,'Corner protector');
  box(.14,1.1,1.85,silver,x+Math.sign(x)*.95,y+.5,z,p);
  box(1.85,1.1,.14,silver,x,y+.5,z+Math.sign(z)*.95,p);
  screw(x,y+.15,z,p);
 }
 for(const x of [-16.35,16.35])for(const z of [-11.85,11.85])cap(x,.6,z);
 // Front paired loudspeaker grilles with actual crossed metal wires.
 for(const x of [-11.1,11.1]){
  const frame=rounded(7.3,2.65,.15,.28,silver,x,2.9,13.08,model,'Speaker bezel');frame.rotation.x=Math.PI/2;
  box(6.8,2.15,.12,rubber,x,2.9,13.2);
  for(let i=0;i<38;i++)box(.035,2.12,.035,silver,x-3.3+i*6.6/37,2.9,13.29);
  for(let i=0;i<14;i++)box(6.65,.035,.035,silver,x,1.88+i*2.04/13,13.32);
 }
 // Central clasp and curved carry handle.
 box(2.1,2.1,.22,silver,0,4.1,13.16,model,'Front clasp');box(1.55,1.55,.13,black,0,4.13,13.31);box(1.25,1.45,.18,silver,0,4.2,13.43);box(.72,.2,.2,black,0,3.83,13.56);
 for(const x of [-5.1,5.1]){box(2.2,1.05,.25,silver,x,3.9,13.2);screw(x-.68,3.9,13.36,model,true);screw(x+.68,3.9,13.36,model,true);tube([[x,4,13.4],[x,2.8,14.25],[x*.88,2.1,14.5]],.17,silver);}
 tube([[-4.5,2.1,14.5],[-3.6,1.65,14.8],[0,1.5,14.8],[3.6,1.65,14.8],[4.5,2.1,14.5]],.5,red,model,'Red padded carry handle');
 // Lid pivots about the back edge. Closed: horizontal; open: 104 degrees.
 const lid=new T.Group();lid.name='Hinged lid';lid.position.set(0,5.45,-12.65);model.add(lid);
 // Hollow lid: hardware needs headroom, not a solid slab through the tonearm.
 // Closed inner ceiling starts at world Y=7.73; counterweight tops out at 7.4.
 rounded(35,26,.35,.85,red,0,2.55,12.65,lid,'Leather lid roof');
 rounded(33.6,24.6,.1,.4,lining,0,2.38,12.65,lid,'Inner lid ceiling');
 for(const x of [-17.15,17.15])box(.5,2.55,24.8,red,x,1.23,12.65,lid,'Lid side wall');
 for(const z of [-.05,25.35])box(33.8,2.55,.5,red,0,1.23,z,lid,'Lid front and back wall');
 for(const x of [-16.35,16.35])for(const z of [.8,24.5]){
  rounded(2,2,.13,.35,silver,x,2.93,z,lid,'Lid silver cap');
  box(.13,1.1,1.8,silver,x+Math.sign(x)*.95,2.44,z,lid);screw(x,3.09,z,lid);
 }
 for(const x of [-11.5,11.5]){box(3,.12,1.6,silver,x,5.44,-11.9);const h=cyl(.27,3.1,silver,x,5.55,-12.65);h.rotation.z=Math.PI/2;}
 tube([[-.8,1.7,25.7],[-.8,1.7,27.5],[.8,1.7,27.5],[.8,1.7,25.7]],.16,silver,lid,'Lid latch loop');
 for(const x of [-14.8,14.8])box(.9,.22,.9,cream,x,-.4,1.3,lid,'Lid bumper');
 // Polygon traced from the supplied website logo; eyes/mouth are true cutouts.
 // Geometry travels with the GLB without external image/texture dependencies.
 const outline=[[361,680],[434,546],[471,380],[517,364],[633,454],[870,424],[1122,464],[1223,396],[1269,413],[1296,561],[1378,699],[1319,950],[1147,1050],[564,1004],[388,884]];
 const holes=[[[615,651],[721,651],[721,757],[615,757]],[[1033,670],[1137,688],[1119,792],[1015,775]],[[840,769],[901,772],[900,811],[838,808]]];
 function trace(points,Path){const p=new Path();points.forEach(([x,y],i)=>{const a=(x-870)*.009,b=(707-y)*.009;i?p.lineTo(a,b):p.moveTo(a,b);});p.closePath();return p;}
 const cat=trace(outline,T.Shape);holes.forEach(points=>cat.holes.push(trace(points,T.Path)));
 const catGeometry=new T.ShapeGeometry(cat);
 function logo(y,inside){const o=mesh(catGeometry,black,0,y,12.65,lid,inside?'Website cat logo — inside':'Website cat logo — outside');o.rotation.x=inside?Math.PI/2:-Math.PI/2;}
 logo(2.22,true);logo(3.04,false);
 const record=new T.Group();record.name='Spinning vinyl';record.position.set(-5.1,5.9,.4);model.add(record);
 cyl(11.5,.25,rubber,-5.1,5.57,.4,model,'Platter');cyl(11.65,.12,vinyl,0,0,0,record,'Black vinyl');
 for(let r=4.15;r<11.5;r+=.13)torus(r,.009,black,0,.065,0,record);
 cyl(3.85,.018,label,0,.077,0,record,'Red record label');torus(3.65,.023,cream,0,.09,0,record);
 for(let j=0;j<3;j++)tube(Array.from({length:36},(_,i)=>{const a=i/35*Math.PI*2;return [Math.cos(a)*(1.3+.7*Math.sin(a*3+j)),.095,Math.sin(a)*(1.3+.7*Math.sin(a*3+j))];}),.035,cream,record,'Label ornament approximation');
 cyl(.16,.6,silver,-5.1,6.18,.4,model,'Spindle');
 // Right controls and tonearm. Straight polished arm with black cartridge.
 rounded(3.2,22.5,.1,.2,rubber,14,5.45,0,model,'Control strip');
 cyl(.7,.45,silver,14,5.85,6.5,model,'Volume knob');cyl(.55,.08,black,14,6.12,6.5);box(.035,.015,.35,cream,14,6.17,6.7);
 for(const z of [-7,-4.5,-2]){box(.85,.12,1.5,black,14,5.7,z);box(.5,.18,.35,silver,14,5.82,z);}
 for(const z of [8.2,9.3]){cyl(.21,.07,silver,14,5.65,z);cyl(.13,.08,black,14,5.69,z);}
 const arm=new T.Group();arm.name='Tonearm pivot';arm.position.set(8.1,5.6,-8.3);model.add(arm);
 cyl(1,.35,black,0,.2,0,arm);cyl(.65,.7,black,0,.65,0,arm);torus(.64,.05,silver,0,.9,0,arm);
 const weight=cyl(.6,1.1,black,.2,1.2,-1.25,arm);weight.rotation.x=Math.PI/2;
 tube([[0,1.1,-.8],[0,1.1,.2],[-2.6,.85,5.7],[-5.8,.6,11.6]],.14,silver,arm,'Polished tonearm');
 const head=box(1.2,.48,2.1,black,-5.8,.55,11.6,arm,'Cartridge');head.rotation.y=-.45;
 box(.72,.15,1,label,-6,.24,12,arm);box(.15,.3,.15,silver,-6,.07,12.4,arm);
 box(.55,.9,.55,black,8.7,6,-1.5,model,'Tonearm rest');
 for(const x of [-15.8,15.8])for(const z of [-11.1,11.1])screw(x,5.47,z);
 function setOpen(degrees){lid.rotation.x=-T.MathUtils.degToRad(Math.max(0,Math.min(110,degrees)));}
 setOpen(104);model.updateMatrixWorld(true);
 return {model,lid,record,arm,setOpen};
});

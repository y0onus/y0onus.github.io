// ═══════════════════════════════════════
// AVATAR PICKER FUNCTIONS
// ═══════════════════════════════════════
// buildSwatches removed — using arrow-only UI

function refreshAvatar(){
  renderAvatarPreview();
  myAvatarHead=myHeadIdx;
  myAvatarShirt=myShirtIdx;
  sessionStorage.setItem('wc_head',myHeadIdx);
  sessionStorage.setItem('wc_shirt',myShirtIdx);
  var lbl=document.getElementById('avatar-current-label');
  if(lbl)lbl.textContent=HEAD_COLORS[myHeadIdx].label+' skin · '+SHIRT_COLORS[myShirtIdx].label+' shirt';
}

function cycleHead(dir){
  myHeadIdx=(myHeadIdx+dir+HEAD_COLORS.length)%HEAD_COLORS.length;
  refreshAvatar();
}
function cycleShirt(dir){
  myShirtIdx=(myShirtIdx+dir+SHIRT_COLORS.length)%SHIRT_COLORS.length;
  refreshAvatar();
}

// ═══════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════
const FB={apiKey:"AIzaSyDW0UpHNzP_JaOsDH_6ZFlA3wHg26M8Y4s",authDomain:"locationchatbase.firebaseapp.com",databaseURL:"https://locationchatbase-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"locationchatbase",storageBucket:"locationchatbase.firebasestorage.app",messagingSenderId:"645678725889",appId:"1:645678725889:web:2a36a0aebc1d1dcb6af900"};
const _S3={region:'ap-southeast-2',bucket:'boalhathakey',keyId:'AKIAYXUC44KXTUULTTWI',secret:'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'};
const PROXIMITY_METERS=60;
const BANDS=[
  {id:'EHF',label:'EHF',freq:'30 GHz', desc:'Millimeter Wave',    color:'#CC0040',glow:'rgba(204,0,64,.6)'},
  {id:'SHF',label:'SHF',freq:'3 GHz',  desc:'Super High Freq',   color:'#FF3B3B',glow:'rgba(255,59,59,.6)'},
  {id:'UHF',label:'UHF',freq:'450 MHz',desc:'Ultra High Freq',    color:'#FF9500',glow:'rgba(255,149,0,.6)'},
  {id:'VHF',label:'VHF',freq:'150 MHz',desc:'Very High Freq',     color:'#FFD600',glow:'rgba(255,214,0,.6)'},
  {id:'FM', label:'FM', freq:'100 MHz',desc:'Frequency Modulated',color:'#34C759',glow:'rgba(52,199,89,.6)'},
  {id:'SW', label:'SW', freq:'7 MHz',  desc:'Shortwave',          color:'#007AFF',glow:'rgba(0,122,255,.6)'},
  {id:'AM', label:'AM', freq:'530 kHz',desc:'Amplitude Modulated',color:'#5856D6',glow:'rgba(88,86,214,.6)'},
];
const PIN_TYPES={
  gathering:  {icon:'groups',      color:'#FFD600',label:'Gathering'},
  party:      {icon:'celebration', color:'#FF3B3B',label:'Party'},
  meetup:     {icon:'handshake',   color:'#34C759',label:'Meetup'},
  market:     {icon:'storefront',  color:'#FF9500',label:'Market'},
  performance:{icon:'music_note',  color:'#5856D6',label:'Performance'},
  sports:     {icon:'sports_soccer',color:'#007AFF',label:'Sports'},
  rally:      {icon:'campaign',    color:'#FF453A',label:'Rally'},
  food:       {icon:'restaurant',  color:'#FF9F0A',label:'Food'},
  other:      {icon:'star',        color:'#FF375F',label:'Other'},
};


// ═══════════════════════════════════════
// AVATAR DATA
// ═══════════════════════════════════════
const HEAD_COLORS=[
  {id:'pale',  fill:'#ffe7d0',stroke:'#deb9a0',label:'Pale'},
  {id:'tan',   fill:'#f5cca6',stroke:'#c8955e',label:'Tan'},
  {id:'brown', fill:'#9a6f47',stroke:'#7a5030',label:'Brown'},
  {id:'dark',  fill:'#594029',stroke:'#3d2a18',label:'Dark'},
];
const SHIRT_COLORS=[
  {id:'blue',   fill:'#61daff',stroke:'#4aa4c2',label:'Blue'},
  {id:'purple', fill:'#6648bd',stroke:'#4a32a0',label:'Purple'},
  {id:'green',  fill:'#48bd4c',stroke:'#33963a',label:'Green'},
  {id:'yellow', fill:'#ffbd2d',stroke:'#d49a00',label:'Yellow'},
  {id:'pink',   fill:'#ff92e8',stroke:'#d060c0',label:'Pink'},
  {id:'red',    fill:'#ff6161',stroke:'#d43030',label:'Red'},
];
let myHeadIdx=0, myShirtIdx=0;

function avatarSVG(headIdx, shirtIdx, size, animated){
  if(size===undefined)size=120;
  if(animated===undefined)animated=false;
  var h=HEAD_COLORS[headIdx]||HEAD_COLORS[0];
  var s=SHIRT_COLORS[shirtIdx]||SHIRT_COLORS[0];
  // ViewBox 80x170. All coords absolute — no group transforms.
  // Head:  circle cx=40 cy=30 r=22  (bottom edge y=52)
  // Shirt: rect x=20 y=54 w=40 h=48 (top touches head, bottom y=102)
  // Arms:  from (20,65)→(6,92) and (60,65)→(74,92)
  // Legs:  from (30,102)→(26,148) and (50,102)→(54,148)
  // Feet:  (26,148)→(16,148)  and  (54,148)→(64,148)
  var W=size, H=Math.round(size*170/80);
  var shirtCls = animated ? ' class="av-shirt-bob"' : '';
  var headCls  = animated ? ' class="av-head-flip"' : '';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 170" width="'+W+'" height="'+H+'">'
    // ── arms & legs — drawn first (behind shirt & head) ──
    +'<g stroke="#222" stroke-width="4.5" stroke-linecap="round" fill="none">'
    +'<line x1="20" y1="65" x2="6"  y2="92"/>'   // left arm
    +'<line x1="60" y1="65" x2="74" y2="92"/>'   // right arm
    +'<line x1="30" y1="102" x2="26" y2="148"/>' // left leg
    +'<line x1="26" y1="148" x2="16" y2="148"/>' // left foot
    +'<line x1="50" y1="102" x2="54" y2="148"/>' // right leg
    +'<line x1="54" y1="148" x2="64" y2="148"/>' // right foot
    +'</g>'
    // ── shirt — drawn second (over arms, under head) ──
    +'<rect'+shirtCls+' x="20" y="54" width="40" height="48" rx="5"'
    +' fill="'+s.fill+'" stroke="'+s.stroke+'" stroke-width="2.5"/>'
    // ── head — drawn last (on top of everything) ──
    +'<circle'+headCls+' cx="40" cy="30" r="22"'
    +' fill="'+h.fill+'" stroke="'+h.stroke+'" stroke-width="2.5"/>'
    +'<circle cx="33" cy="34" r="3" fill="#111"/>'  // left eye
    +'<circle cx="47" cy="34" r="3" fill="#111"/>'  // right eye
    +'</svg>';
}

function avatarSVGForMap(headIdx, shirtIdx){
  return avatarSVG(headIdx, shirtIdx, 54, false);
}

function renderAvatarPreview(){
  const el=document.getElementById('avatar-preview');
  if(el)el.innerHTML=avatarSVG(myHeadIdx,myShirtIdx,160,true);
}

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let db,auth,map,myUID,myUsername,myPfp='',myLocation=null;
let myAvatarHead=0,myAvatarShirt=0;
let isAnonymous=true,isGhostMode=false,isRegisteredUser=false;
let selectedBand=4,myMarker=null,myCircle=null;
let currentRoomId=null,activeRoomListeners={};
let typingTimeout=null,chatOpen=false,unreadCount=0;
let cameraStream=null,capturedBlob=null;
let heatCanvas=null,allUsersData={};
let pinMarkers={},editingPinId=null,selectedPinType='gathering',selectedPinBands=new Set();
let pendingPinLat=null,pendingPinLng=null,draggablePinMarker=null;

// ═══════════════════════════════════════
// S3
// ═══════════════════════════════════════
async function sha256hex(msg){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(msg));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
async function hmacRaw(key,msg){const k=typeof key==='string'?new TextEncoder().encode(key):key,m=typeof msg==='string'?new TextEncoder().encode(msg):msg,ck=await crypto.subtle.importKey('raw',k,{name:'HMAC',hash:'SHA-256'},false,['sign']);return new Uint8Array(await crypto.subtle.sign('HMAC',ck,m))}
async function hmacHex(key,msg){return Array.from(await hmacRaw(key,msg)).map(b=>b.toString(16).padStart(2,'0')).join('')}
async function getSigningKey(secret,date,region,service){let k=await hmacRaw('AWS4'+secret,date);k=await hmacRaw(k,region);k=await hmacRaw(k,service);return await hmacRaw(k,'aws4_request')}
async function uploadToS3(blob,keyPath,mime){
  const now=new Date(),ds=now.toISOString().replace(/[:\-]|\.\d{3}/g,'').substring(0,15)+'Z',d0=ds.substring(0,8);
  const cs=`${d0}/${_S3.region}/s3/aws4_request`,host=`${_S3.bucket}.s3.${_S3.region}.amazonaws.com`;
  const ch=`content-type:${mime}\nhost:${host}\nx-amz-date:${ds}\n`,sh='content-type;host;x-amz-date';
  const cr=`PUT\n/${keyPath}\n\n${ch}\n${sh}\nUNSIGNED-PAYLOAD`;
  const sts=`AWS4-HMAC-SHA256\n${ds}\n${cs}\n${await sha256hex(cr)}`;
  const sk=await getSigningKey(_S3.secret,d0,_S3.region,'s3');
  const sig=await hmacHex(sk,sts);
  const ah=`AWS4-HMAC-SHA256 Credential=${_S3.keyId}/${cs},SignedHeaders=${sh},Signature=${sig}`;
  const url=`https://${host}/${keyPath}`;
  const res=await fetch(url,{method:'PUT',headers:{'Content-Type':mime,'x-amz-date':ds,'Authorization':ah,'x-amz-content-sha256':'UNSIGNED-PAYLOAD'},body:blob});
  if(!res.ok)throw new Error('S3 '+res.status);
  return url+'?v='+Date.now();
}

// ═══════════════════════════════════════
// ROLLER
// ═══════════════════════════════════════
function setupRoller(barEl,rollerEl,labelsEl,onSnap,opts={}){
  const cls=opts.cls||'band-lbl';
  function setPos(idx){rollerEl.style.left=(barEl.offsetWidth/(BANDS.length-1)*idx)+'px';rollerEl.style.boxShadow=`0 0 0 2px rgba(0,0,0,.5),0 4px 20px rgba(0,0,0,.7),0 0 24px ${BANDS[idx].glow}`}
  function snap(idx){selectedBand=idx;setPos(idx);labelsEl.querySelectorAll('div').forEach((el,i)=>el.classList.toggle('active',i===idx));onSnap(idx)}
  function xi(cx){const r=cx-barEl.getBoundingClientRect().left,W=barEl.offsetWidth;return Math.max(0,Math.min(BANDS.length-1,Math.round((r/W)*(BANDS.length-1))))}
  labelsEl.innerHTML='';
  BANDS.forEach((b,i)=>{const el=document.createElement('div');el.className=cls+(i===selectedBand?' active':'');el.textContent=b.label;el.onclick=()=>snap(i);labelsEl.appendChild(el)});
  let drag=false;
  rollerEl.addEventListener('mousedown',e=>{drag=true;e.preventDefault()});
  rollerEl.addEventListener('touchstart',e=>{drag=true;e.preventDefault()},{passive:false});
  document.addEventListener('mousemove',e=>{if(!drag)return;const i=xi(e.clientX);setPos(i);labelsEl.querySelectorAll('div').forEach((el,j)=>el.classList.toggle('active',j===i));onSnap(i,true)});
  document.addEventListener('touchmove',e=>{if(!drag)return;const i=xi(e.touches[0].clientX);setPos(i);labelsEl.querySelectorAll('div').forEach((el,j)=>el.classList.toggle('active',j===i));onSnap(i,true)},{passive:false});
  document.addEventListener('mouseup',e=>{if(!drag)return;drag=false;snap(xi(e.clientX))});
  document.addEventListener('touchend',e=>{if(!drag)return;drag=false;snap(xi(e.changedTouches[0].clientX))});
  barEl.addEventListener('click',e=>snap(xi(e.clientX)));
  setTimeout(()=>setPos(selectedBand),50);
  return{snap};
}

// ═══════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════
function initOnboarding(){
  const uid=sessionStorage.getItem('wc_uid'),uname=sessionStorage.getItem('wc_username'),pfp=sessionStorage.getItem('wc_pfp'),anon=sessionStorage.getItem('wc_anon');
  if(uid&&uname){
    myUID=uid;myUsername=uname;myPfp=pfp||'';isAnonymous=anon==='true';isRegisteredUser=anon!=='true';
    myAvatarHead=parseInt(sessionStorage.getItem('wc_head')||'0');
    myAvatarShirt=parseInt(sessionStorage.getItem('wc_shirt')||'0');
    myHeadIdx=myAvatarHead;myShirtIdx=myAvatarShirt;
    document.getElementById('auth-gate').style.display='none';
    document.getElementById('freq-picker').style.display='block';
    document.getElementById('username-input').value=myUsername;
    showFreqPicker();
  } else {
    document.getElementById('auth-gate').style.display='flex';
    document.getElementById('freq-picker').style.display='none';
  }
}
function enterAnonymous(){
  const adj=['Whispering','Silent','Phantom','Roaming','Static','Drifting','Distant','Lurking'];
  const noun=['Signal','Wave','Ghost','Nomad','Echo','Rider','Pilgrim','Wanderer'];
  myUID='u_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
  myUsername=adj[Math.floor(Math.random()*adj.length)]+noun[Math.floor(Math.random()*noun.length)]+(Math.floor(Math.random()*900000)+100000);
  myPfp='';isAnonymous=true;isRegisteredUser=false;
  sessionStorage.setItem('wc_uid',myUID);sessionStorage.setItem('wc_username',myUsername);sessionStorage.setItem('wc_pfp','');sessionStorage.setItem('wc_anon','true');
  document.getElementById('auth-gate').style.display='none';
  document.getElementById('freq-picker').style.display='block';
  document.getElementById('username-input').value=myUsername;
  showFreqPicker();
}
function showFreqPicker(){
  // Init avatar picker
  myHeadIdx=myAvatarHead||0;myShirtIdx=myAvatarShirt||0;
  setTimeout(()=>{renderAvatarPreview();refreshAvatar();},50);
  setupRoller(document.getElementById('ob-rainbow-bar'),document.getElementById('ob-roller'),document.getElementById('ob-band-labels'),(idx)=>{
    const b=BANDS[idx];document.getElementById('ob-selected-band').textContent=b.label;document.getElementById('ob-selected-sub').textContent=`${b.freq} · ${b.desc}`;
  },{cls:'ob-band-lbl'});
  const b=BANDS[selectedBand];document.getElementById('ob-selected-band').textContent=b.label;document.getElementById('ob-selected-sub').textContent=`${b.freq} · ${b.desc}`;
  // Username is permanent once set — lock the field
  const inp=document.getElementById('username-input');
  if(myUsername){
    inp.value=myUsername;
    inp.readOnly=true;
    inp.style.opacity='.55';
    inp.style.cursor='default';
    inp.title='Callsign is permanent';
  }
  document.getElementById('join-btn').onclick=joinApp;
  if(!inp.readOnly)inp.addEventListener('keypress',e=>{if(e.key==='Enter')joinApp()});
}

// ═══════════════════════════════════════
// JOIN
// ═══════════════════════════════════════
async function joinApp(){
  const raw=document.getElementById('username-input').value.trim();
  if(!raw){const el=document.getElementById('username-input');el.style.borderColor='#ff453a';setTimeout(()=>el.style.borderColor='',800);return}
  myUsername=raw.slice(0,20);
  if(!myUID)myUID='u_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
  myAvatarHead=myHeadIdx;myAvatarShirt=myShirtIdx;
  sessionStorage.setItem('wc_head',myAvatarHead);
  sessionStorage.setItem('wc_shirt',myAvatarShirt);
  const btn=document.getElementById('join-btn');
  btn.disabled=true;btn.innerHTML='<span class="material-icons-round" style="animation:spin .8s linear infinite">refresh</span> Locating…';
  try{await getLocation()}
  catch(e){alert('Location required. Please allow it and retry.');btn.disabled=false;btn.innerHTML='<span class="material-icons-round">cell_tower</span>Tune In';return}
  document.getElementById('onboarding').classList.add('hidden');
  await initMap();showUI();initWatch();listenAllUsers();listenPins();
}

// ═══════════════════════════════════════
// UI
// ═══════════════════════════════════════
function showUI(){
  document.getElementById('topbar').style.display='flex';
  document.getElementById('freq-dock').style.display='block';
  document.getElementById('chat-tab').style.display='flex';
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('tb-name').textContent=myUsername;
  const av=document.getElementById('tb-avatar');
  if(myPfp){av.innerHTML=`<img src="${myPfp}" alt="">`;
  }else{av.innerHTML=avatarSVG(myAvatarHead,myAvatarShirt,32,false);av.style.background='transparent';av.style.border='none';}
  if(isRegisteredUser){
    document.getElementById('ghost-btn').style.display='flex';
    document.getElementById('add-pin-btn').style.display='flex';
    document.getElementById('snap-btn').style.display='flex';
  }
  updateSnapBtnVis();
  setupRoller(document.getElementById('rainbow-bar'),document.getElementById('roller'),document.getElementById('band-labels'),(idx,prev)=>{updateBandUI(idx,prev);if(!prev){saveLocation(myLocation.lat,myLocation.lng);tuneIntoRoom()}},{cls:'band-lbl'});
  updateBandUI(selectedBand);
  requestAnimationFrame(()=>{
    const h=document.getElementById('freq-dock').offsetHeight;
    document.getElementById('panel-map').style.setProperty('--freq-dock-h',h+'px');
  });
  buildPinBandRow();
}  // end showUI

function updateSnapBtnVis(){
  document.getElementById('snap-btn').style.display=(isRegisteredUser&&!isGhostMode)?'flex':'none';
}

function toggleGhostMode(){
  isGhostMode=!isGhostMode;
  document.getElementById('ghost-btn').classList.toggle('ghost-active',isGhostMode);
  showToast(isGhostMode?'👻 Ghost mode on — appearing anonymous':'✓ Identity restored');
  updateSnapBtnVis();
}

function getEffName(){return(isGhostMode&&isRegisteredUser)?'Anonymous'+myUID.slice(-4):myUsername}
function getEffPfp(){return(isGhostMode&&isRegisteredUser)?'':myPfp}

function updateBandUI(idx,preview=false){
  selectedBand=idx;const b=BANDS[idx];
  document.getElementById('freq-current-name').textContent=b.label;
  document.getElementById('freq-current-hz').textContent=b.freq;
  document.getElementById('chat-room-title').textContent=`${b.label} · ${b.freq}`;
  document.getElementById('chat-room-sub').textContent=b.desc+' · Nearby only';
  document.getElementById('chat-band-dot').style.background=b.color;
  document.getElementById('tb-band-pill').textContent=b.label;
  updateMyCircle();
  if(!preview)drawHeatmap();
}

// ═══════════════════════════════════════
// CHAT OPEN / CLOSE  (click only, bottom-sheet on mobile)
// ═══════════════════════════════════════
function openChat(){
  chatOpen=true;
  unreadCount=0;
  document.getElementById('chat-unread-badge').style.display='none';
  document.body.classList.add('chat-open');
}
function closeChat(){
  chatOpen=false;
  document.body.classList.remove('chat-open');
}

// ═══════════════════════════════════════
// FIREBASE
// ═══════════════════════════════════════
function initFirebase(){firebase.initializeApp(FB);db=firebase.database();auth=firebase.auth()}

// ═══════════════════════════════════════
// LOCATION
// ═══════════════════════════════════════
function getLocation(){
  return new Promise((res,rej)=>{
    if(!navigator.geolocation){rej(new Error('no geo'));return}
    navigator.geolocation.getCurrentPosition(p=>{myLocation={lat:p.coords.latitude,lng:p.coords.longitude};res(myLocation)},rej,{enableHighAccuracy:true,timeout:15000});
  });
}
function initWatch(){
  navigator.geolocation.watchPosition(p=>{
    const lat=p.coords.latitude,lng=p.coords.longitude;
    if(!myLocation||dist(myLocation.lat,myLocation.lng,lat,lng)>5){
      myLocation={lat,lng};saveLocation(lat,lng);
      if(myMarker)myMarker.setLatLng([lat,lng]);
      updateMyCircle();updateNearbyCount();
    }
  },null,{enableHighAccuracy:true,maximumAge:10000});
}
function saveLocation(lat,lng){
  if(!myUID)return;
  const b=BANDS[selectedBand];
  db.ref('users/'+myUID).set({username:myUsername,color:b.color,band:b.id,bandIdx:selectedBand,lat,lng,online:true,lastSeen:Date.now(),pfp:myPfp,isAnonymous,avatarHead:myAvatarHead,avatarShirt:myAvatarShirt});
  if(myMarker&&map)myMarker.setIcon(makeMyMarkerIcon());
  db.ref('users/'+myUID).onDisconnect().update({online:false,lastSeen:Date.now()});
}
function dist(la1,ln1,la2,ln2){const R=6371000,dL=(la2-la1)*Math.PI/180,dN=(ln2-ln1)*Math.PI/180,a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dN/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))}
function isNearby(lat,lng){return myLocation&&dist(myLocation.lat,myLocation.lng,lat,lng)<=PROXIMITY_METERS}

// ═══════════════════════════════════════
// MAP
// ═══════════════════════════════════════
async function initMap(){
  const c=myLocation||{lat:4.1755,lng:73.5093};
  map=L.map('map',{center:[c.lat,c.lng],zoom:16,zoomControl:true,attributionControl:false});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19,subdomains:'abcd'}).addTo(map);
  placeMyMarker();saveLocation(c.lat,c.lng);tuneIntoRoom();
}
function makeMyMarkerIcon(){
  var hi=myAvatarHead||0, si=myAvatarShirt||0;
  var hc=HEAD_COLORS[hi]||HEAD_COLORS[0];
  var sc=SHIRT_COLORS[si]||SHIRT_COLORS[0];
  var W=54,H=115;
  var canvas=document.createElement('canvas');
  canvas.width=W;canvas.height=H;
  var ctx=canvas.getContext('2d');
  var sx=W/80,sy=H/170;
  ctx.save();ctx.scale(sx,sy);ctx.lineCap='round';
  function line(x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  ctx.strokeStyle='#222';ctx.lineWidth=4.5;
  line(20,65,6,92);line(60,65,74,92);
  line(30,102,26,148);line(26,148,16,148);
  line(50,102,54,148);line(54,148,64,148);
  ctx.fillStyle=sc.fill;ctx.strokeStyle=sc.stroke;ctx.lineWidth=2.5;
  ctx.beginPath();
  var r=5,x=20,y=54,w=40,h=48;
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=hc.fill;ctx.strokeStyle=hc.stroke;ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(40,30,22,0,Math.PI*2);ctx.fill();ctx.stroke();
  // yellow ring to distinguish self
  ctx.strokeStyle='#FFD600';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(40,30,25,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(33,34,3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(47,34,3,0,Math.PI*2);ctx.fill();
  ctx.restore();
  return L.divIcon({
    html:'<img src="'+canvas.toDataURL()+'" width="'+W+'" height="'+H+'" style="display:block">',
    className:'',iconSize:[W,H],iconAnchor:[W/2,H]
  });
}
function placeMyMarker(){
  if(!myLocation||!map)return;
  if(myMarker)myMarker.remove();
  myMarker=L.marker([myLocation.lat,myLocation.lng],{icon:makeMyMarkerIcon(),zIndexOffset:1000}).addTo(map);
  myMarker.on('click',openChat);updateMyCircle();map.panTo([myLocation.lat,myLocation.lng]);
}
function updateMyCircle(){
  if(myCircle){myCircle.remove();myCircle=null}
  if(!myLocation||!map)return;
  const b=BANDS[selectedBand];
  myCircle=L.circle([myLocation.lat,myLocation.lng],{radius:PROXIMITY_METERS,color:b.color,weight:2,opacity:.8,fillColor:b.color,fillOpacity:.12,dashArray:'6,4'}).addTo(map);
}

// ═══════════════════════════════════════
// HEATMAP — vibrant canvas
// ═══════════════════════════════════════
function ensureHeatCanvas(){
  if(heatCanvas)return;
  heatCanvas=document.createElement('canvas');
  // no blend mode — straight normal composite so colors show vivid on light map
  heatCanvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;';
  document.getElementById('map').appendChild(heatCanvas);
}

function drawHeatmap(){
  if(!map||!myLocation)return;
  ensureHeatCanvas();
  const mapEl=document.getElementById('map'),W=mapEl.offsetWidth,H=mapEl.offsetHeight;
  heatCanvas.width=W;heatCanvas.height=H;
  const ctx=heatCanvas.getContext('2d');
  ctx.clearRect(0,0,W,H);

  const users=Object.values(allUsersData).filter(u=>u.online&&u.lat);
  if(!users.length)return;

  // Grid cluster ~40m cells
  const cellDeg=0.0004;
  const clusters={};
  users.forEach(u=>{
    const cx=Math.round(u.lat/cellDeg),cy=Math.round(u.lng/cellDeg);
    const key=`${cx},${cy}`;
    if(!clusters[key])clusters[key]={lat:u.lat,lng:u.lng,count:0};
    clusters[key].count++;
  });

  // Count-based colour tiers — bold visible colors
  // 1-10  → sky blue
  // 11-20 → deep blue
  // 21-35 → teal
  // 36-50 → orange
  // 50+   → red
  function tierColor(count){
    if(count<=10) return {r:30, g:144,b:255};  // dodger blue
    if(count<=20) return {r:0,  g:60, b:200};  // deep blue
    if(count<=35) return {r:0,  g:200,b:160};  // teal
    if(count<=50) return {r:255,g:120,b:0};    // orange
    return              {r:220,g:20, b:40};     // crimson
  }

  // Pass 1 — large soft glow, high opacity
  Object.values(clusters).forEach(cl=>{
    const pt=map.latLngToContainerPoint([cl.lat,cl.lng]);
    const tc=tierColor(cl.count);
    const r=Math.min(50+cl.count*2.2, 150);
    const coreAlpha=Math.min(0.65+cl.count*0.005, 0.88);
    const edgeAlpha=Math.min(0.30+cl.count*0.003, 0.55);
    const g=ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,r);
    g.addColorStop(0,   `rgba(${tc.r},${tc.g},${tc.b},${coreAlpha.toFixed(2)})`);
    g.addColorStop(0.4, `rgba(${tc.r},${tc.g},${tc.b},${edgeAlpha.toFixed(2)})`);
    g.addColorStop(1,   `rgba(${tc.r},${tc.g},${tc.b},0)`);
    ctx.beginPath();ctx.arc(pt.x,pt.y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
  });

  // Pass 2 — bright solid core dot (visible even for single user)
  Object.values(clusters).forEach(cl=>{
    const pt=map.latLngToContainerPoint([cl.lat,cl.lng]);
    const tc=tierColor(cl.count);
    const r2=Math.min(6+cl.count*0.8, 32);
    const g2=ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,r2);
    g2.addColorStop(0,  `rgba(${tc.r},${tc.g},${tc.b},0.95)`);
    g2.addColorStop(0.5,`rgba(${tc.r},${tc.g},${tc.b},0.7)`);
    g2.addColorStop(1,  `rgba(${tc.r},${tc.g},${tc.b},0)`);
    ctx.beginPath();ctx.arc(pt.x,pt.y,r2,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
  });
}

function makeAvatarMarkerIcon(u){
  var hi=parseInt(u.avatarHead)||0;
  var si=parseInt(u.avatarShirt)||0;
  var hc=HEAD_COLORS[hi]||HEAD_COLORS[0];
  var sc=SHIRT_COLORS[si]||SHIRT_COLORS[0];
  // Draw avatar directly onto a canvas — 100% reliable in Leaflet
  var W=54, H=115;
  var canvas=document.createElement('canvas');
  canvas.width=W; canvas.height=H;
  var ctx=canvas.getContext('2d');
  // Scale: viewBox 80x170 -> W x H
  var sx=W/80, sy=H/170;
  ctx.save();ctx.scale(sx,sy);
  ctx.lineCap='round';
  // ── arms & legs ──
  ctx.strokeStyle='#222'; ctx.lineWidth=4.5; ctx.fillStyle='none';
  function line(x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  line(20,65,6,92);   // left arm
  line(60,65,74,92);  // right arm
  line(30,102,26,148);// left leg
  line(26,148,16,148);// left foot
  line(50,102,54,148);// right leg
  line(54,148,64,148);// right foot
  // ── shirt ──
  ctx.fillStyle=sc.fill; ctx.strokeStyle=sc.stroke; ctx.lineWidth=2.5;
  ctx.beginPath();
  var r=5,x=20,y=54,w=40,h=48;
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();ctx.fill();ctx.stroke();
  // ── head ──
  ctx.fillStyle=hc.fill; ctx.strokeStyle=hc.stroke; ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(40,30,22,0,Math.PI*2);ctx.fill();ctx.stroke();
  // eyes
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(33,34,3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(47,34,3,0,Math.PI*2);ctx.fill();
  ctx.restore();
  var dataURL=canvas.toDataURL();
  return L.divIcon({
    html:'<img src="'+dataURL+'" width="'+W+'" height="'+H+'" style="display:block">',
    className:'',
    iconSize:[W,H],
    iconAnchor:[W/2,H]
  });
}

let userMarkers={};

function listenAllUsers(){
  db.ref('users').on('value',snap=>{
    allUsersData=snap.val()||{};
    // Update/create markers for other users
    const online=Object.entries(allUsersData).filter(([id,u])=>id!==myUID&&u.online&&u.lat);
    const onlineIds=online.map(([id])=>id);
    // Remove stale
    Object.keys(userMarkers).forEach(id=>{
      if(!onlineIds.includes(id)){userMarkers[id].remove();delete userMarkers[id];}
    });
    // Add/update
    online.forEach(([id,u])=>{
      if(userMarkers[id]){
        userMarkers[id].setLatLng([u.lat,u.lng]);
        userMarkers[id].setIcon(makeAvatarMarkerIcon(u));
      } else {
        const m=L.marker([u.lat,u.lng],{icon:makeAvatarMarkerIcon(u),zIndexOffset:500}).addTo(map);
        // No tooltip with name — just the avatar
        userMarkers[id]=m;
      }
    });
    drawHeatmap();
    updateNearbyCount();
  });
  map.on('move zoom moveend zoomend',drawHeatmap);
}

function updateNearbyCount(){
  if(!myLocation)return;
  const b=BANDS[selectedBand];
  let count=0;
  Object.entries(allUsersData).forEach(([id,u])=>{
    if(id===myUID||!u.online||!u.lat||u.band!==b.id)return;
    if(isNearby(u.lat,u.lng))count++;
  });
  document.getElementById('ch-online-num').textContent=count;
}

// ═══════════════════════════════════════
// ROOMS & MESSAGES
// ═══════════════════════════════════════
function tuneIntoRoom(){const b=BANDS[selectedBand];joinRoom('band_'+b.id)}
function joinRoom(roomId){
  if(currentRoomId===roomId)return;
  Object.values(activeRoomListeners).forEach(off=>off());activeRoomListeners={};
  if(currentRoomId)db.ref(`rooms/${currentRoomId}/members/${myUID}`).remove();
  currentRoomId=roomId;
  const b=BANDS[selectedBand];
  db.ref(`rooms/${roomId}/members/${myUID}`).set({username:myUsername,color:b.color,band:b.id,lat:myLocation?.lat||0,lng:myLocation?.lng||0});
  db.ref(`rooms/${roomId}/members/${myUID}`).onDisconnect().remove();
  db.ref(`rooms/${roomId}/messages`).push({type:'system',text:`${myUsername} tuned into ${b.label} · ${b.freq}`,ts:Date.now(),lat:myLocation?.lat||0,lng:myLocation?.lng||0});
  listenMessages(roomId);listenTyping(roomId);listenMemberCount(roomId);updateNearbyCount();
}

function shouldShowMsg(msg){
  if(msg.type==='system')return true;
  if(msg.uid===myUID)return true;
  if(msg.lat!==undefined&&msg.lng!==undefined)return isNearby(msg.lat,msg.lng);
  return false;
}

function listenMessages(roomId){
  document.getElementById('messages-area').innerHTML='';
  const ref=db.ref(`rooms/${roomId}/messages`).orderByChild('ts').limitToLast(200);
  let first=true;
  ref.on('value',snap=>{if(!first)return;first=false;snap.forEach(c=>{if(shouldShowMsg(c.val()))renderMsg(c.val())});scrollMsgs()});
  ref.on('child_added',snap=>{
    if(first)return;
    const msg=snap.val();if(!shouldShowMsg(msg))return;
    renderMsg(msg);scrollMsgs();
    if(!chatOpen){
      unreadCount++;
      const badge=document.getElementById('chat-unread-badge');
      badge.textContent=unreadCount>9?'9+':unreadCount;
      badge.style.display='flex';
    }
  });
  activeRoomListeners['msgs']=()=>ref.off();
}

function renderMsg(msg){
  const area=document.getElementById('messages-area');
  const div=document.createElement('div');
  if(msg.type==='system'){div.className='msg-system';div.textContent=msg.text;area.appendChild(div);return}
  if(msg.type==='snap'){renderSnapMsg(msg,div,area);return}
  const isMe=msg.uid===myUID;
  div.className='msg '+(isMe?'mine':'theirs');
  if(!isMe){
    const meta=document.createElement('div');meta.className='msg-meta';
    const av=document.createElement('div');av.className='msg-avatar';
    if(msg.pfp){av.innerHTML=`<img src="${msg.pfp}" alt="">`}else{av.textContent=(msg.username||'?')[0].toUpperCase()}
    meta.appendChild(av);
    const nm=document.createElement('span');nm.className='msg-name';nm.textContent=msg.username;
    const tm=document.createElement('span');tm.className='msg-time';tm.textContent=fmtTime(msg.ts);
    meta.appendChild(nm);meta.appendChild(tm);div.appendChild(meta);
  }
  const bubble=document.createElement('div');bubble.className='msg-bubble';bubble.textContent=msg.text;
  div.appendChild(bubble);area.appendChild(div);
}

function renderSnapMsg(msg,div,area){
  const isMe=msg.uid===myUID;
  div.className='msg '+(isMe?'mine':'theirs');
  if(!isMe){
    const meta=document.createElement('div');meta.className='msg-meta';
    const av=document.createElement('div');av.className='msg-avatar';
    if(msg.pfp){av.innerHTML=`<img src="${msg.pfp}" alt="">`}else{av.textContent=(msg.username||'?')[0].toUpperCase()}
    meta.appendChild(av);
    const nm=document.createElement('span');nm.className='msg-name';nm.textContent=msg.username;
    const tm=document.createElement('span');tm.className='msg-time';tm.textContent=fmtTime(msg.ts);
    meta.appendChild(nm);meta.appendChild(tm);div.appendChild(meta);
  }
  const snapEl=document.createElement('div');
  if(isMe){
    snapEl.className='snap-bubble snap-locked';snapEl.style.cssText='background:rgba(255,214,0,.12);border-color:rgba(255,214,0,.3)';
    snapEl.innerHTML=`<span class="material-icons-round" style="color:var(--accent)">photo_camera</span><span>Snap sent</span>`;
  } else {
    const oKey=`snap_opened_${msg.snapId}_${myUID}`,opened=localStorage.getItem(oKey);
    if(opened){
      snapEl.className='snap-bubble';snapEl.innerHTML=`<div class="snap-opened-label"><span class="material-icons-round" style="font-size:14px">done</span>Snap opened</div>`;
    } else {
      snapEl.className='snap-bubble snap-locked';
      snapEl.innerHTML=`<span class="material-icons-round">photo_camera</span><span>Tap to open (1×)</span>`;
      snapEl.onclick=()=>openSnap(msg,snapEl,oKey);
    }
  }
  div.appendChild(snapEl);area.appendChild(div);
}

function openSnap(msg,el,oKey){
  el.className='snap-bubble snap-open';el.innerHTML=`<img src="${msg.snapUrl}" alt="snap">`;
  localStorage.setItem(oKey,'1');
  if(msg.snapId)db.ref(`snaps/${msg.snapId}/openedBy/${myUID}`).set(Date.now());
  setTimeout(()=>{el.className='snap-bubble';el.innerHTML=`<div class="snap-opened-label"><span class="material-icons-round" style="font-size:14px">done</span>Snap expired</div>`;el.onclick=null},10000);
  el.onclick=()=>{el.className='snap-bubble';el.innerHTML=`<div class="snap-opened-label"><span class="material-icons-round" style="font-size:14px">done</span>Snap closed</div>`;el.onclick=null};
}

function scrollMsgs(){const a=document.getElementById('messages-area');a.scrollTop=a.scrollHeight}
function fmtTime(ts){return new Date(ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
function sendMessage(){
  const inp=document.getElementById('msg-input');const text=inp.value.trim();
  if(!text||!currentRoomId||!myLocation)return;
  db.ref(`rooms/${currentRoomId}/messages`).push({uid:myUID,username:getEffName(),color:BANDS[selectedBand].color,text,ts:Date.now(),pfp:getEffPfp(),isAnonymous,lat:myLocation.lat,lng:myLocation.lng});
  inp.value='';autoResize(inp);clearTyping();
}
// msg input listener moved to boot()

// ═══════════════════════════════════════
// TYPING
// ═══════════════════════════════════════
function listenTyping(roomId){
  const ref=db.ref(`rooms/${roomId}/typing`);
  ref.on('value',snap=>{
    const t=snap.val()||{},names=Object.entries(t).filter(([id,v])=>id!==myUID&&v&&Date.now()-v.ts<4000).map(([,v])=>v.name);
    const row=document.getElementById('typing-row');
    if(names.length){row.style.display='block';document.getElementById('typing-label').textContent=names.join(', ')+(names.length===1?' is':' are')+' transmitting…'}else row.style.display='none';
  });
  activeRoomListeners['typing']=()=>ref.off();
}
function handleTyping(){if(!currentRoomId||!myUID)return;db.ref(`rooms/${currentRoomId}/typing/${myUID}`).set({name:getEffName(),ts:Date.now()});clearTimeout(typingTimeout);typingTimeout=setTimeout(clearTyping,3000)}
function clearTyping(){if(!currentRoomId||!myUID)return;db.ref(`rooms/${currentRoomId}/typing/${myUID}`).remove()}
function listenMemberCount(roomId){
  const ref=db.ref(`rooms/${roomId}/members`);
  ref.on('value',snap=>{if(!myLocation)return;let c=0;snap.forEach(s=>{const m=s.val();if(s.key===myUID)return;if(m.lat!==undefined&&isNearby(m.lat,m.lng))c++});document.getElementById('ch-online-num').textContent=c});
  activeRoomListeners['members']=()=>ref.off();
}

// ═══════════════════════════════════════
// CAMERA
// ═══════════════════════════════════════
async function openCamera(){
  if(!isRegisteredUser||isGhostMode){showToast('Sign in to send snaps');return}
  const modal=document.getElementById('camera-modal');modal.classList.add('open');
  document.getElementById('cam-preview-wrap').classList.remove('show');
  document.getElementById('camera-video').style.display='block';document.getElementById('cam-shoot').style.display='flex';
  try{cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});document.getElementById('camera-video').srcObject=cameraStream}
  catch(e){try{cameraStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});document.getElementById('camera-video').srcObject=cameraStream}catch(e2){closeCamera();showToast('Camera unavailable')}}
}
function closeCamera(){if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null}document.getElementById('camera-modal').classList.remove('open');capturedBlob=null}
function shootPhoto(){
  const video=document.getElementById('camera-video'),canvas=document.getElementById('camera-canvas');
  canvas.width=video.videoWidth||640;canvas.height=video.videoHeight||480;
  canvas.getContext('2d').drawImage(video,0,0);
  canvas.toBlob(blob=>{capturedBlob=blob;document.getElementById('cam-preview-img').src=URL.createObjectURL(blob);document.getElementById('cam-preview-wrap').classList.add('show');document.getElementById('camera-video').style.display='none';document.getElementById('cam-shoot').style.display='none'},'image/jpeg',.88);
}
function retakePhoto(){capturedBlob=null;document.getElementById('cam-preview-wrap').classList.remove('show');document.getElementById('camera-video').style.display='block';document.getElementById('cam-shoot').style.display='flex'}
async function sendSnap(){
  if(!capturedBlob||!currentRoomId||!myLocation)return;
  const btn=document.getElementById('cam-send');btn.disabled=true;btn.innerHTML='<span class="material-icons-round" style="animation:spin .8s linear infinite">refresh</span>Uploading…';
  try{
    const snapId='snap_'+Date.now()+'_'+myUID.slice(0,6);
    const url=await uploadToS3(capturedBlob,`snaps/${snapId}.jpg`,'image/jpeg');
    db.ref(`rooms/${currentRoomId}/messages`).push({type:'snap',uid:myUID,username:getEffName(),pfp:getEffPfp(),snapId,snapUrl:url,ts:Date.now(),lat:myLocation.lat,lng:myLocation.lng});
    db.ref(`snaps/${snapId}`).set({url,sentBy:myUID,ts:Date.now()});
    closeCamera();showToast('📸 Snap sent');
  }catch(e){showToast('Upload failed');btn.disabled=false;btn.innerHTML='<span class="material-icons-round">send</span>Send Snap'}
}

// ═══════════════════════════════════════
// EVENT PINS
// ═══════════════════════════════════════
function buildPinBandRow(){
  const row=document.getElementById('pin-band-row');row.innerHTML='';
  BANDS.forEach(b=>{
    const tag=document.createElement('div');tag.className='pin-band-tag';tag.textContent=b.label;tag.dataset.band=b.id;
    tag.style.borderColor=selectedPinBands.has(b.id)?b.color:'';
    tag.classList.toggle('selected',selectedPinBands.has(b.id));
    if(selectedPinBands.has(b.id)){tag.style.color=b.color;tag.style.background=`${b.color}18`}
    tag.onclick=()=>{
      if(selectedPinBands.has(b.id)){selectedPinBands.delete(b.id);tag.classList.remove('selected');tag.style.borderColor='';tag.style.color='';tag.style.background=''}
      else{selectedPinBands.add(b.id);tag.classList.add('selected');tag.style.borderColor=b.color;tag.style.color=b.color;tag.style.background=`${b.color}18`}
    };
    row.appendChild(tag);
  });
}

function selectPinType(el){
  // Works for both old grid (.pin-type-opt) and new row (.pt-btn)
  document.querySelectorAll('.pt-btn').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  selectedPinType=el.dataset.type;
  const lbl=document.getElementById('pin-type-label');
  if(lbl)lbl.textContent=PIN_TYPES[selectedPinType]?.label||selectedPinType;
}

// ── PIN PLACEMENT STATE ──
let pinPlacingMode=false,pinCursorEmoji='📍';

function openPinModal(existingPin=null,pinId=null){
  editingPinId=pinId;
  if(existingPin){
    // Editing: go straight to form with existing data
    pendingPinLat=existingPin.lat;pendingPinLng=existingPin.lng;
    fillPinForm(existingPin);
    showPinForm();
  } else {
    // New pin: enter placement mode first
    enterPinPlacingMode();
  }
}

function enterPinPlacingMode(){
  pinPlacingMode=true;
  pendingPinLat=null;pendingPinLng=null;
  // Show overlay
  document.getElementById('pin-place-overlay').classList.add('active');
  document.getElementById('pin-confirm-btn').classList.remove('visible');
  // Animate cursor pin appearing at center of map
  const cursor=document.getElementById('map-pin-cursor');
  cursor.style.display='block';
  cursor.classList.remove('drop-anim','bounce-anim','dragging');
  cursor.classList.add('placing');
  const mapEl=document.getElementById('map');
  const rect=mapEl.getBoundingClientRect();
  moveCursor(rect.left+rect.width/2, rect.top+rect.height/2);
  // Crosshair cursor on map
  mapEl.classList.add('pin-placing');
  // Tap/click to place
  map.once('click',onMapClickPlace);
}

function moveCursor(x,y){
  const cursor=document.getElementById('map-pin-cursor');
  cursor.style.left=x+'px';
  cursor.style.top=y+'px';
}

function onMapClickPlace(e){
  if(!pinPlacingMode)return;
  const pt=map.latLngToContainerPoint(e.latlng);
  const mapRect=document.getElementById('map').getBoundingClientRect();
  const screenX=mapRect.left+pt.x, screenY=mapRect.top+pt.y;
  dropPinAtPoint(e.latlng.lat,e.latlng.lng,screenX,screenY);
}

function dropPinAtPoint(lat,lng,screenX,screenY){
  pendingPinLat=lat;pendingPinLng=lng;
  const cursor=document.getElementById('map-pin-cursor');
  const shadow=document.getElementById('pin-drop-shadow');
  // Position cursor above drop point for animation
  cursor.style.left=screenX+'px';
  cursor.style.top=(screenY-40)+'px';
  cursor.classList.remove('bounce-anim','dragging');
  cursor.classList.add('drop-anim');
  // Shadow ripple at landing point
  shadow.style.display='block';
  shadow.style.left=screenX+'px';
  shadow.style.top=screenY+'px';
  shadow.classList.remove('pulse');
  void shadow.offsetWidth; // reflow
  shadow.classList.add('pulse');
  // After drop anim: bounce + show confirm button
  setTimeout(()=>{
    cursor.classList.remove('drop-anim','dragging');
    cursor.classList.add('bounce-anim');
    cursor.style.top=screenY+'px';
    setTimeout(()=>cursor.classList.remove('bounce-anim'),300);
    // Place actual draggable marker
    placeDraggablePin(lat,lng);
    document.getElementById('pin-confirm-btn').classList.add('visible');
    // Update banner sub text
    document.getElementById('pin-place-banner-sub').textContent='Drag pin to adjust · Tap map to reposition';
    // Re-listen for repositioning taps
    map.on('click',onMapReplace);
  },500);
}

function onMapReplace(e){
  if(!pinPlacingMode)return;
  // Remove old and re-drop
  if(draggablePinMarker){draggablePinMarker.remove();draggablePinMarker=null}
  document.getElementById('pin-confirm-btn').classList.remove('visible');
  const pt=map.latLngToContainerPoint(e.latlng);
  const mapRect=document.getElementById('map').getBoundingClientRect();
  const sx=mapRect.left+pt.x,sy=mapRect.top+pt.y;
  dropPinAtPoint(e.latlng.lat,e.latlng.lng,sx,sy);
}

function placeDraggablePin(lat,lng){
  if(draggablePinMarker){draggablePinMarker.remove();draggablePinMarker=null}
  const emoji=document.getElementById('pin-emoji')?.value||'📍';
  draggablePinMarker=L.marker([lat,lng],{
    icon:makePinIcon('new',emoji),
    draggable:true,
    zIndexOffset:2000
  }).addTo(map);
  // Drag animations
  draggablePinMarker.on('dragstart',()=>{
    document.getElementById('map-pin-cursor').classList.add('dragging');
  });
  draggablePinMarker.on('drag',e=>{
    const pt=map.latLngToContainerPoint(e.target.getLatLng());
    const r=document.getElementById('map').getBoundingClientRect();
    moveCursor(r.left+pt.x,r.top+pt.y);
    document.getElementById('pin-drop-shadow').style.left=(r.left+pt.x)+'px';
    document.getElementById('pin-drop-shadow').style.top=(r.top+pt.y)+'px';
  });
  draggablePinMarker.on('dragend',e=>{
    const p=e.target.getLatLng();
    pendingPinLat=p.lat;pendingPinLng=p.lng;
    document.getElementById('map-pin-cursor').classList.remove('dragging');
    // bounce
    document.getElementById('map-pin-cursor').classList.add('bounce-anim');
    setTimeout(()=>document.getElementById('map-pin-cursor').classList.remove('bounce-anim'),280);
  });
}

function cancelPinPlacement(){
  pinPlacingMode=false;
  map.off('click',onMapClickPlace);
  map.off('click',onMapReplace);
  document.getElementById('pin-place-overlay').classList.remove('active');
  const cursor=document.getElementById('map-pin-cursor');
  cursor.classList.remove('placing','drop-anim','bounce-anim','dragging');
  cursor.style.display='none';
  document.getElementById('pin-drop-shadow').style.display='none';
  document.getElementById('map').classList.remove('pin-placing');
  if(draggablePinMarker){draggablePinMarker.remove();draggablePinMarker=null}
  pendingPinLat=null;pendingPinLng=null;
}

function confirmPinLocation(){
  if(pendingPinLat===null){showToast('Tap the map first to place the pin');return;}
  pinPlacingMode=false;
  // Remove ALL click listeners from map (both placement + reposition)
  map.off('click',onMapClickPlace);
  map.off('click',onMapReplace);
  // Hide placement UI
  document.getElementById('pin-place-overlay').classList.remove('active');
  const cursor=document.getElementById('map-pin-cursor');
  cursor.classList.remove('placing','drop-anim','bounce-anim','dragging');
  cursor.style.display='none';
  document.getElementById('pin-drop-shadow').style.display='none';
  document.getElementById('map').classList.remove('pin-placing');
  // Keep the draggable marker visible so user can see chosen location
  // Show the form
  fillPinForm(null);
  showPinForm();
}

function fillPinForm(existingPin){
  const safe=(id,val)=>{const el=document.getElementById(id);if(el)el.value=val;};
  safe('pin-name', existingPin?.name||'');
  safe('pin-desc', existingPin?.desc||'');
  safe('pin-location-note', existingPin?.locationNote||'');
  safe('pin-datetime', existingPin?.datetime||'');
  safe('pin-endtime', existingPin?.endtime||'');
  selectedPinType=existingPin?.type||'gathering';
  document.querySelectorAll('.pt-btn').forEach(e=>e.classList.toggle('selected',e.dataset.type===selectedPinType));
  const lbl=document.getElementById('pin-type-label');
  if(lbl)lbl.textContent=PIN_TYPES[selectedPinType]?.label||selectedPinType;
  selectedPinBands=new Set(existingPin?.bands||[BANDS[selectedBand].id]);
  buildPinBandRow();
  const title=document.getElementById('pin-sheet-title');
  if(title)title.textContent=existingPin?'Edit Pin':'New Event';
  const btn=document.getElementById('pin-submit-btn');
  if(btn)btn.innerHTML='<span class="material-icons-round">check_circle</span>'+(existingPin?'SAVE':'CONFIRM');
}

function showPinForm(){
  const modal=document.getElementById('pin-modal');
  // Add 'open' which sets display:flex via CSS
  modal.classList.add('open');
}

function closePinModal(){
  forceClearPinModal();
}
document.getElementById('pin-modal').addEventListener('click',e=>{if(e.target===document.getElementById('pin-modal'))closePinModal()});

async function submitPin(){
  const name=document.getElementById('pin-name').value.trim();
  const nameEl=document.getElementById('pin-name');
  if(!name){
    nameEl.style.borderColor='#ff453a';
    nameEl.focus();
    setTimeout(()=>nameEl.style.borderColor='',1200);
    return;
  }
  const lat=pendingPinLat!==null?pendingPinLat:(myLocation?.lat);
  const lng=pendingPinLng!==null?pendingPinLng:(myLocation?.lng);
  if(lat==null){showToast('No location set — drop a pin on the map first');return;}
  const btn=document.getElementById('pin-submit-btn');
  btn.disabled=true;
  btn.innerHTML='<span class="material-icons-round" style="animation:spin .7s linear infinite;display:inline-block">refresh</span> Saving…';
  const pinData={
    name,
    desc:document.getElementById('pin-desc').value.trim(),
    locationNote:document.getElementById('pin-location-note').value.trim(),
    type:selectedPinType,
    emoji:PIN_TYPES[selectedPinType]?.icon||'star',
    bands:Array.from(selectedPinBands),
    datetime:document.getElementById('pin-datetime').value,
    endtime:document.getElementById('pin-endtime').value,
    lat,lng,
    createdBy:myUID,createdByName:myUsername,
    pfp:myPfp,
    createdAt:Date.now(),updatedAt:Date.now(),
  };
  try{
    if(editingPinId){
      await db.ref('pins/'+editingPinId).update({...pinData,createdAt:undefined});
      showToast('📍 Pin updated');
    } else {
      await db.ref('pins').push(pinData);
      showToast('📍 Pin dropped!');
    }
    // Fully close and reset everything
    forceClearPinModal();
  } catch(e){
    showToast('Failed to save — check connection');
    btn.disabled=false;
    btn.innerHTML='<span class="material-icons-round">push_pin</span><span id="pin-submit-lbl">Drop Pin</span>';
  }
}

function forceClearPinModal(){
  const modal=document.getElementById('pin-modal');
  modal.classList.remove('open');
  editingPinId=null;
  pinPlacingMode=false;
  pendingPinLat=null;pendingPinLng=null;
  if(map){map.off('click',onMapClickPlace);map.off('click',onMapReplace);}
  if(draggablePinMarker){draggablePinMarker.remove();draggablePinMarker=null;}
  const cursor=document.getElementById('map-pin-cursor');
  if(cursor){cursor.style.display='none';cursor.classList.remove('placing','drop-anim','bounce-anim','dragging');}
  const shadow=document.getElementById('pin-drop-shadow');
  if(shadow)shadow.style.display='none';
  const overlay=document.getElementById('pin-place-overlay');
  if(overlay)overlay.classList.remove('active');
  const mapEl=document.getElementById('map');
  if(mapEl)mapEl.classList.remove('pin-placing');
  const btn=document.getElementById('pin-submit-btn');
  if(btn){btn.disabled=false;btn.innerHTML='<span class="material-icons-round">check_circle</span> CONFIRM';}
}

// ── PIN MARKERS on map ── always red pin, emoji on face ──
function makePinIcon(pt,iconName){
  // iconName is a material icon string e.g. 'groups', 'celebration'
  if(!iconName||iconName==='📍')iconName=PIN_TYPES[pt]?.icon||'push_pin';
  // Realistic red pin SVG
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="46" height="58" viewBox="0 0 46 58">
    <defs>
      <radialGradient id="pg" cx="38%" cy="28%" r="65%">
        <stop offset="0%" stop-color="#ff6b6b"/>
        <stop offset="100%" stop-color="#c0000a"/>
      </radialGradient>
      <filter id="ps2" x="-30%" y="-10%" width="180%" height="160%">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="rgba(0,0,0,.5)"/>
      </filter>
    </defs>
    <path d="M23 1C13.06 1 5 9.06 5 19c0 13.5 18 37 18 37s18-23.5 18-37C41 9.06 32.94 1 23 1z" fill="url(#pg)" filter="url(#ps2)"/>
    <circle cx="23" cy="19" r="9.5" fill="rgba(0,0,0,.22)"/>
    <circle cx="23" cy="19" r="8" fill="rgba(255,255,255,.9)"/>
    <ellipse cx="18" cy="14" rx="3" ry="2" fill="rgba(255,255,255,.45)" transform="rotate(-25,18,14)"/>
  </svg>`;
  const html=`<div style="position:relative;width:46px;height:58px">
    ${svg}
    <span class="material-icons-round" style="position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:14px;line-height:1;color:#c0000a">${iconName}</span>
  </div>`;
  return L.divIcon({html,className:'',iconSize:[46,58],iconAnchor:[23,54],popupAnchor:[0,-54]});
}

function fmtDateTime(dt){if(!dt)return null;try{return new Date(dt).toLocaleString([],{weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return dt}}

function buildPinPopup(pin,pinId){
  const pt=PIN_TYPES[pin.type]||PIN_TYPES.other;
  const bands=(pin.bands||[]).map(bid=>{const b=BANDS.find(x=>x.id===bid);return b?`<span class="ppb" style="background:${b.color}22;color:${b.color};border:1px solid ${b.color}44">${b.label}</span>`:''}).join('');
  const dtStr=fmtDateTime(pin.datetime);
  const edtStr=fmtDateTime(pin.endtime);
  const isOwner=pin.createdBy===myUID;
  const locationNote=pin.locationNote?`<div class="pin-popup-row"><span class="material-icons-round">place</span>${pin.locationNote}</div>`:'';
  return `<div class="pin-popup">
    <div class="pin-popup-type">${pt.label}</div>
    <div class="pin-popup-title">${pin.name}</div>
    ${pin.desc?`<div class="pin-popup-desc">${pin.desc}</div>`:''}
    <div class="pin-popup-meta">
      ${dtStr?`<div class="pin-popup-row"><span class="material-icons-round">schedule</span>${dtStr}${edtStr?` → ${edtStr}`:''}</div>`:''}
      ${locationNote}
      ${bands?`<div style="margin-top:4px">${bands}</div>`:''}
    </div>
    <div class="pin-popup-author"><span class="material-icons-round">person</span>Posted by ${pin.createdByName||'Unknown'}</div>
    ${isOwner?`<div style="display:flex;gap:6px;margin-top:8px">
      <button class="pin-popup-edit" style="flex:1" onclick="openPinModal(window._pinData['${pinId}'],'${pinId}');if(window._popupRef)window._popupRef.remove()"><span class='material-icons-round' style='font-size:14px;vertical-align:middle'>edit</span> Edit</button>
      <button class="pin-popup-delete" onclick="deletePin('${pinId}')"><span class='material-icons-round' style='font-size:14px;vertical-align:middle'>delete</span> Delete</button>
    </div>`:''}
  </div>`;
}

async function deletePin(pinId){
  // Extra ownership check — must be the creator
  const snap=await db.ref('pins/'+pinId+'/createdBy').once('value');
  if(snap.val()!==myUID){showToast('You can only delete your own pins');return;}
  if(!confirm('Remove this pin?'))return;
  await db.ref('pins/'+pinId).remove();
  if(pinMarkers[pinId]){pinMarkers[pinId].remove();delete pinMarkers[pinId]}
  showToast('Pin removed');
}

function listenPins(){
  db.ref('pins').on('value',snap=>{
    // Remove old markers
    Object.values(pinMarkers).forEach(m=>m.remove());
    for(const k in pinMarkers)delete pinMarkers[k];
    window._pinData={};
    const pins=snap.val()||{};
    Object.entries(pins).forEach(([pid,pin])=>{
      window._pinData[pid]=pin;
      const m=L.marker([pin.lat,pin.lng],{icon:makePinIcon(pin.type,pin.emoji||PIN_TYPES[pin.type]?.icon||'push_pin'),zIndexOffset:800}).addTo(map);
      const popupHtml=buildPinPopup(pin,pid);
      m.bindPopup(popupHtml,{maxWidth:260,minWidth:220,className:''});
      m.on('popupopen',()=>{window._popupRef=m});
      pinMarkers[pid]=m;
    });
  });
}

// ═══════════════════════════════════════
// TOAST & HELPERS
// ═══════════════════════════════════════
function showToast(html,dur=3500){
  const stack=document.getElementById('nearby-toast');
  const el=document.createElement('div');el.className='toast-item';el.innerHTML=html;stack.appendChild(el);
  setTimeout(()=>{el.style.cssText+='opacity:0;transform:translateY(-5px);transition:all .3s';setTimeout(()=>el.remove(),300)},dur);
}
function autoResize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,100)+'px'}

// ── PWA ──
(function(){const m={name:'Walkie-Chatie',short_name:'W-C',start_url:'/',display:'standalone',background_color:'#000',theme_color:'#000',icons:[{src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23000"/></svg>',sizes:'192x192',type:'image/svg+xml'}]};const blob=new Blob([JSON.stringify(m)],{type:'application/manifest+json'});document.getElementById('manifest-link').href=URL.createObjectURL(blob)})();

// ── PIN CURSOR FOLLOW MOUSE ──
document.addEventListener('mousemove',e=>{
  if(!pinPlacingMode)return;
  const cursor=document.getElementById('map-pin-cursor');
  if(!cursor.classList.contains('placing'))return;
  // only follow if inside map area
  const mapRect=document.getElementById('map')?.getBoundingClientRect();
  if(!mapRect)return;
  if(e.clientX>=mapRect.left&&e.clientX<=mapRect.right&&e.clientY>=mapRect.top&&e.clientY<=mapRect.bottom){
    cursor.style.left=e.clientX+'px';
    cursor.style.top=e.clientY+'px';
  }
});

// ── BOOT ──
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',boot);
} else {
  boot();
}
function boot(){
  initFirebase();
  initOnboarding();
  setTimeout(()=>{const l=document.getElementById('loading');if(l)l.classList.add('hidden');},700);
  // msg input enter key
  const inp=document.getElementById('msg-input');
  if(inp)inp.addEventListener('keypress',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
}
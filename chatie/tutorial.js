(function(){

if(window.innerWidth>=769)return;

function getCookie(n){var m=document.cookie.match('(?:^|; )'+n+'=([^;]*)');return m?decodeURIComponent(m[1]):null;}
function setCookie(n,v,days){var d=new Date();d.setTime(d.getTime()+days*864e5);document.cookie=n+'='+encodeURIComponent(v)+';expires='+d.toUTCString()+';path=/';}
function tutorialSeen(){
  try{if(localStorage.getItem('wc_tutorial_seen')==='1')return true;}catch(e){}
  return getCookie('wc_tutorial_done')==='1'; // legacy fallback for browsers that already finished it pre-update
}
function markTutorialSeen(){
  try{localStorage.setItem('wc_tutorial_seen','1');}catch(e){setCookie('wc_tutorial_done','1',365);}
}
if(tutorialSeen())return;

/* ── GSAP ── */
function loadGSAP(cb){
  if(window.gsap){cb();return;}
  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  s.onload=cb;document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════ */
var st=document.createElement('style');
st.textContent=`
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

/* ─── PHASE A: intro modal ─── */
#tut-intro-root{
  position:fixed;inset:0;z-index:9999;
  font-family:'Montserrat',sans-serif;
  pointer-events:none;
  opacity:0;
}
#tut-intro-root.tut-visible{
  pointer-events:auto;
  opacity:1;
}
#tut-intro-backdrop{
  position:absolute;inset:0;
  background:rgba(0,0,0,.65);
  backdrop-filter:blur(5px);
}
#tut-intro-modal{
  position:absolute;
  left:50%;top:45%;transform:translate(-50%,-50%);
  width:min(92vw,460px);
  max-height:85vh;
  background:#0d0d0d;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 30px 90px rgba(0,0,0,.9);
  overflow-y:auto;overflow-x:hidden;
  scrollbar-width:none;opacity:0;
}
#tut-intro-modal::-webkit-scrollbar{display:none}

#tut-intro-close{
  position:sticky;top:0;z-index:10;
  display:flex;justify-content:flex-end;
  padding:16px 18px 0;
  background:linear-gradient(to bottom,#0d0d0d 55%,transparent);
}
#tut-intro-close button{
  width:34px;height:34px;border-radius:50%;
  background:rgba(255,255,255,.1);
  border:1px solid rgba(255,255,255,.14);
  color:rgba(255,255,255,.7);cursor:pointer;
  font-size:16px;display:flex;align-items:center;justify-content:center;
  transition:background .15s;
}
#tut-intro-close button:hover{background:rgba(255,255,255,.18)}

.ti-page{display:none;padding:0 20px 24px}
.ti-page.ti-active{display:block}

/* hero */
.ti-hero-icon{text-align:center;padding:4px 0 14px;font-size:48px;line-height:1}
.ti-hero-icon .material-icons-round{font-size:48px;color:#fff}
.ti-h1{font-size:22px;font-weight:900;color:#fff;text-align:center;line-height:1.2;margin-bottom:8px}
.ti-sub{font-size:12.5px;font-weight:500;color:rgba(255,255,255,.48);text-align:center;line-height:1.65;margin-bottom:22px}

/* 3-col step cards */
.ti-step-row{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:24px}
.ti-step-card{background:#191919;border-radius:14px;padding:14px 8px;text-align:center;border:1px solid rgba(255,255,255,.06)}
.ti-step-num{width:24px;height:24px;border-radius:50%;background:#242424;border:1px solid rgba(255,255,255,.13);font-size:11px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 9px}
.ti-step-label{font-size:11px;font-weight:800;color:#fff;margin-bottom:9px}
.ti-step-icon-wrap{height:36px;display:flex;align-items:center;justify-content:center;margin-bottom:8px}
.ti-step-icon-wrap .material-icons-round{font-size:26px;color:#fff}
.ti-step-text{font-size:10px;font-weight:500;color:rgba(255,255,255,.4);line-height:1.5}

/* divider */
.ti-divider{height:1px;background:rgba(255,255,255,.08);margin:2px 0 20px}
.ti-section-h{font-size:15px;font-weight:800;color:#fff;margin-bottom:5px}
.ti-section-sub{font-size:12px;font-weight:500;color:rgba(255,255,255,.42);line-height:1.6;margin-bottom:14px}

/* info cards */
.ti-info-row{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:24px}
.ti-info-card{background:#191919;border-radius:14px;padding:16px 8px 12px;text-align:center;border:1px solid rgba(255,255,255,.06)}
.ti-info-icon .material-icons-round{font-size:28px;color:#fff}
.ti-info-title{font-size:11px;font-weight:800;color:#fff;margin:8px 0 5px}
.ti-info-text{font-size:10px;font-weight:500;color:rgba(255,255,255,.37);line-height:1.5}

/* rule rows */
.ti-rule{display:flex;align-items:flex-start;gap:13px;margin-bottom:16px}
.ti-rule-icon{width:42px;height:42px;border-radius:50%;flex-shrink:0;background:#191919;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center}
.ti-rule-icon .material-icons-round{font-size:20px;color:#fff}
.ti-rule-title{font-size:12.5px;font-weight:800;color:#fff;margin-bottom:3px}
.ti-rule-text{font-size:11.5px;font-weight:500;color:rgba(255,255,255,.42);line-height:1.5}

/* progress + CTA sticky bar */
#ti-progress-bar{
  position:sticky;bottom:0;z-index:10;
  padding:12px 20px 20px;
  background:linear-gradient(to top,#0d0d0d 65%,transparent);
}
.ti-prog{height:2.5px;background:rgba(255,255,255,.1);border-radius:99px;margin-bottom:12px;overflow:hidden}
.ti-prog-fill{height:100%;background:rgba(255,255,255,.45);border-radius:99px;width:0%;transition:width .4s ease}
.ti-cta{
  width:100%;padding:14px;border-radius:99px;border:none;
  background:#fff;color:#000;
  font-family:'Montserrat',sans-serif;font-size:14px;font-weight:800;
  cursor:pointer;letter-spacing:.1px;
  transition:transform .12s,opacity .12s;
  display:block;
}
.ti-cta:active{transform:scale(.97);opacity:.9}
#ti-next-btn{} /* same as .ti-cta */

/* freq bar illustration */
.ti-freq-bar-demo{
  width:100%;height:44px;border-radius:10px;
  background:linear-gradient(to right,#5500AA,#2200FF 14%,#007AFF 28%,#00CFCF 42%,#34C759 56%,#FFD600 66%,#FF9500 76%,#FF3B3B 88%,#CC0040);
  position:relative;margin:0 0 8px;overflow:visible;
}
.ti-freq-thumb{
  position:absolute;top:50%;left:45%;transform:translate(-50%,-50%);
  width:20px;height:56px;background:#fff;border-radius:6px;
  box-shadow:0 2px 12px rgba(0,0,0,.5);
}
.ti-freq-labels{display:flex;justify-content:space-between;font-size:9px;font-weight:800;color:rgba(255,255,255,.35);margin-bottom:18px}

/* features list */
.ti-feat-list{display:flex;flex-direction:column;gap:11px;margin-bottom:4px}
.ti-feat-row{display:flex;align-items:center;gap:11px}
.ti-feat-icon{width:34px;height:34px;border-radius:9px;flex-shrink:0;background:#191919;border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center}
.ti-feat-icon .material-icons-round{font-size:17px;color:rgba(255,255,255,.55)}
.ti-feat-text{font-size:12px;font-weight:500;color:rgba(255,255,255,.5);line-height:1.45}
.ti-feat-text b{color:#fff;font-weight:800}

/* ─── PHASE B: spotlight tutorial ─── */
#tut-overlay{
  position:fixed;inset:0;z-index:8000;
  pointer-events:none;
  font-family:'Montserrat',sans-serif;
}
#tut-dim{
  position:fixed;inset:0;z-index:7900;
  background:rgba(0,0,0,0);
  pointer-events:none;
}
#tut-dim.active{
  pointer-events:none;
}
#tut-spotlight{
  position:fixed;z-index:8100;
  pointer-events:none;opacity:0;
  border-radius:16px;border:2px solid rgba(255,255,255,.35);
  box-shadow:0 0 0 9999px rgba(0,0,0,.58),0 0 0 3px rgba(255,255,255,.08);
  transition:border-radius .25s;
}
@keyframes b-pulse{0%{box-shadow:0 0 0 9999px rgba(0,0,0,.58),0 0 0 0 rgba(255,255,255,.5)}70%{box-shadow:0 0 0 9999px rgba(0,0,0,.58),0 0 0 12px rgba(255,255,255,0)}100%{box-shadow:0 0 0 9999px rgba(0,0,0,.58),0 0 0 0 rgba(255,255,255,0)}}
#tut-spotlight.pulse{animation:b-pulse 1.8s ease-out infinite}
#tut-arrow{position:fixed;z-index:8200;opacity:0;pointer-events:none}
#tut-card{
  position:fixed;z-index:8300;
  background:rgba(10,10,10,.96);
  border:1px solid rgba(255,255,255,.1);
  border-radius:20px;padding:20px 20px 16px;
  width:min(88vw,320px);
  box-shadow:0 10px 50px rgba(0,0,0,.8);
  opacity:0;pointer-events:auto;
}
.tc-icon-row{display:flex;align-items:center;gap:11px;margin-bottom:11px}
.tc-icon-wrap{width:44px;height:44px;border-radius:12px;flex-shrink:0;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center}
.tc-icon-wrap .material-icons-round{font-size:22px;color:#fff}
.tc-title{font-family:'Montserrat',sans-serif;font-size:16px;font-weight:800;color:#fff;line-height:1.2}
.tc-body{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:500;color:rgba(255,255,255,.6);line-height:1.6;margin-bottom:14px}
.tc-body strong{color:#fff;font-weight:800}
.tc-row{display:flex;align-items:center;gap:8px}
.tc-skip{font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;color:rgba(255,255,255,.25);cursor:pointer;background:none;border:none;padding:4px 0;flex:1;text-align:left}
.tc-skip:hover{color:rgba(255,255,255,.45)}
.tc-next{font-family:'Montserrat',sans-serif;background:#fff;color:#000;border:none;border-radius:99px;padding:10px 22px;font-size:12px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:4px}
.tc-next:active{transform:scale(.95)}
.tc-next .material-icons-round{font-size:15px}
.tc-tap{font-family:'Montserrat',sans-serif;font-size:11px;font-weight:600;color:rgba(255,255,255,.35);text-align:center;margin-top:6px}
`;
document.head.appendChild(st);

/* ═══════════════════════════════════════════════════
   PHASE A — INTRO MODAL (2 pages: welcome + frequency)
   ═══════════════════════════════════════════════════ */
document.body.insertAdjacentHTML('beforeend',`
<div id="tut-intro-root">
  <div id="tut-intro-backdrop"></div>
  <div id="tut-intro-modal">
    <div id="tut-intro-close"><button onclick="TUTA.skip()" aria-label="Close">✕</button></div>

    <!-- PAGE 1: WELCOME -->
    <div class="ti-page ti-active" id="ti-p1">
      <div class="ti-hero-icon"><span class="material-icons-round">cell_tower</span></div>
      <h1 class="ti-h1">Walkie-Chatie</h1>
      <p class="ti-sub">Talk to <strong style="color:#fff">real people near you</strong> — like a walkie-talkie for your neighbourhood.</p>

      <div class="ti-step-row">
        <div class="ti-step-card">
          <div class="ti-step-num">1</div>
          <div class="ti-step-label">Choose</div>
          <div class="ti-step-icon-wrap"><span class="material-icons-round">tune</span></div>
          <div class="ti-step-text">Pick a frequency near you</div>
        </div>
        <div class="ti-step-card">
          <div class="ti-step-num">2</div>
          <div class="ti-step-label">Tune In</div>
          <div class="ti-step-icon-wrap"><span class="material-icons-round">cell_tower</span></div>
          <div class="ti-step-text">Join that channel instantly</div>
        </div>
        <div class="ti-step-card">
          <div class="ti-step-num">3</div>
          <div class="ti-step-label">Chat</div>
          <div class="ti-step-icon-wrap"><span class="material-icons-round">chat_bubble</span></div>
          <div class="ti-step-text">Talk to anyone on the same frequency</div>
        </div>
      </div>

      <div class="ti-divider"></div>
      <div class="ti-section-h">Ways to Use It</div>
      <div class="ti-section-sub">People in the same area can use different frequencies for different conversations.</div>

      <div class="ti-info-row">
        <div class="ti-info-card">
          <div class="ti-info-icon"><span class="material-icons-round">meeting_room</span></div>
          <div class="ti-info-title">Different Areas</div>
          <div class="ti-info-text">Each floor, room or zone gets its own channel.</div>
        </div>
        <div class="ti-info-card">
          <div class="ti-info-icon"><span class="material-icons-round">home</span></div>
          <div class="ti-info-title">Neighbours</div>
          <div class="ti-info-text">Chat about local news, help, or just hanging out.</div>
        </div>
        <div class="ti-info-card">
          <div class="ti-info-icon"><span class="material-icons-round">event</span></div>
          <div class="ti-info-title">Events</div>
          <div class="ti-info-text">Run a channel for your event or gathering.</div>
        </div>
      </div>

      <div class="ti-divider"></div>
      <div class="ti-rule">
        <div class="ti-rule-icon"><span class="material-icons-round">groups</span></div>
        <div>
          <div class="ti-rule-title">Your Area, Your Rules</div>
          <div class="ti-rule-text">You and the people around you decide how to use each frequency.</div>
        </div>
      </div>
      <div class="ti-rule">
        <div class="ti-rule-icon"><span class="material-icons-round">verified_user</span></div>
        <div>
          <div class="ti-rule-title">Stay Respectful</div>
          <div class="ti-rule-text">No spam, harassment, or harmful content. Keep every frequency safe.</div>
        </div>
      </div>
    </div>

    <!-- PAGE 2: FREQUENCY BAR -->
    <div class="ti-page" id="ti-p2">
      <div class="ti-hero-icon"><span class="material-icons-round">radio</span></div>
      <h1 class="ti-h1">How Frequency Works</h1>
      <p class="ti-sub">Slide the rainbow bar to pick your channel. Different frequencies reach different people.</p>

      <div style="padding:0 4px;margin-bottom:6px">
        <div class="ti-freq-bar-demo"><div class="ti-freq-thumb"></div></div>
        <div class="ti-freq-labels">
          <span>EHF</span><span>SHF</span><span>UHF</span><span>VHF</span><span>FM</span><span>SW</span><span>AM</span>
        </div>
      </div>

      <div class="ti-feat-list">
        <div class="ti-feat-row">
          <div class="ti-feat-icon"><span class="material-icons-round">swipe</span></div>
          <div class="ti-feat-text"><b>Slide left or right</b> on the bar to change frequency.</div>
        </div>
        <div class="ti-feat-row">
          <div class="ti-feat-icon"><span class="material-icons-round">radar</span></div>
          <div class="ti-feat-text"><b>Only nearby people</b> on the same frequency can see your messages.</div>
        </div>
        <div class="ti-feat-row">
          <div class="ti-feat-icon"><span class="material-icons-round">diversity_3</span></div>
          <div class="ti-feat-text"><b>FM</b> is great for general nearby chat. Try other frequencies to find smaller groups.</div>
        </div>
        <div class="ti-feat-row">
          <div class="ti-feat-icon"><span class="material-icons-round">sync_alt</span></div>
          <div class="ti-feat-text"><b>Switch anytime</b> — change frequency from the bar at the bottom of the map.</div>
        </div>
      </div>
    </div>

    <div id="ti-progress-bar">
      <div class="ti-prog"><div class="ti-prog-fill" id="ti-pfill"></div></div>
      <button class="ti-cta" id="ti-next-btn" onclick="TUTA.next()">Next →</button>
    </div>
  </div>
</div>
`);

/* ── Phase A state ── */
var tiPage=1, tiTotal=2;

function tiSetProgress(){
  document.getElementById('ti-pfill').style.width=(((tiPage-1)/(tiTotal-1))*100)+'%';
  document.getElementById('ti-next-btn').innerHTML=tiPage===tiTotal?'Got it':'Next →';
}

function tiShowPage(n){
  if(!window.gsap)return;
  var outEl=document.getElementById('ti-p'+tiPage);
  var inEl=document.getElementById('ti-p'+n);
  document.getElementById('tut-intro-modal').scrollTo({top:0,behavior:'smooth'});
  gsap.to(outEl,{opacity:0,x:-28,duration:.2,ease:'power2.in',onComplete:function(){
    outEl.classList.remove('ti-active');
    inEl.classList.add('ti-active');
    gsap.fromTo(inEl,{opacity:0,x:28},{opacity:1,x:0,duration:.3,ease:'power3.out'});
    var kids=inEl.querySelectorAll('.ti-step-card,.ti-info-card,.ti-feat-row,.ti-rule');
    gsap.from(kids,{opacity:0,y:16,duration:.38,stagger:.055,ease:'power2.out',delay:.05});
  }});
  tiPage=n;tiSetProgress();
}

window.TUTA={
  next:function(){
    if(tiPage<tiTotal){tiShowPage(tiPage+1);}
    else{TUTA.finish();}
  },
  skip:function(){
    if(!window.gsap){closeTUTA();return;}
    gsap.to(document.getElementById('tut-intro-modal'),{scale:.9,opacity:0,duration:.25,ease:'power2.in'});
    gsap.to(document.getElementById('tut-intro-backdrop'),{opacity:0,duration:.25,onComplete:closeTUTA});
  },
  finish:function(){
    if(!window.gsap){closeTUTA();return;}
    gsap.to(document.getElementById('tut-intro-modal'),{scale:1.03,opacity:0,duration:.3,ease:'power2.in'});
    gsap.to(document.getElementById('tut-intro-backdrop'),{opacity:0,duration:.3,onComplete:closeTUTA});
  }
};

function closeTUTA(){
  var r=document.getElementById('tut-intro-root');
  if(r)r.remove();
  // Start Phase B after intro finishes
  startPhaseB();
}

/* ═══════════════════════════════════════════════════
   PHASE B — SPOTLIGHT TUTORIAL
   ═══════════════════════════════════════════════════ */
document.body.insertAdjacentHTML('beforeend',`
<div id="tut-dim"></div>
<div id="tut-overlay">
  <div id="tut-spotlight"></div>
  <div id="tut-arrow">
    <svg width="38" height="38" viewBox="0 0 38 38">
      <path d="M19 5 L19 28 M11 20 L19 29 L27 20" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".85"/>
    </svg>
  </div>
  <div id="tut-card">
    <div class="tc-icon-row">
      <div class="tc-icon-wrap"><span class="material-icons-round" id="tc-icon">star</span></div>
      <div class="tc-title" id="tc-title"></div>
    </div>
    <div class="tc-body" id="tc-body"></div>
    <div class="tc-row">
      <button class="tc-skip" onclick="TUTB.skip()">Skip tutorial</button>
      <button class="tc-next" id="tc-next-btn" onclick="TUTB.next()">
        Next <span class="material-icons-round">chevron_right</span>
      </button>
    </div>
    <div class="tc-tap" id="tc-tap" style="display:none">Tap the arrows to continue</div>
  </div>
</div>
`);

/* ── Phase B steps ── */
var B_STEPS=[
  {
    icon:'face',title:'Your Avatar',
    body:'Tap the <strong>arrows</strong> beside your character to change skin tone and shirt.',
    target:'avatar-stage',arrow:'down',interact:true,watch:watchAvatar
  },
  {
    icon:'cell_tower',title:'Tune In',
    body:'Enter a <strong>callsign</strong> and tap <strong>Tune In</strong> to join your frequency.',
    target:'join-btn',arrow:'up',interact:false,autoAdvance:true,watch:watchJoin
  },
  {
    icon:'radar',title:'Your Radius',
    body:'You can only chat with people inside your <strong>glowing circle</strong>. Zoom in to see them.',
    target:'map',arrow:null,interact:false
  },
  {
    icon:'chat',title:'Open Chat',
    body:'Tap the yellow <strong>Chat</strong> button to start talking to people nearby.',
    target:'chat-tab',arrow:'up',interact:true,watch:watchChatOpen
  },
  {
    icon:'checkroom',title:'Customize Your Look',
    body:'Members can tap their <strong>avatar</strong> up top to add hats, glasses &amp; change their expression.',
    target:'tb-avatar',arrow:'down',interact:false,isFinal:true,
    skipIf:function(){return typeof isRegisteredUser!=='undefined' && !isRegisteredUser;}
  }
];

var bStep=0,bActive=false,_bCleanup=null;

function clearBCleanup(){if(_bCleanup){_bCleanup();_bCleanup=null;}}

function watchAvatar(done){
  var fired=false;
  function h(){
    if(fired)return;
    fired=true;
    setTimeout(function(){
      done();
    },400);
  }
  var stage = document.getElementById('avatar-stage');
  if(stage){
    var btns = stage.querySelectorAll('button');
    btns.forEach(function(b){
      b.addEventListener('click', h);
      b.addEventListener('touchstart', h, {passive:true});
    });
    _bCleanup=function(){
      btns.forEach(function(b){
        b.removeEventListener('click', h);
        b.removeEventListener('touchstart', h);
      });
    };
  } else {
    var btns2 = document.querySelectorAll('.av-side-btn');
    btns2.forEach(function(b){
      b.addEventListener('click', h);
      b.addEventListener('touchstart', h, {passive:true});
    });
    _bCleanup=function(){
      btns2.forEach(function(b){
        b.removeEventListener('click', h);
        b.removeEventListener('touchstart', h);
      });
    };
  }
}

function watchJoin(done){
  var btn = document.getElementById('join-btn');
  var fired = false;
  function h(){
    if(fired)return;
    fired=true;
    setTimeout(function(){
      done();
    },800);
  }
  if(btn){
    btn.addEventListener('click', h);
    btn.addEventListener('touchstart', h, {passive:true});
  }
  _bCleanup=function(){
    if(btn){
      btn.removeEventListener('click', h);
      btn.removeEventListener('touchstart', h);
    }
  };
}

function watchChatOpen(done){
  var btn=document.getElementById('chat-tab');var fired=false;
  function h(){if(fired)return;fired=true;setTimeout(done,600);}
  if(btn){
    btn.addEventListener('click',h);
    btn.addEventListener('touchstart',h,{passive:true});
  }
  _bCleanup=function(){
    if(btn){
      btn.removeEventListener('click',h);
      btn.removeEventListener('touchstart',h);
    }
  };
}

function bSpotlight(id,opts){
  var sp=document.getElementById('tut-spotlight');
  if(!id){gsap.to(sp,{opacity:0,duration:.25});return;}
  var el=document.getElementById(id)||document.querySelector('#'+id)||document.querySelector('.'+id);
  if(!el){gsap.to(sp,{opacity:0,duration:.25});return;}
  var r=el.getBoundingClientRect();
  var pad=(opts&&opts.pad)||13;
  gsap.set(sp,{left:r.left-pad,top:r.top-pad,width:r.width+pad*2,height:r.height+pad*2,borderRadius:(opts&&opts.br)||16});
  sp.classList.remove('pulse');void sp.offsetWidth;sp.classList.add('pulse');
  gsap.to(sp,{opacity:1,duration:.32,ease:'power2.out'});
}

function bArrow(targetId,dir){
  var a=document.getElementById('tut-arrow');
  if(!dir||!targetId){gsap.killTweensOf(a);gsap.to(a,{opacity:0,duration:.2});return;}
  var el=document.getElementById(targetId)||document.querySelector('.'+targetId);
  if(!el){gsap.to(a,{opacity:0,duration:.2});return;}
  var r=el.getBoundingClientRect();
  var ax,ay,rot=0;
  if(dir==='up')   {ax=r.left+r.width/2-19;ay=r.top-54;rot=0}
  if(dir==='down') {ax=r.left+r.width/2-19;ay=r.bottom+14;rot=180}
  if(dir==='left') {ax=r.left-54;ay=r.top+r.height/2-19;rot=-90}
  if(dir==='right'){ax=r.right+14;ay=r.top+r.height/2-19;rot=90}
  gsap.killTweensOf(a);
  gsap.set(a,{left:ax,top:ay,rotation:rot,y:0});
  gsap.to(a,{opacity:1,duration:.28});
  gsap.to(a,{y:dir==='up'?-8:8,duration:.52,ease:'sine.inOut',yoyo:true,repeat:-1});
}

function bPositionCard(targetId,dir){
  var card=document.getElementById('tut-card');
  var vw=window.innerWidth,vh=window.innerHeight;
  var cw=card.offsetWidth||300,ch=card.offsetHeight||160;
  var left,top;
  if(!targetId||!dir){left=vw/2-cw/2;top=vh*0.38-ch/2;}
  else{
    var el=document.getElementById(targetId)||document.querySelector('.'+targetId);
    if(!el){left=vw/2-cw/2;top=vh*0.38-ch/2;}
    else{
      var r=el.getBoundingClientRect();
      left=Math.max(12,Math.min(vw/2-cw/2,vw-cw-12));
      if(dir==='up')   top=Math.max(12,r.top-ch-24);
      else if(dir==='down') top=Math.min(r.bottom+24,vh-ch-16);
      else top=Math.max(12,Math.min(r.top-ch/2+r.height/2,vh-ch-16));
    }
  }
  left=Math.max(12,Math.min(left,vw-cw-12));
  top=Math.max(12,Math.min(top,vh-ch-12));
  gsap.set(card,{left:left,top:top});
}

function bRender(step){
  if(step.skipIf && step.skipIf()){
    bStep++;
    if(bStep<B_STEPS.length){bRender(B_STEPS[bStep]);} else {bEnd();}
    return;
  }
  clearBCleanup();
  document.getElementById('tc-icon').textContent=step.icon;
  document.getElementById('tc-title').textContent=step.title;
  document.getElementById('tc-body').innerHTML=step.body;
  var nextBtn=document.getElementById('tc-next-btn');
  var tap=document.getElementById('tc-tap');
  
  // For auto-advance steps, hide the next button
  if(step.autoAdvance){
    nextBtn.style.display = 'none';
    tap.textContent = 'Tap "Tune In" to continue';
    tap.style.display = 'block';
  } else if(step.interact){
    nextBtn.style.display = 'none';
    tap.style.display = 'block';
  } else {
    nextBtn.style.display = 'flex';
    tap.style.display = 'none';
  }
  
  var card=document.getElementById('tut-card');
  var sp=document.getElementById('tut-spotlight');
  sp.classList.remove('pulse');
  bPositionCard(step.target,step.arrow);
  gsap.killTweensOf(card);
  gsap.fromTo(card,{opacity:0,y:12,scale:.93},{opacity:1,y:0,scale:1,duration:.36,ease:'back.out(1.4)'});
  if(step.target) bSpotlight(step.target);
  else gsap.to(sp,{opacity:0,duration:.2});
  bArrow(step.target,step.arrow);
  
  var dim = document.getElementById('tut-dim');
  if(step.interact || step.autoAdvance){
    dim.classList.add('active');
  } else {
    dim.classList.remove('active');
  }
  
  if(step.watch) {
    step.watch(function(){
      dim.classList.remove('active');
      // For auto-advance steps, manually advance
      if(step.autoAdvance){
        setTimeout(function(){
          TUTB.next();
        },300);
      } else if(step.isFinal){
        // End tutorial after chat is opened
        setTimeout(function(){
          bEnd();
        },400);
      } else {
        TUTB.next();
      }
    });
  }
}

function bHideAll(cb){
  clearBCleanup();
  var els=[document.getElementById('tut-card'),document.getElementById('tut-spotlight'),document.getElementById('tut-arrow')];
  document.getElementById('tut-dim').classList.remove('active');
  gsap.to(els,{opacity:0,duration:.25,onComplete:cb||function(){}});
}

function bEnd(){
  bHideAll(function(){
    markTutorialSeen();
    var toast=document.createElement('div');
    toast.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:9999;background:#0d0d0d;border:1px solid rgba(255,255,255,.12);border-radius:99px;padding:12px 22px;font-family:Montserrat,sans-serif;font-size:13px;font-weight:700;color:#fff;white-space:nowrap;box-shadow:0 8px 30px rgba(0,0,0,.7);opacity:0';
    toast.textContent='Good luck — have fun out there!';
    document.body.appendChild(toast);
    gsap.to(toast,{opacity:1,y:-6,duration:.4,ease:'back.out(1.5)'});
    setTimeout(function(){
      gsap.to(toast,{opacity:0,y:-12,duration:.4,delay:.1,onComplete:function(){toast.remove();}});
    },3000);
  });
}

window.TUTB={
  next:function(){
    clearBCleanup();
    var card=document.getElementById('tut-card');
    gsap.to(card,{opacity:0,x:-14,duration:.16,onComplete:function(){
      gsap.set(card,{x:0});
      bStep++;
      if(bStep<B_STEPS.length) bRender(B_STEPS[bStep]);
      else bEnd();
    }});
  },
  skip:function(){bHideAll(bEnd);}
};

/* ── Phase B boot: triggered after Phase A closes ── */
function startPhaseB(){
  bActive=true;

  var fp=document.getElementById('freq-picker');
  function tryB(){
    if(fp&&fp.style.display!=='none'&&fp.style.display!==''){
      setTimeout(function(){bRender(B_STEPS[0]);},400);
      watchForMap();
    } else {
      var obs=new MutationObserver(function(m,o){
        if(fp&&fp.style.display!=='none'&&fp.style.display!==''){
          o.disconnect();
          setTimeout(function(){bRender(B_STEPS[0]);watchForMap();},400);
        }
      });
      if(fp)obs.observe(fp,{attributes:true,attributeFilter:['style']});
      document.querySelectorAll('.ob-auth-anon,.ob-auth-btn').forEach(function(b){
        b.addEventListener('click',function(){setTimeout(tryB,300);},{once:true});
      });
    }
  }
  tryB();
}

function watchForMap(){
  var ob=document.getElementById('onboarding');
  var obs=new MutationObserver(function(){
    if(ob&&ob.classList.contains('hidden')){
      obs.disconnect();
      if(bStep<2){
        clearBCleanup();
        bStep=2;
        setTimeout(function(){bRender(B_STEPS[bStep]);},700);
        watchForChat();
      }
    }
  });
  if(ob)obs.observe(ob,{attributes:true,attributeFilter:['class']});
}

function watchForChat(){
  var obs=new MutationObserver(function(){
    if(document.body.classList.contains('chat-open')){
      obs.disconnect();
      if(bStep<4){
        clearBCleanup();
        bStep=3;
        setTimeout(function(){bRender(B_STEPS[bStep]);},400);
      }
    }
  });
  obs.observe(document.body,{attributes:true,attributeFilter:['class']});
}

/* ═══════════════════════════════════════════════════
   BOOT — show Phase A only after the user has logged in /
   chosen anonymous (never on the raw login screen)
   ═══════════════════════════════════════════════════ */
function waitForAuthChoice(cb){
  var fp=document.getElementById('freq-picker');
  function ready(){return fp&&fp.style.display!=='none'&&fp.style.display!=='';}
  if(ready()){cb();return;}
  var obs=new MutationObserver(function(m,o){
    if(ready()){o.disconnect();cb();}
  });
  if(fp)obs.observe(fp,{attributes:true,attributeFilter:['style']});
  document.querySelectorAll('.ob-auth-anon,.ob-auth-btn').forEach(function(b){
    b.addEventListener('click',function(){setTimeout(function(){if(ready())cb();},300);},{once:true});
  });
}

loadGSAP(function(){
  waitForAuthChoice(function(){
    markTutorialSeen();
    var root=document.getElementById('tut-intro-root');
    if(root)root.classList.add('tut-visible');
    var modal=document.getElementById('tut-intro-modal');
    var backdrop=document.getElementById('tut-intro-backdrop');
    gsap.fromTo(backdrop,{opacity:0},{opacity:1,duration:.4});
    gsap.fromTo(modal,{scale:.86,opacity:0,y:32},{scale:1,opacity:1,y:0,duration:.55,ease:'back.out(1.15)',delay:.1});
    setTimeout(function(){
      var kids=document.querySelectorAll('#ti-p1 .ti-step-card,#ti-p1 .ti-info-card,#ti-p1 .ti-rule');
      gsap.from(kids,{opacity:0,y:20,duration:.4,stagger:.06,ease:'power2.out'});
    },350);
    tiSetProgress();
  });
});

})();

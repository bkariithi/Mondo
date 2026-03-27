// ── Cursor ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function loop(){
  rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,input,textarea').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

// ── Header scroll ──
const hdr = document.getElementById('site-header');
window.addEventListener('scroll',()=>{
  hdr.classList.toggle('scrolled', window.scrollY > 20);
});


// ── Promo viz ──
const pviz = document.getElementById('pviz');
const heights = [40,70,55,90,65,80,45,100,72,58,88,50,75,95,60,85,48,78,92,62,70,55,80,44];
heights.forEach(h=>{
  const b=document.createElement('div');
  b.className='pvb';
  b.style.setProperty('--a',(h*0.3)+'px');
  b.style.setProperty('--b',h+'px');
  b.style.setProperty('--d',(Math.random()*.6+.3).toFixed(2)+'s');
  b.style.animationDelay=(Math.random()*.4).toFixed(2)+'s';
  pviz.appendChild(b);
});

// ── Ticker ──
const tItems=['Afrobeats','Amapiano','Dancehall','Festivals','Private Events','Hip-Hop','International Tours','Boiler Room','R&B','Dance Mixes', 'AV Rentals'];
const tk=document.getElementById('ticker');
[...tItems,...tItems,...tItems].forEach(t=>{
  const d=document.createElement('div');
  d.className='tick-item';
  d.innerHTML='<span class="tick-dot"></span>'+t;
  tk.appendChild(d);
});

// ── Waveforms ──
['wf0','wf1','wf2','wf3'].forEach((id,i)=>{
  const el=document.getElementById(id);
  if(!el)return;
  const playedFrac=[.38,0,.72,.15][i];
  for(let j=0;j<80;j++){
    const b=document.createElement('div');
    b.className='wf '+(j/80<playedFrac?'p':'u');
    b.style.height=(Math.random()*55+20)+'%';
    el.appendChild(b);
  }
});

// ── Play ──
function togglePlay(btn){
  const on=btn.classList.contains('active');
  document.querySelectorAll('.mix-play').forEach(b=>{b.classList.remove('active');b.textContent='▶';});
  if(!on){btn.classList.add('active');btn.textContent='■';}
}

// ── Reveal ──
const obs=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:.08,rootMargin:'0px 0px -32px 0px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{
  el.style.transitionDelay=((i%4)*.08)+'s';
  obs.observe(el);
});

// ── Custom Select ──
(function(){
  const input = document.getElementById('eventTypeInput');
  const popup = document.getElementById('eventTypePopup');
  if (!input) return;

  input.addEventListener('click', function(e) {
    e.stopPropagation();
    popup.classList.toggle('open');
  });

  popup.querySelectorAll('li').forEach(function(li) {
    li.addEventListener('click', function(e) {
      e.stopPropagation();
      popup.querySelectorAll('li').forEach(function(el) { el.classList.remove('selected'); });
      li.classList.add('selected');
      input.value = li.textContent;
      popup.classList.remove('open');
    });
  });

  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target) && e.target !== input) {
      popup.classList.remove('open');
    }
  });
})();

// ── Date Picker ──
(function(){
  const input = document.getElementById('eventDateInput');
  const popup = document.getElementById('datePickerPopup');
  const grid  = document.getElementById('dpGrid');
  const label = document.getElementById('dpMonthLabel');
  const prev  = document.getElementById('dpPrev');
  const next  = document.getElementById('dpNext');
  const confirm = document.getElementById('dpConfirm');

  if (!input) return;

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  let view = new Date(); view.setDate(1);
  let selected = null;
  const today = new Date(); today.setHours(0,0,0,0);

  function render() {
    const y = view.getFullYear(), m = view.getMonth();
    label.textContent = MONTHS[m] + ' ' + y;
    grid.innerHTML = '';
    const first = new Date(y, m, 1).getDay();
    const days  = new Date(y, m+1, 0).getDate();
    for (let i = 0; i < first; i++) {
      const el = document.createElement('div');
      el.className = 'dp-day other-month';
      grid.appendChild(el);
    }
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d);
      const el = document.createElement('div');
      el.className = 'dp-day';
      el.textContent = d;
      if (date.toDateString() === today.toDateString()) el.classList.add('today');
      if (selected && date.toDateString() === selected.toDateString()) el.classList.add('selected');
      el.addEventListener('click', function() {
        selected = date;
        render();
      });
      grid.appendChild(el);
    }
  }

  prev.addEventListener('click', function(e) {
    e.stopPropagation();
    view.setMonth(view.getMonth() - 1);
    render();
  });
  next.addEventListener('click', function(e) {
    e.stopPropagation();
    view.setMonth(view.getMonth() + 1);
    render();
  });

  input.addEventListener('click', function(e) {
    e.stopPropagation();
    popup.classList.toggle('open');
    render();
  });

  confirm.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!selected) { popup.classList.remove('open'); return; }
    const h   = document.getElementById('dpHour').value || '--';
    const mn  = (document.getElementById('dpMin').value || '--').toString().padStart(2,'0');
    const ap  = document.getElementById('dpAmPm').value;
    const h2  = document.getElementById('dpHourEnd').value || '--';
    const mn2 = (document.getElementById('dpMinEnd').value || '--').toString().padStart(2,'0');
    const ap2 = document.getElementById('dpAmPmEnd').value;
    const dateStr = selected.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    input.value = dateStr + '  ·  ' + h + ':' + mn + ' ' + ap + ' – ' + h2 + ':' + mn2 + ' ' + ap2;
    popup.classList.remove('open');
  });

  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target) && e.target !== input) {
      popup.classList.remove('open');
    }
  });

  render();
})();

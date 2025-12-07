// GSAP animations for the confirmation landing page
(function(){
  let logo = document.getElementById('teamsLogo');
  const headline = document.getElementById('headline');
  const subtext = document.getElementById('subtext');
  const confettiContainer = document.getElementById('confetti');
  let animationsStarted = false;

  // Fallback SVG (simple Teams-like mark) to use when the external image fails to load.
  const fallbackSVG = `
    <svg id="teamsLogoSVG" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stop-color="#4f46e5" />
          <stop offset="1" stop-color="#00a4ef" />
        </linearGradient>
      </defs>
      <rect x="18" y="30" width="72" height="60" rx="10" fill="url(#g1)" opacity="0.95" />
      <circle cx="42" cy="48" r="10" fill="#fff" opacity="0.9" />
      <rect x="58" y="36" width="18" height="8" rx="3" fill="#fff" />
      <rect x="58" y="50" width="18" height="8" rx="3" fill="#fff" />
      <rect x="58" y="64" width="18" height="8" rx="3" fill="#fff" />
    </svg>
  `;

  // Start animations once we have a drawable logo element (either img or fallback SVG)
  function startAnimations(){
    if(animationsStarted) return;
    animationsStarted = true;

    const tl = gsap.timeline({defaults:{duration:0.7, ease: 'power3.out'}});

    tl.from(logo, {scale:0, rotation: -10, opacity:0, duration:0.9, ease:'elastic.out(1,0.6)'});
    tl.from(headline, {y:20, opacity:0}, '-=0.35');
    tl.from(subtext, {y:10, opacity:0, duration:0.5}, '-=0.35');
    tl.from('.btn', {y:6, opacity:0, duration:0.5}, '-=0.3');

    // subtle floating loop for logo
    gsap.to(logo, {y:6, duration:3.5, yoyo:true, repeat:-1, ease:'sine.inOut'});
  }

  // If the image fails to load, replace it with the fallback inline SVG and start animations.
  function useFallback(){
    const wrapper = document.querySelector('.logo-wrap');
    if(!wrapper) return;
    const temp = document.createElement('div');
    temp.innerHTML = fallbackSVG;
    const svgEl = temp.firstElementChild;
    svgEl.style.filter = window.getComputedStyle(logo).getPropertyValue('filter') || '';
    wrapper.replaceChild(svgEl, logo);
    logo = document.getElementById('teamsLogoSVG');
  }

  // Attach handlers before attempting to start animations
  if(logo){
    // If the external image fails to load, swap to the inline SVG and then start
    logo.addEventListener('error', ()=>{ useFallback(); startAnimations(); });
    // If it loads successfully, start animations
    logo.addEventListener('load', ()=> startAnimations());
  }

  // Pulse on click of button
  const btn = document.querySelector('.btn');
  btn.addEventListener('mouseenter', ()=> gsap.to(btn, {scale:1.03, duration:0.2}));
  btn.addEventListener('mouseleave', ()=> gsap.to(btn, {scale:1, duration:0.2}));

  // Make lightweight confetti
  function makeConfetti(count=22){
    const colors=['#00a4ef','#6bd3ff','#2fd47a','#ffd166','#ff76a1'];
    const w = confettiContainer.clientWidth || window.innerWidth;
    const h = confettiContainer.clientHeight || window.innerHeight;
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.background = colors[Math.floor(Math.random()*colors.length)];
      el.style.left = Math.round(Math.random()*w) + 'px';
      el.style.top = Math.round(Math.random()* (h*0.2)) + 'px';
      el.style.transform = `rotate(${Math.random()*360}deg)`;
      el.style.opacity = (0.7 + Math.random()*0.3).toString();
      confettiContainer.appendChild(el);

      // animate each piece falling and rotating
      const fallDur = 2.2 + Math.random()*1.2;
      gsap.to(el, {y: h + 80, x: `+=${-60 + Math.random()*120}`, rotation: 360*(Math.random()>0.5?1:-1), duration: fallDur, ease:'power1.out', delay: Math.random()*0.6, onComplete: ()=> el.remove()});
    }
  }

  // If the logo neither loads nor errors quickly (cached/browsers), ensure animations start on window load
  window.addEventListener('load', ()=>{ if(!animationsStarted){ if(!logo || (logo && logo.complete && logo.naturalWidth===0)){ useFallback(); } startAnimations(); makeConfetti(26); } });


})();

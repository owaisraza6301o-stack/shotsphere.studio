(function(){
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis smooth scroll ---------- */
try{
  if(window.Lenis && !reduceMotion){
    var lenis = new Lenis({
      lerp:0.1,
      smoothWheel:true
    });

    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if(window.ScrollTrigger){
      lenis.on('scroll', ScrollTrigger.update);
    }
  }
}catch(e){}

if(window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
}


/* ---------- VISUAL TONE ---------- */

function tone(i){
  var p = [
    'linear-gradient(135deg,#1c1e22,#08090b 70%)',
    'linear-gradient(150deg,#191b1e,#050506 65%)',
    'linear-gradient(120deg,#20221f,#08090b 70%)',
    'linear-gradient(160deg,#22201e,#08090b 65%)',
    'radial-gradient(circle at 30% 20%,#24262a,#08090b 70%)',
    'linear-gradient(145deg,#1a1c20,#050506 70%)'
  ];

  return p[i % p.length];
}


/* ---------- LOADER ---------- */

var pctEl = document.getElementById('loaderPct');
var fillEl = document.getElementById('loaderFill');

var steps = [0,18,42,67,89,100];
var si = 0;

function stepLoader(){

  if(si >= steps.length){

    var loader = document.getElementById('loader');

    if(loader){
      loader.classList.add('split');

      setTimeout(function(){
        loader.classList.add('hide');
      },850);
    }

    var heroTitle = document.getElementById('heroTitle');
    var heroSub = document.getElementById('heroSub');
    var heroCtas = document.getElementById('heroCtas');

    if(heroTitle) heroTitle.classList.add('animate');
    if(heroSub) heroSub.classList.add('animate');
    if(heroCtas) heroCtas.classList.add('animate');

    return;
  }

  var v = steps[si];

  if(pctEl){
    pctEl.textContent = (v<10?'0':'') + v + '%';
  }

  if(fillEl){
    fillEl.style.width = v + '%';
  }

  si++;

  setTimeout(stepLoader,260);
}

setTimeout(stepLoader,250);


/* ---------- CUSTOM CURSOR ---------- */

var cursor = document.getElementById('cursor');

window.addEventListener('mousemove',function(e){

  if(cursor){
    cursor.style.left = e.clientX+'px';
    cursor.style.top = e.clientY+'px';
  }

  movePeek(e.clientX,e.clientY);

});


document.addEventListener('mouseover',function(e){

  var t = e.target.closest(
    'a,button,.frame-item,.peek-trigger,.reel-play'
  );

  if(!t) return;

  var label = '';

  if(t.tagName === 'A'){
    label = t.hasAttribute('target') ? 'OPEN' : 'GO →';
  }

  if(t.classList.contains('frame-item')){
    label = 'VIEW';
  }

  if(t.classList.contains('reel-play')){
    label = 'PLAY';
  }

  if(
    t.classList.contains('nav-cta') ||
    t.classList.contains('btn-primary') ||
    t.classList.contains('submit-btn') ||
    t.classList.contains('footer-cta')
  ){
    label = 'GO →';
  }

  if(cursor){
    cursor.classList.toggle('grow',!!label);
    cursor.setAttribute('data-label',label);
  }

});


document.addEventListener('mouseout',function(e){

  var t = e.target.closest(
    'a,button,.frame-item,.peek-trigger,.reel-play'
  );

  if(!t) return;

  if(cursor){
    cursor.classList.remove('grow');
    cursor.setAttribute('data-label','');
  }

});


/* ---------- SERVICE CURSOR PREVIEW ---------- */

var peek = document.getElementById('cursorPeek');
var peekVisual = document.getElementById('peekVisual');
var peekTag = document.getElementById('peekTag');

var peekTones = {
  photography:0,
  videography:1,
  reels:2,
  editing:3,
  concepts:4,
  website:5,
  digital:0,
  advertising:1
};

var peekLabels = {
  photography:'Portrait reference',
  videography:'Filmmaking reference',
  reels:'Short-form reference',
  editing:'Post-production reference',
  concepts:'Moodboard reference',
  website:'Device mockup reference',
  digital:'Digital setup reference',
  advertising:'Campaign reference'
};

var activePeek = null;


document.querySelectorAll('.service-row').forEach(function(row){

  row.addEventListener('mouseenter',function(){

    var key = row.getAttribute('data-peek');

    activePeek = key;

    if(peekVisual){
      peekVisual.style.background =
        tone(peekTones[key] || 0);
    }

    if(peekTag){
      peekTag.textContent =
        peekLabels[key] || 'Visual reference';
    }

    if(peek){
      peek.classList.add('show');
    }

    document.querySelectorAll('.service-row')
      .forEach(function(r){
        r.classList.remove('active');
      });

    row.classList.add('active');

  });


  row.addEventListener('mouseleave',function(){

    if(peek){
      peek.classList.remove('show');
    }

    activePeek = null;

  });

});


function movePeek(x,y){

  if(activePeek && peek){

    peek.style.left = x+'px';
    peek.style.top = y+'px';

  }

}


/* ---------- MAGNETIC BUTTONS ---------- */

document.querySelectorAll('.magnetic').forEach(function(btn){

  btn.addEventListener('mousemove',function(e){

    var r = btn.getBoundingClientRect();

    var mx =
      e.clientX - (r.left + r.width/2);

    var my =
      e.clientY - (r.top + r.height/2);

    btn.style.transform =
      'translate('+
      (mx*0.25)+
      'px,'+
      (my*0.3)+
      'px)';

  });


  btn.addEventListener('mouseleave',function(){

    btn.style.transform =
      'translate(0,0)';

    btn.style.transition =
      'transform .4s cubic-bezier(.16,.84,.24,1)';

  });


  btn.addEventListener('mouseenter',function(){

    btn.style.transition =
      'transform .1s';

  });

});


/* ---------- NAVIGATION ---------- */

var nav = document.getElementById('nav');

window.addEventListener('scroll',function(){

  if(nav){
    nav.classList.toggle(
      'scrolled',
      window.scrollY > 40
    );
  }

},{passive:true});


var burger = document.getElementById('burger');
var mmenu = document.getElementById('mmenu');


if(burger && mmenu){

  burger.addEventListener('click',function(){

    mmenu.classList.toggle('open');

  });

}


if(mmenu){

  mmenu.querySelectorAll('a')
    .forEach(function(a){

      a.addEventListener('click',function(){

        mmenu.classList.remove('open');

      });

    });

}


/* ---------- HERO PARALLAX ---------- */

var heroLines =
  document.getElementById('heroLines');

window.addEventListener('scroll',function(){

  var y = window.scrollY;

  if(
    heroLines &&
    y < window.innerHeight
  ){

    heroLines.style.transform =
      'translateY('+
      (y*0.15)+
      'px)';

  }

},{passive:true});


/* ---------- CAMERA TIMECODE ---------- */

var frame = 0;

setInterval(function(){

  frame++;

  var h =
    String(
      Math.floor(frame/216000)%24
    ).padStart(2,'0');

  var m =
    String(
      Math.floor(frame/3600)%60
    ).padStart(2,'0');

  var s =
    String(
      Math.floor(frame/60)%60
    ).padStart(2,'0');

  var f =
    String(frame%60).padStart(2,'0');

  var hudTc =
    document.getElementById('hudTc');

  if(hudTc){

    hudTc.textContent =
      h+':'+m+':'+s+':'+f;

  }

},500);


/* ---------- REVEAL ANIMATIONS ---------- */

var io =
  new IntersectionObserver(
    function(entries){

      entries.forEach(function(en){

        if(en.isIntersecting){

          en.target.classList.add('in');

        }

      });

    },
    {
      threshold:0.2
    }
  );


document.querySelectorAll('.reveal')
  .forEach(function(el){

    io.observe(el);

  });


/* ---------- HORIZONTAL CONCEPT SCROLL ---------- */

if(
  window.gsap &&
  window.ScrollTrigger
){

  var stages =
    gsap.utils.toArray(
      '.concept-stage'
    );

  var stagesWrap =
    document.getElementById(
      'conceptStages'
    );

  if(stagesWrap){

    gsap.to(stagesWrap,{

      x:function(){

        return -(
          stagesWrap.scrollWidth -
          window.innerWidth
        );

      },

      ease:'none',

      scrollTrigger:{

        trigger:'.concept-track',

        start:'top top',

        pin:true,

        scrub:1,

        end:function(){

          return '+='+
            (
              stagesWrap.scrollWidth -
              window.innerWidth
            );

        }

      }

    });

  }

}else{

  var conceptTrack =
    document.getElementById(
      'conceptTrack'
    );

  var conceptStages =
    document.getElementById(
      'conceptStages'
    );

  if(conceptTrack){
    conceptTrack.style.height='auto';
  }

  if(conceptStages){

    conceptStages.style.flexDirection =
      'column';

    conceptStages.style.width =
      '100%';

  }

}


/* ---------- BUILD STAGE ---------- */

var buildStages = [
  'WIREFRAME',
  'DESIGN',
  'CODE',
  'LAUNCH'
];

var bi = 0;

setInterval(function(){

  bi =
    (bi+1)%buildStages.length;

  var el =
    document.getElementById(
      'browserStage'
    );

  if(el){

    el.style.opacity = 0;

    setTimeout(function(){

      el.textContent =
        buildStages[bi];

      el.style.opacity = 1;

    },300);

  }

},1600);


/* =========================================================
   PORTFOLIO / PROJECTS
   ========================================================= */

var fallbackProjects = [

  {
    title:'Charminar Afterglow',
    cat:'photography',
    catLabel:'HYDERABAD / PORTRAIT',
    year:'SAMPLE',
    size:'wide tall',
    desc:
      'Warm editorial portrait language inspired by Hyderabad’s Old City and evening light.',
    image:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=85&w=1400'
  },

  {
    title:'Red & Gold',
    cat:'photography',
    catLabel:'INDIAN CULTURE',
    year:'SAMPLE',
    size:'',
    desc:
      'Traditional Indian styling, rich textile detail and cinematic low-key contrast.',
    image:
      'https://www.happiffie.com/hp-images/hyderabad-classical-temple-jewellery-collection/banner.jpg'
  },

  {
    title:'Old City Nights',
    cat:'film',
    catLabel:'CHARMINAR / NIGHT',
    year:'SAMPLE',
    size:'narrow',
    desc:
      'Heritage architecture, market light and atmospheric night photography.',
    image:
      'https://images.pexels.com/photos/36762650/pexels-photo-36762650/free-photo-of-romantic-evening-at-hyderabad-s-charminar.jpeg?auto=compress&dpr=1&w=1200'
  }

];


function renderProjects(projects){

  var grid =
    document.getElementById(
      'frameGrid'
    );

  if(!grid) return;

  grid.innerHTML = '';

  projects.forEach(function(p,i){

    var el =
      document.createElement('div');

    el.className =
      'frame-item '+
      (p.size || '');

    el.setAttribute(
      'data-cat',
      p.category ||
      p.cat ||
      'photography'
    );

    el.setAttribute(
      'tabindex',
      '0'
    );

    el.setAttribute(
      'role',
      'button'
    );

    el.setAttribute(
      'aria-label',
      'View project: '+p.title
    );

    var img =
      String(
        p.image_url ||
        p.image ||
        ''
      ).replace(/'/g,'%27');


    el.innerHTML =

      '<div class="frame-visual" '+
      'style="background-image:'+
      'linear-gradient('+
      '180deg,'+
      'rgba(8,9,11,.08),'+
      'rgba(8,9,11,.72)'+
      '),url(\''+
      img+
      '\');'+
      'background-size:cover;'+
      'background-position:center;">'+
      '</div>'+

      '<div class="frame-cat-tag">'+
      (
        p.category_label ||
        p.catLabel ||
        'CREATIVE WORK'
      )+
      '</div>'+

      '<div class="frame-meta">'+

        '<div class="fm-left">'+

          '<h4>'+
          p.title+
          '</h4>'+

          '<span>'+
          (
            p.category_label ||
            p.catLabel ||
            'CREATIVE WORK'
          )+
          ' — '+
          (p.year || '2026')+
          '</span>'+

        '</div>'+

        '<div class="fm-right">'+
        'VIEW PROJECT →'+
        '</div>'+

      '</div>';


    el.addEventListener(
      'click',
      function(){

        openViewer(p,i);

      }
    );


    el.addEventListener(
      'keydown',
      function(e){

        if(e.key === 'Enter'){

          openViewer(p,i);

        }

      }
    );


    grid.appendChild(el);

  });

}


function openViewer(p,i){

  var img =
    p.image_url ||
    p.image ||
    '';


  var viewerVisual =
    document.getElementById(
      'viewerVisual'
    );


  if(viewerVisual){

    viewerVisual.style.backgroundImage =
      'linear-gradient('+
      '180deg,'+
      'rgba(8,9,11,.05),'+
      'rgba(8,9,11,.55)'+
      '),url(\''+
      String(img).replace(/'/g,'%27')+
      '\')';

    viewerVisual.style.backgroundSize =
      'cover';

    viewerVisual.style.backgroundPosition =
      'center';

  }


  var viewerTitle =
    document.getElementById(
      'viewerTitle'
    );

  var viewerSub =
    document.getElementById(
      'viewerSub'
    );

  var viewerDesc =
    document.getElementById(
      'viewerDesc'
    );


  if(viewerTitle){
    viewerTitle.textContent =
      p.title;
  }


  if(viewerSub){

    viewerSub.textContent =
      (
        p.category_label ||
        p.catLabel ||
        'CREATIVE WORK'
      )+
      ' — '+
      (p.year || '2026');

  }


  if(viewerDesc){

    viewerDesc.textContent =
      p.description ||
      p.desc ||
      '';

  }


  if(viewer){

    viewer.classList.add(
      'open'
    );

  }

}


var viewer =
  document.getElementById(
    'viewer'
  );


var viewerClose =
  document.getElementById(
    'viewerClose'
  );


if(viewerClose){

  viewerClose.addEventListener(
    'click',
    function(){

      if(viewer){
        viewer.classList.remove(
          'open'
        );
      }

    }
  );

}


if(viewer){

  viewer.addEventListener(
    'click',
    function(e){

      if(e.target === viewer){

        viewer.classList.remove(
          'open'
        );

      }

    }
  );

}


/* ---------- LOAD PROJECTS FROM BACKEND ---------- */

fetch('/api/public/projects')

  .then(function(r){

    if(!r.ok){
      throw Error(
        'Backend unavailable'
      );
    }

    return r.json();

  })

  .then(function(data){

    renderProjects(data);

  })

  .catch(function(){

    renderProjects(
      fallbackProjects
    );

  });


/* ---------- PROJECT FILTER ---------- */

document.querySelectorAll('.filter-btn')
  .forEach(function(btn){

    btn.addEventListener(
      'click',
      function(){

        document.querySelectorAll(
          '.filter-btn'
        ).forEach(
          function(b){
            b.classList.remove(
              'active'
            );
          }
        );

        btn.classList.add(
          'active'
        );


        var f =
          btn.getAttribute(
            'data-filter'
          );


        document.querySelectorAll(
          '.frame-item'
        ).forEach(
          function(item){

            item.setAttribute(
              'data-hidden',
              (
                f === 'all' ||
                item.getAttribute(
                  'data-cat'
                ) === f
              )
              ? 'false'
              : 'true'
            );

          }
        );

      }
    );

  });


/* =========================================================
   LIVE TESTIMONIALS
   ========================================================= */

fetch('/api/public/testimonials')

  .then(function(r){

    if(!r.ok){
      throw Error();
    }

    return r.json();

  })

  .then(function(items){

    var grid =
      document.querySelector(
        '.testi-grid'
      );

    if(!grid || !items.length){
      return;
    }


    grid.innerHTML =
      items.map(function(t){

        return (

          '<div class="testi-card reveal">'+

            '<div class="tc-eyebrow">'+
            (
              t.company ||
              'CLIENT TESTIMONIAL'
            )+
            '</div>'+

            '<p>“'+
            String(
              t.quote
            ).replace(
              /</g,
              '&lt;'
            )+
            '”</p>'+

            '<strong style="display:block;margin-top:20px;">'+
            String(
              t.client_name
            ).replace(
              /</g,
              '&lt;'
            )+
            '</strong>'+

            '<span style="color:#9d91ad;font-size:12px;">'+
            String(
              t.role || ''
            ).replace(
              /</g,
              '&lt;'
            )+
            '</span>'+

          '</div>'

        );

      }).join('');

  })

  .catch(function(){});


/* ---------- FEATURED PARALLAX ---------- */

var featuredBg =
  document.getElementById(
    'featuredBg'
  );

var featuredSection =
  document.querySelector(
    '.featured'
  );


window.addEventListener(
  'scroll',
  function(){

    if(
      !featuredBg ||
      !featuredSection
    ){
      return;
    }


    var rect =
      featuredSection.getBoundingClientRect();


    if(
      rect.top <
      window.innerHeight &&
      rect.bottom > 0
    ){

      var progress =
        (
          window.innerHeight -
          rect.top
        ) /
        (
          window.innerHeight +
          rect.height
        );


      featuredBg.style.transform =
        'translateX('+
        ((progress-0.5)*40)+
        'px) translateY('+
        ((progress-0.5)*20)+
        'px)';

    }

  },
  {
    passive:true
  }
);


/* =========================================================
   SHOWREEL
   ========================================================= */

var reelStrip =
  document.getElementById(
    'reelStrip'
  );

var reelPlay =
  document.getElementById(
    'reelPlay'
  );

var playing = true;


if(reelPlay && reelStrip){

  reelPlay.addEventListener(
    'click',
    function(){

      playing = !playing;

      reelStrip.classList.toggle(
        'paused',
        !playing
      );


      reelPlay.textContent =
        playing
        ? 'PLAY REEL →'
        : 'PAUSED — RESUME →';


      reelPlay.setAttribute(
        'aria-pressed',
        playing
      );

    }
  );

}


/* =========================================================
   BEFORE / AFTER
   ========================================================= */

document.querySelectorAll(
  '.ba-sample'
).forEach(function(frame){

  var finalLayer =
    frame.querySelector(
      '.ba-final'
    );

  var handle =
    frame.querySelector(
      '.ba-handle'
    );

  var dragging = false;


  function setBA(clientX){

    var r =
      frame.getBoundingClientRect();


    var pct =
      Math.min(
        Math.max(
          (clientX-r.left) /
          r.width,
          0
        ),
        1
      )*100;


    if(finalLayer){

      finalLayer.style.clipPath =
        'inset(0 0 0 '+
        pct+
        '%)';

    }


    if(handle){

      handle.style.left =
        pct+'%';

    }

  }


  var start =
    parseFloat(
      frame.getAttribute(
        'data-start'
      ) || 50
    );


  if(finalLayer){

    finalLayer.style.clipPath =
      'inset(0 0 0 '+
      start+
      '%)';

  }


  if(handle){

    handle.style.left =
      start+'%';

  }


  frame.addEventListener(
    'pointerdown',
    function(e){

      dragging = true;

      if(
        frame.setPointerCapture
      ){

        frame.setPointerCapture(
          e.pointerId
        );

      }

      setBA(e.clientX);

    }
  );


  frame.addEventListener(
    'pointermove',
    function(e){

      if(dragging){

        setBA(e.clientX);

      }

    }
  );


  frame.addEventListener(
    'pointerup',
    function(){

      dragging = false;

    }
  );


  frame.addEventListener(
    'pointercancel',
    function(){

      dragging = false;

    }
  );

});


/* =========================================================
   MOODBOARD
   ========================================================= */

if(
  window.gsap &&
  window.ScrollTrigger
){

  document.querySelectorAll(
    '.mood-item'
  ).forEach(
    function(item,idx){

      var x1 =
        10 +
        (idx%4)*22+
        '%';

      var y1 =
        15 +
        Math.floor(idx/4)*38+
        '%';


      gsap.set(
        item,
        {
          left:item.dataset.x0,
          top:item.dataset.y0,
          rotation:
            idx%2===0
            ? -6
            : 5
        }
      );


      gsap.to(
        item,
        {

          left:x1,

          top:y1,

          rotation:0,

          ease:'none',

          scrollTrigger:{

            trigger:'.mood',

            start:'top bottom',

            end:'bottom top',

            scrub:1

          }

        }
      );

    }
  );

}


/* =========================================================
   SOCIAL STRIP
   ========================================================= */

var socialStrip =
  document.getElementById(
    'socialStrip'
  );


if(socialStrip){

  [
    'Photography',
    'Behind the Scenes',
    'Reels',
    'Creative Work',
    'Photography',
    'Reels',
    'Behind the Scenes',
    'Creative Work'
  ].forEach(function(tag,i){

    var t =
      document.createElement(
        'div'
      );

    t.className =
      'social-tile';


    t.innerHTML =
      '<div class="tile-visual" '+
      'style="position:absolute;inset:0;background:'+
      tone(i+2)+
      '"></div>'+
      '<div class="tile-grain"></div>'+
      '<div class="stag">'+
      tag+
      '</div>';


    socialStrip.appendChild(t);

  });

}


/* =========================================================
   CONTACT CHIPS
   ========================================================= */

document.querySelectorAll(
  '#needChips .chip'
).forEach(function(chip){

  chip.addEventListener(
    'click',
    function(){

      chip.classList.toggle(
        'on'
      );

    }
  );

});


/* =========================================================
   CONTACT FORM → BACKEND
   ========================================================= */

var briefForm =
  document.getElementById(
    'briefForm'
  );


if(briefForm){

  briefForm.addEventListener(
    'submit',
    function(e){

      e.preventDefault();


      var form = e.target;

      var note =
        document.getElementById(
          'formNote'
        );


      var chips =
        [].slice.call(
          document.querySelectorAll(
            '#needChips .chip.on'
          )
        ).map(function(x){

          return x.textContent.trim();

        });


      var body = {

        name:
          (
            document.getElementById(
              'f-name'
            ) || {}
          ).value || '',


        email:
          (
            document.getElementById(
              'f-email'
            ) || {}
          ).value || '',


        phone:
          (
            document.getElementById(
              'f-phone'
            ) || {}
          ).value || '',


        brand:
          (
            document.getElementById(
              'f-brand'
            ) || {}
          ).value || '',


        project_type:
          chips.join(', '),


        details:
          (
            document.getElementById(
              'f-details'
            ) || {}
          ).value || '',


        project_date:
          (
            document.getElementById(
              'f-date'
            ) || {}
          ).value || '',


        budget:
          (
            document.getElementById(
              'f-budget'
            ) || {}
          ).value || ''

      };


      if(!body.email){

        if(note){

          note.textContent =
            'PLEASE ADD YOUR EMAIL.';

        }

        return;

      }


      fetch(
        '/api/inquiries',
        {

          method:'POST',

          headers:{
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(body)

        }
      )

      .then(function(r){

        return r.json()
          .then(function(d){

            if(!r.ok){

              throw Error(
                d.error ||
                'Unable to send'
              );

            }

            return d;

          });

      })

      .then(function(){

        if(note){

          note.textContent =
            'BRIEF RECEIVED. LET\'S BUILD THE FRAME.';

          note.classList.add(
            'received'
          );

        }


        form.reset();


        document.querySelectorAll(
          '#needChips .chip.on'
        ).forEach(
          function(x){

            x.classList.remove(
              'on'
            );

          }
        );

      })

      .catch(function(err){

        if(note){

          note.textContent =
            err.message ||
            'PLEASE TRY AGAIN.';

        }

      });

    }
  );

}


/* =========================================================
   EXTRA MOTION GRAPHICS
   ========================================================= */

})();


(function(){

  if(
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ){

    return;

  }


  /* ---------- HERO SCANLINE ---------- */

  var hero =
    document.getElementById(
      'hero'
    );


  if(hero){

    var scan =
      document.createElement(
        'div'
      );

    scan.className =
      'motion-scan';


    scan.style.cssText =
      'position:absolute;'+
      'left:0;'+
      'right:0;'+
      'top:-10%;'+
      'height:1px;'+
      'background:linear-gradient(90deg,transparent,#5befff,transparent);'+
      'box-shadow:0 0 18px #5befff;'+
      'opacity:.32;'+
      'z-index:1;'+
      'pointer-events:none';


    hero.appendChild(
      scan
    );


    if(window.gsap){

      gsap.to(
        scan,
        {
          top:'110%',
          duration:4.5,
          ease:'none',
          repeat:-1
        }
      );

    }

  }


  /* ---------- SCROLL PARALLAX ---------- */

  if(
    window.gsap &&
    window.ScrollTrigger
  ){

    gsap.utils.toArray(
      '.intro-tile,.hyd-tile,.social-tile'
    ).forEach(
      function(el,i){

        gsap.fromTo(
          el,

          {
            y:
              i%2
              ? 35
              : -25,

            scale:.94
          },

          {

            y:
              i%2
              ? -35
              : 25,

            scale:1,

            scrollTrigger:{

              trigger:el,

              start:'top bottom',

              end:'bottom top',

              scrub:1.2

            }

          }
        );

      }
    );


    gsap.utils.toArray(
      '.service-row h3'
    ).forEach(
      function(el){

        gsap.fromTo(
          el,

          {
            x:-18
          },

          {

            x:0,

            scrollTrigger:{

              trigger:el,

              start:'top 90%',

              end:'top 55%',

              scrub:.7

            }

          }
        );

      }
    );


    /* ---------- MOODBOARD FLOAT ---------- */

    gsap.utils.toArray(
      '.mood-item'
    ).forEach(
      function(el,i){

        gsap.to(
          el,
          {

            rotation:
              i%2
              ? 3
              : -3,

            y:
              i%2
              ? 12
              : -12,

            duration:
              3+i*.25,

            repeat:-1,

            yoyo:true,

            ease:'sine.inOut'

          }
        );

      }
    );

  }


  /* ---------- CARD TILT ---------- */

  document.querySelectorAll(
    '.frame-item,.intro-tile,.hyd-tile,.social-tile'
  ).forEach(function(card){

    card.addEventListener(
      'mousemove',
      function(e){

        var r =
          card.getBoundingClientRect();


        var x =
          (e.clientX-r.left) /
          r.width -
          .5;


        var y =
          (e.clientY-r.top) /
          r.height -
          .5;


        card.style.transform =
          'perspective(900px) '+
          'rotateX('+
          (-y*4)+
          'deg) '+
          'rotateY('+
          (x*5)+
          'deg) '+
          'translateY(-3px)';

      }
    );


    card.addEventListener(
      'mouseleave',
      function(){

        card.style.transform =
          '';

      }
    );

  });


  /* ---------- GLITCH HEADINGS ---------- */

  document.querySelectorAll(
    '.hero-title h1,h2'
  ).forEach(function(el){

    el.addEventListener(
      'mouseenter',
      function(){

        el.style.textShadow =
          '2px 0 #ff4fd8,-2px 0 #5befff';


        setTimeout(
          function(){

            el.style.textShadow =
              '';

          },
          220
        );

      }
    );

  });

})();


/* =========================================================
   INTERNET IMAGE SOURCES
   ========================================================= */

(function(){

  var imgs = [

    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=82',

    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=82',

    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82',

    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=82',

    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=82',

    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=82',

    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=82',

    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'

  ];


  var tiles =
    document.querySelectorAll(
      '.intro-tile .tile-visual,'+
      '.cs-tile .tile-visual,'+
      '.hyd-tile .tile-visual,'+
      '.reel-seg .tile-visual'
    );


  tiles.forEach(
    function(el,i){

      el.style.backgroundImage =
        'linear-gradient('+
        '180deg,'+
        'rgba(0,0,0,.03),'+
        'rgba(0,0,0,.35)'+
        '),url("'+
        imgs[
          i%imgs.length
        ]+
        '")';


      el.style.backgroundSize =
        'cover';


      el.style.backgroundPosition =
        'center';

    }
  );


  /* ---------- SOCIAL IMAGES ---------- */

  var socialImgs = [

    imgs[1],
    imgs[5],
    imgs[2],
    imgs[0],
    imgs[6],
    imgs[3],
    imgs[4],
    imgs[7]

  ];


  document.querySelectorAll(
    '.social-tile .tile-visual'
  ).forEach(
    function(el,i){

      el.style.backgroundImage =
        'linear-gradient('+
        '180deg,'+
        'rgba(0,0,0,.05),'+
        'rgba(0,0,0,.4)'+
        '),url("'+
        socialImgs[
          i%socialImgs.length
        ]+
        '")';


      el.style.backgroundSize =
        'cover';


      el.style.backgroundPosition =
        'center';

    }
  );


  /* ---------- FEATURED IMAGE ---------- */

  var featured =
    document.getElementById(
      'featuredBg'
    );


  if(featured){

    featured.style.backgroundImage =
      'linear-gradient('+
      '90deg,'+
      'rgba(5,6,10,.82),'+
      'rgba(5,6,10,.25)'+
      '),url("'+
      imgs[2]+
      '")';


    featured.style.backgroundSize =
      'cover';


    featured.style.backgroundPosition =
      'center';

  }

})();

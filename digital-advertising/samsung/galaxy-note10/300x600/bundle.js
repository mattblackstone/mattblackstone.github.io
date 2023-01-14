(function () {
  'use strict';

  // BannerUtils version 3.1.5
  function es5() {
    return parseInt('010', 10) === 10 && function () {
      return !this;
    }() && !!(Date && Date.prototype && Date.prototype.toISOString); // IE10, FF21, CH23, SF6, OP15, iOS7, AN4.4
  }
  var log = {
    debug: true,
    trace: function trace(message) {
      if (window.console && this.debug) {
        window.console.log(message);
      }
    }
  };
  var timer = {
    start: function start() {
      this.startTime = new Date().getTime();
    },

    get milliseconds() {
      return new Date().getTime() - this.startTime;
    },

    get seconds() {
      return (new Date().getTime() - this.startTime) * 0.001;
    },

    stop: function stop() {
      var elapsed = new Date().getTime() - this.startTime;
      log.trace("seconds elapsed: " + elapsed * 0.001);
    }
  };
  function domIds(scope) {
    if (scope === void 0) {
      scope = document;
    }

    var all = scope.getElementsByTagName('*');
    var haveIds = {};
    var i = all.length;

    while (i--) {
      if (all[i].id) {
        var safeId = all[i].id.replace(/-|:|\./g, '_');
        haveIds[safeId] = all[i];
      }
    }

    return haveIds;
  }

  var dom;
  var Banner = {
    init: function init(options) {
      log.debug = false; // set to false before publishing

      var edge = /Edge/.test(window.navigator.userAgent);
      var ie = window.navigator.msPointerEnabled && !edge;
      dom = domIds();
      var gsap = TweenMax;
      var unsupported = 0; ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////

      function adClickThru() {
        dom.ad_border.addEventListener('click', function () {
          window.open(window.clickTag);
        });
        dom.ad_border.style.cursor = 'pointer';
        enableRollover();
      }

      function onAdHover() {
        // gsap.to(dom.cta, 0.25, {className: '+=cta-hover', ease: Cubic.easeInOut});
        gsap.set(dom.cta, {
          className: '+=cta-hover'
        });
      }

      function onAdOut() {
        // gsap.to(dom.cta, 0.25, {className: '-=cta-hover', ease: Cubic.easeInOut});
        gsap.set(dom.cta, {
          className: '-=cta-hover'
        });
      }

      function enableRollover() {
        dom.ad_border.addEventListener('mouseenter', function () {
          onAdHover();
        });
        dom.ad_border.addEventListener('mouseleave', function () {
          onAdOut();
        });
      } ////////////////////////////////////////////////////// INIT //////////////////////////////////////////////////////


      adClickThru();

      if (options.unsupported) {
        options.unsupported.forEach(function (browser) {
          if (browser.toLowerCase() === 'ie' && ie) unsupported++;
          if (browser.toLowerCase() === 'edge' && edge) unsupported++;
        });
      }

      if (es5() && unsupported < 1) {
        timer.start();
        options.animStart();
        dom.ad_content.classList.remove('invisible');
      } else {
        gsap.set('#backup', {
          className: 'backup'
        });
      }
    },
    animFinish: function animFinish() {
      log.trace('finish');
      TweenMax.to('#cta', 0.75, {
        opacity: 1,
        ease: Power2.easeInOut,
        onComplete: function onComplete() {
          timer.stop();
        }
      });
    }
  };

  var Anim = {
    play: function play() {
      var gsap = TweenMax;
      var kvStyle = window.getComputedStyle(document.getElementById('kv'));
      var kvHeight = parseInt(kvStyle.width, 10); // const kvWidth = parseInt(kvStyle.width, 10);

      function frame1() {
        gsap.from('#kv_devices', 2.5, {
          y: kvHeight * 0.0928,
          ease: Power3.easeInOut
        });
        gsap.from('#kv_bg', 2.5, {
          opacity: 1,
          scaleX: 1.035,
          scaleY: 1.015,
          ease: Power3.easeInOut
        });
        gsap.from('#pen', 2.5, {
          delay: 1,
          y: kvHeight * -1.2,
          ease: Power4.easeOut
        });
        gsap.from('#pen_ref', 2.5, {
          delay: 1,
          y: kvHeight * 1.2,
          ease: Power4.easeOut
        });
        gsap.from(['#pen', '#pen_ref'], 0.25, {
          delay: 1,
          opacity: 0,
          ease: Power4.easeOut
        });
        gsap.from('#screens_grad1', 1.25, {
          delay: 1.25,
          opacity: 0,
          ease: Power1.easeInOut
        });
        gsap.from('#screens_grad2', 1.5, {
          delay: 1.75,
          opacity: 0,
          ease: Power1.easeInOut
        });
        gsap.delayedCall(2.5, frame2);
      }

      function frame2() {
        gsap.to(['#logos'], 1.75, {
          opacity: 0.95,
          ease: Power2.easeInOut
        });
        gsap.to(['#logo_galaxy', '#logo_n10'], 1.5, {
          x: 0,
          y: 0,
          scale: 1,
          ease: Power3.easeOut
        });
        gsap.delayedCall(1.5, frame3);
      }

      function frame3() {
        gsap.to('#cta', 0.75, {
          opacity: 1,
          ease: Power2.easeInOut
        });
      }

      frame1();
    }
  };

  window.onload = function () {
    var gsap = TweenMax;
    var paths = document.querySelectorAll('.cls-1');
    var writeSpeed = 0.001; // smaller = faster

    var lift = writeSpeed * 100; //

    function penUp(speed) {
      var dur = speed ? speed : lift * 0.5;
      gsap.to('.spen', dur, {
        x: 15,
        y: -3,
        rotation: 2,
        ease: Sine.easeInOut
      });
      gsap.to('.spen-shadow', dur, {
        x: 15,
        y: 3,
        rotation: -2,
        opacity: 0.67,
        ease: Sine.easeInOut
      });
    }

    function penDown() {
      gsap.to('.spen', lift * 0.5, {
        x: 0,
        y: 0,
        rotation: 0,
        ease: Sine.easeInOut
      });
      gsap.to('.spen-shadow', lift * 0.5, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: Sine.easeInOut
      });
    }

    function frame1() {
      var rect = dom.head2.getBoundingClientRect();
      dom.writing.style.left = Math.round(rect.left) + "px";
      dom.writing.style.top = Math.round(rect.top) + "px";
      penUp();
      gsap.from('#spen', 0.33, {
        delay: 1,
        x: 300,
        y: -100,
        ease: Sine.easeOut,
        onComplete: frame2
      });
    }

    function frame2() {
      var del = 0;
      var dur = 0;

      if (paths) {
        for (var i = 0; i < paths.length; i++) {
          var curve = MorphSVGPlugin.pathDataToBezier(paths[i]);
          dur = paths[i].getAttribute('d').length * writeSpeed;
          gsap.to('#spen', lift, {
            delay: del,
            x: curve[0].x,
            y: curve[0].y,
            ease: Sine.easeInOut,
            onStart: penUp
          });
          gsap.delayedCall(del + lift * 0.5, penDown);
          del += lift;
          gsap.to('#spen', dur, {
            delay: del,
            bezier: {
              curviness: 0.4,
              values: curve,
              type: 'cubic'
            },
            ease: Sine.easeInOut
          });
          gsap.from(paths[i], dur, {
            delay: del,
            drawSVG: '0%',
            ease: Sine.easeInOut
          });
          del += dur;
        }
      }

      dom.ink.classList.remove('invisible');
      gsap.delayedCall(del + dur, frame3);
    }

    function frame3() {
      var wait = 0.333;
      penUp(wait);
      gsap.to('#spen', 1.5, {
        delay: wait,
        x: '+=150',
        y: '-=50',
        ease: Power2.easeOut
      });
      gsap.set('#ink', {
        delay: wait * 2,
        className: '+=invisible'
      });
      gsap.set('#head2', {
        delay: wait * 2,
        className: '-=invisible'
      });
      gsap.delayedCall(wait * 2 + 2, frame4);
    }

    function frame4() {
      gsap.from('#end_frame', 0.2, {
        autoAlpha: 0
      });
      gsap.from('#kv', 0.3, {
        delay: 0.1,
        autoAlpha: 0
      });
      Anim.play(); // show cta
    }

    Banner.init({
      animStart: frame1,
      unsupported: []
    });
  };

}());

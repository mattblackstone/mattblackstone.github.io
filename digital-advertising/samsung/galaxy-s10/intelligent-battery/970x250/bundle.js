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

  var Banner = {
    init: function init() {
      log.debug = true; // set to false before publishing

      var dom = domIds();
      var rect = dom.device.getBoundingClientRect();
      var gsap = TweenMax;
      var ease1 = Power4.easeInOut;
      var ease2 = Power4.easeIn;
      var ease3 = Sine.easeOut;
      var head2delays = dom.head2.dataset.delays.split(',').map(function (x) {
        return parseFloat(x);
      }); ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

      function frameStart() {
        if (es5()) {
          frame0();
        } else {
          gsap.set('#backup', {
            className: 'backup'
          });
        }
      }

      function frame0() {
        timer.start();
        gsap.delayedCall(2, frame1);
        dom.ad_content.classList.remove('invisible');
      }

      function frame1() {
        var dur = 1.5;
        var letters = [dom.ltr_G, dom.ltr_a, dom.ltr_l, dom.ltr_a2, dom.ltr_x, dom.ltr_y];
        var head2Split = new SplitText(dom.head2, {
          type: ['words']
        });
        gsap.to(dom.dark_content, dur, {
          x: rect.left,
          ease: ease1
        });
        gsap.to([dom.device, dom.dark], dur, {
          x: 0,
          ease: ease1
        });
        gsap.delayedCall(dur * 0.5, function () {
          gsap.set(dom.charging, {
            delay: 0.25,
            className: '+=last-frame'
          });
          gsap.to(dom.percent, 0.75, {
            alpha: 1,
            ease: Power1.easeInOut
          });
          gsap.to(dom.percent, 0.75, {
            delay: 2,
            alpha: 0,
            ease: Power1.easeInOut
          });
          gsap.set(dom.percent, {
            delay: 1,
            innerHTML: '100%'
          });
        });
        gsap.to(letters, 0.25, {
          delay: dur * 0.25,
          alpha: 1,
          ease: ease2
        });
        gsap.to(letters, 11, {
          delay: dur * 0.25,
          x: 0,
          y: 0,
          ease: ease3,
          onComplete: function onComplete() {
            timer.stop();
          }
        });
        var i = head2Split.words.length;

        while (i--) {
          gsap.from(head2Split.words[i], 0.25, {
            delay: dur * 0.667 + head2delays[i],
            autoAlpha: 0
          });
        }

        gsap.set(dom.head2, {
          alpha: 1
        });
        gsap.delayedCall(dur + 0.5, frame2);
      }

      function frame2() {
        var dur = 1.5;
        gsap.to(dom.dark_content, dur, {
          x: rect.left * 2,
          ease: ease2
        });
        gsap.to([dom.device, dom.dark], dur, {
          x: rect.left * -1,
          ease: ease2,
          onComplete: function onComplete() {
            gsap.to(dom.legal, dur, {
              alpha: 1,
              ease: ease2
            });
            gsap.to(dom.cta, 0.75, {
              alpha: 1,
              ease: ease2
            });
          }
        });
      } ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////


      function adClickThru() {
        dom.border.addEventListener('click', function () {
          window.open(window.clickTag);
        });
        enableRollover();
      }

      function onAdHover() {
        gsap.to(dom.cta_up, 0.25, {
          alpha: 0,
          ease: Cubic.easeIn
        });
        gsap.to(dom.cta_over, 0.25, {
          alpha: 1,
          ease: Cubic.easeOut
        });
      }

      function onAdOut() {
        gsap.to(dom.cta_over, 0.25, {
          alpha: 0,
          ease: Cubic.easeIn
        });
        gsap.to(dom.cta_up, 0.25, {
          alpha: 1,
          ease: Cubic.easeOut
        });
      }

      function enableRollover() {
        dom.border.addEventListener('mouseenter', function () {
          onAdHover();
        });
        dom.border.addEventListener('mouseleave', function () {
          onAdOut();
        });
      } ////////////////////////////////////////////////////// INIT //////////////////////////////////////////////////////


      adClickThru();
      frameStart();
    }
  };

  window.onload = function () {
    Banner.init();
  };

}());

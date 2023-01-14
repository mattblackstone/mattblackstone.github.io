(function () {
  'use strict';

  // BannerUtils version 3.1.4
  function es5() {
    // ES5 compliance for: IE10 99%, FF38 99%, CH43 98%, OP38 98%, AN4.4 98%, iOS7 97%, SF6 96%
    // const LEADING_ZEROS = (parseInt('010', 10) === 10); // IE9, FF21, CH23, SF6, OP15, iOS7, AN4.4
    // const USE_STRICT = (function(){return !this;})(); // IE10, FF4, CH13, SF6, OP12.1, iOS5.1, AN3
    // const DATE_ISO_STRING = !!(Date && Date.prototype && Date.prototype.toISOString); // IE9, FF3.5, CH13, SF5, OP10.5, iOS6, AN4
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
      log.debug = /true/i.test(window.debug);
      log.trace(window.versionData);
      var dom = domIds();
      var animFrames = 35,
          animW = 81,
          head1b = new SplitText('#head1b', {
        type: ['words']
      }),
          head2b = new SplitText('#head2b', {
        type: ['words']
      }),
          head1Delay = headDelay(dom.head1a),
          head2Delay = headDelay(dom.head2a);

      function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
      }

      function headDelay(elem) {
        return clamp(elem.innerHTML.length * 0.035, 1, 2.5);
      }

      function frameStart() {
        if (es5()) {
          setCustomStyles();
        } else {
          dom.backup.className = 'backup';
        }
      }

      function setCustomStyles() {
        if (window.bg_color) dom.ad_content.style.backgroundColor = window.bg_color;
        frame0();
      }

      function playAnimation(id) {
        var tag = dom[id].tagName.toLowerCase();

        if (tag === 'iframe') {
          // template testing only
          if (dom[id].contentWindow.play) dom[id].contentWindow.play();
        } else if (tag === 'img') {
          // gif animation
          var reset = dom[id].src;
          dom[id].src = reset;
        } else if (tag === 'div') {
          // embedded animation
          if (window.play) window.play();
        }
      }

      function frame0() {
        dom.ad_content.classList.remove('invisible');
        var tl = new TimelineMax({
          onComplete: enableRollover
        });
        tl.from("#head1", 0.75, {
          autoAlpha: 0,
          y: "+=80",
          ease: Strong.easeOut
        }, "+=0.5").staggerFrom(head1b.words, 0.01, {
          autoAlpha: 0
        }, 0.2, "+=" + head1Delay).to(['#head1', '#bg_img1_wrap', "#head4"], .85, {
          y: "-=300",
          ease: Quart.easeInOut
        }, "+=1.5").set('#bg_img1_gradient', {
          autoAlpha: 0
        }).to('#head1', 0.1, {
          autoAlpha: 0
        }, "-=0.55").from('#head2', 0.55, {
          y: "+=80",
          autoAlpha: 0,
          ease: Quart.easeOut
        }, "-=0.4").staggerFrom(head2b.words, 0.01, {
          autoAlpha: 0
        }, 0.2, "+=" + head2Delay).to('#bg_img1_wrap', .8, {
          y: 0,
          autoAlpha: 1,
          ease: Strong.easeOut
        }, "+=1.5").add("uiAnim", "-=0.8").from('#img1', .8, {
          y: "+=80",
          autoAlpha: 0,
          ease: Strong.easeOut,
          force3D: false
        }, "uiAnim").call(playAnimation, ["img1"], this, "uiAnim").set('#head2', {
          autoAlpha: 0
        }, "-=.8").to(['#bg_img1_wrap', '#img1'], 0.7, {
          y: "-=600",
          ease: Power2.easeInOut,
          force3D: false
        }, "+=3").to("#ad_content", 0.5, {
          backgroundColor: "#ffe01b"
        }, "-=0.4").from('#head3', .6, {
          y: "+=80",
          autoAlpha: 0,
          ease: Quart.easeOut
        }, "-=.35").to('#logo_anim', 1, {
          backgroundPosition: "+=" + animFrames * animW + "px",
          ease: SteppedEase.config(animFrames)
        }, "+=0.5").to('#branding1', .1, {
          y: "+=3",
          repeat: 1,
          yoyo: true
        }, "-=.5").to('#branding2', .1, {
          y: "-=2",
          repeat: 1,
          yoyo: true
        }, "-=.3"); // tl.seek(9);
      } ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////


      dom.ad_content.addEventListener('click', function () {
        window.open(window.clickTag);
      });

      function enableRollover() {
        dom.ad_content.addEventListener('mouseover', function () {
          TweenMax.to("#cta", 0.25, {
            backgroundColor: "#05565e"
          });
        });
        dom.ad_content.addEventListener('mouseout', function () {
          TweenMax.to("#cta", 0.25, {
            backgroundColor: "#006e7a"
          });
        });
      }

      frameStart();
    }
  };

  window.onload = function () {
    Banner.init();
  };

}());

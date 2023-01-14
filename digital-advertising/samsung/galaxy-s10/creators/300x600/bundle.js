(function () {
  'use strict';

  // BannerUtils version 3.1.3
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
  var domUtils = {
    // DOM UTILS
    getAllIdElements: function getAllIdElements(scope) {
      if (scope === void 0) {
        scope = document;
      }

      // returns an array of all elements in scope that have an ID
      var items = scope.getElementsByTagName('*');
      var elements = [];

      for (var i = items.length; i--;) {
        if (items[i].hasAttribute('id')) {
          elements.push(items[i]);
        }
      }

      return elements;
    },
    varName: function varName(id, camel) {
      var newname;
      camel ? newname = id.replace(/[-_]([a-z])/g, function (g) {
        return g[1].toUpperCase();
      }).replace(/[-_]/g, '') : newname = id.replace(/-/g, '_');
      return newname;
    },
    getAllIds: function getAllIds(scope, trace, camel) {
      if (scope === void 0) {
        scope = document;
      }

      // returns an array of strings of all the id names in scope
      var items = scope.getElementsByTagName('*');
      var ids = [];
      var varlist = "\nfunction getEl(id){\n    return document.getElementById(id);\n}\nvar ";
      var len = items.length;

      for (var i = 0; i < len; i++) {
        if (items[i].hasAttribute('id')) {
          ids.push(items[i].id);

          if (trace) {
            varlist += this.varName(items[i].id, camel) + " = getEl('" + items[i].id + "')";

            if (i > -1) {
              varlist += ',\n    ';
            }
          }
        }
      }

      if (trace) {
        varlist = varlist.replace(/,\s([^,]+)$/, '; $1\n\n');
        log.trace(varlist);
      }

      return ids;
    },
    makeVarsFromIds: function makeVarsFromIds(scope, camel) {
      if (scope === void 0) {
        scope = document;
      }

      var ids = this.getAllIds(scope);
      var i = ids.length;
      var elements = {};

      while (i--) {
        elements[this.varName(ids[i], camel)] = document.getElementById(ids[i]);
      }

      return elements;
    },
    recordClasses: function recordClasses(elements) {
      if (elements === void 0) {
        elements = this.getAllIdElements(document);
      }

      // record each element's current classList
      var i = elements.length;

      while (i--) {
        elements[i].cl = '';
        elements[i].cl += elements[i].className;
      }
    },
    resetClasses: function resetClasses(elements, callback) {
      if (elements === void 0) {
        elements = this.getAllIdElements(document);
      }

      // resets the classes to their recorded state (you must call recordStates() before using this method)
      var i = elements.length;

      while (i--) {
        if (typeof elements[i].cl !== 'undefined') {
          elements[i].className = elements[i].cl;
        } else {
          this.trace("initial state not recorded for: " + elements[i].id);
        }
      }

      if (callback) {
        var dly = elements.length * 10; // KLUDGE adds .01 seconds delay for each element

        setTimeout(function () {
          callback.apply();
        }, dly);
      }
    }
  };

  var Banner = {
    init: function init() {
      // log.debug = true; // set to false before publishing
      var dom = domUtils.makeVarsFromIds();
      var gsap = TweenMax;
      var ease = Sine.easeOut; ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

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
        var pts1 = [{
          x: -8,
          y: -30
        }, {
          x: 4,
          y: 10
        }, {
          x: 2,
          y: -5
        }];
        var pts2 = [{
          x: 8,
          y: 30
        }, {
          x: -4,
          y: -10
        }, {
          x: -2,
          y: 5
        }];
        var uiTrans = getComputedStyle(dom.ui).transform;
        var uiScale = /^matrix/i.test(uiTrans) ? parseFloat(uiTrans.split('(')[1].split(',')[0]) : 1;
        dom.ad_content.classList.remove('invisible');
        gsap.to(dom.headline1, 0.333, {
          delay: 0.25,
          alpha: 1,
          ease: ease
        });
        gsap.set(dom.holding, {
          x: pts1[0].x,
          y: pts1[0].y
        });
        gsap.set(dom.paris_horiz, {
          x: pts2[0].x,
          y: pts2[0].y
        });
        gsap.set(dom.ui_dot, {
          x: pts2[0].x / uiScale,
          y: pts2[0].y / uiScale
        });
        gsap.to(dom.holding, 2.5, {
          delay: 0.5,
          x: pts1[1].x,
          y: pts1[1].y,
          ease: Back.easeInOut,
          onStart: function onStart() {
            gsap.to(dom.paris_horiz, 2.5, {
              x: pts2[1].x,
              y: pts2[1].y,
              ease: Back.easeInOut
            });
            gsap.to(dom.ui_dot, 2.5, {
              x: pts2[1].x / uiScale,
              y: pts2[1].y / uiScale,
              ease: Back.easeInOut
            });
          },
          onComplete: function onComplete() {
            gsap.to(dom.paris_horiz, 2, {
              x: pts2[2].x,
              y: pts2[2].y,
              ease: Sine.easeInOut
            });
            gsap.to(dom.ui_dot, 2, {
              x: pts2[2].x / uiScale,
              y: pts2[2].y / uiScale,
              ease: Sine.easeInOut
            });
            gsap.to(dom.holding, 2, {
              x: pts1[2].x,
              y: pts1[2].y,
              ease: Sine.easeInOut,
              onComplete: function onComplete() {
                gsap.to([dom.holding, dom.paris_horiz, dom.ui_dot], 1.5, {
                  x: 0,
                  y: 0,
                  ease: Sine.easeInOut
                });
              }
            });
          }
        });
        gsap.to(dom.headline1, 0.25, {
          delay: 3,
          autoAlpha: 0,
          ease: ease
        });
        gsap.to(dom.headline2, 0.333, {
          delay: 3.5,
          alpha: 1,
          ease: ease
        });
        gsap.to(dom.h2b, 0.333, {
          delay: 5,
          alpha: 1,
          ease: ease
        });
        gsap.delayedCall(5.75, frame1);
      }

      function frame1() {
        gsap.killTweensOf(dom.ui_dot);
        gsap.set(dom.ui_dot, {
          x: 0,
          y: 0
        });
        gsap.from([dom.ui_line_left, dom.ui_line_right], 0.75, {
          scaleX: 0,
          ease: Sine.easeInOut
        });
        gsap.set([dom.ui_line_left, dom.ui_line_right], {
          borderColor: '#ff0'
        });
        gsap.set(dom.ui_circ, {
          delay: 0.666,
          borderColor: '#ff0'
        });
        gsap.from(dom.ui_dot_big, 0.2, {
          delay: 0.666,
          scale: 0.7,
          alpha: 0,
          ease: ease,
          onStart: function onStart() {
            dom.ui_dot_big.classList.remove('invisible');
            gsap.to(dom.ui_dot, 0.3, {
              autoAlpha: 0,
              ease: Sine.easeIn
            });
          },
          onComplete: function onComplete() {
            gsap.to(dom.ui_dot_big, 0.1, {
              autoAlpha: 0,
              scale: 0.7,
              ease: Sine.easeIn
            });
            gsap.set(dom.ui, {
              delay: 0.3,
              visibility: 'hidden'
            });
            gsap.from(dom.paris_horiz, 0.1, {
              delay: 0.6,
              alpha: 0.5,
              immediateRender: false
            });
          }
        });
        gsap.delayedCall(2, frame2);
      }

      function frame2() {
        gsap.to(dom.headline2, 0.25, {
          autoAlpha: 0,
          ease: ease
        });
        gsap.to([dom.lifestyle, dom.holding], 0.5, {
          autoAlpha: 0,
          ease: Sine.easeIn,
          onComplete: frame3
        });
      }

      function frame3() {
        var dur = 4;
        gsap.to(dom.devices, 1, {
          alpha: 1,
          ease: Sine.easeIn
        });
        gsap.to(dom.headline3, 1, {
          delay: 0.666,
          alpha: 1,
          ease: ease
        });
        gsap.to(dom.cta, 0.333, {
          delay: 1.333,
          alpha: 1,
          ease: ease
        });
        var rot = -28;
        gsap.from(dom.s10p, dur, {
          rotationY: rot,
          rotationZ: 0.02,
          ease: ease
        });
        gsap.from(dom.s10p_front, dur, {
          x: -5,
          scaleX: 0.985,
          ease: ease
        });
        gsap.to(dom.s10p_edge, dur * 0.25, {
          autoAlpha: 0,
          ease: Sine.easeIn
        });
        gsap.to(dom.glare, dur, {
          x: -500,
          ease: ease,
          onComplete: function onComplete() {
            timer.stop();
          }
        });
      } ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////


      function adClickThru() {
        dom.ad_content.addEventListener('click', function () {
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
        dom.ad_content.addEventListener('mouseenter', function () {
          onAdHover();
        });
        dom.ad_content.addEventListener('mouseleave', function () {
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

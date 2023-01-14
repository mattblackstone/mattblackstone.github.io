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
    init: function init(opts) {
      // log.debug = true; // set to false before publishing
      var dom = domUtils.makeVarsFromIds();
      var gsap = TweenMax; ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

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
        gsap.set(dom.fold, {
          rotationX: opts.foldStart.rx,
          rotationY: opts.foldStart.ry,
          rotationZ: opts.foldStart.rz
        });
        dom.ad_content.classList.remove('invisible');
        frame1();
      }

      function frame1() {
        var dur = 4;
        var ease = Power2.easeOut;
        var ease2 = Power2.easeInOut;
        gsap.to(dom.device, dur, {
          y: -33,
          ease: ease
        });
        gsap.to(dom.fold, dur, {
          rotationX: opts.foldEnd.rx,
          rotationY: opts.foldEnd.ry,
          rotationZ: opts.foldEnd.rz,
          z: 60,
          ease: ease
        });
        gsap.to([dom.parts_right, dom.parts_left], dur, {
          y: -4,
          scaleY: 0.975,
          ease: ease
        });
        gsap.delayedCall(dur * 0.5, function () {
          gsap.to([dom.fashion_sm, dom.google_maps], 0.2, {
            x: -71,
            ease: ease2
          });
          gsap.to(dom.website, 0.2, {
            width: 119,
            ease: ease2
          });
          gsap.delayedCall(0.067, function () {
            dom.header.classList.add('ui-header-grey');
            dom.header.classList.remove('ui-header-white');
          });
          gsap.delayedCall(1.5, function () {
            gsap.set([dom.fashion_lg, dom.dark_sm], {
              alpha: 1
            });
            gsap.to(dom.fashion_lg, 0.6, {
              x: -13.5,
              y: 0,
              ease: ease2,
              onComplete: function onComplete() {
                gsap.set(dom.dark_lg, {
                  alpha: 1
                });
                gsap.to(dom.fashion_lg, 0.4, {
                  x: 0,
                  width: 119,
                  scale: 1,
                  ease: Sine.easeInOut,
                  onComplete: function onComplete() {
                    gsap.set(dom.website, {
                      scale: 0.597,
                      x: 121.5,
                      height: 199.5
                    });
                    gsap.set([dom.dark_lg, dom.fashion_sm], {
                      alpha: 0
                    });
                    dom.fashion_lg.classList.remove('shadow');
                    gsap.to(dom.legal, 0.5, {
                      alpha: 1,
                      ease: Power0.easeNone
                    });
                  }
                });
              }
            });
          });
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
    Banner.init({
      foldStart: {
        rx: 0,
        ry: 0,
        rz: -30
      },
      foldEnd: {
        rx: 42,
        ry: 0,
        rz: -0
      }
    });
  };

}());

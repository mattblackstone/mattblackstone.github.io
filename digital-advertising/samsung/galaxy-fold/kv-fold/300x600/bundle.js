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
      var isIE = window.navigator.msPointerEnabled; // IE10+
      ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

      function frameStart() {
        if (es5() && !isIE) {
          frame0();
        } else {
          gsap.set('#backup', {
            className: 'backup'
          });
        }
      }

      function frame0() {
        dom.ad_content.classList.remove('invisible');
        frame1();
      }

      function frame1() {
        var dur = 4;
        var dur2 = 3;
        var dur3 = 5;
        var ease = Power2.easeOut;
        var ease2 = Power2.easeInOut;
        var ease3 = Sine.easeInOut;
        gsap.to(dom.device, dur, {
          y: -33,
          ease: ease
        });
        gsap.to([dom.fold, dom.fold_middle], dur, {
          rotationX: 56,
          z: 45,
          ease: ease
        });
        gsap.to(dom.shadow, dur, {
          rotationX: 56,
          z: -45,
          y: 40,
          ease: ease
        });
        gsap.to([dom.parts_right, dom.parts_left, dom.parts_middle], dur, {
          y: -4,
          scaleY: 0.985,
          ease: ease
        });
        gsap.from([dom.glare_left, dom.glare_right], dur * 0.5, {
          alpha: 0,
          ease: Linear.easeNone,
          onComplete: function onComplete() {
            gsap.to(dom.fold_left, dur2, {
              rotationY: 37,
              ease: ease2
            });
            gsap.to(dom.fold_right, dur2, {
              rotationY: -37,
              ease: ease2
            });
            gsap.to(dom.fold_middle, dur2, {
              alpha: 1,
              y: -0.75,
              ease: ease2
            });
            gsap.to(dom.glare_left, dur2, {
              alpha: 0.5,
              scaleX: 0.5,
              ease: ease2
            });
            gsap.to(dom.glare_right, dur2, {
              alpha: 1,
              scaleX: 1.2,
              ease: ease2
            });
            gsap.to(dom.reflect_right, dur2, {
              alpha: 1,
              scaleX: 1.75,
              skewY: 67,
              ease: ease
            });
            gsap.to(dom.shadow_right, dur2, {
              x: -0.1,
              scaleX: 1.155,
              rotationY: 18,
              ease: ease2
            });
            gsap.to(dom.shadow_left, dur2, {
              x: 0.1,
              scaleX: 1.155,
              rotationY: -18,
              ease: ease2
            });
          }
        });
        gsap.to(dom.ltr_l_F, dur3, {
          x: 7,
          y: 43,
          scaleX: 0.62,
          scaleY: 1.07,
          ease: ease3
        });
        gsap.to([dom.ltr_l_o, dom.ltr_m_o, dom.ltr_r_o], dur3, {
          x: -31,
          y: -172,
          scaleX: 0.77,
          scaleY: 1.25,
          ease: ease3
        });
        gsap.to([dom.ltr_l_l, dom.ltr_m_l, dom.ltr_r_l], dur3, {
          x: 68,
          y: -15,
          scaleX: 1.42,
          scaleY: 1.03,
          rotation: 90,
          ease: ease3
        });
        gsap.to(dom.ltr_r_d, dur3, {
          x: 5,
          y: 66,
          scaleX: 0.57,
          scaleY: 0.86,
          ease: ease3
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

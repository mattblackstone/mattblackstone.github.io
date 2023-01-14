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
    init: function init() {
      // log.debug = true; // set to false before publishing
      var dom = domUtils.makeVarsFromIds();
      var gsap = TweenMax; ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

      function frameStart() {
        if (es5()) {
          frame1();
        } else {
          gsap.set('#backup', {
            className: 'backup'
          });
        }
      }

      function frame1() {
        var dur = 4;
        var rot = 28;
        var ease = Sine.easeOut;
        rain();
        gsap.from(dom.s10p, dur, {
          rotationX: rot,
          rotationZ: 0.02,
          ease: ease
        });
        gsap.from(dom.s10p_front, dur, {
          y: -5,
          scaleY: 0.985,
          ease: ease
        });
        gsap.to(dom.s10p_edge, dur * 0.25, {
          autoAlpha: 0,
          ease: Sine.easeIn
        });
        gsap.to(dom.glare, dur, {
          y: -435,
          ease: ease
        });
        dom.ad_content.classList.remove('invisible');
      }

      function rain() {
        // https://www.html5canvastutorials.com/advanced/html5-canvas-rain-effect/
        var canvas = dom.sparks;
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var init = [];
        var maxParts = 150;
        var particles = [];
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        for (var a = 0; a < maxParts; a++) {
          init.push({
            x: Math.random() * w,
            y: Math.random() * h,
            l: Math.random() * 0.9 + 0.1,
            xs: -2 + Math.random() * 2 + 1,
            ys: Math.random() * 4 + 4
          });
        }

        for (var b = 0; b < maxParts; b++) {
          particles[b] = init[b];
        }

        function draw() {
          ctx.clearRect(0, 0, w, h);

          for (var c = 0; c < particles.length; c++) {
            var p = particles[c];
            ctx.strokeStyle = "rgba(200," + Math.ceil(p.l * 100) + ",255," + p.l + ")";
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs * 0.75, p.y + p.l * p.ys * 0.75);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.x + p.l * p.xs * 0.25, p.y + p.l * p.ys * 0.25);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
          }

          move();
        }

        function move() {
          for (var b = 0; b < particles.length; b++) {
            var p = particles[b];
            p.x += p.xs * 1.333;
            p.y += p.ys * 1.333;

            if (p.x > w || p.y > h) {
              p.x = Math.random() * w;
              p.y = -20;
            }
          }
        }

        var raf;
        var count = 0;

        function fps() {
          raf = requestAnimationFrame(fps);
          if (count % 2 === 0) draw();
          count++;
        }

        requestAnimationFrame(fps);
        gsap.to(dom.sparks_bg, 1, {
          delay: 5,
          alpha: 1,
          ease: Sine.easeIn,
          onComplete: function onComplete() {
            cancelAnimationFrame(raf);
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

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

  /* global lottie */
  var Banner = {
    init: function init(cuepoints) {
      // log.debug = true; // set to false before publishing
      // const edge = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style && /Edge/.test(window.navigator.userAgent);
      var dom = domUtils.makeVarsFromIds();
      var gsap = TweenMax;
      var functions = [frame2, frame3, frame4];
      var len = cuepoints.length;
      var cuePos = 0;
      var animation; ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

      function frameStart() {
        if (es5()) {
          animation = lottie.loadAnimation({
            container: document.getElementById('animation'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'storage2.json'
          });
          animation.addEventListener('data_ready', frame1);
        } else {
          dom.backup.classList.add('backup');
        }
      }

      function cuePoints() {
        var i = cuePos;

        while (i < len) {
          if (animation.currentFrame > cuepoints[i]) {
            cuePos++;
            if (functions[i]) functions[i].call(this);
            break;
          }

          i++;
        }
      }

      function frame1() {
        timer.start();

        animation.onComplete = function () {
          timer.stop();
        };

        animation.addEventListener('enterFrame', cuePoints); // animation.setSpeed(0.5);
        // animation.setSubframe(false); // original AE fps

        animation.play();
        dom.ad_content.classList.remove('invisible');
      }

      function frame2() {
        gsap.to(dom.f1_copy, 0.25, {
          opacity: 1
        });
      }

      function frame3() {
        gsap.to(dom.f1_copy, 0.25, {
          opacity: 0
        });
      }

      function frame4() {
        animation.removeEventListener('enterFrame', cuePoints);
        gsap.to(dom.f2_copy, 0.25, {
          opacity: 1
        });
        gsap.to(dom.cta, 0.25, {
          delay: 0.5,
          opacity: 1
        });
      } ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////


      function adClickThru() {
        dom.ad_content.addEventListener('click', function () {
          window.open(window.clickTag);
        });
        enableRollover();
      }

      function enableRollover() {
        dom.ad_content.addEventListener('mouseenter', function () {
          gsap.to(dom.cta, 0.25, {
            className: '+=cta-hover',
            ease: Cubic.easeInOut
          });
        });
        dom.ad_content.addEventListener('mouseleave', function () {
          gsap.to(dom.cta, 0.25, {
            className: '-=cta-hover',
            ease: Cubic.easeInOut
          });
        });
      } ////////////////////////////////////////////////////// INIT //////////////////////////////////////////////////////


      adClickThru();
      frameStart();
    }
  };

  var cuepoints = [90, 180, 190];

  window.onload = function () {
    Banner.init(cuepoints);
  };

}());

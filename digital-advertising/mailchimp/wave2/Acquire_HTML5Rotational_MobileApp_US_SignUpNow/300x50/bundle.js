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
      log.debug = /true/i.test(window.debug);
      log.trace('debug: true');
      var dom = domUtils.makeVarsFromIds();
      var animFrames = 35,
          animW = 65;

      function frameStart() {
        if (es5()) {
          frame0();
        } else {
          dom.backup.className = 'backup';
        }
      }

      function frame0() {
        dom.ad_content.classList.remove('invisible');
        var tl = new TimelineMax();
        tl.set('#logo_anim', {
          autoAlpha: 1
        }, "+=-.15").to('#logo_anim', 1, {
          backgroundPosition: "+=" + animFrames * animW + "px",
          ease: SteppedEase.config(animFrames)
        }).set('#branding1', {
          autoAlpha: 1
        }, "-=.5").from('#branding1', .4, {
          y: "+=3",
          ease: Back.easeOut
        }, "-=.5").set('#branding2', {
          autoAlpha: 1
        }, "-=.3").to('#branding2', .1, {
          y: "-=2",
          repeat: 1,
          yoyo: true
        }, "-=.3").staggerFrom(['#head1a', '#cta'], .75, {
          x: "+=60",
          autoAlpha: 0,
          ease: Expo.easeOut
        }, 0.5); // tl.seek(14);
      } ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////


      dom.ad_content.addEventListener('click', function () {
        window.open(window.clickTag);
      }); // function enableRollover(){
      //   dom.ad_content.addEventListener('mouseover', () => {
      //      TweenMax.to("#cta", 0.25, { backgroundColor: "#05565e" });
      //   });
      //   dom.ad_content.addEventListener('mouseout', () => {
      //      TweenMax.to("#cta", 0.25, { backgroundColor: "#006e7a" });
      //   });
      // }

      frameStart();
    }
  };

  window.onload = function () {
    Banner.init();
  };

}());

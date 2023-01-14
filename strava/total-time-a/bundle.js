(function () {
  'use strict';

  /* eslint-disable no-plusplus */
  // BannerUtils version 3.2.0
  function getBrowser() {
    // desktop browsers as of 2019-10-04
    var browserslist = ['other', 'blink', 'chrome', 'safari', 'opera', 'ie', 'edge', 'firefox'];
    var browser = 0;

    if ('WebkitAppearance' in document.documentElement.style) {
      browser = 1; // chrome/safari/opera/edge/firefox

      if (/google/i.test(window.navigator.vendor)) browser = 2;
      if (/apple/i.test(window.navigator.vendor)) browser = 3;
      if (!!window.opr && !!window.opr.addons || !!window.opera || / OPR\//.test(window.navigator.userAgent)) browser = 4;
    } // eslint-disable-next-line spaced-comment


    if (
    /*@cc_on!@*/
     !!document.documentMode) browser = 5; // ie 6-11

    if (browser !== 5 && !!window.StyleMedia) browser = 6;
    if (typeof InstallTrigger !== 'undefined' || 'MozAppearance' in document.documentElement.style) browser = 7;
    return browserslist[browser];
  }
  var browser = getBrowser();
  var log = {
    // https://bit.ly/32ZIpgo
    traceOn: window.console.log.bind(window.console, '%s'),
    traceOff: function traceOff() {},
    trace: window.console.log.bind(window.console, '%s'),

    set debug(bool) {
      this.d = bool;
      this.trace = bool ? this.traceOn : this.traceOff;
    },

    get debug() {
      return this.d;
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

  window.initMoment = function (data, copy) {
    var dom = domIds();
    var timeDisplay = {
      units: 0
    };
    var animationA = new TimelineMax({
      paused: true
    });
    var yisData = data;
    var lang = 'en';
    var totalTime = yisData.timeByActivityType.totalSeconds;
    var digits;

    function updateTimeText() {
      var units = Math.round(timeDisplay.units).toString();

      while (units.length < digits) {
        units = "0" + units;
      }

      dom.time_text.innerHTML = units;
    }

    window.addEventListener('seek', function (e) {
      animationA.seek(animationA.totalDuration() * e.detail.ratio);
      updateTimeText(); // onUpdate doesn't fire on seek
    });
    var timeUnits = totalTime < 540000 ? 'min' : 'hrs'; // max 9000 mins

    var timeDivisor = timeUnits === 'min' ? 60 : 3600;
    var totalUnits = totalTime / timeDivisor;
    digits = Math.round(totalUnits).toString().length;
    dom.time_units.innerHTML = timeUnits.toUpperCase();
    dom.title_a.innerHTML = copy.totalTimeA[lang];
    animationA.to(dom.time_ring, 5, {
      strokeDashoffset: 0,
      ease: Power3.easeInOut
    }, 0);
    animationA.to(timeDisplay, 5, {
      units: totalUnits,
      ease: Power3.easeInOut,
      onUpdate: updateTimeText
    }, 0); // onUpdate doesn't fire on seek

    animationA.from(dom.title_a, 0.5, {
      x: -30,
      opacity: 0,
      ease: Power3.easeOut
    });
  };

}());

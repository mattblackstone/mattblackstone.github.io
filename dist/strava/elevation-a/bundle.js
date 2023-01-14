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
  function insertCommas(input, n) {
    if (n === void 0) {
      n = 3;
    }

    // TODO: account for decimals
    var str = typeof input === 'string' ? input : Math.round(input).toString();
    var commas = Math.ceil(str.length / n) - 1;
    var arr = [];
    var start = 0;
    var end = str.length % n || n;

    for (var i = 0; i <= commas; i += 1) {
      arr.push(str.substring(start, end));
      start = end;
      end += n;
    }

    return arr.join(',');
  }

  window.initMoment = function (data, copy) {
    var dom = domIds();
    var tweenProxy = {
      units: 0
    };
    var animationA = new TimelineMax({
      paused: true
    });
    var athleteInfo = data.athleteInfo,
        totalElevationGainMeters = data.totalElevationGainMeters;
    var lang = 'en';
    var everest = 8848; // meters

    var totalElevation = 0; // let digits;

    window.console.log(athleteInfo.firstName + " " + athleteInfo.lastName.substring(0, 1) + ".");

    function updateElevationText() {
      // const units = leadingZeros(Math.round(tweenProxy.units), digits);
      // dom.elevation_text.innerHTML = insertCommas(units);
      dom.elevation_text.innerHTML = insertCommas(tweenProxy.units);
    }

    window.addEventListener('seek', function (e) {
      animationA.seek(animationA.totalDuration() * e.detail.ratio);
      updateElevationText(); // onUpdate doesn't fire on seek
    });
    totalElevation = totalElevationGainMeters; // 2019 format

    var elevationUnits = athleteInfo.measurementPreference;
    var elevationMultiple = elevationUnits === 'feet' ? 3.28084 : 1;
    var totalUnits = totalElevation * elevationMultiple; // digits = Math.round(totalUnits).toString().length;

    dom.elevation_units.innerHTML = elevationUnits === 'feet' ? ' ft' : ' m';
    dom.head.innerHTML = copy.elevationA[lang].head;
    dom.subhead.innerHTML = copy.elevationA[lang].subhead.replace(/\[x\]/i, (totalElevation / everest).toFixed(1));
    var paths = dom.mountain.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path');
    var mtDur = 7;
    animationA.from(paths, mtDur, {
      scaleY: 0.75,
      transformOrigin: '0% 125%',
      ease: Power3.easeOut
    });
    animationA.from('.st0', mtDur / 2, {
      y: 140,
      ease: Back.easeOut
    }, mtDur / 2); // flag

    animationA.from('.st1', mtDur, {
      y: 74,
      ease: Power3.easeOut
    }, 0);
    animationA.from('.st2', mtDur, {
      y: 77,
      ease: Power3.easeOut
    }, 0);
    animationA.from('.st3', mtDur, {
      y: 30,
      ease: Power3.easeOut
    }, 0);
    animationA.from('.st4', mtDur, {
      y: 34,
      ease: Power3.easeOut
    }, 0);
    animationA.from(paths[0], 0.5, {
      scaleX: 0.1,
      ease: Power3.easeIn
    }, mtDur * 0.9);
    animationA.from(dom.elevation_text, 0.1, {
      opacity: 0
    }, 0);
    animationA.to(tweenProxy, mtDur, {
      units: totalUnits,
      ease: Power3.easeInOut,
      onUpdate: updateElevationText
    }, 0); // onUpdate doesn't fire on seek

    animationA.from(dom.elevation_units, 0.1, {
      opacity: 0
    });
    animationA.staggerFrom([dom.head, dom.subhead], 0.5, {
      y: 30,
      opacity: 0,
      ease: Power3.easeOut
    }, 0.25);
  };

}());

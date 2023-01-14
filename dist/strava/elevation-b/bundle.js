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
  var chunk = function chunk(arr, chunkSize, cache) {
    if (chunkSize === void 0) {
      chunkSize = 1;
    }

    if (cache === void 0) {
      cache = [];
    }

    var tmp = [].concat(arr);
    if (chunkSize <= 0) return cache;

    while (tmp.length) {
      cache.push(tmp.splice(0, chunkSize));
    }

    return cache;
  };

  window.initMoment = function (data, copy) {
    var dom = domIds();
    var elevationDisplay = {
      units: 0
    };
    var animationB = new TimelineMax({
      paused: true
    });
    var hilliestActivity = data.hilliestActivity,
        athleteInfo = data.athleteInfo;
    var lang = 'en';
    var hilliestDay = 0;
    var visualStyle;
    var visualW;
    var visualH;
    window.console.log(athleteInfo.firstName + " " + athleteInfo.lastName.substring(0, 1) + ".");

    function updateElevationText() {
      dom.elevation_text.innerHTML = insertCommas(elevationDisplay.units);
    }

    window.addEventListener('seek', function (e) {
      animationB.seek(animationB.totalDuration() * e.detail.ratio);
      updateElevationText(); // onUpdate doesn't fire on seek
    });
    hilliestDay = hilliestActivity.elevGainMeters; // 2019 format

    var unitPreference = athleteInfo.measurementPreference;
    var unitAbbrSm = unitPreference === 'feet' ? ' ft' : ' m';
    var unitMultipleSm = unitPreference === 'feet' ? 3.28084 : 1;
    var totalUnits = hilliestDay * unitMultipleSm;
    dom.elevation_units.innerHTML = unitAbbrSm;
    dom.head.innerHTML = copy.elevationB[lang].head;
    dom.subhead.innerHTML = hilliestActivity.title; // eslint-disable-next-line prefer-destructuring

    dom.date.innerHTML = hilliestActivity.date.split(' ')[0]; // const unitAbbrLrg = unitPreference === 'feet' ? ' miles' : ' km';
    // const unitMultipleLrg = unitPreference === 'feet' ? 0.00062137273665 : 0.001;
    // dom.subhead.innerHTML = copy.elevationB[lang].subhead.replace(/\[x\]/i, (hilliestActivity.meters * unitMultipleLrg).toFixed(1)).replace(/\[units\]/i, unitAbbrLrg).replace(/\[title\]/i, hilliestActivity.title);

    function getVisualSize() {
      visualStyle = window.getComputedStyle(dom.visual);
      visualW = parseInt(visualStyle.width, 10);
      visualH = parseInt(visualStyle.height, 10);
      dom.elevation_profile.setAttribute('width', visualW);
      dom.elevation_profile.setAttribute('height', visualH);
    }

    getVisualSize();
    dom.elevation_profile.setAttribute('viewBox', "0 0 " + visualW + " " + visualH);
    dom.elevation_profile.setAttribute('preserveAspectRatio', 'none'); // stretch

    window.addEventListener('resize', getVisualSize);
    var elevProfile = new DocumentFragment();
    var elevGainChart = hilliestActivity.elevGainChart;
    var columnEvery = 8;
    var chunkSize = Math.ceil(elevGainChart.length / (visualW / columnEvery));
    var elevations = chunk(elevGainChart, chunkSize).map(function (x) {
      return Math.max.apply(Math, x);
    });
    var columnOffset = Math.round((visualW - elevations.length * columnEvery) / 2 + columnEvery / 2);
    var elevMin = Math.min.apply(Math, elevations);
    var elevMax = Math.max.apply(Math, elevations);
    var elevRange = elevMax - elevMin;
    var lineH = visualH / 2;
    var lineDur = 1;
    var lineStagger = 0.1;
    var lineTweens = [];
    var lineMax = {
      x: 0,
      y: 0
    };
    var lineEl;
    var lineX;
    var lineY;
    elevations.forEach(function (elev, i) {
      lineX = i * columnEvery + columnOffset;
      lineY = (elev - elevMin) / elevRange * (lineH - 1) + 2;
      lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineEl.setAttribute('class', 'elev-line');
      lineEl.setAttribute('x1', lineX);
      lineEl.setAttribute('y1', 0);
      lineEl.setAttribute('x2', lineX);
      lineEl.setAttribute('y2', lineH);

      if (lineY > lineMax.y) {
        lineMax.x = lineX;
        lineMax.y = lineY;
      }

      elevProfile.appendChild(lineEl);
      lineTweens.push({
        elem: lineEl,
        dur: lineDur,
        vars1: {
          y: lineY * 0.1 - lineH
        },
        vars2: {
          y: visualH - lineY,
          ease: Power2.easeInOut
        },
        start: i * lineStagger
      });
    });
    dom.elevation_profile.appendChild(elevProfile);
    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    var dotSize = 18;
    dot.setAttribute('cx', lineMax.x);
    dot.setAttribute('cy', lineMax.y - dotSize / 2);
    dot.setAttribute('r', dotSize / 3);
    dot.setAttribute('stroke-width', dotSize / 3);
    dot.setAttribute('class', 'dot');
    dom.elevation_profile.appendChild(dot);
    lineTweens.forEach(function (tween) {
      var elem = tween.elem,
          dur = tween.dur,
          vars1 = tween.vars1,
          vars2 = tween.vars2,
          start = tween.start;
      animationB.fromTo(elem, dur, vars1, vars2, start);
    });
    var dur = elevations.length * lineStagger + lineDur;
    animationB.from(dom.elevation_text, dur / 2, {
      opacity: 0,
      ease: Power4.easeIn
    }, 0);
    animationB.to(elevationDisplay, dur, {
      units: totalUnits,
      ease: Power3.easeInOut,
      onUpdate: updateElevationText
    }, 0); // onUpdate doesn't fire on seek

    animationB.from(dom.elevation_units, 0.1, {
      opacity: 0
    });
    animationB.from(dot, 2, {
      y: lineH + dotSize,
      ease: Back.easeOut
    });
    animationB.from(dom.head, 0.5, {
      y: 30,
      opacity: 0,
      ease: Power3.easeOut
    }, dur - 2);
    animationB.staggerFrom([dom.subhead, dom.date], 0.5, {
      y: 30,
      opacity: 0,
      ease: Power3.easeOut
    }, 0.5);
  };

}());

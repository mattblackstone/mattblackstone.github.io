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
  function es5() {
    var _this = this;

    return parseInt('010', 10) === 10 && function () {
      return !_this;
    }() && !!(Date && Date.prototype && Date.prototype.toISOString); // IE10, FF21, CH23, SF6, OP15, iOS7, AN4.4
  }
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

  var CompareView = {
    init: function init() {
      var pointer = {
        x: 10,
        y: 10,
        type: null,
        ratioX: 0.5,
        ratioY: 0.5
      };
      var pointerEvt = new CustomEvent('pointerupdate', {
        detail: {
          pointer: pointer
        }
      });
      var unsupported = ['ie'];
      var supported = unsupported ? !(unsupported.indexOf(browser) > -1) : true;
      var origin = {
        get gamma() {
          return this.g;
        },

        set gamma(g) {
          if (!this.g) this.g = g;
        },

        get beta() {
          return this.b;
        },

        set beta(b) {
          if (!this.b) this.b = b;
        }

      };
      window.console.log("browser: " + browser + " (" + (supported ? '' : 'not ') + "supported)");
      var dom = domIds();
      var maRect = dom.main_area.getBoundingClientRect();
      var aspectRatio = maRect.width / maRect.height;
      var orientation = aspectRatio > 1 ? 'landscape' : 'portrait';
      var gyro = true;
      var permission = null;
      var midSnap = true;
      var gamma = 0; // x

      var beta = 0; // y

      window.console.log(maRect);

      function setPointer(x, y, type) {
        var midY = maRect.height * 0.5;
        var xx = x - maRect.left; // TODO: same as yy

        var yy = y - (maRect.top + midY);
        var ratioY = yy / midY;
        if (ratioY < -0.1 || ratioY > 0.1) yy *= 0.9 + Math.abs(ratioY);

        if (yy < -midY) {
          yy = -midY;
          midSnap = false;
        }

        if (yy > midY) {
          yy = midY;
          midSnap = false;
        }

        if (midSnap && Math.abs(yy) < 40) yy = 0; // snap to middle

        pointer.x = xx;
        pointer.y = yy + midY;
        pointer.type = type;
        pointer.ratioX = pointer.x / maRect.width;
        pointer.ratioY = pointer.y / maRect.height;
        window.dispatchEvent(pointerEvt);
      }

      function userTilt(e) {
        origin.gamma = e.gamma;
        gamma += e.gamma - origin.gamma;
        if (gamma > maRect.width) gamma = maRect.width;
        if (gamma < maRect.left) gamma = maRect.left;
        origin.beta = e.beta;
        beta += e.beta - origin.beta;
        if (beta > maRect.height + maRect.top) beta = maRect.height + maRect.top;
        if (beta < maRect.top) beta = maRect.top;
        setPointer(gamma, beta, 'gyro');
      }

      function startTilt() {
        origin.g = null;
        origin.b = null;
        gamma = pointer.x || maRect.width / 2;
        beta = pointer.y + maRect.top || maRect.height / 2 + maRect.top;
        window.addEventListener('deviceorientation', userTilt, false);
      }

      function mouseMove(e) {
        e.preventDefault();
        setPointer(e.pageX, e.pageY, 'mouse');
      }

      function touchMove(e) {
        e.preventDefault();
        setPointer(e.changedTouches[0].pageX, e.changedTouches[0].pageY, 'touch');
      }

      function startSwipe(e) {
        if (gyro) window.removeEventListener('deviceorientation', userTilt, false);
        touchMove(e);
        dom.main_area.addEventListener('touchmove', touchMove, false);
      }

      function endSwipe() {
        if (gyro) startTilt();
        dom.main_area.removeEventListener('touchmove', touchMove, false);
      }

      var listening;

      function gyroAccess(callback) {
        // only call when page loads
        setPointer(maRect.width * 0.5 + maRect.left, maRect.height * 0.5 + maRect.top);
        dom.main_content.classList.remove('invisible');

        if (!/gyro/i.test(window.location.hash) && permission === null && window.location.protocol === 'https:' && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          dom.allow.addEventListener('click', function () {
            DeviceOrientationEvent.requestPermission().then(function (response) {
              // dom.nav_gyro.classList.remove('none');
              dom.test.innerHTML = response;
              window.location.hash = 'gyro';
              permission = true;
              TweenMax.to(dom.test, 1.5, {
                delay: 0.5,
                autoAlpha: 0
              });
              gyro = true;
              callback();
            });
            dom.permission.classList.add('none');
          });
          dom.deny.addEventListener('click', function () {
            window.location.hash = 'nogyro';
            permission = false;
            dom.permission.classList.add('none');
            gyro = false;
            callback();
          });
          dom.permission.classList.remove('none');
        } else {
          if (window.location.hash === '#gyro') {
            gyro = true;
            dom.test.innerHTML = 'gyro on';
          }

          if (window.location.hash === '#nogyro') {
            gyro = false;
            dom.nav_gyro.classList.add('disabled');
            dom.test.innerHTML = 'gyro off';
          }

          TweenMax.to(dom.test, 1.5, {
            delay: 0.5,
            autoAlpha: 0
          });
          callback();
        }
      }

      function toggleGyro() {
        gyro = !gyro;

        if (gyro) {
          startTilt();
          dom.nav_gyro.classList.remove('disabled');
        } else {
          window.removeEventListener('deviceorientation', userTilt, false);
          dom.nav_gyro.classList.add('disabled');
        }
      }

      function firstTilt() {
        dom.nav_gyro.addEventListener('click', toggleGyro);
        dom.nav_gyro.classList.remove('none');
        window.removeEventListener('deviceorientation', firstTilt);
      }

      function initListeners() {
        if (!listening) {
          dom.toggle_a.addEventListener('click', function () {
            window.console.log('toggle_a click');
          });
          dom.toggle_b.addEventListener('click', function () {
            window.console.log('toggle_b click');
          }); // dom.nav_gyro.addEventListener('click', toggleGyro);

          window.addEventListener('deviceorientation', firstTilt, false);
          dom.main_area.addEventListener('mousemove', mouseMove, false);
          dom.main_area.addEventListener('touchstart', startSwipe, false);
          dom.main_area.addEventListener('touchend', endSwipe, false);
          dom.main_area.addEventListener('touchcancel', endSwipe, false);
          if (gyro) startTilt();
          window.addEventListener('resize', function () {
            maRect = dom.main_area.getBoundingClientRect();
            aspectRatio = maRect.width / maRect.height;
            orientation = aspectRatio > 1 ? 'landscape' : 'portrait';
            dom.test.innerHTML = orientation;
            TweenMax.fromTo(dom.test, 1.5, {
              autoAlpha: 1
            }, {
              delay: 0.5,
              autoAlpha: 0
            });
          });
          listening = true;
        }
      } // //////////////////////////////////////////////////// INIT //////////////////////////////////////////////////////


      if (es5() && supported) {
        gyroAccess(initListeners);
      }
    }
  };

  /* eslint-disable no-console */
  var Animation = {
    init: function init() {
      var dom = domIds();
      var names = ['athlete-01', 'athlete-02', 'athlete-03', 'athlete-04', 'athlete-05', 'athlete-06', 'athlete-07'];
      var name = Math.floor(Math.random() * names.length);
      var athleteURL = "../sample-data/" + names[name] + ".json";
      var athleteReq = new XMLHttpRequest();
      var tweenProxy = {
        units: 0
      };
      var animationA = new TimelineMax({
        paused: true
      });
      var animationB = new TimelineMax({
        paused: true
      });
      var lang = 'en';
      var everest = 8848; // meters

      var copy = {
        elevationA: {
          en: {
            head: 'Movin’ up in the world.',
            subhead: 'That’s like climbing [X] Mt.Everests.'
          },
          es: '',
          de: ''
        },
        elevationB: {
          en: {
            head: 'RIP your quads.',
            subhead: '[X] [units] during [title]'
          },
          es: '',
          de: ''
        }
      };
      var elevationDisplay = {
        units: 0
      };
      var hilliestDay = 0;
      var visualStyle;
      var visualW;
      var visualH;
      var totalElevation = 0;
      var pointer;
      var yisData;

      function updateElevationText() {
        dom.elevation_text_a.innerHTML = insertCommas(tweenProxy.units);
        dom.elevation_text.innerHTML = insertCommas(elevationDisplay.units);
      }

      window.addEventListener('pointerupdate', function (e) {
        pointer = e.detail.pointer;
        TweenMax.set('#mask_b', {
          y: pointer.y
        });
        TweenMax.set('#content_b', {
          y: -pointer.y
        });

        if (pointer.type) {
          if (pointer.ratioY > 0.5) {
            animationA.seek(animationA.totalDuration() * (pointer.ratioY - 0.5) / 0.5);
            updateElevationText();
            animationB.seek(0);
          }

          if (pointer.ratioY === 0.5) {
            animationA.seek(0);
            updateElevationText();
            animationB.seek(0);
          }

          if (pointer.ratioY < 0.5) {
            animationB.seek(animationB.totalDuration() * (1 - pointer.ratioY * 2));
            updateElevationText();
            animationA.seek(0);
          }
        }
      });
      CompareView.init(); // after pointerupdate listener

      athleteReq.open('GET', athleteURL);
      athleteReq.responseType = 'json';
      athleteReq.send();

      athleteReq.onload = function () {
        yisData = athleteReq.response;
        var _yisData = yisData,
            athleteInfo = _yisData.athleteInfo,
            hilliestActivity = _yisData.hilliestActivity,
            totalElevationGainMeters = _yisData.totalElevationGainMeters;
        totalElevation = totalElevationGainMeters; // 2019 format

        hilliestDay = hilliestActivity.elevGainMeters; // 2019 format

        var unitPreference = athleteInfo.measurementPreference;
        var unitAbbrSm = unitPreference === 'feet' ? ' ft' : ' m';
        var unitMultipleSm = unitPreference === 'feet' ? 3.28084 : 1;
        var totalUnits = hilliestDay * unitMultipleSm;
        var totalElevationUnits = totalElevation * unitMultipleSm;
        dom.elevation_units_a.innerHTML = unitAbbrSm;
        dom.head_a.innerHTML = copy.elevationA[lang].head;
        dom.subhead_a.innerHTML = copy.elevationA[lang].subhead.replace(/\[x\]/i, (totalElevation / everest).toFixed(1));
        dom.elevation_units.innerHTML = unitAbbrSm;
        dom.head.innerHTML = copy.elevationB[lang].head;
        dom.subhead.innerHTML = hilliestActivity.title; // eslint-disable-next-line prefer-destructuring

        dom.date.innerHTML = hilliestActivity.date.split(' ')[0];
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
        animationA.from(dom.elevation_text_a, 0.1, {
          opacity: 0
        }, 0);
        animationA.to(tweenProxy, mtDur, {
          units: totalElevationUnits,
          ease: Power3.easeInOut,
          onUpdate: updateElevationText
        }, 0); // onUpdate doesn't fire on seek

        animationA.from(dom.elevation_units_a, 0.1, {
          opacity: 0
        });
        animationA.staggerFrom([dom.head_a, dom.subhead_a], 0.5, {
          y: 30,
          opacity: 0,
          ease: Power3.easeOut
        }, 0.25);

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
    }
  };

  window.onload = function () {
    window.requestAnimationFrame(Animation.init);
  };

}());

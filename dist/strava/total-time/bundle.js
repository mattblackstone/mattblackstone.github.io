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

  var ActivityIcons = {
    Ride: 'bike',
    Run: 'run',
    Swim: 'water',
    Hike: 'hike',
    Walk: 'walk',
    AlpineSki: 'ski',
    BackcountrySki: 'ski',
    Canoeing: 'kayaking',
    Crossfit: 'other',
    EBikeRide: 'e_bike',
    Elliptical: 'other',
    Handcycle: 'handcycle',
    IceSkate: 'ice_skate',
    InlineSkate: 'inline_skate',
    Kayaking: 'kayaking',
    Kitesurf: 'kitesurf',
    NordicSki: 'ski',
    RockClimbing: 'rock_climbing',
    RollerSki: 'ski',
    Rowing: 'rowing',
    Snowboard: 'snowboard',
    Snowshoe: 'snowshoe',
    StairStepper: 'other',
    StandUpPaddling: 'stand_up_paddling',
    Surfing: 'surfing',
    Velomobile: 'velomobile',
    VirtualRide: 'bike',
    VirtualRun: 'other',
    WeightTraining: 'weight_training',
    Wheelchair: 'wheelchair',
    Windsurf: 'windsurf',
    Workout: 'other',
    Yoga: 'yoga'
  };

  var Animation = {
    init: function init() {
      var dom = domIds();
      var names = ['athlete-01', 'athlete-02', 'athlete-03', 'athlete-04', 'athlete-05', 'athlete-06', 'athlete-07'];
      var name = Math.floor(Math.random() * names.length);
      var athleteURL = "../sample-data/" + names[name] + ".json";
      var athleteReq = new XMLHttpRequest();
      var timeDisplay = {
        units: 0
      };
      var animationA = new TimelineMax({
        paused: true
      });
      var animationB = new TimelineMax({
        paused: true
      });
      var pointer;
      var yisData;
      var totalTime = 0;
      var timeUnits;
      var timeDivisor;
      var topActivities;
      var digits; // let rx;
      // let ry;

      function updateTimeText() {
        var units = Math.round(timeDisplay.units).toString();

        while (units.length < digits) {
          units = "0" + units;
        }

        dom.time_text.innerHTML = units;
      }

      window.addEventListener('pointerupdate', function (e) {
        pointer = e.detail.pointer;
        TweenMax.set('#mask_b', {
          y: pointer.y
        });
        TweenMax.set('#content_b', {
          y: -pointer.y
        }); // rx = -10 * (pointer.ratioY - 0.5);
        // ry = 10 * (pointer.ratioX - 0.5);
        // TweenMax.set('#parallax', { rotationX: rx, rotationY: ry });

        if (pointer.type) {
          if (pointer.ratioY > 0.5) {
            animationA.seek(animationA.totalDuration() * (pointer.ratioY - 0.5) / 0.5);
            updateTimeText();
            animationB.seek(0);
          }

          if (pointer.ratioY === 0.5) {
            animationA.seek(0);
            updateTimeText();
            animationB.seek(0);
          }

          if (pointer.ratioY < 0.5) {
            animationB.seek(animationB.totalDuration() * (1 - pointer.ratioY * 2));
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
        totalTime = yisData.timeByActivityType.totalSeconds;
        timeUnits = totalTime < 540000 ? 'min' : 'hrs'; // max 9000 mins

        timeDivisor = timeUnits === 'min' ? 60 : 3600;
        var totalUnits = totalTime / timeDivisor;
        dom.time_units.innerHTML = timeUnits.toUpperCase();
        animationA.to(dom.time_ring, 5, {
          strokeDashoffset: 0,
          ease: Power3.easeInOut
        }, 0);
        digits = Math.round(totalUnits).toString().length;
        animationA.to(timeDisplay, 5, {
          units: totalUnits,
          ease: Power3.easeInOut
        }, 0);
        animationA.from(dom.title_a, 0.5, {
          x: -30,
          opacity: 0,
          ease: Power3.easeOut
        });
        topActivities = yisData.timeByActivityType.byActivityType;
        topActivities.sort(function (a, b) {
          return a.seconds < b.seconds ? 1 : -1;
        });
        window.console.log("total time for " + names[name] + ": " + totalUnits + " " + timeUnits);
        var ringRatios = [1, 0.8, 0.6, 0.4, 0.2];
        var iconThemes = ['light', 'light', 'light', 'normal', 'normal'];
        var range = 0;
        topActivities.splice(ringRatios.length); // truncate

        topActivities.forEach(function (activity, i) {
          topActivities[i].icon = ActivityIcons[activity.activityType] || 'other';
          topActivities[i].units = activity.seconds / timeDivisor;
          topActivities[i].ringRelative = activity.units / ringRatios[i];
          range = Math.max(range, activity.ringRelative);
        });
        range = Math.ceil(range * 1.1); // no full rings

        window.console.log(topActivities);
        var midpoint = Math.round(dom.rings.getAttribute('width') * 0.5);
        var ringOffset = 12; // half-width of ring icons

        var pi2 = Math.PI * 2;
        topActivities.forEach(function (activity, i) {
          var rad = midpoint * ringRatios[i] - ringOffset;
          var ratio = activity.ringRelative / range;
          var arc = pi2 * rad; // const dash = ratio * arc;

          var gap = arc - ratio * arc; // window.console.log(`rad: ${rad}, ratio: ${ratio}, arc: ${arc}`);

          var circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circ.setAttribute('cx', midpoint);
          circ.setAttribute('cy', midpoint);
          circ.setAttribute('r', rad);
          circ.setAttribute('class', 'circ');
          dom.rings.appendChild(circ);
          var ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          ring.setAttribute('id', "ring" + i);
          ring.setAttribute('cx', midpoint);
          ring.setAttribute('cy', midpoint);
          ring.setAttribute('r', rad);
          ring.setAttribute('class', 'ring');
          ring.setAttribute('stroke-dasharray', arc + " " + arc); // static [dash, gap]

          ring.setAttribute('stroke-dashoffset', "" + arc); // start at 0

          dom.rings.appendChild(ring);
          var type = topActivities[i].activityType;
          var units = topActivities[i].units;
          var iconCirc = document.createElement('div');
          var iconSprite = document.createElement('div');
          iconCirc.setAttribute('id', "icon" + i);
          iconCirc.style.top = Math.round(midpoint - rad - ringOffset) + "px";
          iconCirc.classList.add('icon-circ');
          iconSprite.classList.add('sprite-svg');
          iconSprite.classList.add("sports_" + topActivities[i].icon + "_" + iconThemes[i] + "_xsmall");
          iconCirc.appendChild(iconSprite);
          dom.icons.appendChild(iconCirc);
          var sport = document.createElement('div');
          var sportName = document.createElement('div');
          var sportDot = document.createElement('div');
          var sportTime = document.createElement('div');
          sportName.innerHTML = "" + type.toUpperCase();
          sportName.classList.add('sport-name');
          sportDot.id = "dot" + i;
          sportDot.classList.add('sport-dot');
          sportTime.innerHTML = Math.round(units) + " <span>" + timeUnits + "</span>";
          sportTime.classList.add('sport-time');
          sport.appendChild(sportName);
          sport.appendChild(sportDot);
          sport.appendChild(sportTime);
          dom.sports.appendChild(sport);
          animationB.from(sport, 0.5, {
            x: -30,
            opacity: 0,
            ease: Power3.easeOut
          }, i * 0.1 + 0.5);
          animationB.from(iconCirc, 0.5, {
            scale: 0,
            ease: Back.easeOut
          }, i * 0.2 + 4);
          animationB.to(ring, 3.5, {
            strokeDashoffset: gap,
            ease: Power2.easeOut
          }, i * 0.2 + 4.5);
        });

        if (topActivities.length === 1) {
          var iconSpriteLrg = document.createElement('div');
          iconSpriteLrg.classList.add('sprite-svg');
          iconSpriteLrg.classList.add("sports_" + topActivities[0].icon + "_" + iconThemes[0] + "_large");
          var iconBig = document.createElement('div');
          iconBig.id = 'icon_big';
          iconBig.appendChild(iconSpriteLrg);
          dom.icons.appendChild(iconBig);
          animationB.from(iconBig, 0.5, {
            scale: 0,
            ease: Back.easeOut
          }, 0.5);
        }

        animationB.from(dom.title_b, 0.5, {
          x: -30,
          opacity: 0,
          ease: Power3.easeOut
        });
      };
    }
  };

  window.onload = function () {
    window.requestAnimationFrame(Animation.init);
  };

}());

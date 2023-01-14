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

  window.initMoment = function (data, copy) {
    var dom = domIds();
    var animationB = new TimelineMax({
      paused: true
    });
    var yisData = data;
    var lang = 'en';
    var topActivities = yisData.timeByActivityType.byActivityType;
    var totalTime = yisData.timeByActivityType.totalSeconds;
    var timeUnits = totalTime < 60000 ? 'min' : 'hrs'; // max 1000 mins

    var timeDivisor = timeUnits === 'min' ? 60 : 3600;
    var totalUnits = totalTime / timeDivisor;
    window.addEventListener('seek', function (e) {
      animationB.seek(animationB.totalDuration() * e.detail.ratio);
    });
    topActivities.sort(function (a, b) {
      return a.seconds < b.seconds ? 1 : -1;
    });
    window.console.log("total time for " + yisData.athleteInfo.firstName + ": " + totalUnits + " " + timeUnits);
    var ringRatios = [1, 0.8, 0.6, 0.4, 0.2];
    var iconThemes = ['light', 'light', 'light', 'normal', 'normal'];
    var range = 0;
    topActivities.splice(ringRatios.length); // truncate

    topActivities.forEach(function (activity, i) {
      topActivities[i].icon = ActivityIcons[activity.activityType] || 'other';
      topActivities[i].units = activity.seconds / timeDivisor;
      topActivities[i].ringRelative = activity.seconds / ringRatios[i];
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
      iconSpriteLrg.classList.add("sports_" + topActivities[0].icon + "_orange_xlarge");
      var iconBig = document.createElement('div');
      iconBig.id = 'icon_big';
      iconBig.appendChild(iconSpriteLrg);
      dom.icons.appendChild(iconBig);
      animationB.from(iconBig, 0.5, {
        scale: 0,
        ease: Back.easeOut
      }, 0.5);
    }

    dom.title_b.innerHTML = copy.totalTimeB[lang];
    animationB.from(dom.title_b, 0.5, {
      x: -30,
      opacity: 0,
      ease: Power3.easeOut
    });
  };

}());

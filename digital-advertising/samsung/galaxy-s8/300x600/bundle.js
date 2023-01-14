(function () {
'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

function es5() {
  if (typeof window.Event !== 'function') {
    var Event = function Event(event, params) {
      params = params || { bubbles: false, cancelable: false };
      var evt = document.createEvent('Event');
      evt.initEvent(event, params.bubbles, params.cancelable);
      return evt;
    };
    Event.prototype = window.Event.prototype;
    window.Event = Event;
    var CustomEvent = function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  return parseInt('010', 10) === 10 && function () {
    return !this;
  }() && !!(Date && Date.prototype && Date.prototype.toISOString);
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
  getAllIdElements: function getAllIdElements() {
    var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

    var items = scope.getElementsByTagName('*');
    var elements = [];
    for (var i = items.length; i--;) {
      if (items[i].hasAttribute('id')) {
        elements.push(items[i]);
      }
    }
    return elements;
  },
  getAllIds: function getAllIds() {
    var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    var trace = arguments[1];

    var items = scope.getElementsByTagName('*');
    var ids = [];
    var varlist = '\nfunction getEl(id){\n    return document.getElementById(id);\n}\nvar ';
    var len = items.length;
    for (var i = 0; i < len; i++) {
      if (items[i].hasAttribute('id')) {
        ids.push(items[i].id);
        if (trace) {
          varlist += items[i].id.replace(/-/g, '_') + ' = getEl(\'' + items[i].id + '\')';
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
  makeVar: function makeVar(id, camel) {
    var newname = void 0;
    camel ? newname = id.replace(/[-_]([a-z])/g, function (g) {
      return g[1].toUpperCase();
    }).replace(/[-_]/g, '') : newname = id.replace(/-/g, '_');
    return {
      key: newname,
      val: document.getElementById(id)
    };
  },
  makeVars: function makeVars(ids, camel) {
    var i = ids.length;
    var elements = {};
    var elem = void 0;
    while (i--) {
      elem = this.makeVar(ids[i], camel);
      elements[elem.key] = elem.val;
    }
    return elements;
  },
  makeVarsFromIds: function makeVarsFromIds() {
    var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    var camelCase = arguments[1];

    var ids = this.getAllIds(scope);
    return this.makeVars(ids, camelCase);
  },
  recordClasses: function recordClasses() {
    var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getAllIdElements(document);

    var i = elements.length;
    while (i--) {
      elements[i].cl = '';
      elements[i].cl += elements[i].className;
    }
  },
  resetClasses: function resetClasses() {
    var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getAllIdElements(document);
    var callback = arguments[1];

    var i = elements.length;
    while (i--) {
      if (typeof elements[i].cl !== 'undefined') {
        elements[i].className = elements[i].cl;
      } else {
        this.trace('initial state not recorded for: ' + elements[i].id);
      }
    }
    if (callback) {
      var dly = elements.length * 10;
      setTimeout(function () {
        callback.apply();
      }, dly);
    }
  }
};

var Banner = {

  init: function init() {
    var dom = domUtils.makeVarsFromIds();
    var gsap = TweenMax;

    var _delay = 0,
        _speed = 0;

    function frameStart() {
      if (es5()) {
        frame0();
      } else {
        gsap.set('#backup', { className: 'backup' });
      }
    }

    function frame0() {
      dom.ad_content.classList.remove('invisible');
      gsap.delayedCall(0, frame1);
    }

    function frame1() {
      _delay = 0;
      _speed = 0.4;

      gsap.delayedCall(_delay, device_anime);
      gsap.to(dom.headline, _speed, { autoAlpha: 1, ease: Cubic.easeInOut, delay: _delay += 2 });

      gsap.to(dom.cta, _speed, { autoAlpha: 1, ease: Cubic.easeInOut, delay: _delay += 1 });
    }

    function device_anime() {
      _delay = 0;
      _speed = 2;

      gsap.set([dom.device], { autoAlpha: 1 });

      gsap.from(dom.device, _speed, { x: +300, autoAlpha: 1, ease: Cubic.easeInOut, delay: _delay });
      dom.photo_dark.src = 'long-exposure-lights.gif';

      gsap.from(dom.marker, _speed, { y: -85, ease: Cubic.easeInOut, delay: _delay += _speed });


      gsap.delayedCall(_delay += _speed, screen_flash);
    }

    function screen_flash() {
      _speed = 0.06;

      dom.camera_button.src = 'camera_button.gif';
      gsap.to(dom.camera_button, _speed, { autoAlpha: 0.75, ease: Cubic.easeInOut });
      gsap.to([dom.device_ui, dom.marker], _speed, { autoAlpha: 0, ease: Cubic.easeInOut });
      _delay = 1.1;
      gsap.to([dom.screen_cover, dom.device_ui_bars, dom.camera_button, dom.photo_dark], _speed, { autoAlpha: 0, ease: Cubic.easeInOut, delay: _delay });
    }

    function adClickThru() {
      dom.ad_content.addEventListener('click', function () {
        window.open(window.clickTag);
      });
      enableRollover();
    }

    function onAdHover(e) {
      gsap.to(dom.cta_over, 0.25, { alpha: 1 });
      gsap.to(dom.cta_up, 0.25, { alpha: 0 });
    }

    function onAdOut(e) {
      gsap.to(dom.cta_over, 0.25, { alpha: 0 });
      gsap.to(dom.cta_up, 0.25, { alpha: 1 });
    }

    function enableRollover() {
      dom.ad_content.addEventListener('mouseenter', function () {
        onAdHover();
      });
      dom.ad_content.addEventListener('mouseleave', function () {
        onAdOut();
      });
    }

    adClickThru();
    frameStart();
  }
};

window.onload = function () {
  Banner.init();
};

}());

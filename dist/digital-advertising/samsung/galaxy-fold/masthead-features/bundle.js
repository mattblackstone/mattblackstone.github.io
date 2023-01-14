(function () {
  'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

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

  // Version 2.1.5
  var VideoControls =
  /*#__PURE__*/
  function () {
    function VideoControls(source, width, height, options) {
      var _this = this;

      var self = this;
      var srcName;

      if (typeof window.Event !== 'function') {
        var _CustomEvent = function _CustomEvent(event, params) {
          params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };

        _CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = _CustomEvent;
      }

      Array.isArray(source) ? srcName = source[0] : srcName = source;
      this.instanceName = srcName.substring(srcName.lastIndexOf('/') + 1, srcName.lastIndexOf('.'));
      this.videoWidth = width;
      this.videoHeight = height;
      this.options = this.defaultVal(options, {});
      this.id = this.defaultVal(this.options.id, this.instanceName);
      this.container = this.getElem(this.options.container, document.body);
      this.isTouch = this.isTouch();
      this.options.ignoreTouch === true ? this.nativeContols = false : this.nativeContols = this.isTouch; // if ignoreTouch is true, touch-screen detection will be ignored

      this.poster = this.options.poster;
      this.posterTouch = this.options.posterTouch || this.poster;
      this.startMuted = this.defaultVal(this.options.muted, false); // had to change this from muted to startMuted because of set muted method on prototype

      this.autoplay = this.defaultVal(this.options.autoplay, false);
      this.preload = this.defaultVal(this.options.preload, 'auto');
      this.controls = this.defaultVal(this.options.controls, true);
      this.playsinline = this.defaultVal(this.options.playsinline, true);
      this.video = document.createElement('video');
      this.video.setAttribute('id', this.id + "_video");
      this.video.setAttribute('width', width);
      this.video.setAttribute('height', height);
      this.video.setAttribute('preload', this.preload);

      if (this.playsinline) {
        this.video.setAttribute('playsinline', '');
      }

      if (this.autoplay) {
        this.video.setAttribute('autoplay', '');
      }

      if (this.startMuted || this.autoplay) {
        this.video.setAttribute('muted', '');
      }

      this.createSource(source, this.video);

      if (this.options.cuepoints) {
        // only relevant if cuePoints present
        var cpts = this.options.cuepoints;
        var i = cpts.length;
        this.cuePoints = [];

        while (i--) {
          var cpt = cpts[i];

          if (cpt.time) {
            if (typeof cpt.time === 'number' && !isNaN(cpt.time)) {
              cpt.past = false;
              this.cuePoints.push(cpt); // only add valid cuePoints
            }
          }
        }

        this.cuePoints = this.cuePoints.sort(function (a, b) {
          return (// sort by time
            parseFloat(a.time) - parseFloat(b.time)
          );
        });
        this.cueNum = 0;
        this.nextCue = this.cuePoints[this.cueNum];
        this.video.addEventListener('seeked', function () {
          var i = _this.cuePoints.length;
          var now = _this.video.currentTime;
          var cpt;

          while (i--) {
            cpt = _this.cuePoints[i];

            if (cpt.time > now) {
              cpt.past = false; // reactivate future cuePoints

              _this.cueNum = i;
              _this.nextCue = _this.cuePoints[_this.cueNum];
            } else {
              cpt.past = true; // deactivate past cuePoints
            }
          }

          onVideoProgress();
        }, false);
      } else {
        this.cueNum = -1;
      }

      if (this.nativeContols) {
        // do touch specific things
        if (this.posterTouch) {
          this.video.setAttribute('poster', this.posterTouch);
        } // touch specific poster

        if (this.controls) {
          this.video.setAttribute('controls', '');
        }

        this.container.appendChild(this.video);

        if (this.cuePoints) {
          this.video.addEventListener('play', function () {
            _this.progIntrvl = setInterval(onVideoProgress, 42);
          }, false);
          this.video.addEventListener('pause', function () {
            clearInterval(_this.progIntrvl);
          }, false);
        }
      } else {
        // create custom controls for desktop
        if (this.poster) {
          this.video.setAttribute('poster', this.poster);
        } // default poster


        this.propagation = this.defaultVal(this.options.propagation, true);
        this.audio = this.defaultVal(this.options.audio, true);

        if (typeof this.options.right === 'undefined') {
          this.side = 'left';
          this.margin = this.defaultVal(this.options.left, 0);
        } else {
          this.side = 'right';
          this.margin = this.defaultVal(this.options.right, 0);
        }

        this.controlWidth = this.videoWidth - this.margin * 2;
        this.color1 = {};
        this.color1.hex = this.defaultVal(this.options.color1, 'cc0000');
        this.color1.rgbo = this.hexToRgb(this.color1.hex);
        this.color1.rgb = this.color1.rgbo.r + "," + this.color1.rgbo.g + "," + this.color1.rgbo.b;
        this.color2 = {};
        this.color2.hex = this.defaultVal(this.options.color2, 'ffffff');
        this.color2.rgbo = this.hexToRgb(this.color2.hex);
        this.color2.rgb = this.color2.rgbo.r + "," + this.color2.rgbo.g + "," + this.color2.rgbo.b;
        this.icons = this.defaultVal(this.options.icons, {});
        this.iconW = this.defaultVal(this.icons.w, 15);
        this.iconH = this.defaultVal(this.icons.h, 15);
        this.barheight = this.defaultVal(this.options.barheight, 4);
        this.below = this.defaultVal(this.options.below, false); // progress bar above or below buttons

        this.height = this.barheight + this.iconH + 5;

        if (this.below) {
          this.barbottom = 0;
          this.iconbottom = this.barheight + 3;
        } else {
          this.barbottom = this.iconH + 10;
          this.iconbottom = 3;
          this.height += 3;
        }

        this.wrapper = document.createElement('div'); // wraps video tag and controls into another div for positioning

        this.wrapper.setAttribute('id', this.id + "_wrapper");
        this.wrapper.style.position = 'relative';
        this.wrapper.style.width = this.videoWidth + "px";
        this.wrapper.style.height = this.videoHeight + "px";
        this.wrapper.appendChild(this.video);
        this.container.appendChild(this.wrapper);
      } // ------------------------------------- start private methods ------------------------------------- //


      function loadIcon(icon, obj) {
        if (icon.url) {
          // single image
          obj.url = icon.url;

          if (icon.bw || icon.bh) {
            obj.bw = self.defaultVal(icon.bw, self.iconW);
            obj.bh = self.defaultVal(icon.bh, self.iconH);
            obj.bs = ";background-size:" + obj.bw + "px " + obj.bh + "px";
          }
        } else if (self.icons.url) {
          // sprite sheet
          obj.url = self.icons.url;

          if (self.icons.bw || self.icons.bh) {
            obj.bw = self.defaultVal(self.icons.bw, self.iconW);
            obj.bh = self.defaultVal(self.icons.bh, self.iconH);
            obj.bs = ";background-size:" + obj.bw + "px " + obj.bh + "px";
          }
        }

        if (icon.x || icon.y) {
          obj.x = self.defaultVal(icon.x, 0);
          obj.y = self.defaultVal(icon.y, 0);
          obj.bp = ";background-position:" + obj.x + "px " + obj.y + "px";
        }
      }

      function injectStyles() {
        var commonSVG = "\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 15' enable-background='new 0 0 15 15'%3E%3Cstyle type='text/css'%3E.st0%7Bfill:%23" + self.color1.hex + "%3B%7D%3C/style%3E%3Cpath class='st0' d=";
        var iconPlay = {
          bp: '',
          bs: '',
          url: commonSVG + "'M4 3v9l8-4.5-8-4.5z'/%3E%3C/svg%3E\""
        };
        var iconPause = {
          bp: '',
          bs: '',
          url: commonSVG + "'M3 3h3v9h-3v-9zm6 0h3v9h-3v-9z'/%3E%3C/svg%3E\""
        };
        var iconUnmute = {
          bp: '',
          bs: '',
          url: commonSVG + "'M1 5h3l3-3v11l-3-3h-3v-5zM9.3 5.7l-.7.7c.2.3.4.7.4 1.1s-.2.8-.4 1.1l.7.7c.4-.5.7-1.1.7-1.8s-.3-1.3-.7-1.8zm1.4-1.4l-.7.7c.6.6 1 1.5 1 2.5s-.4 1.8-1 2.5l.7.7c.8-.8 1.3-2 1.3-3.2s-.5-2.4-1.3-3.2zm1.4-1.4l-.7.7c1 1 1.6 2.4 1.6 3.9s-.6 2.9-1.6 3.9l.7.7c1.2-1.2 1.9-2.8 1.9-4.6s-.7-3.4-1.9-4.6z'/%3E%3C/svg%3E\""
        };
        var iconMute = {
          bp: '',
          bs: '',
          url: commonSVG + "'M1 5h3l3-3v11l-3-3h-3v-5zm13.4.3l-.7-.7-2.2 2.1-2.1-2.1-.7.7 2.1 2.2-2.1 2.1.7.7 2.1-2.1 2.1 2.1.7-.7-2.1-2.2 2.2-2.1z'/%3E%3C/svg%3E\""
        };

        if (self.icons.play) {
          loadIcon(self.icons.play, iconPlay);
        }

        if (self.icons.pause) {
          loadIcon(self.icons.pause, iconPause);
        }

        if (self.icons.unmute) {
          loadIcon(self.icons.unmute, iconUnmute);
        }

        if (self.icons.mute) {
          loadIcon(self.icons.mute, iconMute);
        }

        var minMargin = 0;

        if (self.margin < 3) {
          minMargin = 3;
        }

        var btn1 = "." + self.id + "-btn-muted{height:" + self.iconH + "px;width:" + self.iconW + "px;background:url(" + iconMute.url + ")" + iconMute.bp + iconMute.bs + "}";
        var btn2 = "." + self.id + "-btn-unmuted{height:" + self.iconH + "px;width:" + self.iconW + "px;background:url(" + iconUnmute.url + ")" + iconUnmute.bp + iconUnmute.bs + "}";
        var btn3 = "." + self.id + "-btn-playing{height:" + self.iconH + "px;width:" + self.iconW + "px;background:url(" + iconPause.url + ")" + iconPause.bp + iconPause.bs + "}";
        var btn4 = "." + self.id + "-btn-paused{height:" + self.iconH + "px;width:" + self.iconW + "px;background:url(" + iconPlay.url + ")" + iconPlay.bp + iconPlay.bs + "}";
        var togl = "#" + self.id + "_toggle_sound,#" + self.id + "_toggle_play{cursor:pointer;bottom:" + self.iconbottom + "px;background-color:rgba(" + self.color2.rgb + ",0)}";
        var togh = "#" + self.id + "_toggle_sound:hover,#" + self.id + "_toggle_play:hover{background-color:rgba(" + self.color2.rgb + ",0.15)}#" + self.id + "_toggle_sound{" + self.side + ":" + (self.iconW + 3 + minMargin) + "px}#" + self.id + "_toggle_play{" + self.side + ":" + minMargin + "px}";
        var prog = "#" + self.id + "_progress{width:0;background-color:#" + self.color1.hex + "}#" + self.id + "_seek_hit{width:100%;height:100%;cursor:pointer;background-color:rgba(0,0,0,0.001)}#" + self.id + "_seek_track{width:100%;background-color:#" + self.color2.hex + ";opacity:0.1}#" + self.id + "_buffer_track{width:0;background-color:#" + self.color2.hex + ";opacity:0.125}#" + self.id + "_seek_mark{width:0;background-color:#" + self.color1.hex + ";opacity:0.25;pointer-events:none}";
        var bars = "#" + self.id + "_progress,#" + self.id + "_seek_track,#" + self.id + "_seek_mark,#" + self.id + "_buffer_track{bottom:" + self.barbottom + "px;height:" + self.barheight + "px}";
        var ctrl = "#" + self.id + "_controls{margin:0 !important;position:absolute;left:" + self.margin + "px;top:" + (self.videoHeight - self.height) + "px;width:" + self.controlWidth + "px;height:" + self.height + "px}";
        var cdiv = "#" + self.id + "_controls div{margin:0;position:absolute}";
        self.writeCSS(cdiv + ctrl + bars + prog + togl + togh + btn1 + btn2 + btn3 + btn4);
      }

      function createControls() {
        self.controls = self.createDiv(self.video.parentNode, self.id + "_controls");
        self.progress = self.createDiv(self.controls, self.id + "_progress");
        self.seek_mark = self.createDiv(self.controls, self.id + "_seek_mark");
        self.buffer_track = self.createDiv(self.controls, self.id + "_buffer_track");
        self.seek_track = self.createDiv(self.controls, self.id + "_seek_track");
        self.seek_hit = self.createDiv(self.controls, self.id + "_seek_hit");
        self.toggle_play = self.createDiv(self.controls, self.id + "_toggle_play");
        self.toggle_sound = self.createDiv(self.controls, self.id + "_toggle_sound");

        if (self.audio === false) {
          self.toggle_sound.style.visibility = 'hidden';
        }

        showPaused();
        self.toggle_sound.addEventListener('click', onSoundClick, false);
        self.toggle_sound.addEventListener('mouseover', onSoundHover, false);
        self.toggle_play.addEventListener('click', onPlayClick, false);
        self.toggle_play.addEventListener('mouseover', onPlayHover, false);
        self.seek_hit.addEventListener('click', onSeekClick, false);
        self.seek_hit.addEventListener('mouseover', onSeekHover, false);
        self.seek_hit.addEventListener('mouseout', onSeekOut, false);
        self.video.addEventListener('progress', onBufferProgress, false);
        self.video.addEventListener('loadedmetadata', onBufferProgress, false);
        self.video.addEventListener('ended', self.video.pause, false);
        self.video.addEventListener('play', showPlaying, false);
        self.video.addEventListener('pause', showPaused, false);
        self.video.addEventListener('volumechange', onVolumeChange, false);

        if (!self.startMuted) {
          onVolumeChange();
        }

        self.video.muted = self.startMuted;
        onBufferProgress();
      }

      function videoSeek(time) {
        if (typeof time === 'number' && !isNaN(time)) {
          if (self.video.readyState > 2) {
            self.video.currentTime = time;
            onVideoProgress();
          } else {
            self.video.addEventListener('canplay', function canSeek() {
              self.video.removeEventListener('canplay', canSeek, false);
              self.video.currentTime = time;
              onVideoProgress();
            }, false);
          }
        }
      }

      function showPlaying() {
        self.toggle_play.classList.remove(self.id + "-btn-paused");
        self.toggle_play.classList.add(self.id + "-btn-playing");
        self.progIntrvl = setInterval(onVideoProgress, 42); // approx 24fps since many browsers only fire the 'timeupdate' event at 4fps (250ms)
      }

      function showPaused() {
        self.toggle_play.classList.remove(self.id + "-btn-playing");
        self.toggle_play.classList.add(self.id + "-btn-paused");
        clearInterval(self.progIntrvl);
      }

      function onVolumeChange() {
        if (self.video.muted) {
          self.toggle_sound.classList.remove(self.id + "-btn-unmuted");
          self.toggle_sound.classList.add(self.id + "-btn-muted");
        } else {
          self.toggle_sound.classList.remove(self.id + "-btn-muted");
          self.toggle_sound.classList.add(self.id + "-btn-unmuted");
        }
      }

      function onSoundClick(e) {
        if (!self.propagation) {
          e.stopPropagation();
        }

        if (self.video.muted) {
          self.video.muted = false;
        } else {
          self.video.muted = true;
        }
      }

      function onSoundHover(e) {
        if (!self.propagation) {
          e.stopPropagation();
        }
      }

      function onPlayClick(e) {
        if (!self.propagation) {
          e.stopPropagation();
        }

        if (!self.video.paused) {
          self.video.pause();
        } else {
          self.video.play();
        }
      }

      function onPlayHover(e) {
        if (!self.propagation) {
          e.stopPropagation();
        }
      }

      function onSeekClick(e) {
        if (!self.propagation) {
          e.stopPropagation();
        }

        var newtime = (e.clientX - self.controls.getBoundingClientRect().left) / parseInt(self.seek_hit.getBoundingClientRect().width, 10) * self.video.duration;
        videoSeek(newtime);
      }

      function onSeekHover(e) {
        if (!self.propagation) {
          e.stopPropagation();
        }

        self.seek_hit.addEventListener('mousemove', onSeekMark, false);
        self.seek_mark.style.visibility = 'visible';
      }

      function onSeekOut() {
        self.seek_hit.removeEventListener('mousemove', onSeekMark, false);
        self.seek_mark.style.visibility = 'hidden';
      }

      function onSeekMark(e) {
        var scale = self.video.getBoundingClientRect().width / self.videoWidth;
        self.seek_mark.style.width = Math.round((e.clientX - self.controls.getBoundingClientRect().left) / scale) + "px";
      }

      function onVideoProgress() {
        // every 42ms (24fps) when playing
        var now = self.video.currentTime;

        if (!self.nativeContols) {
          var percent;
          percent = now / self.video.duration * 100;

          if (percent > 100) {
            percent = 100;
          }

          self.progress.style.width = percent + "%";
          onBufferProgress();
        }

        if (self.cueNum > -1 && !self.video.seeking) {
          if (now >= self.nextCue.time - 0.02) {
            // shift cuePoints up 0.02 ^ seconds to compensate for fps
            if (!self.nextCue.past) {
              var eventCue = new CustomEvent('cuepoint', {
                detail: {
                  data: self.nextCue.data,
                  time: self.nextCue.time,
                  actual: now
                }
              });
              self.video.dispatchEvent(eventCue);
              self.nextCue.past = true;

              if (self.cueNum === self.cuePoints.length - 1) {
                self.cueNum = -1;
              } else {
                self.cueNum++;
                self.nextCue = self.cuePoints[self.cueNum];
              }
            }
          }
        }
      }

      function onBufferProgress() {
        var buffered = self.video.buffered;

        if (buffered.length > 0) {
          var bufferEnd = buffered.end(buffered.length - 1);
          var percent = bufferEnd / self.video.duration * 100;
          self.buffer_track.style.width = percent + "%";
        }
      } // ------------------------------------- end private methods ------------------------------------- //


      if (this.nativeContols) {
        this.proxyShowControls = function (bool) {
          if (bool) {
            if (!_this.video.hasAttribute('controls')) {
              _this.video.setAttribute('controls', '');
            }
          } else {
            if (_this.video.hasAttribute('controls')) {
              _this.video.removeAttribute('controls');
            }
          }
        };

        this.proxyCurrentTime = function (time) {
          _this.video.currentTime = time;
        };
      } else {
        this.proxyShowControls = function (bool) {
          if (bool) {
            _this.controls.style.visibility = 'visible';
          } else {
            _this.controls.style.visibility = 'hidden';
          }
        };

        this.proxyCurrentTime = function (time) {
          videoSeek(time);
        };

        injectStyles();
        createControls();
      }
    }

    var _proto = VideoControls.prototype;

    _proto.isTouch = function isTouch() {
      var EVENTS = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      var AGENT = typeof window.orientation !== 'undefined' || navigator.userAgent.match(/iPhone|iPad|iPod|Android|IEMobile|Kindle|Silk|BlackBerry|Opera Mini/i);
      return EVENTS && AGENT;
    };

    _proto.play = function play() {
      this.video.play();
    };

    _proto.pause = function pause() {
      this.video.pause();
    };

    _proto.showControls = function showControls(bool) {
      this.proxyShowControls(bool);
    };

    _proto.writeCSS = function writeCSS(styles) {
      var css = document.createElement('style');
      css.type = 'text/css';
      css.appendChild(document.createTextNode(styles));
      document.head.appendChild(css);
    };

    _proto.trace = function trace(msg) {
      if (window.console) {
        window.console.log(msg);
      }
    };

    _proto.getElem = function getElem(ref) {
      if (ref) {
        if (typeof ref === 'string') {
          if (/^#|^\./.test(ref)) {
            return document.querySelector(ref);
          } else {
            return document.getElementById(ref);
          }
        } else {
          return ref;
        }
      } else {
        return document.body;
      }
    };

    _proto.createSource = function createSource(source, videoElem) {
      if (typeof source === 'string') {
        videoElem.setAttribute('src', source);
      } else {
        for (var i = 0; i < source.length; i++) {
          var src = document.createElement('source');
          var ext = source[i].split('.').pop();
          var type = ext; // default: same type as file extention

          if (/m4v/.test(ext)) {
            type = 'mp4';
          }

          if (/ogv/.test(ext)) {
            type = 'ogg';
          }

          src.setAttribute('src', source[i]);
          src.setAttribute('type', "video/" + type);
          videoElem.appendChild(src);
        }
      }
    };

    _proto.defaultVal = function defaultVal(option, defalt) {
      var value;
      typeof option === 'undefined' || option === '' || typeof option !== typeof defalt ? value = defalt : value = option;
      return value;
    };

    _proto.getStyle = function getStyle(elem, styleProp) {
      var ret;
      styleProp ? ret = window.getComputedStyle(elem, null).getPropertyValue(styleProp) : ret = window.getComputedStyle(elem, null);
      return ret;
    };

    _proto.createDiv = function createDiv(parent, id) {
      var elem = document.createElement('div');
      elem.id = id;
      parent.appendChild(elem);
      return elem;
    };

    _proto.hexToRgb = function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    _proto.addEventListener = function addEventListener(type, func, capture) {
      var useCapture = this.defaultVal(capture, false);
      this.video.addEventListener(type, func, useCapture);
    };

    _proto.removeEventListener = function removeEventListener(type, func, capture) {
      var useCapture = this.defaultVal(capture, false);
      this.video.removeEventListener(type, func, useCapture);
    };

    _createClass(VideoControls, [{
      key: "muted",
      get: function get() {
        return this.video.muted;
      },
      set: function set(value) {
        this.video.muted = value;
      }
    }, {
      key: "currentTime",
      get: function get() {
        return this.video.currentTime;
      },
      set: function set(time) {
        this.proxyCurrentTime(time);
      }
    }, {
      key: "paused",
      get: function get() {
        return this.video.paused;
      }
    }, {
      key: "seeking",
      get: function get() {
        return this.video.seeking;
      }
    }, {
      key: "duration",
      get: function get() {
        return this.video.duration;
      }
    }, {
      key: "videoElement",
      get: function get() {
        return this.video;
      }
    }, {
      key: "controlsElement",
      get: function get() {
        return this.controls;
      }
    }]);

    return VideoControls;
  }();

  var Banner = {
    init: function init() {
      log.debug = true; // set to false before publishing

      var isIE = window.navigator.msPointerEnabled;
      var isEdge = /Edge/.test(navigator.userAgent);
      var dom = domUtils.makeVarsFromIds();
      var gsap = TweenMax;
      // var dc = studio.Enabler.getInstance();
      var dc = { exit: function(msg) { window.console.log("exit: " + msg); }};
      var control_sprites = {
        w: 15,
        h: 15,
        bw: 60,
        bh: 15,
        url: 'control-sprites.png',
        play: {
          x: -15,
          y: 0
        },
        pause: {
          x: 0,
          y: 0
        },
        mute: {
          x: -30,
          y: 0
        },
        unmute: {
          x: -45,
          y: 0
        }
      };
      var vcOpts = {
        muted: true,
        icons: control_sprites,
        barheight: 2,
        below: true,

        /* progress bar below controls */
        // right: true, /* controls on right side */
        audio: false
      };
      var feature_camera = {
        name: 'feature-camera',
        text: '<div><div class="hint-left">Pro-Grade Camera</div></div>',
        icon: 'dot',
        left: '300px',
        top: '45px',
        video: {
          file: 'feature-camera.mp4',
          vo: _extends({}, vcOpts, {
            container: dom.feature1_video_player,
            poster: 'feature-camera-poster.jpg',
            autoplay: true
          })
        }
      };
      var feature_display = {
        name: 'feature-display',
        text: '<div><div class="hint-left">Infinity Flex Display</div></div>',
        icon: 'dot',
        left: '310px',
        top: '165px',
        video: {
          file: 'feature-display.mp4',
          vo: _extends({}, vcOpts, {
            container: dom.feature2_video_player,
            poster: 'feature-display-poster.jpg',
            autoplay: true
          })
        }
      };
      var feature_multi = {
        name: 'feature-multi',
        text: '<div><div class="hint-left">Multi Active Window</div></div>',
        icon: 'dot',
        left: '300px',
        top: '185px',
        video: {
          file: 'feature-multi.mp4',
          vo: _extends({}, vcOpts, {
            container: dom.feature3_video_player,
            poster: 'feature-multi-poster.jpg',
            autoplay: true
          })
        }
      };

      var feature_camera2 = _extends({}, feature_camera, {
        left: '335px'
      });

      var cuepoints = [{
        time: 0.000,
        data: feature_camera
      }, {
        time: 1.000,
        data: {
          text: ''
        }
      }, {
        time: 2.100,
        data: feature_display
      }, {
        time: 5.300,
        data: {
          text: ''
        }
      }, {
        time: 8.067,
        data: {
          text: '<div><div class="hint-right">Click and drag to explore the phone</div></div>',
          icon: 'sprite-png spin',
          left: '535px',
          top: '180px'
        }
      }, {
        time: 8.100,
        data: {
          text: ''
        }
      }, {
        time: 10.00,
        data: feature_camera2
      }, {
        time: 11.80,
        data: {
          text: ''
        }
      }, {
        time: 13.20,
        data: feature_multi
      }];
      var len = cuepoints.length;
      var vidSize = {
        w: 184,
        h: 248
      };

      var vo = _extends({}, vcOpts, {
        container: dom.auto_video_player,
        poster: 'video-poster-2x.jpg',
        cuepoints: cuepoints
      });

      // var vc = new VideoControls(Enabler.getUrl('galaxy-fold-spin.mp4'), vidSize.w, vidSize.h, vo);
      var vc = new VideoControls('galaxy-fold-spin.mp4', vidSize.w, vidSize.h, vo);
      var fps = 1 / 30;
      var local = window.location.hostname === 'localhost';
      var midpoint = cuepoints[4].time;
      var duration;
      var pressX;
      var pressTime;
      var lastCue;
      var currentFeature;
      var interacted; ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

      function startAd() {
        if (es5()) {
          autoPlayBanner();
        } else {
          gsap.set('#backup', {
            className: 'backup'
          });
        }
      }

      function autoPlayBanner() {
        dom.seek_cover.style.backgroundImage = "url('" + vo.poster + "')"; // show video poster during initial seek to midpoint

        dom.seek_cover.style.backgroundSize = 'cover';
        // dc.loadModule(studio.module.ModuleId.VIDEO, function () { if (!local) studio.video.Reporter.attach('auto_video', vc.videoElement); });
        dom.ad_content.classList.remove('invisible');
      } ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////


      function scrub(e) {
        var shift = (e.clientX - pressX) * fps;
        var time = pressTime + shift;

        if (Math.abs(time - vc.currentTime) > fps) {
          if (time >= duration) time = duration - fps;

          if (vc.seeking) {
            vc.addEventListener('seeked', function wait() {
              vc.removeEventListener('seeked', wait);
              vc.currentTime = time;
            });
          } else {
            vc.currentTime = time;
          }
        }
      }

      function startDrag(e) {
        if (!interacted) {
          // BUG: cuePoints index is off by -1
          dom.overlay.innerHTML = '';
          dom.overlay.classList.remove('no-mouse');
          vc.cuePoints[3].data = _extends({}, feature_multi, {
            left: '370px'
          });
          vc.cuePoints[3].time = 6.8;
          vc.cuePoints[4].time = 9.2;
          dom.overlay.addEventListener('click', handleFeatureClick);
          dom.overlay.style.cursor = 'pointer';
          interacted = true;
        }

        pressX = e.clientX;
        pressTime = vc.currentTime; // if(!vc.paused) vc.pause();

        dom.ad_content.addEventListener('mousemove', scrub);
      }

      dom.ad_content.addEventListener('mouseleave', stopDrag);

      function stopDrag() {
        dom.ad_content.removeEventListener('mousemove', scrub);
      }

      function updateOverlay(time) {
        var cue = {
          time: 0,
          data: {
            text: ''
          }
        };
        var pt = -1;

        for (var i = 0; i < len; i++) {
          if (time >= cuepoints[i].time) pt = i;
        }

        if (pt > -1) cue = cuepoints[pt];

        if (pt !== lastCue) {
          if (cue.data.left) dom.overlay.style.left = cue.data.left;
          if (cue.data.top) dom.overlay.style.top = cue.data.top;
          dom.overlay.innerHTML = cue.data.text;

          if (cue.data.icon) {
            var side = cue.data.icon === 'dot' ? 'beforeend' : 'afterbegin';
            dom.overlay.insertAdjacentHTML(side, "<div id=\"icon\" class=\"" + cue.data.icon + "\"></div>");
          }

          if (cue.data.video) {
            if (!cue.data.video.vc) {
              // cue.data.video.vc = new VideoControls(Enabler.getUrl(cue.data.video.file), 320, 180, cue.data.video.vo);
              cue.data.video.vc = new VideoControls(cue.data.video.file, 320, 180, cue.data.video.vo);

              // switch (cue.data.name) {
              //   case 'feature-camera': studio.video.Reporter.attach('feature-camera', cue.data.video.vc.videoElement); break;
              //   case 'feature-display': studio.video.Reporter.attach('feature-display', cue.data.video.vc.videoElement); break;
              //   case 'feature-multi': studio.video.Reporter.attach('feature-multi', cue.data.video.vc.videoElement); break;
              //   default: log.trace(cue.data.name + " video initiated");
              // }
            }

            currentFeature = cue.data.video.vc;
            dom.feature_video.classList.remove('invisible');
            currentFeature.container.classList.remove('invisible');

            if (currentFeature.paused) {
              currentFeature.play();
              currentFeature.currentTime = 0;
            }
          } else {
            if (currentFeature) currentFeature.pause();
            [dom.feature_video, dom.feature1_video_player, dom.feature2_video_player, dom.feature3_video_player].forEach(function (elem) {
              elem.classList.add('invisible');
            });
          }

          lastCue = pt;
        }

        dom.time.innerHTML = time.toFixed(2);
      }

      vc.addEventListener('error', function (err) {
        log.trace("err.message: " + err.message);
      });
      vc.addEventListener('seeked', function () {
        if (isIE || isEdge) {
          if (vc.paused) {
            vc.addEventListener('play', function movePlayhead() {
              vc.removeEventListener('play', movePlayhead);
              vc.pause();
            });
            vc.play();
          }
        }
      });
      vc.addEventListener('loadedmetadata', function () {
        duration = vc.duration;
        vc.showControls(false);
        vc.addEventListener('seeked', function initialSeek() {
          vc.removeEventListener('seeked', initialSeek);
          dom.seek_cover.style.display = 'none';
        });
        vc.currentTime = midpoint;
      });
      vc.addEventListener('timeupdate', function () {
        updateOverlay(vc.currentTime);
        dom.time.innerHTML = vc.currentTime.toFixed(2);
      });
      vc.addEventListener('cuepoint', function (e) {
        updateOverlay(e.detail.time);
      });
      dom.auto_video_hit.addEventListener('mousedown', function (e) {
        if (duration) {
          startDrag(e);
          scrub(e);
        }
      });

      function handleFeatureClick() {
        var cue = cuepoints[lastCue].data;
        cue.video.vc.pause();

        switch (cue.name) {
          case 'feature-camera':
            dc.exit('feature-camera');
            break;

          case 'feature-display':
            dc.exit('feature-display');
            break;

          case 'feature-multi':
            dc.exit('feature-multi');
            break;

          default:
            log.trace(cue.name + " clicked");
        }
      }

      dom.feature_video_hit.addEventListener('click', handleFeatureClick);
      dom.ad_content.addEventListener('mouseup', stopDrag);
      dom.cta_hit.addEventListener('mouseenter', function () {
        gsap.to(dom.cta_up, 0.25, {
          alpha: 0,
          ease: Cubic.easeIn
        });
        gsap.to(dom.cta_over, 0.25, {
          alpha: 1,
          ease: Cubic.easeOut
        });
      });
      dom.cta_hit.addEventListener('mouseleave', function () {
        gsap.to(dom.cta_over, 0.25, {
          alpha: 0,
          ease: Cubic.easeIn
        });
        gsap.to(dom.cta_up, 0.25, {
          alpha: 1,
          ease: Cubic.easeOut
        });
      });
      dom.cta_hit.addEventListener('click', function () {
        dc.exit('cta');
      }); ////////////////////////////////////////////////////// INIT //////////////////////////////////////////////////////

      startAd();
    }
  };

  window.onload = function () {
    // if (Enabler.isInitialized()) {
      Banner.init();
    // } else { Enabler.addEventListener(studio.events.StudioEvent.INIT, Banner.init); }
  };

}());

(function () {
  'use strict';

  /* eslint-disable no-use-before-define */
  var Animation = {
    init: function init() {
      var screens = document.getElementById('screens');
      var frameWidth = 414;
      var frames = 29;
      var frameNum = 0;
      var loops = 0;
      var advance;

      function frameAdvance() {
        frameNum += 1;

        if (frameNum < frames) {
          TweenMax.to(screens, 0.5, {
            backgroundPosition: "-" + frameWidth * frameNum + "px 0px",
            ease: Power3.easeInOut
          });
        } else {
          window.clearInterval(advance);
          loops += 1;
          frameNum = 0;
          TweenMax.to(screens, 1, {
            backgroundPosition: '0px 0px',
            ease: Power3.easeInOut
          });
          if (loops < 3) TweenMax.delayedCall(2, play);
        }
      }

      function play() {
        advance = window.setInterval(frameAdvance, 1500);
      }

      play();
    }
  };

  window.onload = function () {
    window.requestAnimationFrame(Animation.init);
  };

}());

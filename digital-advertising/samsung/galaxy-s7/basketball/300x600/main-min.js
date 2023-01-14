!function(e){"use strict";function t(t,o,r,a,s,u,c,m,f,l){function y(){var e=F%w.every;if(0===e)h(),S&&d(0,x[M]);else if(S){var t=e/w.every;d(t)}F++,I===!0&&n(y)}function d(e,n){if(p){var s=e*i;t.style.opacity=Math.cos(s),v.style.opacity=Math.sin(s)}else v.style.opacity=e;n&&(g.clearRect(b,k,r,a),g.drawImage(o,n.x,n.y,r,a,b,k,r,a))}function h(){u?z[M]?A.drawImage(z[M],0,0,r,a,b,k,r,a):(A.drawImage(o,x[M].x,x[M].y,r,a,b,k,r,a),z[M]=new Image,z[M].src=t.toDataURL()):(A.clearRect(b,k,r,a),A.drawImage(o,x[M].x,x[M].y,r,a,b,k,r,a)),M>s-2&&!w.reverse?(I=!1,w.onComplete&&w.onComplete()):1>M&&w.reverse?I=!1:w.reverse?M--:M++}var p,v,g,w=this,C=Math.floor(o.width/r)-1,A=(Math.floor(o.height/a)-1,t.getContext("2d")),M=0,x=[],R=0,q=0,F=1,I=!1,S=!1,b=f||0,k=l||0;if(u)var z=new Array(s+1);t.width=c||r,t.height=m||a;for(var B=0,D=0;s>B;)x.push({x:r*R,y:a*q}),C>R?R++:R=0,D++,q=Math.floor(D/(C+1)),B++;R=q=0,w.every=1,w.setCrossfade=function(n){n&&(p=!0),v=document.createElement("canvas"),v.id=t.id+"2",v.width=t.width,v.height=t.height,v.style.position=e.getComputedStyle(t).position,v.style.left=e.getComputedStyle(t).left,v.style.top=e.getComputedStyle(t).top,t.parentNode.insertBefore(v,t.nextSibling),g=v.getContext("2d"),S=!0,d(0,x[1])},w.reverse=!1,w.onComplete=function(){},w.play=function(e){void 0!==e&&(M=0>e?0:e>s?s:e),I=!0,y()},w.pause=function(){I=!1},h()}var n,o=Math.PI/180,i=90*o;n=e.requestAnimationFrame?function(t){return e.requestAnimationFrame(t)}:e.webkitRequestAnimationFrame?function(t){return e.webkitRequestAnimationFrame(t)}:e.MozRequestAnimationFrame?function(t){return e.MozRequestAnimationFrame(t)}:function(t){return e.setTimeout(t,17)},t.prototype={constructor:t},e.AnimatedSprite=t}(window);
!function(e){"use strict";function t(){i=this}function n(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}var r,o,a,i;t.prototype={constructor:t,debug:!1,dom:{},trace:function(t){i.debug&&e.console&&e.console.log(t)},getTouch:function(){return void 0===a&&(a="ontouchstart"in e||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0),a},getMobileOS:function(){var t=navigator.userAgent||navigator.vendor||e.opera;return t.match(/iPad/i)||t.match(/iPhone/i)||t.match(/iPod/i)?"iOS":t.match(/Android/i)||t.match(/Silk/i)?"Android":"unknown"},getBrowser:function(){if(void 0===o){var t="WebkitAppearance"in document.documentElement.style,n=!!e.opera||/opera|opr/i.test(navigator.userAgent);o=t?e.chrome?e.chrome&&e.chrome.webstore?"Chrome 14+":n?"Opera 14+":"Android 4+":"//"==/a/.__proto__?"Safari 5-":"Safari 6+ or other Webkit":n?"Opera 13-":e.sidebar?e.globalStorage?"Firefox 13-":"Firefox 14+":e.navigator.msPointerEnabled?"IE10+":document.all&&document.addEventListener&&!e.atob?"IE9":document.all&&!document.addEventListener?"IE8-":"unknown"}return o},timerStart:function(){r=(new Date).getTime()},getMilliseconds:function(){return(new Date).getTime()-r},getSeconds:function(){return.001*((new Date).getTime()-r)},timerStop:function(){var e=(new Date).getTime()-r;i.trace("seconds elapsed: "+.001*e)},preloadImages:function(e){function t(){o++;var e=.001*((new Date).getTime()-n);c.trace("image "+o+"/"+i.length+" loaded @ "+e),o===i.length&&a(r)}for(var n=(new Date).getTime(),r=[],o=0,a=function(){},i="object"!=typeof e?[e]:e,c=this,u=0;u<i.length;u++)r[u]=new Image,r[u].onload=t,r[u].onerror=t,r[u].src=i[u];return{done:function(e){a=e||a}}},qs:function(e,t){return(t||document).querySelector(e)},qsa:function(e,t){return(t||document).querySelectorAll(e)},targ:function(e){return"string"==typeof e?i.qs(e):e},makeVar:function(e,t,n){var r;return r=n?e.replace(/-(.)|_(.)/g,function(e,t,n){var r="";return t&&(r+=t.charAt(0).toUpperCase()+t.substring(1,t.length)),n&&(r+=n.toUpperCase()),r}):e.replace(/-/g,"_"),t[r]=document.getElementById(e),t[r]},makeVars:function(e,t,n,r){for(var o,a=e.length;a--;)o=i.makeVar(e[a],t,r),n.push(o)},getAllIdElements:function(e){for(var t=e.getElementsByTagName("*"),n=[],r=t.length;r--;)t[r].hasAttribute("id")&&n.push(t[r]);return n},getAllIds:function(e,t,n){for(var r=e.getElementsByTagName("*"),o=[],a="var ",c=n||"bu",u=r.length,s=0;u>s;s++)r[s].hasAttribute("id")&&(o.push(r[s].id),t&&(a+=r[s].id.replace(/-/g,"_")+" = "+c+".qs('#"+r[s].id+"')",s>-1&&(a+=",\n    ")));return t&&(a=a.replace(/,\s([^,]+)$/,"; $1"),i.trace(a)),o},makeVarsFromIds:function(e,t,n,r){var o=i.getAllIds(e||document);i.makeVars(o,t||i.dom,n||[],r)},recordStates:function(e){(!e||e.length<1)&&(e=i.getAllIdElements(document));for(var t=e.length;t--;)e[t].cl="",e[t].cl+=e[t].className},resetStates:function(e,t){(!e||e.length<1)&&(e=i.getAllIdElements(document));for(var n=e.length;n--;)void 0!==e[n].cl?e[n].className=e[n].cl:i.trace("initial state not recorded for: "+e[n].id);if(t){var r=10*e.length;setTimeout(function(){t.apply()},r)}}},NodeList.prototype.forEach=Array.prototype.forEach;var c,u;e.addEventListener?(c=function(e,t,n,r){i.targ(e).addEventListener(t,n,r||!1)},u=function(e,t,n,r){i.targ(e).removeEventListener(t,n,r||!1)}):e.attachEvent&&(c=function(t,n,r){var o=i.targ(t);o["e"+n+r]=r,o[n+r]=function(){o["e"+n+r](e.event)},o.attachEvent("on"+n,o[n+r])},u=function(e,t,n){var r=i.targ(e);r.detachEvent("on"+t,r[t+n]),r[t+n]=null}),t.prototype.addListener=c,t.prototype.removeListener=u;var s;s=e.stopPropagation?function(e){e.stopPropagation(),e.preventDefault()}:function(e){e.returnValue=!1,e.cancelBubble=!0},t.prototype.stopPropagation=s;var l;l=e.requestAnimationFrame?function(t){return e.requestAnimationFrame(t)}:e.webkitRequestAnimationFrame?function(t){return e.webkitRequestAnimationFrame(t)}:e.MozRequestAnimationFrame?function(t){return e.MozRequestAnimationFrame(t)}:function(t){return e.setTimeout(t,17)},t.prototype.requestFrame=l;var m;m=e.cancelAnimationFrame?function(t){return e.cancelAnimationFrame(t)}:e.webkitCancelAnimationFrame?function(t){return e.webkitCancelAnimationFrame(t)}:e.MozCancelAnimationFrame?function(t){return e.MozCancelAnimationFrame(t)}:function(t){return e.clearTimeout(t)},t.prototype.cancelFrame=m;var d;d=e.getComputedStyle?function(t){return e.getComputedStyle(t)}:function(e){return i.targ(e).currentStyle},t.prototype.getStyle=d;var g,f,p;"classList"in document.documentElement?(g=function(e,t){return i.targ(e).classList.contains(t)},f=function(e,t){i.targ(e).classList.add(t)},p=function(e,t){i.targ(e).classList.remove(t)}):(g=function(e,t){return n(t).test(i.targ(e).className)},f=function(e,t){g(e,t)||(i.targ(e).className=i.targ(e).className+" "+t)},p=function(e,t){i.targ(e).className=i.targ(e).className.replace(n(t)," ")}),t.prototype.addClass=f,t.prototype.removeClass=p,t.prototype.hasClass=g,t.prototype.replaceClass=function(e,t,n){i.removeClass(e,t),i.addClass(e,n)},e.BannerUtils=t}(window);
!function(t){"use strict";var s,e=function(t){t=t||{};for(var s=1;s<arguments.length;s++)if(arguments[s])for(var e in arguments[s])arguments[s].hasOwnProperty(e)&&(t[e]=arguments[s][e]);return t},r=function(t,s){return(t.matches||t.matchesSelector||t.msMatchesSelector||t.mozMatchesSelector||t.webkitMatchesSelector||t.oMatchesSelector).call(t,s)},i=function(t,i){s=this,this.el=t,this.options=e({},s.typed.defaults,i),this.isInput=r(this.el,"input"),this.attr=this.options.attr,this.showCursor=this.isInput?!1:this.options.showCursor,this.elContent=this.attr?this.el.setAttribute(this.attr):this.el.textContent,this.contentType=this.options.contentType,this.typeSpeed=this.options.typeSpeed,this.startDelay=this.options.startDelay,this.backSpeed=this.options.backSpeed,this.backDelay=this.options.backDelay,this.stringsElement=this.options.stringsElement,this.strings=this.options.strings,this.strPos=0,this.arrayPos=0,this.stopNum=0,this.loop=this.options.loop,this.loopCount=this.options.loopCount,this.curLoop=0,this.stop=!1,this.cursorChar=this.options.cursorChar,this.shuffle=this.options.shuffle,this.sequence=[],this.build()};i.prototype={constructor:i,init:function(){var t=this;t.timeout=setTimeout(function(){for(var s=0;s<t.strings.length;++s)t.sequence[s]=s;t.shuffle&&(t.sequence=t.shuffleArray(t.sequence)),t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos)},t.startDelay)},build:function(){var t=this;if(this.showCursor===!0&&(this.cursor='<span class="typed-cursor">'+this.cursorChar+"</span>",this.el.insertAdjacentHTML("afterend",this.cursor)),this.stringsElement){t.strings=[],this.stringsElement.style.display="none";for(var s=this.stringsElement.querySelectorAll("p"),e=0;e<s.length;e++)t.strings.push(s[e].innerHTML)}this.init()},typewrite:function(t,s){if(this.stop!==!0){var e=Math.round(Math.random()*this.typeSpeed)+this.typeSpeed,r=this;r.timeout=setTimeout(function(){var e=0,i=t.substr(s);if("^"===i.charAt(0)){var o=1;/^\^\d+/.test(i)&&(i=/\d+/.exec(i)[0],o+=i.length,e=parseInt(i)),t=t.substring(0,s)+t.substring(s+o)}if("html"===r.contentType){var n=t.substr(s).charAt(0);if("<"===n||"&"===n){var a="",h="";for(h="<"===n?">":";";t.substr(s).charAt(0)!==h;)a+=t.substr(s).charAt(0),s++;s++,a+=h}}r.timeout=setTimeout(function(){if(s===t.length){if(r.options.onStringTyped(r.arrayPos),r.arrayPos===r.strings.length-1&&(r.options.callback(),r.curLoop++,r.loop===!1||r.curLoop===r.loopCount))return;r.timeout=setTimeout(function(){r.backspace(t,s)},r.backDelay)}else{0===s&&r.options.preStringTyped(r.arrayPos);var e=t.substr(0,s+1);r.attr?r.el.attr(r.attr,e):r.isInput?r.el.val(e):"html"===r.contentType?r.el.innerHTML=e:r.el.textContent=e,s++,r.typewrite(t,s)}},e)},e)}},backspace:function(t,s){if(this.stop!==!0){var e=Math.round(Math.random()*this.typeSpeed)+this.backSpeed,r=this;r.timeout=setTimeout(function(){if("html"===r.contentType&&">"===t.substr(s).charAt(0)){for(var e="";"<"!==t.substr(s).charAt(0);)e-=t.substr(s).charAt(0),s--;s--,e+="<"}var i=t.substr(0,s);r.attr?r.el.attr(r.attr,i):r.isInput?r.el.val(i):"html"===r.contentType?r.el.innerHTML=i:r.el.textContent=i,s>r.stopNum?(s--,r.backspace(t,s)):s<=r.stopNum&&(r.arrayPos++,r.arrayPos===r.strings.length?(r.arrayPos=0,r.shuffle&&(r.sequence=r.shuffleArray(r.sequence)),r.init()):r.typewrite(r.strings[r.sequence[r.arrayPos]],s))},e)}},shuffleArray:function(t){var s,e,r=t.length;if(r)for(;--r;)e=Math.floor(Math.random()*(r+1)),s=t[e],t[e]=t[r],t[r]=s;return t},reset:function(){var t=this;clearInterval(t.timeout);var s=this.el.getAttribute("id");this.el.insertAdjacentHTML("afterend",'<span id="'+s+'"/>'),this.el.parentNode.removeChild(this.el),"undefined"!=typeof this.cursor&&this.cursor.parentNode.removeChild(this.cursor),t.options.resetCallback()}},i.prototype.typed=function(t){},i.prototype.typed.defaults={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,shuffle:!1,backDelay:500,loop:!1,loopCount:!1,showCursor:!0,cursorChar:"|",attr:null,contentType:"html",callback:function(){},preStringTyped:function(){},onStringTyped:function(){},resetCallback:function(){}},t.Typed=i}(window);
var Banner = {

  init: function() {

    'use strict';

    var bu = new BannerUtils(); // utilities class
    var isIE9 = document.all && !window.atob;
    var typing;

    // Debug mode. Comment this line for final publishing
    bu.debug = true;

    // Log all IDs and create variables. Comment this line for final publishing
    // bu.getAllIds(document, true);
    // Or add all ID elements to one object and avoid all the hassle above and never worry about forgetting to declare a var (implied globals etc)
    var dom = {}; // this is the master object that will hold all references to elements with IDs
    bu.makeVarsFromIds(document, dom); // If camelCase arg is set to true, then <div id="my-div-name"> = dom.myDivName, otherwise it will = dom.my_div_name
//  bu.makeVarsFromIds(scope:object, holder:object, log:array, camelCase:boolean)

    // Set banner dimensions
    var adWidth = 300,
        adHeight = 600;


    ////////////////////////////////////////////////////// ANIMATION //////////////////////////////////////////////////////

    var clockInterval;
    var clockSeconds = 1.3;

    function countdown(){
      clockSeconds -= 0.1;
      dom.digits.innerHTML = ':0'+clockSeconds.toFixed(1);
    }

    function frameStart() {
      countdown();
      bu.timerStart();
      clockInterval = setInterval(countdown, 333);

      // if animation needs to be reset, you'll have to remove these transition classes
      dom.legal.classList.add('trans-1000');
      dom.headline.classList.add('trans-250');
      dom.typed.classList.add('trans-250');
      dom.end_card.classList.add('trans-250');
      dom.phone_end.classList.add('trans-2000');
      dom.phone_cover.classList.add('trans-1500');
      dom.logo.classList.add('trans-500');
      // dom.tagline.classList.add('trans-500');
      dom.cta.classList.add('trans-500');

      frame0();
    }

    function frame0(){
      dom.photo.classList.remove('photo-start');
      dom.player.classList.remove('player-start');
      dom.player_arm_ball.classList.add('arm-ball-move');
      dom.player_arm_back.classList.add('arm-back-move');
      setTimeout(function(){
        frame1();
      }, 2450);
    }

    function frame1(){
      clearInterval(clockInterval);
      // dom.sport.classList.add('alpha-0');
      // dom.sport.classList.add('blur');
      dom.sport.classList.add('invisible'); // child divs don't inherit visibility by default
      dom.cover.classList.remove('invisible');
      setTimeout(function(){
        dom.battery.classList.remove('invisible');
      }, 1000);
      setTimeout(function(){
        dom.battery.classList.add('invisible');
      }, 1600);
      setTimeout(function(){
        dom.battery.classList.remove('invisible');
      }, 2200);
      setTimeout(function(){
        dom.battery.classList.add('invisible');
      }, 2800);
      setTimeout(function(){
        frame2();
      }, 3400);
    }

    function frame2(){
      dom.branding.classList.remove('alpha-0');
      dom.headline.classList.remove('alpha-0');
      typing = new Typed(dom.typed, {
        stringsElement: dom.copy,
        showCursor: false,
        typeSpeed: 25,
        backDelay: 1000,
        loop: false,
        contentType: 'html', // html or text
        loopCount: false, // defaults to false for infinite loop
        callback: function(){
          setTimeout(frame3, 2000);
        }
      });
      setTimeout(function(){
        // dom.legal.classList.remove('alpha-0');
      }, 500);
    }

    function frame3(){
      dom.end_card.classList.remove('alpha-0');
      setTimeout(function(){
        dom.logo.classList.remove('alpha-0');
        dom.phone_cover.classList.add('alpha-0');
      }, 500);
      setTimeout(function(){
        dom.phone_end.classList.remove('phone-end-start');
      }, 1000);
      // setTimeout(function(){ dom.tagline.classList.remove('alpha-0'); }, 1500);
      setTimeout(function(){
        dom.cta.classList.remove('alpha-0');
      }, 1500);
      dom.end_card.classList.remove('invisible');
      setTimeout(frameStop, 2000);
    }

    function frameStop() {
      bu.timerStop();
      // bu.resetStates(null, frameStart); // loop
    }


    ////////////////////////////////////////////////////// EVENT HANDLERS //////////////////////////////////////////////////////

    function onAdClick() {
      window.open(window.clickTag);
    }

    function onAdHover() {
      bu.removeClass(dom.cta_over, 'alpha-0');
      bu.addClass(dom.cta_up, 'alpha-0');
    }

    function onAdOut() {
      bu.addClass(dom.cta_over, 'alpha-0');
      bu.removeClass(dom.cta_up, 'alpha-0');
    }

    function adClickThru() {
      bu.addListener(dom.ad_content, 'click', onAdClick);
      bu.addListener(dom.ad_content, 'mouseenter', onAdHover);
      bu.addListener(dom.ad_content, 'mouseleave', onAdOut);
    }


    ////////////////////////////////////////////////////// INIT //////////////////////////////////////////////////////

    bu.recordStates();

    function showFallback(){
      bu.removeClass(dom.branding, 'alpha-0');
      bu.removeClass(dom.cta, 'alpha-0');
      bu.removeClass(dom.logo, 'alpha-0');
      // bu.removeClass(dom.tagline, 'alpha-0');
      bu.removeClass(dom.end_card, 'alpha-0');
      bu.removeClass(dom.phone_end, 'phone-end-start');
      bu.addClass(dom.phone_cover, 'invisible');
      bu.removeClass(dom.end_card, 'invisible');
    }

    function displayAd(){
      adClickThru();
      if(isIE9){
        showFallback();
      } else {
        frameStart();
      }
      bu.removeClass(dom.ad_content, 'invisible');
    }

    displayAd();
  }
};

window.onload = function(){
  'use strict';
  Banner.init();
};

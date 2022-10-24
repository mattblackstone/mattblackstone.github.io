(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function i(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerpolicy&&(r.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?r.credentials="include":a.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=i(a);fetch(a.href,r)}})();function c(){}function D(e){return e()}function x(){return Object.create(null)}function p(e){e.forEach(D)}function C(e){return typeof e=="function"}function j(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function B(e){return Object.keys(e).length===0}function N(e,t,i){e.insertBefore(t,i||null)}function L(e){e.parentNode.removeChild(e)}function O(e){return document.createElement(e)}function R(e){return Array.from(e.childNodes)}let b;function h(e){b=e}const d=[],A=[],m=[],$=[],V=Promise.resolve();let v=!1;function P(){v||(v=!0,V.then(M))}function w(e){m.push(e)}const g=new Set;let f=0;function M(){const e=b;do{for(;f<d.length;){const t=d[f];f++,h(t),G(t.$$)}for(h(null),d.length=0,f=0;A.length;)A.pop()();for(let t=0;t<m.length;t+=1){const i=m[t];g.has(i)||(g.add(i),i())}m.length=0}while(d.length);for(;$.length;)$.pop()();v=!1,g.clear(),h(e)}function G(e){if(e.fragment!==null){e.update(),p(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(w)}}const z=new Set;function T(e,t){e&&e.i&&(z.delete(e),e.i(t))}function q(e,t,i,o){const{fragment:a,after_update:r}=e.$$;a&&a.m(t,i),o||w(()=>{const s=e.$$.on_mount.map(D).filter(C);e.$$.on_destroy?e.$$.on_destroy.push(...s):p(s),e.$$.on_mount=[]}),r.forEach(w)}function F(e,t){const i=e.$$;i.fragment!==null&&(p(i.on_destroy),i.fragment&&i.fragment.d(t),i.on_destroy=i.fragment=null,i.ctx=[])}function I(e,t){e.$$.dirty[0]===-1&&(d.push(e),P(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function W(e,t,i,o,a,r,s,E=[-1]){const u=b;h(e);const n=e.$$={fragment:null,ctx:[],props:r,update:c,not_equal:a,bound:x(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(u?u.$$.context:[])),callbacks:x(),dirty:E,skip_bound:!1,root:t.target||u.$$.root};s&&s(n.root);let y=!1;if(n.ctx=i?i(e,t.props||{},(l,k,...S)=>{const _=S.length?S[0]:k;return n.ctx&&a(n.ctx[l],n.ctx[l]=_)&&(!n.skip_bound&&n.bound[l]&&n.bound[l](_),y&&I(e,l)),k}):[],n.update(),y=!0,p(n.before_update),n.fragment=o?o(n.ctx):!1,t.target){if(t.hydrate){const l=R(t.target);n.fragment&&n.fragment.l(l),l.forEach(L)}else n.fragment&&n.fragment.c();t.intro&&T(e.$$.fragment),q(e,t.target,t.anchor,t.customElement),M()}h(u)}class J{$destroy(){F(this,1),this.$destroy=c}$on(t,i){if(!C(i))return c;const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(i),()=>{const a=o.indexOf(i);a!==-1&&o.splice(a,1)}}$set(t){this.$$set&&!B(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function U(e){let t;return{c(){t=O("main"),t.innerHTML=`<header><div id="me"><h1>Matt Blackstone</h1> 
      <h2>Creative Technologist</h2></div> 
    <span class="address">Bend, OR<br/><a href="https://www.linkedin.com/in/mattblackstone/">linkedin.com/in/mattblackstone</a></span></header> 
  <section><div><h3>Summary</h3> 
      <article><p>Technical leader, front-end developer, animator and production artist with over 20 years of experience
          creating digital content as well as managing teams of developers and designers. Proven success planning and
          executing projects with limited oversight for clients like Samsung, Mercedes, Disney, Nike and Lego.
          Approachable manager with experience estimating, solving technical problems, reaching consensus, resolving
          conflicts and hiring. Over 5 years of experience working with remote teams across multiple time zones.
          Comfortable writing minimal vanilla JavaScript as well as using the latest front-end frameworks and libraries.
          Able to leverage design background to bridge the gap between creative and tech.</p></article></div></section> 
  <section><div><h3>Work</h3> 
      <article class="row"><img src="/images/logo-strava-128x128.png" alt="Strava logo" width="64" height="64" class="logo"/> 
        <div><div class="inline-all"><h4>Strava:</h4> 
            <h5>Year In Sport</h5></div> 
          <p>An interactive data visualization experience for athletes who use Strava to track their workouts. Strava&#39;s
            annual Year In Sport is a chance for athletes to review their fitness highlights, progress, summary and
            share stats with friends. Designed in Figma, prototyped in vanilla JS and built using React. <a href="https://mattblackstone.com/strava">View project</a></p></div></article> 
      <article class="row"><img src="/images/logo-quad-128x128.png" alt="GAS React Next Lambda logos" width="64" height="64" class="logo"/> 
        <div><div class="inline-all"><h4>R/GA:\xA0</h4> 
            <h5>Spreadsheet Driven Static Site</h5></div> 
          <p>Automated workflows using custom scripted Google Sheets are extremely effective, but can be overwhelming. A
            well designed front-end view gives much more control over how the data is displayed while still using the
            Google Sheets as the data source. The tech stack includes Google APIs, AWS Lambda, React and Next.js <a href="https://mattblackstone.com/front-end">View project</a></p></div></article> 
      <article class="row"><img src="/images/logo-mercedes-128x128.png" alt="Mercedes logo" width="64" height="64" class="logo"/> 
        <div><div class="inline-all"><h4>Mercedes-Benz:\xA0</h4> 
            <h5>Build Your Own</h5></div> 
          <p>Visitors to <a href="https://www.mbusa.com">MBUSA</a> are retargeted in display channels with dynamic ad
            content featuring a replica of the vehicle that they configured (class, model, paint, wheels etc). Using a
            custom developed solution, new vehicle configurations are pulled dynamically from the MBUSA media server at
            impression time, and cached at the dynamic ad server for future requests. <a href="https://mattblackstone.com/mercedes">View
              project</a></p></div></article> 
      <article class="row"><img src="/images/logo-disney-128x128.png" alt="Disney logo" width="64" height="64" class="logo"/> 
        <div><div class="inline-all"><h4>Disney Parks &amp; Resorts:\xA0</h4> 
            <h5>Shopping Cart Abandoners</h5></div> 
          <p>Data from abandoned shopping carts on Disney owned properties helps target users with ads designed to
            facilitate planning a Disney vacation. Users see ads featuring their favorite Disney characters with helpful
            suggestions relevant to the resorts from their carts. The content changes over time with special offers and
            reminders to book soon. Design systems, automation and extremely flexible HTML templates enabled thousands
            of variations. <a href="https://mattblackstone.com/disney">View project</a></p></div></article> 
      <article class="row"><img src="/images/logo-mailchimp-128x128.png" alt="Mailchimp logo" width="64" height="64" class="logo"/> 
        <div><div class="inline-all"><h4>Mailchimp:\xA0</h4> 
            <h5>Programmatic Automation</h5></div> 
          <p>A programmatic ad campaign built without the use of a dynamic ad server such as Sizmek or Flashtalking. A
            local Node.js workflow paired with scripted spreadsheets to automate the creation of the hundreds of ad
            versions required circumvented the need for a dynamic ad server. As a result, the media team retained full
            ownership of the performance metrics and the ads were served at a much lower cost. <a href="https://mattblackstone.com/mailchimp">View
              project</a></p></div></article> 
      <article class="row"><img src="/images/logo-samsung-128x128.png" alt="Samsung logo" width="64" height="64" class="logo"/> 
        <div><div class="inline-all"><h4>Samsung:\xA0</h4> 
            <h5>Display Advertising</h5></div> 
          <p>Pushing the limits of display advertising using a variety of animation techniques (GSAP, CSS 3D, Canvas,
            Lottie, Spritesheets etc) to achieve video quality in a package of around 200k. <a href="https://mattblackstone.com/digital-advertising/samsung">View examples</a></p></div></article></div></section> 
  <section id="resume"><div id="experience"><h3>Experience</h3> 
      <article><h4>RED Digital Cinema</h4> 
        <h5>Senior Frontend Developer (2022 \u2013 present)</h5> 
        <p>Build interactive marketing experiences that showcase the industry leading digital video capabilities of RED cameras. Maintain and improve RED&#39;s large ecommerce website. Refactor legacy code to improve performance and usability by leveraging front-end frameworks like Alpine and Svelte.</p></article> 
      <article><h4>Spectrum</h4> 
        <h5>Senior Frontend Developer (2021 \u2013 2022)</h5> 
        <p>Build Vue.js + Vuex front-end for data-driven WebGL-based 3D product customization. Each unique front-end UI
          for clients like Specialized, Levi&#39;s, Gerber and Chewy ties the 3D product and backend data together to give
          the user a truly immersive experience to visualize their customized product from any angle before it&#39;s sent to
          the factory for production.</p></article> 
      <article><h4>R/GA</h4> 
        <h5>Technology Director (2009 \u2013 2020)</h5> 
        <p>Lead front-end development projects for clients such as Nike, Verizon, and Walmart. Create templates and
          documentation for developers in our Portland, New York and Buenos Aires offices. Build framework agnostic
          prototypes for client approval. Oversee developers and liaise with producers and creative teams. Consult with
          creative teams about technical possibilities during concept phase.</p></article> 
      <article><h4>Cheil</h4> 
        <h5>Design Director (2003 \u2013 2008)</h5> 
        <p>Managed and created promotional campaigns for Samsung ranging from landing pages to larger websites. Produced
          rich-media advertising to drive traffic to these destinations. Oversaw video and photo shoots with vendors.
          Created some of the first promotional content for Facebook and YouTube.</p></article> 
      <article><h5>*More experience available upon request.</h5></article></div> 
    <div id="code" class="thin-list"><h3>Code</h3> 
      <ul><li>JavaScript</li> 
        <li>ES6+</li> 
        <li>HTML5</li> 
        <li>CSS/SCSS</li> 
        <li>JSON</li> 
        <li>Svelte</li> 
        <li>Vue</li> 
        <li>React</li> 
        <li>Next.js</li> 
        <li>Alpine</li> 
        <li>Bash</li> 
        <li>SQL</li></ul></div> 
    <div id="tools" class="thin-list"><h3>Tools</h3> 
      <ul><li>Git</li> 
        <li>Node</li> 
        <li>npm</li> 
        <li>Babel</li> 
        <li>Webpack</li> 
        <li>Rollup</li> 
        <li>Greensock</li> 
        <li>AWS</li> 
        <li>AWS Lambda</li> 
        <li>Azure</li> 
        <li>Contentful</li> 
        <li>Jira</li></ul></div> 
    <div id="software"><h3>Software</h3> 
      <ul><li>Visual Studio Code</li> 
        <li>Adobe Photoshop</li> 
        <li>Adobe Illustrator</li> 
        <li>Adobe After Effects</li> 
        <li>Adobe Animate</li> 
        <li>Figma</li></ul></div> 
    <div id="education"><h3>Education</h3> 
      <h4>James Madison University</h4> 
      <h5>Harrisonburg, VA<br/>Bachelor of Science<br/>1992 \u2013 1996</h5> 
      <p>Areas of study: graphic design, 3D animation, printmaking, color theory, painting, drawing, sculpture, math and
        science.</p></div></section>`},m(i,o){N(i,t,o)},p:c,i:c,o:c,d(i){i&&L(t)}}}class Y extends J{constructor(t){super(),W(this,t,null,U,j,{})}}new Y({target:document.getElementById("app")});

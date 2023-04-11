const InView=function(i,t){t="object"==typeof t?t:{};const s=this;s.selector=i,s.items=document.querySelectorAll(s.selector),s.observer=null,s.defaults={hidden:"inview--hidden",partial:"inview--partial",visible:"inview--full",steps:10,once:!1},s.options={},s.merge=function(t,e,o){o=void 0!==o;const n={};return Object.keys(t).forEach(i=>{i in e?!o||"object"!=typeof e[i]||"length"in e[i]?n[i]=e[i]:n[i]=s.merge(t[i],e[i]):n[i]=t[i]}),Object.keys(e).forEach(i=>{i in n||(i in t?!o||"object"!=typeof t[i]||"length"in t[i]?n[i]=t[i]:n[i]=s.merge(e[i],t[i]):n[i]=e[i])}),n},s.event_dispatch=function(t,e){try{var i=new Event(t);e.dispatchEvent(i)}catch(i){const o=document.createEvent("Event");o.initEvent(t,!0,!0),e.dispatchEvent(o)}},s.view_check_item=function(i){const t=i.target;Math.floor(i.intersectionRatio)?t.classList.contains(s.options.visible)||(s.options.hidden.length&&s.options.hidden!==s.options.visible&&t.classList.remove(s.options.hidden),s.options.partial.length&&s.options.partial!==s.options.visible&&t.classList.remove(s.options.partial),s.options.visible.length&&(t.classList.add(s.options.visible),s.options.once&&s.observer.unobserve(t)),"function"==typeof s.options.onshow&&s.options.onshow(t),s.event_dispatch("inview_visible",t)):i.intersectionRatio?t.classList.contains(s.options.partial)||(s.options.hidden.length&&s.options.hidden!==s.options.partial&&t.classList.remove(s.options.hidden),s.options.partial.length&&(t.classList.add(s.options.partial),s.options.once&&!s.options.visible.length&&s.observer.unobserve(t)),s.options.visible.length&&s.options.visible!==s.options.partial&&t.classList.remove(s.options.visible),"function"==typeof s.options.onpartial&&s.options.onpartial(t),s.event_dispatch("inview_partial",t)):t.classList.contains(s.options.hidden)||(s.options.hidden.length&&t.classList.add(s.options.hidden),s.options.partial.length&&s.options.partial!==s.options.hidden&&t.classList.remove(s.options.partial),s.options.visible.length&&s.options.visible!==s.options.hidden&&t.classList.remove(s.options.visible),"function"==typeof s.options.onhide&&s.options.onhide(t),s.event_dispatch("inview_hidden",t)),t.matches(s.selector)||s.observer.unobserve(t)},s.view_check=function(i){i.forEach(s.view_check_item)},s.thresholds_get=function(){var i=1/s.options.steps;let t=i;const e=[0];for(;t<1;)e.push(t),t+=i;return e.push(1),e},s.init=function(){s.options=s.merge(s.defaults,t),s.items.length&&(s.observer=new IntersectionObserver(s.view_check,{root:null,rootMargin:"0px",threshold:s.thresholds_get()}),s.items.forEach(function(i){s.observer.observe(i),"function"==typeof s.options.onbind&&s.options.onbind(i)}),s.event_dispatch("inview_initialised",window))},s.fallback=function(){s.items.length&&s.items.forEach(i=>{i.classList.remove(s.options.hidden),i.classList.remove(s.options.partial),i.classList.add(s.options.visible),s.event_dispatch("inview_visible",i)})},"undefined"!=typeof IntersectionObserver?s.init():s.fallback()};
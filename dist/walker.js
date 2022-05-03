!function(){"use strict";var t=function(){return t=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},t.apply(this,arguments)};function e(t){return function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];try{return t.apply(void 0,e)}catch(t){return void console.error("walker",t)}}}function n(){return Math.random().toString(36).slice(2,8)}function r(t,e){void 0===e&&(e=";");var n={};if(!t)return n;var r=new RegExp("(?:[^".concat(e,"']+|'[^']*')+"),"ig");return(t.match(r)||[]).forEach((function(t){var e=function(t){var e=t.split(/:(.+)/,2),n=e[0],r=e[1];return[o(n),o(r)]}(t),r=e[0],a=e[1],c=i(r)[0];c&&(n[c]=a||c)})),n}function i(t){var e=t.split("(",2),n=e[0],r=e[1];return[n,r?r.slice(0,-1):""]}function o(t){return t?t.trim().replace(/^'|'$/g,"").trim():""}function a(t,e){return t.getAttribute(e)||""}function c(e,n){return void 0===n&&(n={}),t(t({},e),n)}function u(t){var e=a(t,f());if(!e)return null;for(var n={},r="[".concat(f(e),"]"),i=t;i;)i.matches(r)&&(n=c(s(i,e),n)),i=i.parentElement;t.querySelectorAll(r).forEach((function(t){var r=s(t,e);Object.entries(r).forEach((function(e){var n=e[0],i=e[1];if("#"===i.charAt(0)){i=i.substring(1);try{var o=t[i];o||"selected"!==i||(o=t.options[t.selectedIndex].text),o&&(r[n]=o)}catch(t){r[n]=""}}})),n=c(n,r)}));var o=[];return t.querySelectorAll("[".concat(f(),"]")).forEach((function(t){var e=u(t);e&&o.push(e)})),{type:e,data:n,nested:o}}function f(t,e){return void 0===e&&(e=!0),"elb"+(t?(e?"-":"")+t:"")}function s(t,e){return r(a(t,f(e))||"")}var l=document,d=window,h=e((function(t){if(void 0===t&&(t=1e3),d.IntersectionObserver)return new d.IntersectionObserver((function(e){e.forEach((function(e){var n=e.target,r="elbTimerId";if(e.intersectionRatio>=.5){var i=d.setTimeout((function(){(function(t){var e=getComputedStyle(t);if("none"===e.display)return!1;if("visible"!==e.visibility)return!1;if(Number(e.opacity)<.1)return!1;if(t.offsetWidth+t.offsetHeight+t.getBoundingClientRect().height+t.getBoundingClientRect().width===0)return!1;var n={x:t.getBoundingClientRect().left+t.offsetWidth/2,y:t.getBoundingClientRect().top+t.offsetHeight/2};if(n.x<0)return!1;if(n.x>(l.documentElement.clientWidth||d.innerWidth))return!1;if(n.y<0)return!1;if(n.y>(l.documentElement.clientHeight||d.innerHeight))return!1;var r=l.elementFromPoint(n.x,n.y);if(r)do{if(r===t)return!0}while(r=r.parentElement);return!1})(n)&&(m(n,"visible"),delete n.dataset[r],h&&h.unobserve(n))}),t);n.dataset[r]=String(i)}else n.dataset[r]&&(clearTimeout(Number(n.dataset[r])),delete n.dataset[r])}))}),{rootMargin:"0px",threshold:[.5]})}))(1e3);function p(){var t,e;t=d.location,e={domain:t.hostname,id:t.pathname,title:l.title},t.search&&(e.search=t.search),t.hash&&(e.hash=t.hash),d.elbLayer.push("page view",e,"load"),l.querySelectorAll(y("load")).forEach((function(t){m(t,"load")})),l.querySelectorAll(y("wait")).forEach((function(t){setTimeout((function(){return m(t,"wait")}),4e3)})),function(t,e){if(void 0===e&&(e=!1),h){e&&h.disconnect();var n=y("visible");t.querySelectorAll(n).forEach((function(t){h.observe(t)}))}}(l,!0)}function v(t){m(t.target,"click")}function g(t){m(t.target,"submit")}function m(t,e){(function(t,e){var n=function(t,e){for(var n=t;n;){var o=i(r(a(n,f("action",!1))||a(n,f("action")))[e]||""),c=o[0],u=o[1];if(c||"click"!==e)return[c,u?r(u,","):void 0];n=n.parentElement}return[]}(t,e),o=n[0],c=n[1];if(!o)return[];var s=function(t,e){for(var n=[],r=t;r;){var i=u(r);!i||e&&!e[i.type]||n.push(i),r=r.parentElement}return n}(t,c);return s.map((function(t){return{entity:t.type,action:o,data:t.data,trigger:e,nested:t.nested}}))})(t,e).forEach((function(t){d.elbLayer.push("".concat(t.entity," ").concat(t.action),t.data,e,t.nested)}))}function y(t){return"[".concat(f("action",!1),"*=").concat(t,"],[").concat(f("action"),"*=").concat(t,"]")}var b=function(){return b=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},b.apply(this,arguments)},w={config:{},init:function(){return window.dataLayer=window.dataLayer||[],!0},push:function(t){window.dataLayer.push(b(b({},t),{walker:!0}))}},E=window,k={},L=[],A="".concat("walker"," ").concat("run"),j={walker:1.2,config:0},S=0,O=n(),x={},I={},q=!1,C=!1;function R(t){var i,o,u;S=0,O=n(),i=f("globals",!1),o="[".concat(i,"]"),u={},document.querySelectorAll(o).forEach((function(t){u=c(u,r(a(t,i)))})),x=u,C||(C=!0,function(t){var e="".concat("walker"," "),n=[],r=[];E.elbLayer.map((function(t){var i=t,o=i[0],a=i[1],c=i[2],u=i[3];(null==o?void 0:o.startsWith(e))?n.push([o,a,c,u]):r.push([o,a,c,u])})),n.concat(r).map((function(e){return t.push.apply(t,e)}))}(t)),"loading"!==l.readyState?e(p)():l.addEventListener("DOMContentLoaded",e(p)),l.addEventListener("click",e(v)),l.addEventListener("submit",e(g))}function W(t){var e={init:t.init,push:t.push,config:t.config||{init:!1}};L.push(e)}k.go=function(t){void 0===t&&(t={}),t.version&&(j.config=t.version),function(t){E.elbLayer=E.elbLayer||[],E.elbLayer.push=function(e,n,r,i){return t.push(e,n,r,i),Array.prototype.push.apply(this,[arguments])},E.elbLayer.find((function(t){return t==A}))&&R(t)}(this),t.projectId?function(t){var e=document.createElement("script");e.src="".concat("https://project-file.p.elbwalkerapis.com/").concat(t,".js"),document.head.appendChild(e)}(t.projectId):t.custom||(W(w),q=!0,R(this))},k.push=function(t,n,r,i){if(t){if(!q){if(t!=A)return;q=!0}var o=t.split(" "),a=o[0],u=o[1];if(a&&u)if("walker"!==a){++S;var f=Date.now(),s=Math.round(performance.now()/10)/100,l="".concat(f,"-").concat(O,"-").concat(S);L.map((function(o){e((function(){if(o.init&&!o.config.init){var e=o.init();if(o.config.init=e,!e)return}o.push({event:t,data:c({},n),globals:c({},x),user:c({},I),nested:i||[],id:l,trigger:r||"",entity:a,action:u,timestamp:f,timing:s,group:O,count:S,version:j})}))()}))}else!function(t,e,n){switch(void 0===e&&(e={}),t){case"destination":W(e);break;case"run":R(n);break;case"user":!function(t){t.id&&(I.id=t.id),t.device&&(I.device=t.device),t.hash&&(I.hash=t.hash)}(e)}}(u,n,this)}};var B,H,M,T=k,P=document.querySelector("script.elbwalker");P&&(B=P.getAttribute("data-project")||void 0,H=!!P.getAttribute("data-custom"),M=parseInt(P.getAttribute("data-version")||"1")),T.go({projectId:B,custom:H,version:M}),window.elbwalker=T}();
var m={type:"meta-pixel",config:{},init(t){let e=t.custom||{};return t.loadScript&&w(),e.pixelId?(y(),window.fbq("init",e.pixelId),e.pageview!==!1&&window.fbq("track","PageView"),!0):!1},push(t,e,n={}){let s=e.custom;if(!s)return;let r=n.custom||{};if(r.track){let a=b(t,r,s.currency);window.fbq("track",r.track,a)}else window.fbq("trackCustom",t.event)}};function y(){let t=window;if(t.fbq)return;let e=t.fbq=function(){e.callMethod?e.callMethod.apply(e,arguments):e.queue.push(arguments)};t._fbq||(t._fbq=e),e.push=e,e.loaded=!0,e.version="2.0",e.queue=[]}function b(t,e,n="EUR"){let s=1;if(e.value){let o=c(e.value);s=parseFloat(String(u(t,o.key,o.defaultValue)))}let r="";if(e.content_name){let o=c(e.content_name);r=String(u(t,o.key,o.defaultValue))}let a=e.content_type?e.content_type:"",i=x(t,e);switch(e.track){case"AddPaymentInfo":return{content_ids:i,currency:n,value:s};case"AddToCart":return{content_ids:i,content_name:r,content_type:a,currency:n,value:s};case"AddToWishlist":return{content_ids:i,content_name:r};case"CompleteRegistration":return{content_name:r,currency:n};case"InitiateCheckout":return{content_ids:i,currency:n,value:s};case"Lead":return{content_ids:i,content_name:r,currency:n};case"Purchase":return{content_ids:i,content_name:r,content_type:a,value:s||1,currency:n,contents:f(t,e)};case"Search":return{content_ids:i,content_type:a,currency:n,value:s,contents:f(t,e)};case"StartTrial":return{currency:n,value:s};case"Subscribe":return{currency:n,value:s};case"ViewContent":return{content_ids:i,content_name:r,content_type:a,currency:n,value:s,contents:f(t,e)};default:return{}}}function c(t){let e,n;return typeof t=="string"?e=t:(e=t.key,n=t.default),{key:e,defaultValue:n}}function x(t,e){let n=e.contents;if(!n)return;let s=[],r=c(n.id),a=u(t,r.key,r.defaultValue);if(a){if(Array.isArray(a)||(a=[a]),Array.isArray(a))for(let i=0;i<a.length;i++)s.push(String(a[i]));return s}}function f(t,e){let n=e.contents;if(!n)return;let s=[],r=c(n.id),a=c(n.quantity),i=u(t,r.key,r.defaultValue),o=u(t,a.key,a.defaultValue);if(!(!i||!o)){if(Array.isArray(i)||(i=[i]),Array.isArray(o)||(o=[o]),Array.isArray(i)&&Array.isArray(o))for(let l=0;l<i.length;l++)s.push({id:String(i[l]),quantity:parseFloat(String(o[l]))});return s}}function u(t,e,n,s=0){let r=e.split("."),a=t;for(let i=0;i<r.length;i++){let o=r[i];if(o==="*"&&Array.isArray(a)){let l=r.slice(i+1).join("."),d=[];for(let P of a){let k=u(P,l,n,s);d.push(k)}return d}if(a=a instanceof Object?a[o]:void 0,!a)break}return a||n}function w(t="https://connect.facebook.net/en_US/fbevents.js"){let e=document.createElement("script");e.src=t,e.async=!0,document.head.appendChild(e)}var p=m;export{p as default,m as destinationMetaPixel};

"use strict";var f=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var w=Object.prototype.hasOwnProperty;var p=(t,e)=>{for(var n in e)f(t,n,{get:e[n],enumerable:!0})},C=(t,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of x(e))!w.call(t,a)&&a!==n&&f(t,a,{get:()=>e[a],enumerable:!(s=b(e,a))||s.enumerable});return t};var g=t=>C(f({},"__esModule",{value:!0}),t);var D={};p(D,{default:()=>q,destinationMetaPixel:()=>k});module.exports=g(D);var k={type:"meta-pixel",config:{},init(t){let e=t.custom||{};return t.loadScript&&S(),e.pixelId?(h(),window.fbq("init",e.pixelId),e.pageview!==!1&&window.fbq("track","PageView"),!0):!1},push(t,e,n={}){let s=e.custom;if(!s)return;let a=n.custom||{};if(a.track){let i=A(t,a,s.currency);window.fbq("track",a.track,i)}else window.fbq("trackCustom",t.event)}};function h(){let t=window;if(t.fbq)return;let e=t.fbq=function(){e.callMethod?e.callMethod.apply(e,arguments):e.queue.push(arguments)};t._fbq||(t._fbq=e),e.push=e,e.loaded=!0,e.version="2.0",e.queue=[]}function A(t,e,n="EUR"){let s=1;if(e.value){let o=c(e.value);s=parseFloat(String(u(t,o.key,o.defaultValue)))}let a="";if(e.content_name){let o=c(e.content_name);a=String(u(t,o.key,o.defaultValue))}let i=e.content_type?e.content_type:"",r=M(t,e);switch(e.track){case"AddPaymentInfo":return{content_ids:r,currency:n,value:s};case"AddToCart":return{content_ids:r,content_name:a,content_type:i,currency:n,value:s};case"AddToWishlist":return{content_ids:r,content_name:a};case"CompleteRegistration":return{content_name:a,currency:n};case"InitiateCheckout":return{content_ids:r,currency:n,value:s};case"Lead":return{content_ids:r,content_name:a,currency:n};case"Purchase":return{content_ids:r,content_name:a,content_type:i,value:s||1,currency:n,contents:d(t,e)};case"Search":return{content_ids:r,content_type:i,currency:n,value:s,contents:d(t,e)};case"StartTrial":return{currency:n,value:s};case"Subscribe":return{currency:n,value:s};case"ViewContent":return{content_ids:r,content_name:a,content_type:i,currency:n,value:s,contents:d(t,e)};default:return{}}}function c(t){let e,n;return typeof t=="string"?e=t:(e=t.key,n=t.default),{key:e,defaultValue:n}}function M(t,e){let n=e.contents;if(!n)return;let s=[],a=c(n.id),i=u(t,a.key,a.defaultValue);if(i){if(Array.isArray(i)||(i=[i]),Array.isArray(i))for(let r=0;r<i.length;r++)s.push(String(i[r]));return s}}function d(t,e){let n=e.contents;if(!n)return;let s=[],a=c(n.id),i=c(n.quantity),r=u(t,a.key,a.defaultValue),o=u(t,i.key,i.defaultValue);if(!(!r||!o)){if(Array.isArray(r)||(r=[r]),Array.isArray(o)||(o=[o]),Array.isArray(r)&&Array.isArray(o))for(let l=0;l<r.length;l++)s.push({id:String(r[l]),quantity:parseFloat(String(o[l]))});return s}}function u(t,e,n,s=0){let a=e.split("."),i=t;for(let r=0;r<a.length;r++){let o=a[r];if(o==="*"&&Array.isArray(i)){let l=a.slice(r+1).join("."),P=[];for(let m of i){let y=u(m,l,n,s);P.push(y)}return P}if(i=i instanceof Object?i[o]:void 0,!i)break}return i||n}function S(t="https://connect.facebook.net/en_US/fbevents.js"){let e=document.createElement("script");e.src=t,e.async=!0,document.head.appendChild(e)}var q=k;0&&(module.exports={destinationMetaPixel});

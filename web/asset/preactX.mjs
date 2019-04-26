// https://cdn.jsdelivr.net/npm/preact@10.0.0-beta.0/dist/preact.module.js
var l,n,u,i,t,r={},e=[],f=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function o(l,n){for(var u in n)l[u]=n[u];return l}function c(l){var n=l.parentNode;n&&n.removeChild(l)}function s(l,n,u){var i,t,r,e,f=arguments;if(null==n&&(n={}),arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(f[i]);if(null!=u&&(n.children=u),null!=l&&null!=l.defaultProps)for(t in l.defaultProps)void 0===n[t]&&(n[t]=l.defaultProps[t]);return(r=n.ref)&&delete n.ref,(e=n.key)&&delete n.key,a(l,n,null,e,r)}function a(n,u,i,t,r){var e={type:n,props:u,text:i,key:t,ref:r,__k:null,__e:null,l:null,__c:null};return l.vnode&&l.vnode(e),e}function h(){return{}}function v(){}function y(l){if(null==l||"boolean"==typeof l)return null;if("string"==typeof l||"number"==typeof l)return a(null,null,l,null,null);if(Array.isArray(l))return s(v,null,l);if(null!=l.__e){var n=a(l.type,l.props,l.text,l.key,null);return n.__e=l.__e,n}return l}function p(l,n){this.props=l,this.context=n}function d(i){!i.__d&&(i.__d=!0)&&1===n.push(i)&&(l.debounceRendering||u)(m)}function m(){var l;for(n.sort(function(l,n){return n.__b-l.__b});l=n.pop();)l.__d&&l.forceUpdate(!1)}function w(l,n,u,i,t,f,o,s,a){var h,p,d,m,w,k,b,x,A,C,N=n.__k||g(n.props.children,n.__k=[],y,!0),T=null!=u&&u!=r&&u.__k||e,$=T.length;if(a==r)if(a=null,null!=f){for(p=0;p<f.length;p++)if(null!=f[p]){a=f[p];break}}else for(p=0;p<$;p++)if(T[p]&&T[p].__e){a=T[p].__e;break}for(p=0;p<N.length;p++){if(h=N[p]=y(N[p]),k=w=null,m=T[p],null!=h)if(null===m||null!=m&&(null==h.key&&null==m.key?h.type===m.type:h.key===m.key))w=p;else for(d=0;d<$;d++)if(null!=(m=T[d])&&(null==h.key&&null==m.key?h.type===m.type:h.key===m.key)){w=d;break}if(null!=w&&(k=T[w],T[w]=void 0),x=null!=a&&a.nextSibling,b=_(null==k?null:k.__e,l,h,k,i,t,f,o,s,null,a),null!=h&&null!=b){if(C=document.activeElement,null!=h.l)b=h.l;else if(f==k||b!=a||null==b.parentNode)l:if(null==a||a.parentNode!==l)l.appendChild(b);else{for(A=a,d=0;(A=A.nextSibling)&&d++<$/2;)if(A===b)break l;l.insertBefore(b,a)}C!==document.activeElement&&C.focus(),a=null!=b?b.nextSibling:x}}if(null!=f&&n.type!==v)for(p=f.length;p--;)null!=f[p]&&c(f[p]);for(p=$;p--;)null!=T[p]&&P(T[p],s)}function g(l,n,u,i){if(null==n&&(n=[]),null==l||"boolean"==typeof l)i&&n.push(null);else if(Array.isArray(l))for(var t=0;t<l.length;t++)g(l[t],n,u,i);else n.push(u?u(l):l);return n}function k(l,n,u,i){var t,r;for(t in n)"children"===t||"key"===t||u&&("value"===t||"checked"===t?l:u)[t]===n[t]||b(l,t,n[t],u[t],i);for(r in u)"children"===r||"key"===r||n&&r in n||b(l,r,null,u[r],i)}function b(l,n,u,t,r){var e,o,c,s,a,h;if("class"!==n&&"className"!==n||(n=r?"class":"className"),"style"===n)if(o=l.style,"string"==typeof u)o.cssText=u;else{if("string"==typeof t)o.cssText="";else for(c in t)null!=u&&c in u||o.setProperty(c.replace(i,"-"),"");for(s in u)e=u[s],null!=t&&e===t[s]||o.setProperty(s.replace(i,"-"),"number"==typeof e&&!1===f.test(s)?e+"px":e)}else{if("dangerouslySetInnerHTML"===n)return;"o"===n[0]&&"n"===n[1]?(a=n!==(n=n.replace(/Capture$/,"")),h=n.toLowerCase(),n=(h in l?h:n).substring(2),u?t||l.addEventListener(n,x,a):l.removeEventListener(n,x,a),(l.u||(l.u={}))[n]=u):"list"!==n&&"tagName"!==n&&!r&&n in l?l[n]=null==u?"":u:null==u||!1===u?n!==(n=n.replace(/^xlink:?/,""))?l.removeAttributeNS("http://www.w3.org/1999/xlink",n.toLowerCase()):l.removeAttribute(n):"function"!=typeof u&&(n!==(n=n.replace(/^xlink:?/,""))?l.setAttributeNS("http://www.w3.org/1999/xlink",n.toLowerCase(),u):l.setAttribute(n,u))}}function x(n){return this.u[n.type](l.event?l.event(n):n)}function _(n,u,i,t,e,f,c,s,a,h,d){var m,g,k,b,x,A,j,z,D,H,I,L,M,O;if(null==t||null==i||t.type!==i.type||t.key!==i.key){if(null!=t&&P(t,a),null==i)return null;n=null,t=r}l.diff&&l.diff(i),k=!1,j=i.type;try{l:if(t.type===v||j===v)w(u,i,t,e,f,c,s,m,d),n=null,i.__k.length&&null!=i.__k[0]&&(n=i.__k[0].__e,i.l=(g=i.__k[i.__k.length-1]).l||g.__e);else if("function"==typeof j){if(H=(D=j.contextType)&&e[D.__c],I=null!=D?H?H.props.value:D.__p:e,t.__c?(z=(m=i.__c=t.__c).__p,n=i.__e=t.__e):(j.prototype&&j.prototype.render?i.__c=m=new j(i.props,I):(i.__c=m=new p(i.props,I),m.constructor=j,m.render=T),m.__a=a,H&&H.sub(m),m.props=i.props,m.state||(m.state={}),m.context=I,m.__n=e,k=m.__d=!0,m.__h=[]),m.__v=i,L=m.__s||m.state,null!=j.getDerivedStateFromProps&&(x=o({},m.state),L===m.state&&(L=m.__s=o({},L)),o(L,j.getDerivedStateFromProps(i.props,L))),k)null==j.getDerivedStateFromProps&&null!=m.componentWillMount&&m.componentWillMount(),null!=m.componentDidMount&&s.push(m);else{if(null==j.getDerivedStateFromProps&&null==h&&null!=m.componentWillReceiveProps&&(m.componentWillReceiveProps(i.props,I),L=m.__s||m.state),!h&&null!=m.shouldComponentUpdate&&!1===m.shouldComponentUpdate(i.props,L,I)){n=i.__e,m.props=i.props,m.state=L,m.__d=!1,i.l=t.l;break l}null!=m.componentWillUpdate&&m.componentWillUpdate(i.props,L,I)}b=m.props,x||(x=m.state),m.context=I,m.props=i.props,m.state=L,l.render&&l.render(i),M=m.__t||null,O=m.__t=y(m.render(m.props,m.state,m.context)),m.__d=!1,null!=m.getChildContext&&(e=o(o({},e),m.getChildContext())),k||null==m.getSnapshotBeforeUpdate||(A=m.getSnapshotBeforeUpdate(b,x)),m.__b=a?(a.__b||0)+1:0,m.base=n=_(n,u,O,M,e,f,c,s,m,null,d),null!=O&&(i.l=O.l),m.__P=u,i.ref&&N(i.ref,m,a)}else n=C(n,i,t,e,f,c,s,a),i.ref&&t.ref!==i.ref&&N(i.ref,n,a);if(i.__e=n,null!=m){for(;g=m.__h.pop();)g.call(m);k||null==b||null==m.componentDidUpdate||m.componentDidUpdate(b,x,A)}z&&(m.__p=null),l.diffed&&l.diffed(i)}catch(l){$(l,a)}return n}function A(n,u){for(var i;i=n.pop();)try{i.componentDidMount()}catch(l){$(l,i.__a)}l.commit&&l.commit(u)}function C(l,n,u,i,t,f,o,c){var s,a,h,v,y,p,d,m,g=l;if(t="svg"===n.type||t,null==l&&null!=f)for(s=0;s<f.length;s++)if(null!=(a=f[s])&&(null===n.type?3===a.nodeType:a.localName===n.type)){l=a,f[s]=null;break}if(null==l&&(l=null===n.type?document.createTextNode(n.text):t?document.createElementNS("http://www.w3.org/2000/svg",n.type):document.createElement(n.type),f=null),n.__e=l,null===n.type)null!==g&&l!==g||n.text===u.text||(l.data=n.text);else if(null!=f&&null!=l.childNodes&&(f=e.slice.call(l.childNodes)),n!==u){if(v=n.props,null==(h=u.props)&&(h={},null!=f))for(p=0;p<l.attributes.length;p++)h["class"==(y=l.attributes[p].name)&&v.className?"className":y]=l.attributes[p].value;d=h.dangerouslySetInnerHTML,((m=v.dangerouslySetInnerHTML)||d)&&(m&&d&&m.__html==d.__html||(l.innerHTML=m&&m.__html||"")),v.multiple&&(l.multiple=v.multiple),w(l,n,u,i,"foreignObject"!==n.type&&t,f,o,c,r),k(l,v,h,t)}return l}function N(l,n,u){try{"function"==typeof l?l(n):l.current=n}catch(l){$(l,u)}}function P(n,u,i){var t,r,e;if(l.unmount&&l.unmount(n),(t=n.ref)&&N(t,null,u),i||null!=n.l||(i=null!=(r=n.__e)),n.__e=n.l=null,null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount()}catch(l){$(l,u)}t.base=t.__P=null,(t=t.__t)&&P(t,u,i)}else if(t=n.__k)for(e=0;e<t.length;e++)t[e]&&P(t[e],u,i);null!=r&&c(r)}function T(l,n,u){return this.constructor(l,u)}function $(l,n){for(;n;n=n.__a)if(!n.__p)try{if(null!=n.constructor.getDerivedStateFromError)n.setState(n.constructor.getDerivedStateFromError(l));else{if(null==n.componentDidCatch)continue;n.componentDidCatch(l)}return d(n.__p=n)}catch(n){l=n}throw l}function j(n,u){var i,t;l.root&&l.root(n,u),i=u.__t,n=s(v,null,[n]),t=[],w(u,u.__t=n,i,r,void 0!==u.ownerSVGElement,i?null:e.slice.call(u.childNodes),t,n,r),A(t,n)}function z(l,n){n.__t=null,j(l,n)}function D(l,n){return n=o(o({},l.props),n),arguments.length>2&&(n.children=e.slice.call(arguments,2)),a(l.type,n,null,n.key||l.key,n.ref||l.ref)}function H(l){var n,u="__cC"+t++,i={__c:u,__p:l};function r(l,n){return l.children(n)}return r.contextType=i,i.Consumer=r,(n={})[u]=null,i.Provider=function(l){var i,t;return this.getChildContext||(t=[],(i=this).getChildContext=function(){return n[u]=i,n},i.shouldComponentUpdate=function(l){t.map(function(n){n.__P&&(n.context=l.value,d(n))})},i.sub=function(l){t.push(l);var n=l.componentWillUnmount;l.componentWillUnmount=function(){t.splice(t.indexOf(l),1),n&&n()}}),l.children},i}l={},p.prototype.setState=function(l,n){var u=this.__s!==this.state&&this.__s||(this.__s=o({},this.state));("function"!=typeof l||(l=l(u,this.props)))&&o(u,l),null!=l&&this.__v&&(n&&this.__h.push(n),d(this))},p.prototype.forceUpdate=function(l){var n,u=this.__v,i=this.__v.__e,t=this.__P;t&&(null!=(i=_(i,t,u,u,this.__n,void 0!==t.ownerSVGElement,null,n=[],this.__a,!1!==l,i))&&i.parentNode!==t&&t.appendChild(i),A(n,u)),l&&l()},p.prototype.render=v,n=[],u="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,i=/-?(?=[A-Z])/g,t=0;export{j as render,z as hydrate,s as createElement,s as h,v as Fragment,h as createRef,p as Component,D as cloneElement,H as createContext,g as toChildArray,l as options};
//# sourceMappingURL=./preactX.mjs.map

import e from"path";import{tokenize as r,TokenType as t}from"@csstools/css-tokenizer";import{parseCommaSeparatedListOfComponentValues as s,replaceComponentValues as o,isTokenNode as i,isFunctionNode as a,isWhitespaceNode as n,isCommentNode as u,stringify as l}from"@csstools/css-parser-algorithms";const c=/^([a-z0-9.+-_]+:)?\/\//i;function rebase(r,t,s){if(r.startsWith("data:"))return!1;if(c.test(r))return!1;try{const e=new URL(r);if(e.port||e.protocol)return!1}catch{}if(r.startsWith("/"))return r;const o=e.posix.resolve(e.posix.join(t,r));return e.posix.relative(s,o)}function serializeString(e){let r="";for(const t of e){const e=t.codePointAt(0);if(void 0!==e)switch(e){case 0:r+=String.fromCodePoint(65533);break;case 127:r+=`\\${e.toString(16)}`;break;case 34:case 39:case 92:r+=`\\${t}`;break;default:if(1<=e&&e<=31){r+=`\\${e.toString(16)} `;break}r+=t}else r+=String.fromCodePoint(65533)}return r}const p=/url\(/i,f=/url/i,creator=()=>({postcssPlugin:"postcss-rebase-url",prepare(){const c=new WeakSet;return{Declaration(v,{result:m}){var d;if(c.has(v))return;const{from:g,to:b}=m.opts;if(!b||!g)return;if(null==(d=v.source)||!d.input.from)return;if(!p.test(v.value))return;e.parse(e.resolve(b.trim())).dir.split(e.sep).join(e.posix.sep);const S=e.parse(e.resolve(g.trim())).dir.split(e.sep).join(e.posix.sep),h=v.source.input.from.trim();if(!h)return;const k=e.parse(e.resolve(h)).dir.split(e.sep).join(e.posix.sep),x=s(r({css:v.value})),z=o(x,(e=>{if(i(e)&&e.value[0]===t.URL){const r=rebase(e.value[4].value,k,S);if(r)return e.value[4].value=r,e.value[1]=`url(${serializeString(r)})`,e}if(a(e)&&f.test(e.getName()))for(const r of e.value)if(!n(r)&&!u(r)&&i(r)&&r.value[0]===t.String){const t=rebase(r.value[4].value,k,S);if(t)return r.value[4].value=t,r.value[1]=`"${serializeString(t)}"`,e;break}})),$=l(z);$!==v.value&&(v.value=$,c.add(v))}}}});creator.postcss=!0;export{creator as default};
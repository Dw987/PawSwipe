import{w as a,q as i,p as t,M as c,L as l,S as d,t as p,O as u,i as h}from"./chunk-WWGJGFF6-DaTaPSdi.js";const f=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function m({children:s}){return t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx(c,{}),t.jsx(l,{}),t.jsx("script",{dangerouslySetInnerHTML:{__html:`
            (function(){
              var redirect = sessionStorage.redirect;
              delete sessionStorage.redirect;
              if (redirect && redirect != location.href) {
                history.replaceState(null, null, redirect);
              }
            })();
          `}})]}),t.jsxs("body",{children:[s,t.jsx(d,{}),t.jsx(p,{})]})]})}const j=a(function(){return t.jsx(u,{})}),g=i(function({error:e}){let o="Oops!",r="An unexpected error occurred.",n;return h(e)&&(o=e.status===404?"404":"Error",r=e.status===404?"The requested page could not be found.":e.statusText||r),t.jsxs("main",{className:"pt-16 p-4 container mx-auto",children:[t.jsx("h1",{children:o}),t.jsx("p",{children:r}),n]})});export{g as ErrorBoundary,m as Layout,j as default,f as links};

(this.webpackJsonpstudent=this.webpackJsonpstudent||[]).push([[0],{40:function(e,t,n){},41:function(e,t,n){},42:function(e,t,n){},44:function(e,t,n){"use strict";n.r(t);var r=n(1),s=n.n(r),c=n(24),a=n.n(c),i=n(8),u=n(28),o=n(0),d=Object(r.createContext)();function l(){return Object(r.useContext)(d)}function j(e){var t=e.children,n=Object(r.useState)(""),s=Object(i.a)(n,2),c=s[0],a=s[1];return Object(r.useEffect)((function(){if(""===c){var e=Object(u.a)("/student");a(e)}return function(){""!==c&&c.close()}}),[c]),Object(o.jsx)(d.Provider,{value:c,children:t})}var m=n(7);var b=n(29);var f=Object(r.createContext)();function O(){return Object(r.useContext)(f)}var g={game:{room:"",status:0,id:"",settings:"",props:""},user:{id:"",name:"",rol:"student",status:0},users:[]};function h(e){var t=e.children,n=function(e,t){var n="cg-student-fast-card-"+e,s=Object(r.useState)((function(){var e=localStorage.getItem(n);return e?JSON.parse(e):t})),c=Object(i.a)(s,2),a=c[0],u=c[1];return Object(r.useEffect)((function(){localStorage.setItem(n,JSON.stringify(a))}),[a,n]),[a,u]}("game-session",g),s=Object(i.a)(n,2),c=s[0],a=function(e){return function(t){e((function(e){return t.users=t.users?t.users:e.users,{game:Object(m.a)(Object(m.a)({},e.game),t.game),user:Object(m.a)(Object(m.a)({},e.user),t.user),users:Object(b.a)(t.users)}}))}}(s[1]),u=Object(r.useState)(!0),d=Object(i.a)(u,2),j=d[0],O=d[1],h=l();return Object(r.useEffect)((function(){""!==h&&(h.removeAllListeners("connect"),h.on("connect",(function(){var e=c.game.room,t=c.user.id;""===e?a({user:{status:1,rol:"student"}}):h.emit("verify-room",e,t,(function(e,t){e?(console.log(t),a(Object(m.a)({},t))):a({user:{status:1,rol:"student"}})}))})))}),[h,c.game.room,c.user.id,a]),Object(r.useEffect)((function(){""!==h&&(h.removeAllListeners("update-user-list"),h.on("update-user-list",(function(e){var t=e.filter((function(e){return e.id===c.user.id}));0!==t.length&&a({users:e,user:{rol:t[0].rol}})})),h.removeAllListeners("update-game-state"),h.on("update-game-state",(function(e){if(console.log(e),e.users){var t=e.users.filter((function(e){return e.id===c.user.id}));t[0]&&(e.user.rol=t[0].rol)}a(Object(m.a)({},e))})),j&&(O(!1),h.on("update-game",(function(e){a({game:e})})),h.on("update-user",(function(e){a({user:e})})),h.on("start-game",(function(e){a({game:Object(m.a)({},e),user:{status:3}})}))))}),[h,j,c.user.id,a]),Object(o.jsx)(f.Provider,{value:{gameState:c,updateGameState:a},children:t})}n(40);var v=function(e){var t=e.children,n=O().gameState;return Object(o.jsx)("div",{id:"container",className:n.user.rol,children:t})},x=n(22);function p(){var e=Object(r.useState)(""),t=Object(i.a)(e,2),n=t[0],s=t[1],c=Object(r.useState)({roomNumber:"",userName:""}),a=Object(i.a)(c,2),u=a[0],d=a[1],j=O().updateGameState,b=l();function f(e){var t=e.target;d((function(e){return Object(m.a)(Object(m.a)({},e),{},Object(x.a)({},t.name,t.value))})),s("")}return Object(o.jsxs)("div",{className:"one-input-form",children:[function(){var e=n?"warning-on":"warning-off";return Object(o.jsxs)("div",{className:"".concat(e," warning"),children:[" ",n," "]})}(),Object(o.jsxs)("form",{onSubmit:function(e){e.preventDefault(),b.emit("join-room",u,(function(e,t){e?j(Object(m.a)({},t)):(d((function(e){return Object(m.a)(Object(m.a)({},e),{},{roomNumber:""})})),s("Sala no encontrada"))}))},children:[Object(o.jsx)("input",{className:"it3",placeholder:"N\xfamero de sala",autoFocus:!0,type:"text",onChange:f,name:"roomNumber",value:u.roomNumber}),Object(o.jsx)("input",{className:"it3",placeholder:"Tu nombre",type:"text",onChange:f,name:"userName",value:u.userName}),Object(o.jsx)("button",{className:"b3",type:"submit",children:"Entrar"})]})]})}function N(){var e=O().gameState,t=e.users.map((function(t){return e.game.settings.showStudentsName?t.name:""}));return Object(o.jsxs)("div",{className:"one-input-form",children:[Object(o.jsx)("div",{className:"golden-board",children:"Espera un momento..."}),Object(o.jsx)("div",{className:"student-list",children:e.users.map((function(e,n){var r="teacher"===e.rol?"student-name teacher":"student-name";return Object(o.jsxs)("div",{className:r,children:[t[n],"teacher"===e.rol&&Object(o.jsx)("div",{className:"profe-tag",children:" Profe"})]},e.id)}))})]})}n(41);function S(){var e=O(),t=e.gameState,n=e.updateGameState,s=l(),c=Object(r.useState)(""),a=Object(i.a)(c,2),u=a[0],d=a[1],j=t.user,m=t.game,b=m.props,f=m.settings,g=m.status;function h(){console.log("manda otra vez"),s.emit("action-2")}function v(e){var t="student-name",n=b.clicked.filter((function(t){return t.id===e})),r=n[0]?n[0].selection===b.rightAnswer:null;if(1===g?t+=n[0]?" selected":"":f.showStudentChoises?t+=r?" right":" wrong":t+=" selected",f.showWhoIsFirst){var s=b.clicked.findIndex((function(e){return e.isRight}));if(s>=0)b.clicked[s].id===e&&(t+=" first")}return f.showStudentsName||(t+=" no-name"),t}return Object(r.useEffect)((function(){switch(g){case 1:d("");break;case 2:b.clicked.every((function(e){return e.selection===b.rightAnswer}))?d("\xa1Perfecto!"):d("Oh oh... alguien seleccion\xf3 incorrectamente");break;case 3:n({user:{status:4}});break;default:d("oh oh... algo ha salido mal")}}),[g,b.clicked,b.rightAnswer,n]),Object(o.jsxs)("div",{className:"cards-playground",children:[Object(o.jsxs)("div",{className:"points-bar",children:[Object(o.jsx)("div",{className:"points-level-bar",style:function(){var e=300*b.points/f.maxPoints;return{width:Math.ceil(e)+35}}(),children:Object(o.jsxs)("span",{children:["Puntos: ",b.points]})}),Object(o.jsxs)("div",{className:"points-box",children:[" ",b.points," / ",Object(o.jsxs)("span",{children:[" ",f.maxPoints," "]})," "]})]}),Object(o.jsx)("div",{className:"cards-box",children:function(){if("student"===j.rol)return b.cardsOnBoard.map((function(e,t){var n="card";b.clicked.some((function(e){return e.id===j.id&&e.selection===t}))?(n+=" card-selected",2===g&&(n+=t===b.rightAnswer?" right":" wrong")):n+=" card-no-selected";var r="../images/"+e.src;return Object(o.jsx)("div",{className:n,onClick:function(){return e=t,void(b.clicked.every((function(e){return e.id!==j.id}))&&s.emit("action-1",{userId:j.id,cardIndex:e}));var e},children:Object(o.jsx)("img",{alt:"carta numero "+t,src:r})},t)}));var e="/images/"+b.cardsOnBoard[b.rightAnswer].src;return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("div",{className:"card",children:Object(o.jsx)("img",{className:"cardPic",alt:"tarjeta maestra",src:e})}),2===g&&Object(o.jsx)("button",{onClick:h,className:"b3",children:"Otra vez"})]})}()}),u&&Object(o.jsx)("div",{className:"warning-box",children:u}),Object(o.jsx)("div",{className:"student-list",children:t.users.map((function(e){return"student"===e.rol&&Object(o.jsx)("div",{className:v(e.id),children:f.showStudentsName?e.name:""},e.id)}))})]})}function w(){var e=O().gameState,t=Object(r.useState)(""),n=Object(i.a)(t,2),s=n[0],c=n[1],a=l(),u=e.game.props;return Object(r.useEffect)((function(){var t="";switch(u.status){case 1:t="myTurn"===e.user.rol?"Te toca":"";break;case 2:t="myTurn"===e.user.rol?"Selecciona una nueva carta":"";break;case 3:t=u.clicked.some((function(e){return"wrong"===e.type}))?"Oh oh... equivocado":"\xa1Preparado para el siguiente!";break;default:t="oops... algo sali\xf3 mal"}c(t)}),[u.status,e.user.rol,u.clicked]),Object(o.jsxs)("div",{className:"cards-playground",children:[""!==s&&"myTurn"===e.user.rol&&Object(o.jsx)("div",{className:"warning-box",children:s}),3===u.status&&"myTurn"===e.user.rol&&Object(o.jsx)("button",{onClick:function(){a.emit("action-2")},className:"b3",children:"Siguiente"}),Object(o.jsx)("div",{className:"cards-box",children:u.fullDeck.map((function(t,n){var r="card";u.clicked.some((function(e){return e.index===n}))?r+=" card-selected":r+=" card-no-selected";var s=u.clicked.filter((function(e){return e.index===n}));s.some((function(e){return"wrong"===e.type}))&&(r+=" wrong");var c="../images/"+t.src;return Object(o.jsx)("div",{className:r,onClick:function(){return function(t){"myTurn"===e.user.rol&&3!==u.status&&a.emit("action-1",{index:t})}(n)},children:Object(o.jsx)("img",{alt:"carta numero "+n,src:c})},n)}))})]})}function k(){switch(O().gameState.game.id){case"fastCards":return Object(o.jsx)(S,{});case"memorySnake":return Object(o.jsx)(w,{});default:return Object(o.jsx)("div",{children:"Algo sali\xf3 mal"})}}n(42);function y(){var e=O().gameState.game,t=e.props,n=e.settings;return Object(o.jsxs)("div",{className:"game-over",children:[Object(o.jsxs)("div",{className:"points",children:[" ",t.points," / ",Object(o.jsxs)("span",{children:[" ",n.maxPoints," "]})," "]}),Object(o.jsx)("div",{className:"golden-board",children:"\xa1Muy bien!"})]})}function C(){switch(O().gameState.user.status){case 0:return Object(o.jsx)("div",{className:"golden-board",children:"Conectando ..."});case 1:return Object(o.jsx)(p,{});case 2:return Object(o.jsx)(N,{});case 3:return Object(o.jsx)(k,{});case 4:return Object(o.jsx)(y,{});default:return Object(o.jsx)("div",{children:"Oops..."})}}n(43);var P=function(){return Object(o.jsx)(j,{children:Object(o.jsx)(h,{children:Object(o.jsx)(v,{children:Object(o.jsx)(C,{})})})})},A=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,45)).then((function(t){var n=t.getCLS,r=t.getFID,s=t.getFCP,c=t.getLCP,a=t.getTTFB;n(e),r(e),s(e),c(e),a(e)}))};a.a.render(Object(o.jsx)(s.a.StrictMode,{children:Object(o.jsx)(P,{})}),document.getElementById("root")),A()}},[[44,1,2]]]);
//# sourceMappingURL=main.d80bddc6.chunk.js.map
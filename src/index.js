import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Posts from "./components/posts";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from "layouts/Auth.jsx";

/*
Switch : 이 컴포넌트에 추가된 첫 번째 Route만 보여주고 나머지는 보여주지 않음.(주의 : 먼저 비교할 Route를 맨 위에 둬야 함.)
         path 중 '/'를 switch 맨 위에 두지 말 것.
BrowserRouter : 브라우저와 웹 사이에 존재하는 라우터 임포팅하는 것으로 브라우저들이 동작하게 만듦
*/
ReactDOM.render(
  <BrowserRouter>
    <Switch> 
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Redirect from="/" to="/auth/search" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);


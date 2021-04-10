import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from "layouts/Auth.jsx";
import Tables from "views/examples/Tables";

ReactDOM.render(
  <BrowserRouter>
    <Switch> 
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Route path="/admin/tables/users" render={props => <Tables {...props} />} />
      <Redirect from="/" to="/auth/search" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);


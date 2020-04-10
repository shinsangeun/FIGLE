import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import {Container, Row, Col, Form, InputGroup, Input, InputGroupAddon, InputGroupText, Collapse, Button} from "reactstrap";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.jsx";
import AuthFooter from "components/Footers/AuthFooter.jsx";
import routes from "routes.js";
import axios from "axios";

class Auth extends React.Component {
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  constructor(props) {
    super(props);
    this.state ={
      nickname:'',  //닉네임
      accessId:'',  //아이디 시리얼 넘버
      level:0,      //레벨
    };
  }

  handleChange = (e) => {
    // 페이지 리로딩 방지
    e.preventDefault();
    this.setState({
      nickname: e.target.value
    });
    this.getUserId(e.target.value);
  };

  async getUserId(nickname){
    let req_message = 'https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=' + nickname;
    try{
      return await axios.get(req_message, {
        // 헤더 값 : 권한 시리얼 정보
        headers : { Authorization : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
      }).then(response => this.setState({
        nickname : response.data.nickname,
        accessId : response.data.accessId,
        level : response.data.level
      }))
    }
    catch (error)
    {
      console.error(error);
    }
  };

  render() {
    return (
      <>
        <div className="main-content">
          <AuthNavbar />
          <div className="header bg-gradient-info py-7 py-lg-8">
            <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center">
                  <Col lg="5" md="6">
                    <h1 className="text-white">Welcome!</h1>
                    <p className="text-lead text-light">
                      전적을 검색 할 FIFA Online 계정의 아이디를 입력 하세요.
                    </p>
                  </Col>
                </Row>
              </div>
            </Container>

              <form className="navbar-search navbar-search-dark">
                  <div className="mb-0 form-group">
                      <div className="input-group-alternative input-group">
                          <div className="input-group-prepend"><span className="input-group-text">
                              <i className="fas fa-search" ></i></span></div>
                          <input placeholder="Search" type="text" className="form-control"
                                 name="nickname"
                                 value={this.state.nickname}
                                 onChange={this.handleChange}
                          ></input>
                        <Button type="submit" href='/admin/tables/'>검색</Button>
                      </div>
                  </div>
              </form>
              {/*<li>닉네임: {this.state.nickname}</li>
              <li>레벨: {this.state.level}</li>
              <li>access ID: {this.state.accessId} </li>*/}

            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-default"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </div>
          {/* Page content */}
          <Container className="mt--8 pb-5">
            <Row className="justify-content-center">
              <Switch>{this.getRoutes(routes)}</Switch>
            </Row>
          </Container>
        </div>
        <AuthFooter />
      </>
    );
  }
}

export default Auth;

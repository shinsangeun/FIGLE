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
    //this.getUserId(this.state.nickname);
  }

  handleChange = (e) => {
    this.setState({
      nickname: e.target.value
    });
    console.log("e:", e.target.value);
   // this.getUserId(e.target.value);
  };

   async getUserId(nickname){
    console.log("nickname:", nickname);
    console.log("유저아이디")

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let req_message = 'https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=' + nickname;

    try{
      return await axios.get(proxyurl + req_message, {
        // 헤더 값 : 권한 시리얼 정보
        headers : { Authorization : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
      }).then(response => {
        console.log("code:", response.status);
        console.log("message: ", response);

        if(response.status === 200){
          this.setState({
            nickname : response.data.nickname,
            accessId : response.data.accessId,
            level : response.data.level
          })
        }else{
          alert("해당 닉네임의 유저가 없습니다.")
        }
      })
    }catch (error){
      console.log(error)
     // if(error.response.status === 404){
      //  alert("해당 닉네임의 유저가 없습니다.")
      //}
    }
  };

  render() {
    return (
      <>
        <div className="main-content">
          <AuthNavbar />
          <div className="header bg-gradient-default py-10 py-lg-8">
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

            <Container>
              <form className="navbar-search navbar-search-dark">
                <div className="mb-0 form-group">
                  <div className="input-group-alternative input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                            <i className="fas fa-search" />
                      </span>
                    </div>
                    <input placeholder="Search" type="text"
                           className="form-control"
                           name="nickname"
                           value={this.state.nickname}
                           onChange={this.handleChange}
                    >
                    </input>
                    <Button onClick={this.getUserId(this.state.nickname)} type="submit" href={`/admin/tables/users?accessId=${this.state.accessId}`}>검색</Button>
                  </div>
                </div>
              </form>
            </Container>
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
          <Container className="mt--100 pb-9">
            <Row className="justify-content-row">
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

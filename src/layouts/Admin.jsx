import React from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar.jsx";
import AdminFooter from "../components/Footers/AdminFooter.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";

import routes from "../routes.js";

class Admin extends React.Component {

  // Props 또는 State가 변경이 되면 갱신 발생
  componentDidUpdate(e) 
  { 
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  //getRoutes 함수 선언
  getRoutes = routes => { // routes라는 파라미터 변수 선언
    return routes.map((prop, key) => { // map 함수를 통하여 routes로 값이 들어올 때마다 반복하여 반환
      if (prop.layout === "/admin") { // 주소창의 경로가 /admin일 경우
        return (
          // 라우팅, 아래와 같은 형식으로 경로 및 컴포넌트 반환
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

  //getBrandText 함수 선언
  getBrandText = path => {
    // routes.js 파일에서 반환된 값의 길이 만큼 반복
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  // 페이지 렌더링
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("../assets/img/brand/logo.png"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;

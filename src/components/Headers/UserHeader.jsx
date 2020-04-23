import React from "react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import AdminNavbar from "../Navbars/AuthNavbar";

class UserHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            nickname:'',    //닉네임
            accessId:'',    //아이디 시리얼 넘버
            level:0,        //레벨
        };
    }

    async componentDidMount() {
        const search = this;
        console.log("search:", search);

        const params = new URLSearchParams(search);
        const accessId = params.get("accessId");

        await this.setState({accessId: accessId});
    }

    render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "100px",
            backgroundImage: "",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="15" md="12">
                <h1 className="display-2 text-white">안녕하세요, {this.state.nickname} 님</h1>
                <p className="text-white mt-0 mb-5">
                  검색한 유저의 정보 조회 페이지 입니다.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default UserHeader;

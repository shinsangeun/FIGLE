import React from "react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import axios from "axios";

class UserHeader extends React.Component {
    constructor()
    {
        super();

        this.state ={
            //닉네임
            nickname:'',
            //아이디 시리얼 넘버
            accessId:'',
            //레벨
            level:0,
        }

        // 이벤트 호출이 텍스트에 입력하고 검색 버튼을 눌렀을 때 나오도록 바꾸어야 함
        this.getUserId('아무거나다잘함')
    }

    getUserId = user_name => {

        var req_message = 'https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=' + user_name
        try{

            return axios.get(req_message, {
                // 헤더 값 : 권한 시리얼 정보
                headers : { Authorization : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}

            }).then(response => this.setState({nickname : response.data.nickname, accessId : response.data.accessId, level : response.data.level}))
        }
        catch (error)
        {
            console.error(error);
        }
    };

  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "600px",
            backgroundImage:
              "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
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

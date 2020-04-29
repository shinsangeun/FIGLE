import React from "react";
import axios from "axios";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col, Table
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.jsx";

class Profile extends React.Component {
  constructor(props) {
    super(props);
      this.state ={
          nickname:'',    //닉네임
          accessId:'',    //아이디 시리얼 넘버
          level:0,        //레벨
          matchResult: '',
          isLoading: true
      };
  }

  componentDidMount = async () => {
      await this.getMatchIdDatail();
  };

  getMatchIdDatail(){
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const MatchId = params.get("matchId");
    let matchResultArray = [];

    let getMatchIdDetail = 'https://api.nexon.co.kr/fifaonline4/v1.0/matches/' + MatchId;
    try{
      axios.get(getMatchIdDetail, {
        // 헤더 값 : 권한 시리얼 정보
        headers: {Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
      }).then(response => {
        matchResultArray.push(response.data);
        console.log("matchResult:" , matchResultArray[0].matchInfo[0].matchDetail.possession)
        this.setState({
          matchResult: matchResultArray,
          isLoading: false
        })
      })
    }catch(error){
      console.error(error);
    }
  }

  render() {
    const {matchResult, isLoading} = this.state;

    if(!isLoading){
        console.log("res:", matchResult[0].matchInfo[0].nickname);
        console.log(this.state.matchResult[0].matchInfo[0].nickname);
        console.log("test:", this.state.matchResult[0].matchInfo[0].matchDetail.possession)
    }

    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={require("assets/img/theme/profile.png")}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                  {isLoading ? (
                      <div className="loader">
                          <span className="loader__text">Loading...</span>
                      </div>
                  ) : (
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                        <div>
                          <span className="heading">{this.state.matchResult[0].matchInfo[0].matchDetail.possession}</span>
                          <span className="description">점유율</span>
                        </div>
                        <div>
                          <span className="heading">{this.state.matchResult[0].matchInfo[0].matchDetail.foul}</span>
                          <span className="description">파울</span>
                        </div>
                        <div>
                          <span className="heading">{this.state.matchResult[0].matchInfo[0].matchDetail.cornerKick}</span>
                          <span className="description">코너킥</span>
                        </div>
                          <div>
                              <span className="heading">{this.state.matchResult[0].matchInfo[0].matchDetail.yellowCards}</span>
                              <span className="description">카드</span>
                          </div>
                          <div>
                              <span className="heading">89</span>
                              <span className="description">패스 <br/> 성공률</span>
                          </div>
                          <div>
                              <span className="heading">89</span>
                              <span className="description">슛 <br/> 성공률</span>
                          </div>
                          <div>
                              <span className="heading">89</span>
                              <span className="description">수비 <br/> 성공률</span>
                          </div>
                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3>{this.state.matchResult[0].matchInfo[0].nickname}</h3>
                  </div>
                </CardBody>
                  )}
              </Card>
            </Col>
              <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
                  <Card className="card-profile shadow">
                      <Row className="justify-content-center">
                          <Col className="order-lg-2" lg="3">
                              <div className="card-profile-image">
                                  <a href="#pablo" onClick={e => e.preventDefault()}>
                                      <img
                                          alt="..."
                                          className="rounded-circle"
                                          src={require("assets/img/theme/profile.png")}
                                      />
                                  </a>
                              </div>
                          </Col>
                      </Row>
                      {isLoading ? (
                          <div className="loader">
                              <span className="loader__text">Loading...</span>
                          </div>
                      ) : (
                      <CardBody className="pt-0 pt-md-4">
                          <Row>
                              <div className="col">
                                  <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                      <div>
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].matchDetail.possession}</span>
                                          <span className="description">점유율</span>
                                      </div>
                                      <div>
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].matchDetail.foul}</span>
                                          <span className="description">파울</span>
                                      </div>
                                      <div>
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].matchDetail.cornerKick}</span>
                                          <span className="description">코너킥</span>
                                      </div>
                                      <div>
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].matchDetail.yellowCards}</span>
                                          <span className="description">카드</span>
                                      </div>
                                      <div>
                                          <span className="heading">89</span>
                                          <span className="description">패스 <br/> 성공률</span>
                                      </div>
                                      <div>
                                          <span className="heading">89</span>
                                          <span className="description">슛 <br/> 성공률</span>
                                      </div>
                                      <div>
                                          <span className="heading">89</span>
                                          <span className="description">수비 <br/> 성공률</span>
                                      </div>
                                  </div>
                              </div>
                          </Row>
                          <div className="text-center">
                              <h3>{this.state.matchResult[0].matchInfo[1].nickname}</h3>
                          </div>
                      </CardBody>
                      )}
                  </Card>
              </Col>
          </Row>
            <br/>

        </Container>
          <Container>
              <Col className="order-xl-1" xl="12">
                  <Card className="bg-secondary shadow">
                      <CardHeader className="bg-white border-0">
                          <Row className="align-items-center">
                              <Col xs="8">
                                  <h3 className="mb-0">My account</h3>
                              </Col>
                              <Col className="text-right" xs="4">
                                  <Button
                                      color="primary"
                                      href="#pablo"
                                      onClick={e => e.preventDefault()}
                                      size="sm"
                                  >
                                      Settings
                                  </Button>
                              </Col>
                          </Row>
                      </CardHeader>
                      <CardBody>
                          <Form>
                              <h6 className="heading-small text-muted mb-4">
                                  User information
                              </h6>
                              <div className="pl-lg-4">
                                  <Row>
                                      <Col lg="6">
                                          <FormGroup>
                                              <label
                                                  className="form-control-label"
                                                  htmlFor="input-username"
                                              >
                                                  Username
                                              </label>
                                              <Input
                                                  className="form-control-alternative"
                                                  defaultValue={this.state.nickname}
                                                  id="input-username"
                                                  placeholder="Username"
                                                  type="text"
                                              />
                                          </FormGroup>
                                      </Col>
                                      <Col lg="6">
                                          <FormGroup>
                                              <label
                                                  className="form-control-label"
                                                  htmlFor="input-email"
                                              >
                                                  Email address
                                              </label>
                                              <Input
                                                  className="form-control-alternative"
                                                  id="input-email"
                                                  placeholder="email@email.com"
                                                  type="email"
                                              />
                                          </FormGroup>
                                      </Col>
                                  </Row>
                              </div>
                              <div className="pl-lg-4">
                              </div>
                              <hr className="my-4" />
                              Description
                              <h6 className="heading-small text-muted mb-4">About me</h6>
                              <div className="pl-lg-4">
                                  <FormGroup>
                                      <label>About Me</label>
                                      <Input
                                          className="form-control-alternative"
                                          placeholder=""
                                          rows="4"
                                          defaultValue=""
                                          type="textarea"
                                      />
                                  </FormGroup>
                              </div>
                          </Form>
                      </CardBody>
                  </Card>
              </Col>
          </Container>
      </>
    );
  }
}

export default Profile;

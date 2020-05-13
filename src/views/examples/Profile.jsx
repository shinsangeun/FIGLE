import React from "react";
import axios from "axios";
import Player from './Player';

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
          matchResult: '',
          isLoading: true,
          playerList: '',
          id:'',
          name:''
      };
  }

  componentDidMount = async () => {
      await this.getMatchIdDatail();
      await this.getPlayerList();
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
        console.log("matchResult:" , matchResultArray[0].matchInfo[0].matchDetail.possession);
        this.setState({
          matchResult: matchResultArray,
          isLoading: false
        })
      })
    }catch(error){
      console.error(error);
    }
  }

  getPlayerList = async () => {
      const url = '/fifaonline4/latest/spid.json';
      const options = {
          method: 'GET',
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Accept": "*/*",
              "Host": "static.api.nexon.co.kr",
              "Connection":"keep-alive"
          }
      };
      let response = await fetch(url, options);
      let responseOK = response && response.ok;
      if(responseOK){
          let data = await response.json();
          this.setState({
              playerList: data
          });
      }
  };

  render() {
    const {matchResult, isLoading} = this.state;

    if(!isLoading){
        console.log("res:", matchResult[0].matchInfo[0].nickname);
        console.log(this.state.matchResult[0].matchInfo[0].nickname);
        console.log("test:", this.state.matchResult[0].matchInfo[0].player[0].spId, this.state.playerList);

        if(this.state.playerList.indexOf(this.state.matchResult[0].matchInfo[0].player[0].spId) != -1){
            console.log("spId match::", this.state.matchResult[0].matchInfo[0].player[0].spId);
        }else{
            console.log("No match data.");
        }
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
                              <span className="heading">{this.state.matchResult[0].matchInfo[0].pass.passSuccess} / {this.state.matchResult[0].matchInfo[0].pass.passTry}</span>
                              <span className="description">패스 <br/> 성공률</span>
                          </div>
                          <div>
                              <span className="heading">{this.state.matchResult[0].matchInfo[0].shoot.effectiveShootTotal} / {this.state.matchResult[0].matchInfo[0].shoot.shootTotal}</span>
                              <span className="description">슛 <br/> 성공률</span>
                          </div>
                          <div>
                              <span className="heading">{this.state.matchResult[0].matchInfo[0].defence.blockSuccess} / {this.state.matchResult[0].matchInfo[0].defence.blockTry}</span>
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
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].pass.passSuccess} / {this.state.matchResult[0].matchInfo[1].pass.passTry}</span>
                                          <span className="description">패스 <br/> 성공률</span>
                                      </div>
                                      <div>
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].shoot.effectiveShootTotal} / {this.state.matchResult[0].matchInfo[1].shoot.shootTotal}</span>
                                          <span className="description">슛 <br/> 성공률</span>
                                      </div>
                                      <div>
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].defence.blockSuccess} / {this.state.matchResult[0].matchInfo[1].defence.blockTry}</span>
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
                          <Col xs="4">
                              <h3 className="mb-0">선수 명단</h3>
                          </Col>
                      </Row>
                  </CardHeader>
                  <CardBody>
                      <Form>
                          <h6 className="heading-small text-muted mb-4">
                              선수 명단
                          </h6>
                          <div className="pl-lg-4">
                              <Row>
                                  <Col lg="6">
                                      {isLoading ? (
                                          <div className="loader">
                                              <span className="loader__text">Loading...</span>
                                          </div>
                                      ) : (
                                         /* {matchResult.map((index, matchId) => (*/
                                      <FormGroup>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[0].spId}
                                          </tr>
                                          <tr>
                                            {this.state.matchResult[0].matchInfo[0].player[1].spId}
                                          </tr>
                                          <tr>
                                            {this.state.matchResult[0].matchInfo[0].player[2].spId}
                                          </tr>
                                          <tr>
                                             {this.state.matchResult[0].matchInfo[0].player[3].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[3].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[4].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[5].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[6].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[7].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[8].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[9].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[10].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[11].spId}
                                          </tr>
                                          <tr>
                                              {this.state.matchResult[0].matchInfo[0].player[12].spId}
                                          </tr>
                                      </FormGroup>
                                           /*   ))}*/
                                      )}
                                  </Col>
                              </Row>
                          </div>
                          <div className="pl-lg-4">
                              <Row>
                                  <Col lg="6">
                                      {isLoading ? (
                                          <div className="loader">
                                              <span className="loader__text">Loading...</span>
                                          </div>
                                      ) : (
                                          /* {matchResult.map((index, matchId) => (*/
                                          <FormGroup>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[0].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[1].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[2].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[3].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[3].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[4].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[5].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[6].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[7].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[8].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[9].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[10].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[11].spId}
                                              </tr>
                                              <tr>
                                                  {this.state.matchResult[0].matchInfo[1].player[12].spId}
                                              </tr>
                                          </FormGroup>
                                          /*   ))}*/
                                      )}
                                  </Col>
                              </Row>
                          </div>
                          <div className="pl-lg-4">
                          </div>
                          <hr className="my-4" />
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

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
import PlayerList from "components/Data/PlayerList.jsx";
import SeasonList from "../../components/Data/SeasonList";

class Profile extends React.Component {
  constructor(props) {
    super(props);
      this.state ={
          nickname:'',                      //닉네임
          accessId:'',                      //아이디 시리얼 넘버
          matchResult: '',
          isLoading: true,
          playerList: '',
          id:'',
          leftPlayerListName:'',             // 왼쪽 팀 선수 리스트
          rightPlayerListName:'',            // 오른쪽 팀 선수 리스트
          leftPlayerImage:'',                // 왼쪽 팀 선수 이미지 url 리스트
          rightPlayerImage:''                // 오른쪽 팀 선수 이미지 url 리스트
      };
  }

  componentDidMount = async () => {
      await this.getMatchIdDatail();
      await this.getPlayerList();
  };

  getMatchIdDatail = () => {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const MatchId = params.get("matchId");
    let matchResultArray = [];

    console.log("MatchId:", MatchId);

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let getMatchIdDetail = 'https://api.nexon.co.kr/fifaonline4/v1.0/matches/' + MatchId;
    try{
        axios.get(proxyurl + getMatchIdDetail, {
        // 헤더 값 : 권한 시리얼 정보
        headers: {Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
      }).then(response => {
        matchResultArray.push(response.data);
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
  }

  render() {
    const {isLoading} = this.state;

    if(!isLoading){
        /*<PlayerList />*/
        let playerId = this.state.playerList.map(player => player.id);
        let leftPlayerIdList = [];
        let rightPlayerIdList = [];

        //  왼쪽 팀 선수 리스트
        for(let i = 0; i < this.state.matchResult[0].matchInfo[0].player.length; i++){
            if(playerId.indexOf(this.state.matchResult[0].matchInfo[0].player[i].spId) !== -1){
                console.log("spId match:", this.state.matchResult[0].matchInfo[0].player[i].spId);
            }else{
                console.log("No match data.");
            }
            leftPlayerIdList.push(this.state.matchResult[0].matchInfo[0].player[i].spId);
            console.log("leftPlayerIdList: ", leftPlayerIdList);

            let leftResult = this.state.playerList.filter((element) => {
                for(let i = 0; i < leftPlayerIdList.length; i++){
                    if(element.id === leftPlayerIdList[i]){
                        return element.name;
                    }
                }
            })

            this.state.leftPlayerListName = leftResult;

            let leftPlayerImageUrlList = [];

            // 왼쪽 팀 선수 이미지 조회 url
            for(let i = 0; i < leftResult.length; i++){
                let url = 'https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p' + leftResult[i].id.toString().substring(3,10) + '.png';
                leftPlayerImageUrlList.push(url);
            }
            this.state.leftPlayerImage = leftPlayerImageUrlList;
        }

        this.state.leftListNameImage = this.state.leftPlayerListName + this.state.leftPlayerImage;
        console.log("leftListNameImage:", this.state.leftListNameImage);

        //  오른쪽 팀 선수 리스트
        for(let i = 0; i < this.state.matchResult[0].matchInfo[1].player.length; i++) {
            if(playerId.indexOf(this.state.matchResult[0].matchInfo[1].player[i].spId) !== -1){
                console.log("spId match:", this.state.matchResult[0].matchInfo[1].player[i].spId);
            }else{
                console.log("No match data.");
            }
            rightPlayerIdList.push(this.state.matchResult[0].matchInfo[1].player[i].spId);
            console.log("rightPlayerIdList: ", rightPlayerIdList);

            let rightResult = this.state.playerList.filter((element) => {
                for (let i = 0; i < rightPlayerIdList.length; i++) {
                    if (element.id === rightPlayerIdList[i]) {
                        return element.name;
                    }
                }
            })

            console.log("this.state.seasonResult-->", this.state.seasonResult);

            this.state.rightPlayerListName = rightResult;

            let rightPlayerImageUrlList = [];

            // 오른쪽 팀 선수 이미지 조회 url
            for (let i = 0; i < rightResult.length; i++) {
                let url = 'https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p' + rightResult[i].id.toString().substring(3, 10) + '.png';
                rightPlayerImageUrlList.push(url);
            }
            this.state.rightPlayerImage = rightPlayerImageUrlList;
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
                          <span className="heading">{this.state.matchResult[0].matchInfo[0].matchDetail.possession}%</span>
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
                                          <span className="heading">{this.state.matchResult[0].matchInfo[1].matchDetail.possession}%</span>
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

          <SeasonList/>

        <Container>
          <div class="row">
              <Col className="order-xl-1" xl="6">
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
                              <div className="pl-lg-4">
                                  <Row>
                                      <Col lg="6">
                                          {isLoading ? (
                                              <div className="loader">
                                                  <span className="loader__text">Loading...</span>
                                              </div>
                                          ) : (
                                              // 왼쪽 팀 선수 이름과 이미지 출력
                                          <FormGroup>
                                              {this.state.leftPlayerListName.map((player, index) => {
                                                  return (<div key={index}> {this.state.leftPlayerListName[index].name} </div>)
                                              })}

                                              {this.state.leftPlayerImage.map((image, index) => {
                                                  return (
                                                      <div key={index}>
                                                          <img alt="..." className="rounded-circle" src={this.state.leftPlayerImage[index]}/>
                                                      </div>)
                                              })}
                                          </FormGroup>
                                          )}
                                      </Col>
                                  </Row>
                              </div>
                          </Form>
                      </CardBody>
                  </Card>
              </Col>
              <Col className="order-xl-1" xl="6">
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
                              <div className="pl-lg-4">
                                  <Row>
                                      <Col lg="6">
                                          {isLoading ? (
                                              <div className="loader">
                                                  <span className="loader__text">Loading...</span>
                                              </div>
                                          ) : (
                                              // 오른쪽 팀 선수 이름과 이미지 출력
                                              <FormGroup>
                                                  {this.state.rightPlayerListName.map((player, index) => {
                                                      return (<div key={index}> {this.state.rightPlayerListName[index].name} </div>)
                                                  })}

                                                  {this.state.rightPlayerImage.map((image, index) => {
                                                      return (
                                                          <div key={index}>
                                                              <img alt="..." className="rounded-circle" src={this.state.rightPlayerImage[index]}/>
                                                          </div>)
                                                  })}
                                              </FormGroup>
                                          )}
                                      </Col>
                                  </Row>
                              </div>
                          </Form>
                      </CardBody>
                  </Card>
              </Col>
          </div>
      </Container>
      </>
    );
  }
}

export default Profile;

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
          matchResult: '',
          isLoading: true,
          playerList: '',
          id:'',
          leftPlayerListName:'',     // 왼쪽 팀 선수 리스트
          rightPlayerListName:'',     // 오른쪽 팀 선수 리스트
          playerImage:''               // 선수 이미지
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

    console.log("MatchId:", MatchId);

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let getMatchIdDetail = 'https://api.nexon.co.kr/fifaonline4/v1.0/matches/' + MatchId;
    try{
      axios.get(proxyurl + getMatchIdDetail, {
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
        console.log("res:", matchResult[0].matchInfo[0].nickname, this.state.matchResult[0].matchInfo[0].nickname);
        console.log("player list:", this.state.matchResult[0].matchInfo[0].player[0].spId);
        // console.log("전체 player list:",  this.state.playerList);

        let playerId = this.state.playerList.map(player => player.id);
        let leftPlayerIdList = [];
        let rightPlayerIdList = [];

        //  왼쪽 팀 선수 리스트
        for(let i = 0; i < this.state.matchResult[0].matchInfo[0].player.length; i++){
            if(playerId.indexOf(this.state.matchResult[0].matchInfo[0].player[i].spId) !== -1){
                console.log("spId match::", this.state.matchResult[0].matchInfo[0].player[i].spId);
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
            console.log("leftResult-->", leftResult);
            this.state.leftPlayerListName = leftResult;
        }

        //  오른쪽 팀 선수 리스트
        for(let i = 0; i < this.state.matchResult[0].matchInfo[1].player.length; i++){
            if(playerId.indexOf(this.state.matchResult[0].matchInfo[1].player[i].spId) !== -1){
                console.log("spId match::", this.state.matchResult[0].matchInfo[1].player[i].spId);
            }else{
                console.log("No match data.");
            }
            rightPlayerIdList.push(this.state.matchResult[0].matchInfo[1].player[i].spId);
            console.log("rightPlayerIdList: ", rightPlayerIdList);

            let rightResult = this.state.playerList.filter((element) => {
                for(let i = 0; i < rightPlayerIdList.length; i++){
                    if(element.id === rightPlayerIdList[i]){
                        return element.name;
                    }
                }
            })
            console.log("rightResult-->", rightResult);
            this.state.rightPlayerListName = rightResult;

            // 선수 이미지 조회
            for(let i = 0; i < rightResult.length; i++){
                const proxyurl = "https://cors-anywhere.herokuapp.com/";
                let url = 'https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p' + rightPlayerIdList[i] + '.png';
                console.log("아이디:", rightPlayerIdList[i])
                try{
                    axios.get(proxyurl + url, {
                        headers: {
                            "X-Requested-With": "XMLHttpRequest"
                        }
                    }).then(response => {
                        console.log("axios 실행1", response);
                        let images = [];
                        images.push(response);

                        this.setState({
                            playerImage: images
                        })
                    })
                }catch(error){
                    console.log("에러:", error);
                }
            }
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
                                          //TODO map 루프 함수로 수정 필요
                                          /*{result.map((index, matchId) => (*/
                                      <FormGroup>
                                          {this.state.playerImage[0]} <br/>
                                          {this.state.leftPlayerListName[0].name} <br/>
                                          {this.state.playerImage[1]} <br/>
                                          {this.state.leftPlayerListName[1].name} <br/>
                                          {this.state.leftPlayerListName[2].name} <br/>
                                          {this.state.leftPlayerListName[3].name} <br/>
                                          {this.state.leftPlayerListName[4].name} <br/>
                                          {this.state.leftPlayerListName[5].name} <br/>
                                          {this.state.leftPlayerListName[6].name} <br/>
                                          {this.state.leftPlayerListName[7].name} <br/>
                                          {this.state.leftPlayerListName[8].name} <br/>
                                          {this.state.leftPlayerListName[9].name} <br/>
                                          {this.state.leftPlayerListName[10].name} <br/>
                                          {this.state.leftPlayerListName[11].name} <br/>
                                          {this.state.leftPlayerListName[12].name} <br/>
                                          {this.state.leftPlayerListName[13].name} <br/>
                                          {this.state.leftPlayerListName[14].name} <br/>
                                          {this.state.leftPlayerListName[15].name} <br/>
                                          {this.state.leftPlayerListName[16].name} <br/>
                                          {this.state.leftPlayerListName[17].name} <br/>
                                      </FormGroup>
                                              /*))}*/
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
                                          //TODO map 루프 함수로 수정 필요
                                           /*{rightPlayerListName.map((index, matchId) => (*/
                                          <FormGroup>
                                             {/* {this.state.matchResult[0].matchInfo[1].player[index].spId}*/}
                                              {this.state.rightPlayerListName[0].name} <br/>
                                              {this.state.rightPlayerListName[1].name} <br/>
                                              {this.state.rightPlayerListName[2].name} <br/>
                                              {this.state.rightPlayerListName[3].name} <br/>
                                              {this.state.rightPlayerListName[4].name} <br/>
                                              {this.state.rightPlayerListName[5].name} <br/>
                                              {this.state.rightPlayerListName[6].name} <br/>
                                              {this.state.rightPlayerListName[7].name} <br/>
                                              {this.state.rightPlayerListName[8].name} <br/>
                                              {this.state.rightPlayerListName[9].name} <br/>
                                              {this.state.rightPlayerListName[10].name} <br/>
                                              {this.state.rightPlayerListName[11].name} <br/>
                                              {this.state.rightPlayerListName[12].name} <br/>
                                              {this.state.rightPlayerListName[13].name} <br/>
                                              {this.state.rightPlayerListName[14].name} <br/>
                                              {this.state.rightPlayerListName[15].name} <br/>
                                              {this.state.rightPlayerListName[16].name} <br/>
                                              {this.state.rightPlayerListName[17].name} <br/>
                                          </FormGroup>
                                             /*))}*/
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

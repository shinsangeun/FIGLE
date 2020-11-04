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
import {Bar, Line} from "react-chartjs-2";
import Chart from "chart.js";
// core components
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2
} from "variables/charts.jsx";

class Profile extends React.Component {
  constructor(props) {
    super(props);
      this.state ={
          nickname:'',                      //닉네임
          accessId:'',                      //아이디 시리얼 넘버
          matchResult: '',
          isLoading: true,
          playerList: '',
          positionList: '',
          id: '',
          leftPlayerInfo: '',            // 왼쪽 팀 선수 정보
          rightPlayerInfo: '',            // 오른쪽 팀 선수 정보
          chartExample1Data: "data1",
          seasonResult:''
      };
  }

  componentDidMount = async () => {
      await this.getMatchIdDetail();
      await this.getPlayerList();
      await this.getPositionList();
      await this.getSppositionList();
  };

  getMatchIdDetail = () => {
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

    getPositionList = async () => {
        const url = '/fifaonline4/latest/spposition.json';
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
                positionList: data
            });
        }
    }

    // TODO 선수 포지션(spposition) 메타데이터 조회
    getSppositionList = async () => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const getSeasonIdDetail = 'https://static.api.nexon.co.kr/fifaonline4/latest/seasonid.json';

        axios.get(proxyurl + getSeasonIdDetail).then(response => {
            let data = response.data;
            console.log("getSppositionList:", data);
            this.setState({
                seasonResult: data
            });
        })
    }

    // 유저 닉네임으로 유저 레벨 조회
    getMatchLevel1 = async (nickname) => {
        const getUserLevel = '/fifaonline4/v1.0/users?nickname=' + nickname;
        console.log("getMatchLevel1:", nickname);

        const options = {
            method: 'GET',
            headers: {
                "Authorization": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo',
                "Access-Control-Allow-Origin": "*",
                "Accept": "*/*",
                "Host": "api.nexon.co.kr",
                "Connection":"keep-alive"
            }
        };
        let response = await fetch(getUserLevel, options);
        let responseOK = response && response.ok;
        if(responseOK){
            let data = await response.json();
            console.log("data:", data);
            this.setState({
                level: data.level
            })
        }
    }

    componentWillMount() {
        if (window.Chart) {
            parseOptions(Chart, chartOptions());
        }
    }

  render() {
    const {isLoading} = this.state;

    if(!isLoading){
        /*<PlayerList/>*/
        let leftPlayerIdList = [];
        let rightPlayerIdList = [];

        //  왼쪽 팀 선수 리스트
        for(let i = 0; i < this.state.matchResult[0].matchInfo[0].player.length; i++){
            leftPlayerIdList.push({
                spId: this.state.matchResult[0].matchInfo[0].player[i].spId,
                spPosition: this.state.matchResult[0].matchInfo[0].player[i].spPosition
            });

            let leftResult = this.state.playerList.filter((element) => {
                for(let i in leftPlayerIdList){
                    if(element.id === leftPlayerIdList[i].spId){
                        return element.name;
                    }
                }
            })

            let leftPlayerPosition = this.state.positionList.filter((element) => {
                 for(let i in leftPlayerIdList){
                    if(element.spposition === leftPlayerIdList[i].spPosition){
                        return element.desc;
                    }
                }
            })

            this.state.leftPlayerListName = leftResult;

            let leftPlayerImageSeasonIdList = [];

            // 왼쪽 팀 선수 이미지 조회 url & 시즌 아이디
            for(let i = 0; i < leftResult.length; i++){
                let url = 'https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p' + leftResult[i].id.toString().substring(3,10) + '.png';
                let seasonId = leftResult[i].id.toString().substring(0, 3);
                leftPlayerImageSeasonIdList.push({
                    playerName: leftResult[i],
                    url: url,
                    seasonId: seasonId,
                    leftPlayerPosition: leftPlayerPosition[i]
                });
            }
            this.state.leftPlayerInfo = leftPlayerImageSeasonIdList;
        }

        //  오른쪽 팀 선수 리스트
        for(let i = 0; i < this.state.matchResult[0].matchInfo[1].player.length; i++) {
            rightPlayerIdList.push(this.state.matchResult[0].matchInfo[1].player[i].spId);
            // console.log("rightPlayerIdList: ", rightPlayerIdList);

            let rightResult = this.state.playerList.filter((element) => {
                for (let i = 0; i < rightPlayerIdList.length; i++) {
                    if (element.id === rightPlayerIdList[i]) {
                        return element.name;
                    }
                }
            })

            let rightPlayerPosition = this.state.positionList.filter((element) => {
                for(let i in rightPlayerIdList){
                    if(element.spposition === rightPlayerIdList[i].spPosition){
                        return element.desc;
                    }
                }
            })

            let rightPlayerImageSeasonIdList = [];

            // 오른쪽 팀 선수 이미지 조회 url & 시즌 아이디
            for (let i = 0; i < rightResult.length; i++) {
                let url = 'https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p' + rightResult[i].id.toString().substring(3, 10) + '.png';
                let seasonId = rightResult[i].id.toString().substring(0, 3);
                rightPlayerImageSeasonIdList.push({
                    playerName: rightResult[i],
                    url: url,
                    seasonId: seasonId,
                    rightPlayerPosition: rightPlayerPosition[i]
                });
            }
            this.state.rightPlayerInfo = rightPlayerImageSeasonIdList;
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
                      <Button onClick={this.getMatchLevel1(this.state.matchResult[0].matchInfo[0].nickname)}>Lv: {this.state.level} / {this.state.matchResult[0].matchInfo[0].nickname}</Button>
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
                             {/* <Button onClick={this.getMatchLevel2(this.state.matchResult[0].matchInfo[1].nickname)}>Lv: {this.state.level} / {this.state.matchResult[0].matchInfo[1].nickname}</Button>*/}
                              <h3>{this.state.matchResult[0].matchInfo[1].nickname}</h3>
                          </div>
                      </CardBody>
                      )}
                  </Card>
              </Col>
          </Row>
            <br/>
        </Container>

          <SeasonList children={this.state.seasonId} />

         <br/>

        <Container className="mt--3" fluid>
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
                                              {this.state.leftPlayerInfo.map((image, index) => {
                                                  return (
                                                      <div key={index}>
                                                          <img alt="..." className="rounded-circle"
                                                               src={this.state.leftPlayerInfo[index].url}/>
                                                               {/*TODO 시즌 아이디 이미지 필요*/}
                                                          <img src= {this.state.seasonResult[index].seasonImg}/> / {this.state.leftPlayerInfo[index].seasonId}/ {this.state.leftPlayerInfo[index].playerName.name}
                                                          <br/>
                                                          포지션: {this.state.matchResult[0].matchInfo[0].player[index].spPosition}/
                                                          강화 등급: <div
                                                          className="btn btn-primary btn-sm">{this.state.matchResult[0].matchInfo[0].player[index].spGrade}</div>
                                                          / 선수 평점: <div
                                                          className="btn btn-primary btn-sm">{this.state.matchResult[0].matchInfo[0].player[index].status.spRating}</div>

                                                          <Table>
                                                              <tbody>
                                                              <tr align="center">
                                                                  <td>슛</td>
                                                                  <td>유효 슛</td>
                                                                  <td>어시스트</td>
                                                                  <td>득점</td>
                                                                  <td>패스 시도</td>
                                                                  <td>패스 성공</td>
                                                                  <td>블락 성공</td>
                                                                  <td>태클 성공</td>
                                                              </tr>
                                                              <tr align="center">
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.shoot}</td>
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.effectiveShoot}</td>
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.assist}</td>
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.goal}</td>
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.passTry}</td>
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.passSuccess}</td>
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.block}</td>
                                                                  <td>{this.state.matchResult[0].matchInfo[0].player[index].status.tackle}</td>
                                                              </tr>
                                                              </tbody>
                                                          </Table>

                                                          {/* TODO 선수 차트 필요 */}
                                                          {/* <Card className="bg-gradient-default shadow card">
                                                              <CardBody>
                                                                  <div className="row">
                                                                      <Line
                                                                          data={chartExample1[this.state.chartExample1Data]}
                                                                          options={chartExample1.options}
                                                                          getDatasetAtEvent={e => console.log(e)}
                                                                          width={"30%"}
                                                                      />
                                                                  </div>
                                                              </CardBody>
                                                          </Card>*/}
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
                                                  {this.state.rightPlayerInfo.map((image, index) => {
                                                      return (
                                                          <div key={index}>
                                                              <img alt="..." className="rounded-circle" src={this.state.rightPlayerInfo[index].url}/>
                                                              {/*TODO 시즌 아이디 이미지 필요*/}
                                                              {this.state.rightPlayerInfo[index].seasonId} / {this.state.rightPlayerInfo[index].playerName.name} <br/>
                                                              포지션: {this.state.matchResult[0].matchInfo[1].player[index].spPosition}/
                                                              강화 등급: <div className="btn btn-primary btn-sm">{this.state.matchResult[0].matchInfo[1].player[index].spGrade}</div>
                                                              / 선수 평점: <div className="btn btn-primary btn-sm">{this.state.matchResult[0].matchInfo[1].player[index].status.spRating}</div> <br/>

                                                              <Table>
                                                                  <tbody>
                                                                  <tr align="center">
                                                                      <td>슛</td>
                                                                      <td>유효 슛</td>
                                                                      <td>어시스트</td>
                                                                      <td>득점</td>
                                                                      <td>패스 시도</td>
                                                                      <td>패스 성공</td>
                                                                      <td>블락 성공</td>
                                                                      <td>태클 성공</td>
                                                                  </tr>
                                                                  <tr align="center">
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.shoot}</td>
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.effectiveShoot}</td>
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.assist}</td>
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.goal}</td>
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.passTry}</td>
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.passSuccess}</td>
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.block}</td>
                                                                      <td>{this.state.matchResult[0].matchInfo[1].player[index].status.tackle}</td>
                                                                  </tr>
                                                                  </tbody>
                                                              </Table>

                                                              {/*TODO 선수 차트 필요*/}
                                                              {/*<Card className="bg-gradient-default shadow card">
                                                                  <CardBody>
                                                                      <div className="row">
                                                                          <Line
                                                                              data={chartExample1[this.state.chartExample1Data]}
                                                                              options={chartExample1.options}
                                                                              getDatasetAtEvent={e => console.log(e)}
                                                                              width={"30%"}
                                                                          />
                                                                      </div>
                                                                  </CardBody>
                                                              </Card>*/}
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

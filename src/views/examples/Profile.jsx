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
import Chart from "chart.js";
// core components
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2
} from "variables/charts.jsx";

const options = {
    method: 'GET',
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Accept": "*/*",
        "Host": "static.api.nexon.co.kr",
        "Connection":"keep-alive"
    }
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
      this.state ={
          matchResult: '',
          isLoading: true,
          playerList: '',
          positionList: '',
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

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    let getMatchIdDetail = 'https://api.nexon.co.kr/fifaonline4/v1.0/matches/' + MatchId;
    try{
        axios.get(getMatchIdDetail, {
        // 헤더 값 : 권한 시리얼 정보
        headers: {
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'
        }
      }).then(response => {
        matchResultArray.push(response.data);
        this.setState({
            matchResult: matchResultArray
        })
      })
    }catch(error){
      console.error(error);
    }
  }

  getPlayerList = async () => {
      const url = '/fifaonline4/latest/spid.json';
      let response = await fetch(url, options);
      let responseOK = response && response.ok;
      if(responseOK){
          let data = await response.json();
          this.setState({
              playerList: data
          });
      }
  }

    // 선수 포지션(spposition) 메타데이터 조회
    getPositionList = async () => {
        const url = '/fifaonline4/latest/spposition.json';
        let response = await fetch(url, options);
        let responseOK = response && response.ok;
        if(responseOK){
            let data = await response.json();
            this.setState({
                positionList: data
            });
        }
    }

    // 선수 시즌 아이디(seasonId) 메타데이터 조회
    getSppositionList = async () => {
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const getSeasonIdDetail = '/fifaonline4/latest/seasonid.json';

        axios.get(getSeasonIdDetail).then(response => {
            let data = response.data;
            this.setState({
                seasonResult: data,
                isLoading: false
            });
        })
    }

    componentWillMount() {
        if (window.Chart) {
            parseOptions(Chart, chartOptions());
        }
    }

  render() {
    const {isLoading} = this.state;

    if(!isLoading){
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

            let leftPlayerSeasonImg = this.state.seasonResult.filter((element) => {
                for(let i in leftResult){
                    if(element.seasonId === parseInt(leftResult[i].id.toString().substring(0, 3))){
                        return element.seasonImg;
                    }
                }
            })

            let leftPlayerImageSeasonIdList = [];

            // 왼쪽 팀 선수 이미지 조회 url & 시즌 아이디
            let leftSpIdList = [];

            for(let i = 0; i < leftResult.length; i++){
                let spId = leftResult[i].id.toString().substring(3,10);
                leftSpIdList.push(parseInt(spId));

                let url = 'https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p' + leftSpIdList[i].toString() + '.png';

                // desc, seasonImg 없는 선수들 기본 이미지 표시 필요
                if(leftPlayerPosition[i] === undefined || leftPlayerSeasonImg[i] === undefined){
                    leftPlayerPosition[i] = {desc: "none"};
                    leftPlayerSeasonImg[i] = {seasonImg: "none"};
                }

                let seasonId = leftResult[i].id.toString().substring(0, 3);

                leftPlayerImageSeasonIdList.push({
                    playerName: leftResult[i],
                    url: url,
                    seasonId: seasonId,
                    position: leftPlayerPosition[i],
                    seasonImg: leftPlayerSeasonImg[i]
                });
            }
            this.state.leftPlayerInfo = leftPlayerImageSeasonIdList;
        }

        //  오른쪽 팀 선수 리스트
        for(let i = 0; i < this.state.matchResult[0].matchInfo[1].player.length; i++) {
            rightPlayerIdList.push({
                spId: this.state.matchResult[0].matchInfo[1].player[i].spId,
                spPosition: this.state.matchResult[0].matchInfo[1].player[i].spPosition
            });

            let rightResult = this.state.playerList.filter((element) => {
                for(let i in rightPlayerIdList){
                    if (element.id === rightPlayerIdList[i].spId) {
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

            this.state.rightPlayerListName = rightResult;

            let rightPlayerSeasonImg = this.state.seasonResult.filter((element) => {
                for(let i in rightResult){
                    if(element.seasonId === parseInt(rightResult[i].id.toString().substring(0, 3))){
                        return element.seasonImg;
                    }
                }
            })

            let rightPlayerImageSeasonIdList = [];

            // 오른쪽 팀 선수 이미지 조회 url & 시즌 아이디
            let rightSpIdList = [];

            for (let i = 0; i < rightResult.length; i++) {
                let spId = rightResult[i].id.toString().substring(3, 10);
                rightSpIdList.push(parseInt(spId));

                let url = 'https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p' + rightSpIdList[i].toString() + '.png';

                // desc, seasonImg 없는 선수들 기본 이미지 표시 필요
                if(rightPlayerPosition[i] === undefined || rightPlayerSeasonImg[i] === undefined){
                    rightPlayerPosition[i] = {desc: "none"};
                    rightPlayerSeasonImg[i] = {seasonImg: "none"};
                }

                let seasonId = rightResult[i].id.toString().substring(0, 3);

                rightPlayerImageSeasonIdList.push({
                    playerName: rightResult[i],
                    url: url,
                    seasonId: seasonId,
                    position: rightPlayerPosition[i],
                    seasonImg: rightPlayerSeasonImg[i]
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
                                                          <img src= {this.state.leftPlayerInfo[index].seasonImg.seasonImg}/> {this.state.leftPlayerInfo[index].playerName.name}
                                                          <br/>
                                                          포지션: {this.state.leftPlayerInfo[index].position.desc} /
                                                          강화 등급: <div className="btn btn-primary btn-sm">
                                                              {this.state.matchResult[0].matchInfo[0].player[index].spGrade}
                                                          </div> /
                                                          선수 평점: <div className="btn btn-primary btn-sm">
                                                                {this.state.matchResult[0].matchInfo[0].player[index].status.spRating}
                                                          </div>

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
                                                              <img alt="..." className="rounded-circle"
                                                                   src={this.state.rightPlayerInfo[index].url}/>
                                                              <img src= {this.state.rightPlayerInfo[index].seasonImg.seasonImg}/> {this.state.rightPlayerInfo[index].playerName.name}
                                                              <br/>
                                                              포지션: {this.state.rightPlayerInfo[index].position.desc} /
                                                              강화 등급: <div className="btn btn-primary btn-sm">
                                                                    {this.state.matchResult[0].matchInfo[1].player[index].spGrade}
                                                              </div> /
                                                              선수 평점: <div className="btn btn-primary btn-sm">
                                                                    {this.state.matchResult[0].matchInfo[1].player[index].status.spRating}
                                                              </div>

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

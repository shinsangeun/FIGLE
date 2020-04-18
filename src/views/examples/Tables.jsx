import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip, Button
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import axios from "axios";

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      isLoading: true,
      matchIdList:'',
      matchResult:[],
      activePage:''
    };
  }

  componentDidMount= async () => {
      await this._getMatchIdList();
      await this._getMatchIdDetail();
  };

  // 유저 닉네임으로 유저 정보 조회
  _getMatchIdList = () => {
      const search = this.props.location.search;
      const params = new URLSearchParams(search);
      const accessId = params.get("accessId");
      const matchtype = 50;                              //50: 공식 경기, 52: 감독 모드
      const offset = 0;                                  // 리스트에서 가져올 시작 위치
      const limit = 100;                                 // 리스트에서 가져올 갯수

      let getMatchIdList = 'https://api.nexon.co.kr/fifaonline4/v1.0/users/' + accessId + '/matches?matchtype=' + matchtype + '&offset=' + offset +'&limit=' + limit;
      try{
          return axios.get(getMatchIdList, {
              // 헤더 값 : 권한 시리얼 정보
              headers : { Authorization : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
          }).then(response =>
            this.setState({
              matchIdList: response.data
            })
          )
      } catch (error) {
          console.error(error);
      }
  };

  // 매치 상세 기록 조
  _getMatchIdDetail = () => {
    let MatchIdList = this.state.matchIdList;
    let matchResultArray = [];

    for (let i = 0; i < MatchIdList.length; i++) {
      if(MatchIdList.length === 0){
        return;
      }else{
        let getMatchIdDetail = 'https://api.nexon.co.kr/fifaonline4/v1.0/matches/' + MatchIdList[i];
        try {
          axios.get(getMatchIdDetail, {
            // 헤더 값 : 권한 시리얼 정보
            headers: {Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
          }).then(response => {
            matchResultArray.push(response.data);
              this.setState({
                matchResult: matchResultArray,
                isLoading: false
              })
          }).then(this._sortByDate(this.state.matchResult));
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  _sortByDate = (matchResultArray) => {
    console.log("matchResultArray:" , matchResultArray[0]);

    if(matchResultArray != null){
      for(let i = 0; i<matchResultArray.length; i++) {

        let match_date = matchResultArray[i].matchDate;
        console.log("match_date:", match_date);

        let sorted_meetings = match_date.sort((a, b) => {
          return new Date(a.match_date).getTime() -
              new Date(b.match_date).getTime()
        }).reverse();
      }
    }
  };

  _sortMatchInfo = () => {
    for(let i = 0; i<this.state.matchResult; i++){
      if(this.state.matchResult != null && this.state.matchResult[i].accessId == this._getMatchIdList.accessId){
        console.log("test-->", "true");
      }else{
        return;
      }
    }
  };

  // 경기 결과 버튼
  handleButton = (matchResult) => {
    if(matchResult == "승"){
      console.log("matchResult ==승");
      return <Button color="primary">{matchResult}</Button>
    }else if(matchResult == "패"){
      return <Button color="warning">{matchResult}</Button>
    }
  };

  // 페이징 처리
  _handlePageChange = (pageNumber) => {
      console.log(`active page is ${pageNumber}`);
      this.setState(({activePage: pageNumber}));
  };

  render() {
    const { matchIdList, matchResult, isLoading, activePage} = this.state;
    if(!isLoading){
      console.log("matchList-->", matchResult[0].matchInfo[0].nickname, matchResult[0].matchInfo[1].nickname, isLoading);
    }

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">경기 매치 리스트</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">경기 결과</th>
                      <th scope="col">매치 ID</th>
                      <th scope="col"></th>
                      <th scope="col">골</th>
                      <th scope="col"></th>
                      <th scope="col">매치 ID</th>
                      <th scope="col">경기 결과</th>
                      <th scope="col">경기 날짜</th>
                    </tr>
                  </thead>
                  {isLoading ? (
                      <div className="loader">
                        <span className="loader__text">Loading...</span>
                      </div>
                        ) : (
                  <tbody>
                  {matchResult.map((index, matchId) => (
                      <tr>
                        <th>
                        <Button onClick={() => {this.handleButton(index.matchInfo[0].matchDetail.matchResult)}} color="success">
                          {index.matchInfo[0].matchDetail.matchResult}
                        </Button>
                        </th>
                        <th scope="row" key={index.matchInfo[0].accessId}>
                          {index.matchInfo[0].nickname}
                        </th>
                        <th>
                          <span className="h2 font-weight-bold mb-0">
                            {index.matchInfo[0].shoot.goalTotal}
                          </span>
                        </th>
                        <th>vs</th>
                        <th>
                          <span className="h2 font-weight-bold mb-0">
                            {index.matchInfo[1].shoot.goalTotal}
                          </span>
                        </th>
                        <th scope="row" key={index.matchInfo[1].accessId}>
                          {index.matchInfo[1].nickname}
                        </th>
                        <th>
                          <Button onClick={this.handleButton(index.matchInfo[1].matchDetail.matchResult)} color="warning">
                            {index.matchInfo[1].matchDetail.matchResult}
                          </Button>
                        </th>
                        <th>
                            {index.matchDate}
                        </th>
                      </tr>
                  ))}
                  </tbody>
                  )}
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Tables;

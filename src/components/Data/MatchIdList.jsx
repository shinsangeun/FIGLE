import React from "react";
import axios from "axios";
import Profile from "views/examples/Profile.jsx"

class MatchIdList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matchResult: ''
        }
    }

    componentDidMount = async () => {
        await this.getMatchIdDetail();
    }

    getMatchIdDetail = async () => {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const MatchId = params.get("matchId");
        let matchResultArray = [];

        console.log("MatchId:", MatchId);
        console.log("search::", search);

        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        let getMatchIdDetail = 'https://api.nexon.co.kr/fifaonline4/v1.0/matches/' + MatchId;
        try{
            axios.get(proxyurl + getMatchIdDetail, {
                // 헤더 값 : 권한 시리얼 정보
                headers: {Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
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

    render() {
        return (
            <div className = "PlayerList">
                {this.state.matchResult.map((match, index)  => {
                    return (
                        <div>
                            {this.state.matchResult[index].id}
                            {this.state.matchResult[index].name}
                        </div>
                    )})}
            </div>
        );
    }
}

export default MatchIdList;

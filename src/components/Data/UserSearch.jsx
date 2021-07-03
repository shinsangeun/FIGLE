import React from "react";
import axios from "axios";

class SeasonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seasonResult: []
        }
    }

    componentDidMount = async () => {
        await this.getUserId();
    }

    async getUserId(nickname){
        console.log("nickname:", nickname);

        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        let req_message = 'https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=' + nickname;

        try{
            return await axios.get(proxyurl + req_message, {
                // 헤더 값 : 권한 시리얼 정보
                headers : { Authorization : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo'}
            }).then(response => {
                console.log("code:", response.status);
                console.log("message: ", response);

                if(response.status === 200){
                    this.setState({
                        nickname : response.data.nickname,
                        accessId : response.data.accessId,
                        level : response.data.level
                    })
                }else{
                    alert("해당 닉네임의 유저가 없습니다.")
                }
            })
        }catch (error){
            console.log(error)
            // if(error.response.status === 404){
            //  alert("해당 닉네임의 유저가 없습니다.")
            //}
        }
    };

    render() {
        return (
            <div className="seasonList">
                {this.state.seasonResult.map((season, index)  => {
                    return (
                        <div className="name">
                            {this.state.seasonResult[index].seasonId} - {this.state.seasonResult[index].className} - <img src= {this.state.seasonResult[index].seasonImg}/>
                        </div>
                    )})}
            </div>
        );
    }
}

export default SeasonList;
import React from "react";
import axios from "axios";

const API_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTIyNDc2MTUyOSIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU3NzAwODc3MywiZXhwIjoxNjQwMDgwNzczLCJpYXQiOjE1NzcwMDg3NzN9.Pv1OIow11dye_uv69wnVleR93fa4fDrmup1oTXVuUuo';

class GetAccessId extends React.Component {
    static async getInitialProps () {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const nickname = params.get("nickname");

        let req_message = 'https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=' + nickname;

        try{
            return await axios.get(req_message, {
                // 헤더 값 : 권한 시리얼 정보
                headers : { Authorization : API_KEY }
            }).then(response => {
                if(response.status === 200){
                    return {
                        nickname : response.data.nickname,
                        accessId : response.data.accessId,
                        level : response.data.level
                    }
                }else if(response.status === 404 || response.status === 500){
                    alert("해당 닉네임의 유저가 없습니다.")
                }
            })
        }catch (error){
            console.log(error);
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            nickname: this.state.nickname,
            accessId: this.state.accessId,
            level: this.state.level
        }
    }

    render() {
        return (
            <div className="id"> {this.props.accessId} </div>
        );
    }
}

export default GetAccessId;

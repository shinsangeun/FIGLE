import React from "react";

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            id: '',
            name: ''
        };
    }

    componentDidMount = () => {
        this.getPlayerList();
    };

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
            console.log("data:", data.length);
        }
    }
}

export default Player;
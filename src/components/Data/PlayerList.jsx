import React from "react";

class PlayerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerList: ''
        }
    }

    componentDidMount = async () => {
        await this.getPlayerList();
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
        return (
            <div className = "PlayerList">
                {this.state.playerList.map((player, index)  => {
                    return (
                        <div>
                            {this.state.playerList[index].id}
                            {this.state.playerList[index].name}
                        </div>
                    )})}
            </div>
        );
    }
}

export default PlayerList;

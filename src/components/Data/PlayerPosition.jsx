import React from "react";
import axios from "axios";
import Profile from "views/examples/Profile.jsx"

class PlayerPosition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positionResult: ''
        }
    }

    componentDidMount = async () => {
        await this.getPlayerPositionList();
    }

    getPlayerPositionList = async () => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const getPlayerPosition = 'https://static.api.nexon.co.kr/fifaonline4/latest/spposition.json';

        axios.get(proxyurl + getPlayerPosition).then(response => {
            let data = response.data;
            this.setState({
                positionResult: data
            });
        })
    }

    render() {
        return (
            <div className = "PlayerPositionList">
                {this.state.positionResult.map((player, index)  => {
                    return (
                        <div>
                            {this.state.positionResult[index].spposition}
                            {this.state.positionResult[index].desc}
                        </div>
                    )})}
            </div> 
        );
    }
}

export default PlayerPosition;

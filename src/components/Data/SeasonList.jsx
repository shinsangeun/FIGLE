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
        await this.getSeasonIdList();
    }

    getSeasonIdList = () => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const getSeasonIdDetail = 'https://static.api.nexon.co.kr/fifaonline4/latest/seasonid.json';

        axios.get(proxyurl + getSeasonIdDetail).then(response => {
            let data = response.data;
            this.setState({
                seasonResult: data
            });
        })
    }

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
import React from 'react';

import {isEmpty} from "lodash"

class Trending extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            trendRepo: []
        };
        this.trendingRepos = this.trendingRepos.bind(this);
        this.showTrendingRepos = this.showTrendingRepos.bind(this);
    }

    componentDidMount() {
        this.trendingRepos();
    }

    trendingRepos() {
        const trendRepoUrl = 'https://github-trending-api.now.sh/repositories';
        fetch(trendRepoUrl)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    trendRepo: json
                });
            });
    }

    showTrendingRepos() {
        return (
            <h1>{this.state.trendRepo[0].name}</h1>
        );
    }

    render() {
        return (
            <div>
                {isEmpty(this.state.trendRepo) ? "": this.showTrendingRepos()}
            </div>
        );
    }
}

export default Trending;
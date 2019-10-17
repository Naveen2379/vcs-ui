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
        function showRepo(repo) {
            return <div>
                <img src={repo.avatar}/>
                <h1>{repo.name}</h1>
                <h1>{repo.author}</h1>
                <h1>{repo.stars}</h1>
                <h1>{repo.language}</h1>
            </div>
        }

        return (
            <div>
                {this.state.trendRepo.map(repo => showRepo(repo))}
            </div>
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
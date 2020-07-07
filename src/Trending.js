import React from 'react';

import {Col, Row} from "react-bootstrap";
import {isEmpty} from "lodash";
import "./Trending.css";


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
        /* previously used Trending reposiroty API URL */
        //const trendRepoUrl = 'https://github-trending-api.now.sh/repositories';
        const trendRepoUrl = 'https://private-anon-8b5052aa0c-githubtrendingapi.apiary-proxy.com/developers';
        fetch(trendRepoUrl)
            .then(response => response.json())
            .then(result => {
                this.setState({
                    trendRepo: result
                });
            });
    }

    showTrendingRepos() {
        return (
            <section>{this.state.trendRepo.map((userRepo, ind) =>
                <React.Fragment key={userRepo.name}>
                    <article className="descArticle">
                        <img className="img" height="100px" width="100px" alt='avatar not displayed' src={userRepo.avatar}/>
                        <Col className="repoDetails">
                            <Row><td width='350px'><b>{userRepo.name}</b></td></Row>
                            <Row><td width='350px'><b>Author: </b>{userRepo.username}</td></Row>
                            <Row><td width='350px'><b>Repo Name: </b>{userRepo.repo.name}</td></Row>
                            <Row><td width='350px'><b>URL: </b><a href={userRepo.repo.url}>{userRepo.repo.url}</a></td></Row>
                        </Col>
                    </article>
                </React.Fragment>
            )}</section>
        );
    }

    render() {
        return  (
            <div>{isEmpty(this.state.trendRepo) ? "": this.showTrendingRepos()}</div>
        );
    }
}

export default Trending;
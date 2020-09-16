import React from 'react';

import {Col, Row} from "react-bootstrap";
import {isEmpty} from "lodash";
import "../styles/Trending.css";


class Trending extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            trendRepo: [],
            errorMsg: ''
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
        /*const trendRepoUrl = 'https://private-anon-8b5052aa0c-githubtrendingapi.apiary-proxy.com/developers';*/
        const trendRepoUrl = 'https://ghapi.huchen.dev/developers';
        fetch(trendRepoUrl)
            .then(response => response.json())
            .then(result => {
                this.setState({
                    trendRepo: result
                });
            })
            .catch( err => this.setState({
                errorMsg: err
            }))
    }

    showTrendingRepos() {
        return (
            <section>
                {
                    this.state.trendRepo.map((userRepo, ind) => {
                        if(userRepo.repo) {
                            return <React.Fragment key={userRepo.name}>
                                <article className="descArticle">
                                    <img className="img" height="100px" width="100px" alt='avatar not displayed' src={userRepo.avatar}/>
                                    <Col className="repoDetails">
                                        <Row>
                                            <td width='350px'><b>{userRepo.name}</b></td>
                                        </Row>
                                        <Row>
                                            <td width='350px'><b>Author: </b>{userRepo.username}</td>
                                        </Row>
                                        <Row>
                                            <td width='350px'><b>Repo Name: </b>{userRepo.repo.name}</td>
                                        </Row>
                                        <Row>
                                            <td width='350px'><b>URL: </b>
                                                <a href={userRepo.repo.url} target='_blank'>{userRepo.repo.url}</a></td>
                                        </Row>
                                    </Col>
                                </article>
                            </React.Fragment>
                        }
                    })
                }
            </section>
        )
    }

    render() {
        return  (
            <React.Fragment>{ this.state.errorMsg ? <h1 style={{marginLeft: "350px", color: "red"}}>something went wrong!!!</h1> : isEmpty(this.state.trendRepo) ? '' : this.showTrendingRepos()}</React.Fragment>
        );
    }
}

export default Trending;

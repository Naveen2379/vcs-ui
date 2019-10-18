import React from 'react';

import {Col, Row, Table} from "react-bootstrap";
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
            return <tr key={repo.name}>
                <td sm='0.5'>
                <img height="100px" width="100px" src={repo.avatar}/>
                </td><Col>
                    <Row><td width="980px"><b>Repo Name - </b>{repo.name}</td></Row>
                    <Row><td width="980px"><b>Author - </b>{repo.author}</td></Row>
                    <Row><td width="980px"><b>Stars - </b>{repo.stars}</td></Row>
                    <Row><td width="980px"><b>Language - </b>{repo.language}</td></Row>
            </Col>



            </tr>
        }

        return (
                <tbody className="tableStyle">{this.state.trendRepo.map(repo => showRepo(repo))}</tbody>
        );
    }

    render() {
        return (
            <Table striped bordered hovered>
                {isEmpty(this.state.trendRepo) ? "": this.showTrendingRepos()}
            </Table>
        );
    }
}

export default Trending;
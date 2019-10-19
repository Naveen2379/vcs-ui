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
        //var tableData = {};
        function showRepo(repo,ind) {
            const tableData = <td as={Col} key={repo.name} sm="5">
                <Col key={repo.name}>
                    <td sm='1'>
                        <img className="img" height="100px" width="100px" src={repo.avatar}/>
                    </td>
                    <td>
                        <Col className="repoDetails">
                            <Row><td width="350px"><b>{repo.name}</b></td></Row>
                            <Row><td width="350px">{repo.author}</td></Row>
                            <Row><td width="350px">{repo.stars}</td></Row>
                            <Row><td width="350px">{repo.language}</td></Row>
                        </Col>
                    </td>
                </Col>
            </td>


            /*if((ind+1)%2 === 0){
                return <tr>{tableData}</tr>
            };*/

            return <tr>{tableData}</tr>


        }

        return (
            <tbody className="tableStyle">{this.state.trendRepo.map((repo,ind) => showRepo(repo,ind))}</tbody>
        );
    }

    render() {
        return (
            <Table striped hovered>
                {isEmpty(this.state.trendRepo) ? "": this.showTrendingRepos()}
            </Table>
        );
    }
}

export default Trending;
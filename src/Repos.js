

import React from 'react';

import {isEmpty, reduce, extend} from "lodash"
import { Button, Form, FormControl, FormGroup, FormLabel, Col, Row, Container, Table,  Dropdown, DropdownButton} from 'react-bootstrap';
import './Repos.css';
import Trending from "./Trending";


function convertJSON(response) {
    return response.json();
}

class Repos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userRepos: [],
            userRepoWithLang: {},
        };
        this.userInput = this.userInput.bind(this);
        this.constructUrlForUsername = this.constructUrlForUsername.bind(this);
        this.fetchReposAPI = this.fetchReposAPI.bind(this);
        this.saveUserRepos = this.saveUserRepos.bind(this);
        this.renderRepos = this.renderRepos.bind(this);
    }

    userInput(event) {
        this.setState({userName: event.target.value});
    }

    constructUrlForUsername() {
        return "http://api.github.com/users/" + this.state.userName + "/repos";
    }

    saveUserRepos(jsonResp) {
        Promise.all(
            jsonResp.map(userRepo => fetch(userRepo.languages_url)
                .then(response =>
                    response.json().then(languages => {
                        return {[userRepo.name]: languages}
                    }))
            )
        ).then(data => {
            const newData = reduce(data, extend);
            this.setState({userRepoWithLang: newData})
        });

        this.setState(
            {
                userRepos: jsonResp,
            }
        );
    }

    fetchReposAPI() {
        console.log(this.constructUrlForUsername());
        fetch(
            this.constructUrlForUsername()
        ).then(convertJSON)
            .then(this.saveUserRepos)
    }

    renderRepos(reposLang) {
        if(isEmpty(reposLang)) {
            return ""
        }

        function repoAndLang(key) {
            return <tr key={key}><td className="RepoBold">{key}</td><td className="langStyle">{Object.keys(reposLang[key]).map(lang => <p key={lang}>{lang}</p>)}</td></tr>
        }

        return Object.keys(reposLang).map(repoAndLang);
    }

    render() {
        const repoLangTable =  <Table striped bordered hover>
                                <tbody>{this.renderRepos(this.state.userRepoWithLang)}</tbody>
                                </Table>;
        return <Container className="containerClass">
            <Row className="rowClass">
                <Col>
                <Form>
                    <Col className="columnChange">
                    <Form.Group as={Row}>
                    <Form.Label column sm="2"> Username </Form.Label>
                        <Col sm="5">
                        <Form.Control type="text" placeholder="Enter username" onChange={this.userInput}/>
                        </Col>
                        <Col sm="2">
                            <Button variant="primary" size="sm" onClick={this.fetchReposAPI}>Submit</Button>
                        </Col>
                    </Form.Group>
                </Col>
                </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    {isEmpty(this.state.userRepos) ? <Trending />: ""}
                </Col>
            </Row>
            <Row className="imgRepos">
            <Col className="imgLeft">
                {isEmpty(this.state.userRepos) ? "" : <img className="imgDisplay" src={isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.avatar_url}/>}
                <h5>{isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.login}</h5>
            </Col>
            <Col sm='5'>
                {isEmpty(this.state.userRepoWithLang) ? "" : repoLangTable}
            </Col>
            <Col className="dropDown">
                <DropdownButton id="dropdown-item-button" title="Dropdown button">
                <Dropdown.Item as="button">Action</Dropdown.Item>
                <Dropdown.Item as="button">Another action</Dropdown.Item>
                <Dropdown.Item as="button">Something else</Dropdown.Item>
                </DropdownButton>
            </Col>
            </Row>
        </Container>

    }
}
export default Repos;
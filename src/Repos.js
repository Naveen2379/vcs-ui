import React from 'react';

import {isEmpty, reduce, extend, pickBy} from "lodash"
import { Button, Form, FormControl, FormGroup, FormLabel, Col, Row, Container, Table,  Dropdown, DropdownButton} from 'react-bootstrap';
import './Repos.css';
import Trending from "./Trending";

export default class Repos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userRepos: [],
            userRepoWithLang: {},
            userRepoOnSelectLang: {},
            languages: [],
            userNotFound: false
        };
        this.userInput = this.userInput.bind(this);
        this.constructUrlForUsername = this.constructUrlForUsername.bind(this);
        this.fetchReposAPI = this.fetchReposAPI.bind(this);
        this.saveUserRepos = this.saveUserRepos.bind(this);
        this.renderRepos = this.renderRepos.bind(this);
        this.onSelectDropdown = this.onSelectDropdown.bind(this);
    }

    userInput(event) {
        this.setState({userName: event.target.value});
    }

    constructUrlForUsername() {
        console.log("http://api.github.com/users/" + this.state.userName + "/repos");
        return "http://api.github.com/users/" + this.state.userName + "/repos";
    }

    saveUserRepos(jsonResp) {
        console.log(jsonResp);
        if(!isEmpty(jsonResp)) {
            console.log('not empty');
            Promise.all(
                jsonResp.map(userRepo => fetch(userRepo.languages_url)
                    .then(response => {
                        return response.json().then(languages => {
                            //console.log(languages);
                            return {[userRepo.name]: languages}
                        })
                    })
                )
            ).then(data => {
                console.log(data);
                const newData = reduce(data, extend);
                console.log(newData);
                const languages = Object.values(newData).map(language => Object.keys(language)).flatMap(x => x);
                const uniqueLang = Array.from(new Set(languages));
                this.setState({languages: uniqueLang});
                this.setState({userRepoWithLang: newData, userRepoOnSelectLang: ""});
            });
        }
        else {
            console.log('empty');
            this.setState({
                userNotFound: true
            })
        }
        this.setState(
            {
                userRepos: jsonResp,
            }
        );
    }

    fetchReposAPI() {
        fetch(
            this.constructUrlForUsername()
        )
            .then(response=> {
            console.log(response);
            return response.json();
        })
            .then(this.saveUserRepos)
            .catch(err=>console.log(err));
    }

    renderRepos(reposLang) {
        if(isEmpty(reposLang)) {
            return ""
        }

        function repoAndLang(key) {
            return <tr key={key}><td className="RepoBold">{key}</td><td className="langStyle1">{Object.keys(reposLang[key]).map((lang, ind) => <span key={lang}>{ (ind ? ', ' : '') + lang} </span>)}</td></tr>
        }

        return Object.keys(reposLang).map(repoAndLang);
    }

    render() {
        const repoLangTable =  <Table className="repoListTable" striped hover>
                                <tbody>{this.renderRepos(this.state.userRepoWithLang)}</tbody>
                                </Table>;
        const repoOnSelectLangTable =  <Table className="repoListTable" striped hover>
                                <tbody>{this.renderRepos(this.state.userRepoOnSelectLang)}</tbody>
                                </Table>;
        return <Container className="containerClass">
            <Row className="rowClass1">
                <Form>
                    <Form.Group as={Row}>
                        <Col sm="8">
                        <Form.Control type="text" placeholder="enter github username..." onChange={this.userInput}/>
                        </Col>
                        <Col sm="2">
                            <Button variant="primary" size="md" onClick={this.fetchReposAPI}>Submit</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Row>
            <Row className="tableAdjust">
                    {isEmpty(this.state.userRepos) ? <Trending />: ""}
            </Row>
            <Row>
            <Col className="imgLeft">
                {this.state.userNotFound ? <h5>user not found</h5> : ''}
                {isEmpty(this.state.userRepos) ? "" : <img className="imgDisplay" src={isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.avatar_url}/>}
                <h5 style={{textAlign:"center"}}>{isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.login}</h5>
            </Col>
            <Col sm='7'>
                {isEmpty(this.state.userRepoOnSelectLang) ? repoLangTable : repoOnSelectLangTable }
            </Col>
            <Col>
                {isEmpty(this.state.languages) ? "" : <DropdownButton id="dropdown-item-button" title="Choose Language">
                    {this.state.languages.map(language =>
                        <Dropdown.Item as="button" className="colorBtn" key={language}
                                       onSelect={() => this.onSelectDropdown(language)}>{language}
                        </Dropdown.Item>)
                    }
                </DropdownButton>}

            </Col>
            </Row>
        </Container>

    }

    onSelectDropdown(language) {
        const newReposWithLang = pickBy(this.state.userRepoWithLang, function(value, key, object) {
            return Object.keys(value).includes(language);
        });
        this.setState({userRepoOnSelectLang: newReposWithLang});
    }
}

function convertJSON(response) {
    return response.json();
}
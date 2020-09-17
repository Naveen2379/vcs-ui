import React from 'react';

import {isEmpty, reduce, extend, pickBy} from "lodash"
import { Button, Form, Col, Row, Container, Table,  Dropdown, DropdownButton} from 'react-bootstrap';
import '../styles/Repos.css';
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
            userNotFound: false,
            errorMsg: ''
        };
        this.userInput = this.userInput.bind(this);
        this.constructUrlForUsername = this.constructUrlForUsername.bind(this);
        this.fetchReposAPI = this.fetchReposAPI.bind(this);
        this.saveUserRepos = this.saveUserRepos.bind(this);
        this.renderRepos = this.renderRepos.bind(this);
        this.onSelectDropdown = this.onSelectDropdown.bind(this);
    }

    userInput(event) {
        this.setState({userName: event.target.value},
            () => {
            if(this.state.userName === '') {
                this.setState({
                    userRepos: [],
                    userNotFound: false
                })
            }});
    }

    constructUrlForUsername() {
        return "https://api.github.com/users/" + this.state.userName + "/repos";
    }

    saveUserRepos(jsonResp) {
        if(jsonResp.message === 'Not Found') {
            this.setState({
                userNotFound: true,
                userRepos: []
            });
        }
        else {
            if(!isEmpty(jsonResp)) {
                Promise.all(
                    jsonResp.map(userRepo => fetch(userRepo.languages_url)
                        .then(response => {
                            return response.json().then(languages => {
                                return {[userRepo.name]: languages}
                            })
                        })
                        .catch(err => console.log(err))
                    )
                ).then(data => {
                    const newData = reduce(data, extend);
                    const languages = Object.values(newData).map(language => Object.keys(language)).flatMap(x => x);
                    const uniqueLang = Array.from(new Set(languages));
                    this.setState({languages: uniqueLang});
                    this.setState({userRepoWithLang: newData, userRepoOnSelectLang: ""});
                });
                this.setState(
                    {
                        userRepos: jsonResp,
                        userNotFound: false,
                    });
            }
            else {
                this.setState({
                    userNotFound: true
                });
            }
        }
    }

    fetchReposAPI() {
        fetch(
            this.constructUrlForUsername())
            .then(response=> {
                return response.json();
            })
            .then(this.saveUserRepos)
            .catch( err => {
                return this.setState({
                    errorMsg: err
                });
            })
    }

    renderRepos(reposLang) {
        if(isEmpty(reposLang)) {
            return "";
        }

        function repoAndLang(key) {
            return <tr key={key}>
                <td className="RepoBold">{key}</td>
                <td className="langStyle1">{Object.keys(reposLang[key]).map((lang, ind) => <span key={lang}>{ (ind ? ', ' : '') + lang} </span>)}</td>
            </tr>
        }
        return Object.keys(reposLang).map(repoAndLang);
    }

    onSelectDropdown(language) {
        const newReposWithLang = pickBy(this.state.userRepoWithLang, function(value, key, object) {
            return Object.keys(value).includes(language);
        });
        this.setState({userRepoOnSelectLang: newReposWithLang});
    }

    render() {
        const repoLangTable =  <Table className="repoListTable" striped hover>
                                <tbody>{this.renderRepos(this.state.userRepoWithLang)}</tbody>
                                </Table>;
        const repoOnSelectLangTable =  <Table className="repoListTable" striped hover>
                                <tbody>{this.renderRepos(this.state.userRepoOnSelectLang)}</tbody>
                                </Table>;
        const userReposWithLanguages = <React.Fragment>
                <Col className="imgLeft">
                    {isEmpty(this.state.userRepos) ? "" : <img className="imgDisplay" alt='avatar not displayed' src={isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.avatar_url}/>}
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
        </React.Fragment>;
        return (
            <Container className="containerClass">
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
                    {
                        this.state.errorMsg ? <h1 style={{marginLeft: "350px", color: "red"}}>something went wrong!!!</h1> :
                        (
                            this.state.userNotFound ?  <React.Fragment>
                                <div className='user-not-found-message'>
                                    <p>Please enter valid gitHub username</p>
                                </div>
                                <Trending />
                            </React.Fragment>
                            : <React.Fragment>
                                {isEmpty(this.state.userRepos) ? <Trending /> : <React.Fragment>{userReposWithLanguages}</React.Fragment>}
                            </React.Fragment>
                        )
                    }
                </Row>
            </Container>
        )
    }
}
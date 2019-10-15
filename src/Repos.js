import React from 'react';

import {isEmpty, reduce, extend} from "lodash"
import { Button } from 'react-bootstrap';

function convertJSON(response) {
    return response.json();
}

class Repos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userRepos: [],
            userRepoWithLang: {}
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
        console.log("1", jsonResp);
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
            return <div key={key}>
                <h1>{key}</h1>
                {Object.keys(reposLang[key]).map(lang => <h3 key={lang}>{lang}</h3>)}
            </div>;
        }

        return Object.keys(reposLang).map(repoAndLang);
        // return reposLang.map(repo => <h1>{repo.name}</h1>)
    }


    render() {
        return <div>
            <label> Enter username
                <input type="text" value={this.state.userName} onChange={this.userInput}/>
            </label>
            <Button onClick={this.fetchReposAPI}>Submit</Button>
            <img src={isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.avatar_url} alt="No Image"/>
            {this.renderRepos(this.state.userRepoWithLang)}
        </div>
    }
}
export default Repos;
export class GitHubSDK {
    // class GitHubSDK {
    constructor(userName, secret = "") {
        this.gitHubAPI = "https://api.github.com";
        this.userName = userName;
        this.secret = secret;
    }
    getOptions(method = "GET", body = {}) {
        const options = {
            method: method,
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
                Accept: 'application/vnd.github.v3+json',
                Authorization: `token ${this.secret}`,
            }
        }
        return options
    }

    fetchData(URL, options = "") {
        return fetch(URL, options)
            .then(resp => {
                if (resp.ok) { return resp.json() }

                if (resp.status === 401) {
                    return Promise.reject(new Error("Unauthorized"))
                }
                if (resp.status === 403) {
                    return Promise.reject(new Error("Forbidden"))
                }
                if (resp.status === 404) {
                    return Promise.reject(new Error("404 Not Found"))
                }
                return Promise.reject(resp)
            })
        // .catch(err => { throw new Error(err) })
        // .catch(err => console.log(new Error(err)))
        // .then(resp => console.log(resp))


    }

    getAuthenticatedUser() {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/user`;
        return this.fetchData(URL, options)
    }

    getUserData() {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/users/${this.userName}`;
        return this.fetchData(URL, options)
    }

    getUserRepos() {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/users/${this.userName}/repos`;
        return this.fetchData(URL, options)
    }

    getUserSpecifiedRepo(repo) {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/repos/${this.userName}/${repo}`;
        return this.fetchData(URL, options)
    }

    getRepoCommits(repo) {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/repos/${this.userName}/${repo}/commits`;
        return this.fetchData(URL, options);
    }

    getRepoSpecifiedCommit(repo = "practice-js-forms", ref = "7b606e9a39e1080e725e522a4b074a7bf22445f6") {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/repos/${this.userName}/${repo}/commits/${ref}`;
        return this.fetchData(URL, options);
    }

    getRepoComments(repo) {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/repos/${this.userName}/${repo}/comments`;
        // const URL = "https://github.com/devmentor-pl/practice-js-api-and-fetch/pull/35"
        return this.fetchData(URL, options);
    }

    getRepoIssues(repo) {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/repos/${this.userName}/${repo}/issues`;
        return this.fetchData(URL, options);
    }

    getRepoEvents(repo) {
        const options = this.getOptions();
        const URL = `${this.gitHubAPI}/repos/${this.userName}/${repo}/events`;
        return this.fetchData(URL, options);
    }

    sendInvitation(repo, collaborator) {
        const body = JSON.stringify({
            permission: 'pull'
        })
        const options = this.getOptions("PUT", body);
        const URL = `${this.gitHubAPI}/repos/${this.userName}/${repo}/collaborators/${collaborator}`;
        return this.fetchData(URL, options);
    }


}

// gitHubSDK.getUserData();
// gitHubSDK.getUserRepos();
// gitHubSDK.getUserRepos("bogolubow");
// gitHubSDK.getUserSpecifiedRepo();
// gitHubSDK.getAuthenticatedUser();
// gitHubSDK.getRepoCommits();
// gitHubSDK.getRepoSpecifiedCommit();

// gitHubSDK.getRepoComments();

// gitHubSDK.getRepoIssues();
// gitHubSDK.getRepoEvents();
// gitHubSDK.sendInvitation("PokeLukas", "bogolubow");

export default GitHubSDK;
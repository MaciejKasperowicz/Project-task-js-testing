import nodeFetch from "node-fetch"; // pobieram paczkę
import dotenv from "dotenv";

import GitHubSDK from "./GitHubSDK";

global.fetch = nodeFetch; // przypisuję do fetch pobraną paczkę, w Node.js global === window
dotenv.config({ path: "./vars/.env" })

describe('GitHubSDK', () => {
    const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

    describe("getOptions", () => {

        it("should return 'GET' method after execute without parameters", () => {
            // expect(gitHubSDK.getOptions()).toBeDefined();
            expect(gitHubSDK.getOptions()["method"]).toContain("GET");
        });

        it("should return 'PUT' method and body object after execute with parameters", () => {
            const body = JSON.stringify({
                permission: 'pull'
            })
            expect(gitHubSDK.getOptions("PUT", body)["method"]).toContain("PUT");
        });
    });



    describe("getAuthenticatedUser", () => {

        it("should return defined data when authorization token works", () => {
            return gitHubSDK.getAuthenticatedUser()
                .then(result => expect(result).toBeDefined());
        });

        it("should return data object when authorization token works", () => {
            return gitHubSDK.getAuthenticatedUser()
                .then(result => expect(typeof result).toBe(typeof {}));
        });

        it("should return defined data when authorization token works, but user isn't set", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);
            const result = await gitHubSDK.getAuthenticatedUser();
            return expect(result).toBeDefined();
        });

        it("should return data object when authorization token works, but user isn't set", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);
            const result = await gitHubSDK.getAuthenticatedUser()
            return expect(typeof result).toBe(typeof {});
        });

        it("should reject (Unauthorized) when user exist but authorization token doesn't work", () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            return expect(gitHubSDK.getAuthenticatedUser())
                .rejects.toThrow("Unauthorized");
        });

    });

    describe("getUserData", () => {

        it("should return defined data when user exists", () => {
            return gitHubSDK.getUserData()
                .then(result => expect(result).toBeDefined())
        });

        it("should return data object when user exists", () => {
            return gitHubSDK.getUserData()
                .then(result => expect(typeof result).toBe(typeof {}))
        });

        it("should reject (404 Not Found)  when user doesn't exist, but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);
            await expect(async () => {
                return gitHubSDK.getUserData();
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (Unauthorized) when user exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getUserData();
            }).rejects.toThrow("Unauthorized");
        });

    });

    describe("getUserRepos", () => {

        it("should return user repos when user exists and authorization token works", async () => {
            // return gitHubSDK.getUserRepos()
            //     .then(result => expect(result).toBeDefined())
            const result = await gitHubSDK.getUserRepos();
            return expect(result).toBeDefined();
        });

        it("should return array of user repos when user exists and authorization token works", async () => {
            // return gitHubSDK.getUserRepos()
            //     .then(result => expect(result).toBeDefined())
            const result = await gitHubSDK.getUserRepos()
            return expect(Array.isArray(result)).toBeTruthy();
        });

        it("should reject (404 Not Found)  when user doesn't exist, but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);
            await expect(async () => {
                return gitHubSDK.getUserRepos();
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (Unauthorized) when user exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getUserRepos();
            }).rejects.toThrow("Unauthorized");
        });

        it("should reject (Unauthorized) when user doesn't exist and authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getUserRepos();
            }).rejects.toThrow("Unauthorized");
        });


    });

    describe("getUserSpecifiedRepo", () => {

        it("should return user specified repo when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getUserSpecifiedRepo("practice-js-forms");
            return expect(result).toBeDefined();

        });

        it("should return data object of user specified repo when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getUserSpecifiedRepo("practice-js-forms");
            return expect(typeof result).toBe(typeof {});

        });

        it("should reject (404 Not Found)  when user doesn't exist, repo doesn't exist but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getUserSpecifiedRepo("no repo");
            }).rejects.toThrow("404 Not Found")
        });

        it("should reject (Unauthorized) when user exists, repo exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getUserSpecifiedRepo("practice-js-forms");
            }).rejects.toThrow("Unauthorized");
        });

        it("should reject (404 Not Found)  when user exist, authorization token works, but repo doesn't exist", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getUserSpecifiedRepo("no repo");
            }).rejects.toThrow("404 Not Found");
        });
    });

    describe("getRepoCommits", () => {

        it("should return repo commits when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoCommits("practice-js-forms")
            return expect(result).toBeDefined();
        });

        it("should return array of repo commits when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoCommits("practice-js-forms")
            return expect(Array.isArray(result)).toBeTruthy();
        });

        it("should reject (404 Not Found)  when user doesn't exist, repo doesn't exist but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoCommits("no repo");
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (Unauthorized) when user exists, repo exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getRepoCommits("practice-js-forms");
            }).rejects.toThrow("Unauthorized");
        });

        it("should reject (404 Not Found)  when user exist, authorization token works, but repo doesn't exist", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoCommits("no repo");
            }).rejects.toThrow("404 Not Found");
        });
    });

    describe("getRepoComments", () => {

        it("should return repo comments when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoComments("PokeLukas")
            return expect(result).toBeDefined();
        });

        it("should return array of repo comments when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoComments("PokeLukas")
            return expect(Array.isArray(result)).toBeTruthy();
        });

        it("should reject (404 Not Found)  when user doesn't exist, repo doesn't exist but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoComments("no repo");
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (Unauthorized) when user exists, repo exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getRepoComments("PokeLukas");
            }).rejects.toThrow("Unauthorized");
        });

        it("should reject (404 Not Found)  when user exist, authorization token works, but repo doesn't exist", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoComments("no repo");
            }).rejects.toThrow("404 Not Found");
        });
    });

    describe("getRepoIssues", () => {

        it("should return repo issues when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoIssues("PokeLukas")
            return expect(result).toBeDefined();
        });

        it("should return array of repo issues when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoIssues("PokeLukas")
            return expect(Array.isArray(result)).toBeTruthy();
            // return expect(result).toEqual({});
        });

        it("should reject (404 Not Found)  when user doesn't exist, repo doesn't exist but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoIssues("no repo");
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (Unauthorized) when user exists, repo exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getRepoIssues("PokeLukas");
            }).rejects.toThrow("Unauthorized");
        });

        it("should reject (404 Not Found)  when user exist, authorization token works, but repo doesn't exist", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoIssues("no repo");
            }).rejects.toThrow("404 Not Found");
        });
    });

    describe("getRepoEvents", () => {

        it("should return repo issues when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoEvents("PokeLukas")
            return expect(result).toBeDefined();
        });

        it("should return array of repo issues when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.getRepoEvents("PokeLukas")
            return expect(Array.isArray(result)).toBeTruthy();
        });

        it("should reject (404 Not Found)  when user doesn't exist, repo doesn't exist but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoEvents("no repo");
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (Unauthorized) when user exists, repo exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.getRepoEvents("PokeLukas");
            }).rejects.toThrow("Unauthorized");
        });

        it("should reject (404 Not Found)  when user exist, authorization token works, but repo doesn't exist", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.getRepoEvents("no repo");
            }).rejects.toThrow("404 Not Found");
        });
    });

    describe("sendInvitation", () => {

        it("should return defined data when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.sendInvitation("PokeLukas", "bogolubow");
            return expect(result).toBeDefined();
        });

        it("should return defined object data when user exists has specified repo and authorization token works", async () => {
            const result = await gitHubSDK.sendInvitation("PokeLukas", "bogolubow");
            return expect(typeof result).toBe(typeof {});
        });

        it("should reject (404 Not Found)  when user doesn't exist, repo doesn't exist but authorization token works", async () => {
            const gitHubSDK = new GitHubSDK(process.env.WRONG_USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.sendInvitation("PokeLukas", "bogolubow");
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (404 Not Found)  when user exists, authorization token works but repo doesn't exist", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.sendInvitation("PokeLuka", "bogolubow");
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (404 Not Found)  when user exists, authorization token works, repo exists, but collaborator doesn't exist", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.SECRET_TOKEN);

            await expect(async () => {
                return gitHubSDK.sendInvitation("PokeLukas", "no collaborator");
            }).rejects.toThrow("404 Not Found");
        });

        it("should reject (Unauthorized) when user exists, repo exists, collaborator exists, but authorization token doesn't work", async () => {
            const gitHubSDK = new GitHubSDK(process.env.USER, process.env.WRONG_TOKEN);
            await expect(async () => {
                return gitHubSDK.sendInvitation("PokeLukas", "bogolubow");
            }).rejects.toThrow("Unauthorized");
        });


    })


});

export class GitHubClient {
    private token: string;
    private repoOwner: string;
    private repoName: string;

    constructor(token: string, repoOwner: string, repoName: string) {
        this.token = token;
        this.repoOwner = repoOwner;
        this.repoName = repoName;
    }

    async getIssues(label: string): Promise<any[]> {
        const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/issues?labels=${label}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching issues: ${response.statusText}`);
        }

        return await response.json();
    }

    async createFile(path: string, content: string): Promise<void> {
        const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `Create file ${path}`,
                content: btoa(content),
                branch: 'main'
            })
        });

        if (!response.ok) {
            throw new Error(`Error creating file: ${response.statusText}`);
        }
    }
}
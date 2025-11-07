class IssueHandler {
    constructor(private githubClient: GitHubClient, private fileOrganizer: FileOrganizer) {}

    async fetchIssues(repo: string, label: string): Promise<Issue[]> {
        return await this.githubClient.getIssues(repo, label);
    }

    async processIssue(issue: Issue): Promise<void> {
        const errorDetails = parseError(issue);
        await this.fileOrganizer.writeFile(issue.title, errorDetails);
    }

    async generateFiles(repo: string, label: string): Promise<void> {
        const issues = await this.fetchIssues(repo, label);
        for (const issue of issues) {
            await this.processIssue(issue);
        }
    }
}
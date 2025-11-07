import { GitHubClient } from './github/githubClient';
import { IssueHandler } from './handlers/issueHandler';
import { FileOrganizer } from './storage/fileOrganizer';

async function run() {
    const githubClient = new GitHubClient();
    const issueHandler = new IssueHandler(githubClient);
    const fileOrganizer = new FileOrganizer();

    try {
        const issues = await issueHandler.fetchIssues();
        for (const issue of issues) {
            const processedData = await issueHandler.processIssue(issue);
            const dateFolder = fileOrganizer.createDateFolder(processedData.date);
            await fileOrganizer.writeFile(dateFolder, processedData.fileName, processedData.content);
        }
    } catch (error) {
        console.error('Error processing issues:', error);
    }
}

run();
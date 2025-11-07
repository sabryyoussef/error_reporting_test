# Convert Issues to Files

This project contains a GitHub Actions workflow that converts GitHub issues (labelled `auto-export` by default) into markdown files organized by date under the `errors/` folder.

How it works (short):

- The workflow `.github/workflows/convert-issues-to-files.yml` runs on issue events, on a schedule, and manually.
- It installs dependencies, runs `node scripts/convert_issues.js` which uses the GitHub API to list issues with the configured labels, then writes files under `errors/YYYY-MM-DD/`.
- The workflow commits and pushes any new/updated files.

Local testing:

1. Create a personal access token with `repo` scope and export it in your shell as `GITHUB_TOKEN`.
2. Install dependencies: `npm ci`.
3. Set `GITHUB_REPOSITORY` to `owner/repo` and optionally `LABELS` to a comma-separated list.
4. Run locally: `node scripts/convert_issues.js`.

Example:

```bash
export GITHUB_TOKEN=ghp_...yourtoken...
export GITHUB_REPOSITORY=sabryyoussef/error_reporting_test
export LABELS=auto-export
npm ci
node scripts/convert_issues.js
```

Note: when running inside GitHub Actions, `GITHUB_TOKEN` and `GITHUB_REPOSITORY` are provided automatically.

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

(async () => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repoFull = process.env.GITHUB_REPOSITORY; // owner/repo
    const labelFilter = process.env.LABELS || 'auto-export';

    if (!token) {
      console.error('GITHUB_TOKEN is not set. Exiting.');
      process.exit(1);
    }
    if (!repoFull) {
      console.error('GITHUB_REPOSITORY is not set. Exiting.');
      process.exit(1);
    }

    const [owner, repo] = repoFull.split('/');
    const octokit = new Octokit({ auth: token });

    console.log(`Listing issues for ${owner}/${repo} with label(s): ${labelFilter}`);

    // Build params for listing issues. If LABELS is empty, don't send the labels param
    const listParams = {
      owner,
      repo,
      state: 'all',
      per_page: 100,
    };
    if (labelFilter) listParams.labels = labelFilter;

    const issues = await octokit.paginate(octokit.issues.listForRepo, listParams);

    console.log(`Found ${issues.length} issue(s) matching labels: ${labelFilter}`);

    const byDate = {};

    for (const issue of issues) {
      // skip pull requests
      if (issue.pull_request) continue;

      const created = new Date(issue.created_at);
      const dateKey = created.toISOString().split('T')[0]; // YYYY-MM-DD
      const dir = path.join(process.cwd(), 'errors', dateKey);
      fs.mkdirSync(dir, { recursive: true });

      const labelNames = (issue.labels || []).map(l => (typeof l === 'string' ? l : l.name)).filter(Boolean);

      const severityCandidates = ['critical', 'error', 'warning', 'info'];
      let severity = 'info';
      for (const s of severityCandidates) {
        if (labelNames.some(n => n.toLowerCase().includes(s))) {
          severity = s;
          break;
        }
      }

      const safeTitle = (issue.title || 'untitled')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 200);

      const filename = `issue_${issue.number}_${severity}_${safeTitle}.md`;
      const filepath = path.join(dir, filename);

      const meta = {
        number: issue.number,
        title: issue.title,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        labels: labelNames,
        url: issue.html_url,
        converted_at: new Date().toISOString(),
      };

      const content = `---\n${Object.entries(meta)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? JSON.stringify(v) : v}`)
        .join('\n')}\n---\n\n# ${issue.title}\n\n${issue.body || ''}\n\n---\nOriginal issue: ${issue.html_url}\n`;

      // Write only if content changed or file missing
      let write = true;
      if (fs.existsSync(filepath)) {
        const existing = fs.readFileSync(filepath, 'utf8');
        if (existing === content) write = false;
      }
      if (write) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Wrote ${filepath}`);
      } else {
        console.log(`Unchanged ${filepath}`);
      }

      if (!byDate[dateKey]) byDate[dateKey] = [];
      byDate[dateKey].push({ number: issue.number, title: issue.title, severity, filename, url: issue.html_url });
    }

    // Create per-date README.md files
    for (const [dateKey, items] of Object.entries(byDate)) {
      const dir = path.join(process.cwd(), 'errors', dateKey);
      const readmePath = path.join(dir, 'README.md');
      const tableRows = items
        .map(it => `| ${it.number} | ${it.severity} | [${it.title}](./${it.filename}) | [issue](${it.url}) |`)
        .join('\n');

      const readmeContent = `# Errors for ${dateKey}\n\nTotal issues: ${items.length}\n\n| Number | Severity | Title | Link |
|---|---:|---|---|
${tableRows}
`;
      fs.writeFileSync(readmePath, readmeContent, 'utf8');
      console.log(`Wrote ${readmePath}`);
    }

    // Create index.md
      // Create index.md (ensure errors/ exists even if there were no matching issues)
      const errorsDir = path.join(process.cwd(), 'errors');
      fs.mkdirSync(errorsDir, { recursive: true });

      const indexPath = path.join(errorsDir, 'index.md');
      const entries = Object.entries(byDate).sort((a, b) => (a[0] < b[0] ? 1 : -1));
      const dateLines = entries
        .map(([dateKey, items]) => `- [${dateKey}](./${dateKey}/) — ${items.length} issue(s)`)
        .join('\\n');
      const total = Object.values(byDate).reduce((s, arr) => s + arr.length, 0);
      const indexContent = `# Error reports\\n\\nGenerated index. Total new/updated exported issues in this run: ${total}\\n\\n${dateLines || 'No issues found.'}\\n`;
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log(`Wrote ${indexPath}`);

    console.log('Done.');
  } catch (err) {
    console.error('Error during conversion:', err);
    process.exit(2);
  }
})();

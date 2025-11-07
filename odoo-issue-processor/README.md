# Odoo Issue Processor

The Odoo Issue Processor is a GitHub Action designed to automatically convert Odoo error issues into organized markdown files and folders within a repository. This project aims to streamline the process of managing Odoo-related issues by categorizing them based on their occurrence date and providing a structured format for easy reference.

## Features

- Automatically triggers on new issues with the `auto-export` label.
- Scheduled execution to process issues at regular intervals.
- Converts issues into markdown files organized by date.
- Easy integration with GitHub repositories.

## Project Structure

```
odoo-issue-processor
├── .github
│   └── workflows
│       └── issue-to-files.yml
├── action.yml
├── src
│   ├── index.ts
│   ├── handlers
│   │   └── issueHandler.ts
│   ├── parsers
│   │   └── odooErrorParser.ts
│   ├── github
│   │   └── githubClient.ts
│   ├── storage
│   │   └── fileOrganizer.ts
│   └── types
│       └── index.ts
├── tests
│   ├── issueHandler.test.ts
│   └── odooErrorParser.test.ts
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd odoo-issue-processor
   ```

2. **Install Dependencies**
   Ensure you have Node.js and npm installed, then run:
   ```bash
   npm install
   ```

3. **Configure GitHub Action**
   Update the `.github/workflows/issue-to-files.yml` file to customize the workflow as needed.

4. **Run Tests**
   To ensure everything is working correctly, run the tests:
   ```bash
   npm test
   ```

## Usage Guidelines

- Label issues with `auto-export` to trigger the action.
- Monitor the repository for generated markdown files in the designated folders.
- Review and manage the generated files as necessary.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
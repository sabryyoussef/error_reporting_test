export function parseError(issue: any): string {
    const errorDetails = issue.body.match(/Error:\s*(.*)/);
    const timestamp = new Date(issue.created_at).toISOString().split('T')[0];
    
    if (errorDetails) {
        return `# Odoo Error Report\n\n## Date: ${timestamp}\n\n## Error Details:\n\n${errorDetails[1]}\n`;
    }
    
    return `# Odoo Error Report\n\n## Date: ${timestamp}\n\n## Error Details:\n\nNo error details found.\n`;
}
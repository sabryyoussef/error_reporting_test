import { parseError } from '../src/parsers/odooErrorParser';

describe('parseError', () => {
    it('should correctly parse a simple error message', () => {
        const issue = {
            title: 'Error: Something went wrong',
            body: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    raise Exception("An error occurred")\nException: An error occurred',
            labels: [{ name: 'auto-export' }],
            created_at: '2023-10-01T12:00:00Z',
        };

        const expectedOutput = {
            title: 'Error: Something went wrong',
            errorDetails: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    raise Exception("An error occurred")\nException: An error occurred',
            date: '2023-10-01',
        };

        expect(parseError(issue)).toEqual(expectedOutput);
    });

    it('should return null for issues without the auto-export label', () => {
        const issue = {
            title: 'Error: Another issue',
            body: 'Some other details',
            labels: [{ name: 'not-auto-export' }],
            created_at: '2023-10-02T12:00:00Z',
        };

        expect(parseError(issue)).toBeNull();
    });

    it('should handle missing fields gracefully', () => {
        const issue = {
            title: 'Error: Missing body',
            labels: [{ name: 'auto-export' }],
            created_at: '2023-10-03T12:00:00Z',
        };

        const expectedOutput = {
            title: 'Error: Missing body',
            errorDetails: '',
            date: '2023-10-03',
        };

        expect(parseError(issue)).toEqual(expectedOutput);
    });
});
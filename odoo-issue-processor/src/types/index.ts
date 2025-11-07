export interface Issue {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    labels: string[];
}

export interface ErrorDetails {
    code: string;
    message: string;
    stackTrace: string;
}

export interface FileMetadata {
    fileName: string;
    date: string;
    issueId: number;
}
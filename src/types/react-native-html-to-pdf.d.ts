declare module 'react-native-html-to-pdf' {
    interface Options {
        html: string;
        fileName?: string;
        directory?: string;
    }

    interface FileInfo {
        filePath: string;
    }

    export function convert(options: Options): Promise<FileInfo>;
} 
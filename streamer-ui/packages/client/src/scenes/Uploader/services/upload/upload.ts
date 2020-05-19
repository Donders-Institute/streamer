import { fetchRetry, basicAuthString } from "../../../../services/fetch/fetch";

import {
    UploadSession,
    ServerResponse,
    Structure,
    RcFile,
    BeginResult,
    ValidateFileResult,
    ValidationResult,
    AddFileResult,
    FinalizeResult,
    SubmitResult
} from "../../../../types/types";

// 1 GB = 1024 * 1024 * 1024 bytes = 1073741824 bytes
export const maxSizeLimitBytes = 1073741824;
export const maxSizeLimitAsString = "1 GB";

export const shortTimeout = 2000; // ms

// 5 minutes = 5 * 60 * 1000 ms = 300000 ms
export const uploadTimeout = 300000; // ms

const uploadNumRetries = 1;

export function detectFile(file: RcFile) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadstart = () => {
            // is file
            resolve(true);
        };
        reader.onerror = (e) => {
            // is directory
            resolve(false);
        };
        reader.readAsArrayBuffer(file);
    });
};

// Start an upload session. Obtain the upload session id
export async function begin(
    username: string,
    password: string,
    projectNumber: string,
    subjectLabel: string,
    sessionLabel: string,
    dataType: string
) {
    const headers = new Headers(
        {
            'Content-Type': 'application/json',
            'Authorization': basicAuthString({ username, password })
        }
    );

    const structure = {
        projectNumber,
        subjectLabel,
        sessionLabel,
        dataType
    } as Structure

    const body = JSON.stringify(structure);

    let result: ServerResponse;
    try {
        result = await fetchRetry({
            url: "/upload/begin",
            options: {
                method: 'POST',
                credentials: 'include',
                headers,
                body
            } as RequestInit,
            numRetries: uploadNumRetries,
            timeout: shortTimeout
        });
    } catch (err) {
        throw err;
    }

    // Double check result for errors
    if (result.error) {
        const errorMessage = result.error as string;
        throw new Error(errorMessage);
    }

    if (!result.data) {
        const errorMessage = "data is empty in result";
        throw new Error(errorMessage);
    }

    const beginResult = result.data as BeginResult;

    // Obtain the upload session id
    const uploadSessionId = beginResult.uploadSessionId;
    return uploadSessionId;
};

export async function initiate(
    username: string,
    password: string,
    projectNumber: string,
    subjectLabel: string,
    sessionLabel: string,
    dataType: string,
    fileList: RcFile[]
) {
    // Obtain the upload session id
    let uploadSessionId: number;
    try {
        uploadSessionId = await begin(
            username,
            password,
            projectNumber,
            subjectLabel,
            sessionLabel,
            dataType);
    } catch (err) {
        throw err;
    }

    // Derive the total size of the files to be uploaded in bytes
    let totalSizeBytes = 0;
    fileList.forEach((file: RcFile) => {
        totalSizeBytes += file.size;
    });

    const uploadSession = {
        uploadSessionId,
        username,
        projectNumber,
        subjectLabel,
        sessionLabel,
        dataType,
        totalSizeBytes
    } as UploadSession;

    return uploadSession;
};

// Create form data from the upload session data and file
function getFormData(uploadSession: UploadSession, file: RcFile, fileFieldName: string) {
    let formData = new FormData();
    formData.append("uploadSessionId", uploadSession.uploadSessionId.toString());
    formData.append("projectNumber", uploadSession.projectNumber);
    formData.append("subjectLabel", uploadSession.subjectLabel);
    formData.append("sessionLabel", uploadSession.sessionLabel);
    formData.append("dataType", uploadSession.dataType);

    formData.append("filename", file.name);
    formData.append("fileSizeBytes", file.size.toString());

    formData.append(fileFieldName, file);

    return formData;
};

// Validate a single file to be uploaded
async function validateFile(
    username: string,
    password: string,
    uploadSession: UploadSession,
    file: RcFile
) {
    // Do not set Content-Type here to make it work
    // (i.e. we do not know boundary for multipart/form-data)
    const headers = new Headers(
        {
            'Authorization': basicAuthString({ username, password })
        }
    );

    const formData = getFormData(uploadSession, file, "validatefile");

    let result: ServerResponse;
    try {
        result = await fetchRetry({
            url: "/upload/validatefile",
            options: {
                method: 'POST',
                credentials: 'include',
                headers,
                body: formData
            } as RequestInit,
            numRetries: uploadNumRetries,
            timeout: uploadTimeout
        });
    } catch (err) {
        throw err;
    }

    // Double check result for errors
    if (result.error) {
        const errorMessage = result.error as string;
        throw new Error(errorMessage);
    }

    if (!result.data) {
        const errorMessage = "data is empty in result";
        throw new Error(errorMessage);
    }

    const validateFileResult = result.data as ValidateFileResult;
    return validateFileResult;
};

// Check for existing project storage folder and existing files
export async function validate(
    username: string,
    password: string,
    uploadSession: UploadSession,
    fileList: RcFile[]
) {
    let existingFiles = [] as string[];
    let emptyFiles = [] as string[];
    let validatedFiles = [] as ValidateFileResult[];

    fileList.forEach(async (file: RcFile) => {
        const filename = file.name as string;

        let validateFileResult: ValidateFileResult;
        try {
            validateFileResult = await validateFile(
                username,
                password,
                uploadSession,
                file);
        } catch (err) {
            throw err;
        }

        // Gather existing files
        if (validateFileResult.fileExists) {
            existingFiles.push(filename);
        }

        // Gather empty files
        if (validateFileResult.fileIsEmpty) {
            emptyFiles.push(filename);
        }

        // Gather validated files
        validatedFiles.push(validateFileResult);
    });

    const validationResult = {
        existingFiles,
        emptyFiles,
        validatedFiles
    } as ValidationResult;
    return validationResult;
};

// Add a file to be uploaded
export async function addFile(
    username: string,
    password: string,
    uploadSession: UploadSession,
    file: RcFile
) {
    // Do not set Content-Type here to make it work 
    // (i.e. we do not know boundary for multipart/form-data)
    const headers = new Headers(
        {
            'Authorization': basicAuthString({ username, password })
        }
    );

    const formData = getFormData(uploadSession, file, "addfile");

    let result: ServerResponse;
    try {
        result = await fetchRetry({
            url: "/upload/addfile",
            options: {
                method: 'POST',
                credentials: 'include',
                headers,
                body: formData
            } as RequestInit,
            numRetries: uploadNumRetries,
            timeout: uploadTimeout
        });
    } catch (err) {
        throw err;
    }

    // Double check result for errors
    if (result.error) {
        const errorMessage = result.error as string;
        throw new Error(errorMessage);
    }

    if (!result.data) {
        const errorMessage = "data is empty in result";
        throw new Error(errorMessage);
    }

    const addFileResult = result.data as AddFileResult;
    return addFileResult;
};

// Finalize the upload session
export async function finalize(
    username: string,
    password: string,
    uploadSession: UploadSession
) {
    const headers = new Headers(
        {
            'Content-Type': 'application/json',
            'Authorization': basicAuthString({ username, password })
        }
    );

    const body = JSON.stringify({
        uploadSessionId: uploadSession.uploadSessionId,
        projectNumber: uploadSession.projectNumber,
        subjectLabel: uploadSession.subjectLabel,
        sessionLabel: uploadSession.sessionLabel,
        dataType: uploadSession.dataType
    });

    let result: ServerResponse;
    try {
        result = await fetchRetry({
            url: "/upload/finalize",
            options: {
                method: 'POST',
                credentials: 'include',
                headers,
                body
            } as RequestInit,
            numRetries: uploadNumRetries,
            timeout: shortTimeout
        });
    } catch (err) {
        throw err;
    }

    // Double check result for errors
    if (result.error) {
        const errorMessage = result.error as string;
        throw new Error(errorMessage);
    }

    if (!result.data) {
        const errorMessage = "data is empty in result";
        throw new Error(errorMessage);
    }

    const finalizeResult = result.data as FinalizeResult;
    return finalizeResult;
};

// Finally, submit a streamer job
export async function submit(
    username: string,
    password: string,
    uploadSession: UploadSession
) {
    const headers = new Headers(
        {
            'Content-Type': 'application/json',
            'Authorization': basicAuthString({ username, password })
        }
    );

    const body = JSON.stringify({
        uploadSessionId: uploadSession.uploadSessionId,
        projectNumber: uploadSession.projectNumber,
        subjectLabel: uploadSession.subjectLabel,
        sessionLabel: uploadSession.sessionLabel,
        dataType: uploadSession.dataType
    });

    let result: ServerResponse;
    try {
        result = await fetchRetry({
            url: "/upload/submit",
            options: {
                method: 'POST',
                credentials: 'include',
                headers,
                body
            } as RequestInit,
            numRetries: uploadNumRetries,
            timeout: uploadTimeout
        });
    } catch (err) {
        throw err;
    }

    // Double check result for errors
    if (result.error) {
        const errorMessage = result.error as string;
        throw new Error(errorMessage);
    }

    if (!result.data) {
        const errorMessage = "data is empty in result";
        throw new Error(errorMessage);
    }

    const submitResult = result.data as SubmitResult;
    return submitResult;
};
import { WrappedFormUtils } from "antd/lib/form/Form";

// Possible login statuses
export enum LoginStatus {
    NotLoggedIn = "NotLoggedIn",
    LoggingIn = "LoggingIn",
    LoggedIn = "LoggedIn",
    LoggingOut = "LoggingOut",
    LoggingError = " LoggingError"
};

export type UserProfile = {
    username: string;
    displayName: string | null;
    password: string;
    isAuthenticated: boolean;
};

// Get projects query element
export interface ProjectsResultElement {
    project: string;
};

// Get projects query result
export type ProjectsResult = ProjectsResultElement[];

export interface FilesSelection {
    fileList: RcFile[];
    totalSizeBytes: number;
    hasFilesSelected: boolean; 
};

export interface BeginResult {
    uploadSessionId: number;
    username: string;
    ipAddress: string;
    projectNumber: string;
    subjectLabel: string;
    sessionLabel: string;
    dataType: string;
    startTime: string;
};

export interface ValidateFileResult {
    filename: string;
    fileExists: boolean;
    fileIsEmpty: boolean;
};

export interface AddFileResult {
    uploadFileId: number;
};

export interface FinalizeResult {
    uploadSessionId: number;
    endTime: string;
};

export interface SubmitResult {
    uploadSessionId: number;
    fileNames: string[];
};

export interface ServerResponse {
    error: string | null;
    data: string | BeginResult | ProjectsResult | ValidateFileResult | AddFileResult | FinalizeResult | SubmitResult | null;
};

export interface ValidationResult {
    existingFiles: string[];
    emptyFiles: string[];
    validatedFiles: ValidateFileResult[];
};

export interface RcFile extends File {
    uid: string;
    readonly lastModifiedDate: Date;
    readonly webkitRelativePath: string;
};

export interface Project {
    projectNumber: string;
};

export type SelectOption = {
    key: string;
};

export declare const InputValidationStatuses: [
    "success", 
    "warning", 
    "error", 
    "validating", 
    ""
];

export interface InputVariable {
    value: string;
    status: (typeof InputValidationStatuses)[number];
    isSelected: boolean;
};

export interface FormInputConfig {
    name: string;
    value: string;
    validateStatus: (typeof InputValidationStatuses)[number];
    label: string;
    help: string;
    message: string;
    placeholder: string;
    validator: (rule: any, value: string, callback: any) => void;
    handleChange: (value: string) => void;
    disable: boolean;  // Grey out input box or not
    show: boolean; // Display the input component or not
    inputStyle: React.CSSProperties | undefined;
    labelStyle: React.CSSProperties | undefined;
    helpStyle: React.CSSProperties | undefined;
    form: WrappedFormUtils<any>;
};

export interface FormSelectConfig {
    options: string[],
    option: string,
    optionNotSelected: string;
    validateStatus: (typeof InputValidationStatuses)[number];
    label: string;
    help: string;
    handleSelect: (value: string) => void;
    disable: boolean; // Grey out select box or not
    show: boolean; // Display the select component or not
    selectStyle: React.CSSProperties | undefined;
    labelStyle: React.CSSProperties | undefined;
    helpStyle: React.CSSProperties | undefined;
};

export interface StructureSelection {
    projectNumberInput: InputVariable;
    subjectLabelInput: InputVariable;
    sessionLabelInput: InputVariable;
    dataTypeInput: InputVariable;
    dataTypeOtherInput: InputVariable;
};

// Possible upload statuses
export enum UploadStatus {
    NotUploading = "NotUploading",
    Selecting = "Selecting",
    Initiating = "Initiating",
    Validating = "Validating",
    Confirming = "Confirming",
    Uploading = "Uploading",
    Finalizing = "Finalizing",
    Submitting = "Submitting",
    Success = "Success",
    Error = " Error"
};

export interface UploadState {
    userProfile: UserProfile,
    uploadSessionId: number,
    structureSelection: StructureSelection,
    filesSelection: FilesSelection,
    isValidSelection: boolean,
    numRemainingFiles: number;
    percentage: number,
    status: UploadStatus;
};

export enum UploadActionType {
    Reset = "Reset",
    Select = "Select",
    Initiate = "Initiate",
    Validate = "Validate",
    Confirm = "Confirm",
    Upload = "Upload",
    Finalize = "Finalize",
    Submit = "Submit",
    Finish = "Finish",
    Error = "Error"
};

export interface UploadAction {
    type: UploadActionType;
    payload: UploadState;
};

export const initialUserProfile = {
    username: "",
    displayName: null as string| null,
    password: "",
    isAuthenticated: false
}as UserProfile;

export const initialFilesSelection = {
    fileList: [] as RcFile[],
    totalSizeBytes: 0,
    hasFilesSelected: false
} as FilesSelection;

export const initialInputVariable = {
    value: "",
    status: "" as (typeof InputValidationStatuses)[number],
    isSelected: false
} as InputVariable;

export const initialStructureSelection = {
    projectNumberInput: {...initialInputVariable},
    subjectLabelInput: {...initialInputVariable},
    sessionLabelInput: {...initialInputVariable},
    dataTypeInput: {...initialInputVariable},
    dataTypeOtherInput: {...initialInputVariable}
} as StructureSelection;

export const initialUploadState = {
    uploadSessionId: -1,
    filesSelection: { ...initialFilesSelection},
    structureSelection: {...initialStructureSelection},
    isValidSelection: false,
    numRemainingFiles: 0,
    percentage: 0,
    status: UploadStatus.NotUploading
} as UploadState;

// Possible error types
export enum ErrorType {
    NoError = "NoError",
    ErrorSignIn = "ErrorSignIn",
    ErrorSignOut = "ErrorSignOut",
    ErrorLoadingProjectList = "ErrorLoadingProjectList",
    ErrorSelect = "ErrorSelect",
    ErrorInitiateUpload = "ErrorInitiateUpload",
    ErrorValidateUpload = "ErrorValidateUpload",
    ErrorConfirmUpload = "ErrorConfirmUpload",
    ErrorUpload = "ErrorUpload",
    ErrorFinalizeUpload = "ErrorFinalizeUpload",
    ErrorSubmit = "ErrorSubmit",
    ErrorFinish = "ErrorFinish",
    ErrorUnknown = "ErrorUnknown"
};

export interface ErrorState {
    errorType: ErrorType;
    errorMessage: string;
};

export interface ErrorAction {
    type: ErrorType;
    payload: ErrorState;
};

export const initialErrorState = {
    errorType: ErrorType.NoError,
    errorMessage: ""
} as ErrorState;

// Auth
export interface AuthState {
    userProfile: UserProfile;
    status: LoginStatus;
    isAuthenticated: boolean;
};

export enum AuthActionType {
    NotSignedIn = "NotSignedIn",
    SigningIn = "SigningIn",
    SignedIn = "SignedIn",
    SigningOut = "SigningOut",
    Error = "Error"
};

export interface AuthAction {
    type: AuthActionType;
    payload: AuthState;
};

export const initialAuthState = {
    userProfile: {...initialUserProfile},
    status: LoginStatus.NotLoggedIn,
    isAuthenticated: false
} as AuthState;

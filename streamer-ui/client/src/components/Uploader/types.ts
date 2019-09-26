export interface RcFile extends File {
    uid: string;
    readonly lastModifiedDate: Date;
    readonly webkitRelativePath: string;
}

export interface Project {
    id: number;
    number: string;
}

export type SelectOption = {
    key: string;
}
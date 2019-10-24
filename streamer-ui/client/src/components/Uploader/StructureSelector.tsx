import React from "react";
import {
    Select,
    Form,
    Row,
    Col,
    Input
} from "antd";
import { FormComponentProps } from "antd/lib/form";
import { Project, SelectOption, ValidateStatuses } from "./types";
import { validateSubjectLabelInput, validateSessionLabelInput, validateSelectedDataTypeOtherInput } from "./utils";

const { Option } = Select;

interface IProps {
    projectList: Project[];
    selectedProjectStatus: (typeof ValidateStatuses)[number];
    selectedSubjectStatus: (typeof ValidateStatuses)[number];
    selectedSessionStatus: (typeof ValidateStatuses)[number];
    selectedDataTypeStatus: (typeof ValidateStatuses)[number];
    selectedDataTypeOtherStatus: (typeof ValidateStatuses)[number];
    isSelectedProject: boolean;
    projectNumber: string;
    isSelectedSubject: boolean;
    subjectLabel: string;
    isSelectedSession: boolean;
    isSelectedDataType: boolean;
    isSelectedDataTypeOther: boolean;
    dataType: string;
    sessionLabel: string;
    handleSelectProjectValue: (value: SelectOption) => void;
    handleChangeSubjectLabel: (event: any) => void;
    handleChangeSessionLabel: (event: any) => void;
    handleSelectDataTypeValue: (value: SelectOption) => void;
    handleChangeSelectedDataTypeOther: (event: any) => void;
}

const dataTypesList = [
    {
        id: 1,
        dataType: "mri"
    },
    {
        id: 2,
        dataType: "meg"
    },
    {
        id: 3,
        dataType: "eeg"
    },
    {
        id: 4,
        dataType: "ieeg"
    },
    {
        id: 5,
        dataType: "beh"
    },
    {
        id: 6,
        dataType: "other"
    }
];

const StructureSelectorForm: React.FC<IProps & FormComponentProps> = (
    {
        form,
        projectList,
        selectedProjectStatus,
        selectedSubjectStatus,
        selectedSessionStatus,
        selectedDataTypeStatus,
        selectedDataTypeOtherStatus,
        isSelectedProject,
        projectNumber,
        isSelectedSubject,
        subjectLabel,
        isSelectedSession,
        isSelectedDataType,
        isSelectedDataTypeOther,
        dataType,
        sessionLabel,
        handleSelectProjectValue,
        handleChangeSubjectLabel,
        handleChangeSessionLabel,
        handleSelectDataTypeValue,
        handleChangeSelectedDataTypeOther
    }) => {
    const { getFieldDecorator } = form;

    const defaultEmpty: SelectOption = { key: "" };

    const optionsProjects = projectList.map((project, key) => (
        <Option value={project.number}>{project.number}</Option>
    ));

    const optionsDataTypes = dataTypesList.map((item, key) => (
        <Option value={item.dataType}>{item.dataType}</Option>
    ));

    const validateSubjectLabel = async (rule: any, value: string) => {
        let isValid = validateSubjectLabelInput(value);
        if (!isValid) {
            throw new Error(`Should be combination of numbers and alphabets with no special characters. Examples: '1', 'mri02'`);
        }
    };

    const validateSessionLabel = async (rule: any, value: string) => {
        let isValid = validateSessionLabelInput(value);
        if (!isValid) {
            throw new Error(`Should be combination of numbers and alphabets with no special characters. Examples: '1', 'mri02'`);
        }
    };

    const validateDataTypeOther = async (rule: any, value: string) => {
        let isValid = validateSelectedDataTypeOtherInput(value);
        if (!isValid) {
            throw new Error(`Should be lower case string with no special characters. Examples: eyelink', 'test'`);
        }
    };

    return (
        <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={<span style={{ fontWeight: "bold" }}>Select project</span>}
                        hasFeedback
                        validateStatus={selectedProjectStatus}
                        help={<span style={{ fontStyle: "italic" }}>Select project for which you are manager or contributor.</span>}
                    >
                        <Select
                            labelInValue
                            defaultValue={defaultEmpty}
                            placeholder="Select project"
                            onSelect={handleSelectProjectValue}
                            style={{ width: "400px" }}
                        >
                            {optionsProjects}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}></Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={<span style={{ fontWeight: "bold" }}>Set subject label</span>}
                        hasFeedback
                        validateStatus={selectedSubjectStatus}
                        help={<span style={{ fontStyle: "italic" }}>Should be combination of numbers and alphabets with no special characters. Examples: 1, test042</span>}
                    >
                        {getFieldDecorator("subjectlabel", {
                            rules: [
                                { required: true, message: "Please input your subject label" },
                                { validator: validateSubjectLabel }
                            ]
                        })(
                            <Input
                                placeholder="Set subject label"
                                onChange={handleChangeSubjectLabel}
                                style={{ width: "400px" }}
                                disabled={!isSelectedProject}
                            />,
                        )}
                    </Form.Item>
                </Col>
                <Col span={12}></Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={<span style={{ fontWeight: "bold" }}>Set session label</span>}
                        hasFeedback
                        validateStatus={selectedSessionStatus}
                        help={<span style={{ fontStyle: "italic" }}>Should be combination of numbers and alphabets with no special characters. Examples: 1, mri02</span>}
                    >
                        {getFieldDecorator("sessionlabel", {
                            rules: [
                                { required: true, message: "Please input your session label" },
                                { validator: validateSessionLabel }
                            ]
                        })(
                            <Input
                                placeholder="Set session label"
                                onChange={handleChangeSessionLabel}
                                style={{ width: "400px" }}
                                disabled={!isSelectedProject}
                            />,
                        )}
                    </Form.Item>
                </Col>
                <Col span={12}></Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label={<span style={{ fontWeight: "bold" }}>Select data type</span>}
                        hasFeedback
                        validateStatus={selectedDataTypeStatus}
                        help=""
                    >
                        <Select
                            labelInValue
                            defaultValue={defaultEmpty}
                            placeholder="Select data type"
                            onSelect={handleSelectDataTypeValue}
                            style={{ width: "400px" }}
                            disabled={!isSelectedProject}
                        >
                            {optionsDataTypes}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}></Col>
            </Row>

            {isSelectedDataTypeOther && (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Set data type other"
                            hasFeedback
                            validateStatus={selectedDataTypeOtherStatus}
                            help="Should be lower case string with no special characters. Examples: eyelink', 'test'"
                        >
                            {getFieldDecorator("datatypeother", {
                                rules: [
                                    { required: true, message: "Please input your other data type" },
                                    { validator: validateDataTypeOther }
                                ]
                            })(
                                <Input
                                    placeholder="Insert other data type"
                                    onChange={handleChangeSelectedDataTypeOther}
                                    style={{ width: "400px" }}
                                    disabled={!isSelectedProject}
                                />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}></Col>

                </Row>
            )}
        </Form>
    );
};

const StructureSelector = Form.create<IProps & FormComponentProps>()(StructureSelectorForm);

export default StructureSelector;

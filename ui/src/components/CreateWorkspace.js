import React, {useState} from "react";
import {Button, Form, PageHeader, Select, Slider, Switch} from "antd";
import {useHistory} from "react-router";
import NavBar from "./NavBar";


export default function CreateWorkspace() {
    const [current, setCurrent] = useState("workspace")
    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    const history = useHistory();
    return (
        <div>
            <div style={{marginLeft: "30px", marginRight: "30px", marginTop: "30px"}}>
                <PageHeader
                    className="site-page-header"
                    onBack={() => history.push("/")}
                    title="Create Workspace"
                    subTitle="Create new Deployment Workspace"
                />
                <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={onFinish}
                >
                    <Form.Item name="switch" label="Switch" valuePropName="checked">
                        <Switch/>
                    </Form.Item>
                    <Form.Item
                        name="provider"
                        label="Provider"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please select your Provider!',
                            },
                        ]}
                    >
                        <Select placeholder="Please select a provider">
                            <Select.Option value="aws">AWS</Select.Option>
                            <Select.Option value="azure">Azure</Select.Option>
                            <Select.Option value="gcp">GCP</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="region"
                        label="Region"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please select your Region!',
                            },
                        ]}
                    >
                        <Select placeholder="Please select a country">
                            <Select.Option value="us-east-2">Ohio</Select.Option>
                            <Select.Option value="us-east-1">Virginia</Select.Option>
                            <Select.Option value="ap-southeast-1">Singapore</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name=" nodes" label="Nodes">
                        <Slider
                            marks={{
                                0: '0 Nodes',
                                20: '20 Nodes',
                                40: '40 Nodes',
                                60: '60 Nodes',
                                80: '80 Nodes',
                                100: '100 Nodes',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            span: 12,
                            offset: 6,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

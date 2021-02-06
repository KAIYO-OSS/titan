import React, {useEffect} from "react";
import {Button, Checkbox, Col, Form, Input, Row} from "antd";
import {useHistory} from "react-router";


export default function Login() {

    const history = useHistory();
    useEffect(() => {
        if (localStorage.getItem("x-kaiyo-token") !== null) {
            history.push("/")
        }
    }, [])

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };
    const onFinish = (values) => {
        console.log('Success:', values);
        localStorage.setItem("x-kaiyo-token", "adas")
        history.push("/")
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Row>
            <Col span={8}>
                <div style={{paddingTop : "30vh", margin: "auto", width : "55%"}}>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="Email Address"
                            name="email_address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email address!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="ACL Token"
                            name="token"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your token!',
                                },
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
            <Col style={{backgroundColor: "#f7f7f7", minHeight: "100vh"}} span={16}>

            </Col>
        </Row>
    )
}
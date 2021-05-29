import React from 'react';
import NavbarComponent from "./Navbar";
import Editor from "@monaco-editor/react";
import {Col, Collapse, Row, Statistic} from "antd";

export default function ServiceDetail() {

    const code = ""
    return (
        <div style={{backgroundColor: 'white', minHeight: '100vh'}}>
            <NavbarComponent/>
            <div style={{margin : '3% 3%'}}>
                <Collapse defaultActiveKey={['1']}>
                    <Collapse.Panel header="Current Service stats" key="1">
                        <Row gutter={16}>
                            <Col span={6}>
                                <Statistic title="Current Deployed Version" value={"1.0.1"}/>
                            </Col>
                            <Col span={6}>
                                <Statistic title="Service Name" value={93}/>
                            </Col>
                            <Col span={6}>
                                <Statistic title="last deployed By" value={"test name"}/>
                            </Col>
                            <Col span={6}>
                                <Statistic title="last deployed time" value={"time"}/>
                            </Col>
                        </Row>
                    </Collapse.Panel>
                    <Collapse.Panel header="Service values" key="2">
                        <Editor
                            height="50vh"
                            defaultLanguage="yaml"
                            defaultValue="// some comment"
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Rollbacks and deployments" key="3">
                        <p>soon to be</p>
                    </Collapse.Panel>
                </Collapse>
            </div>
        </div>
    );
}

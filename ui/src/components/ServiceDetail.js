import React, {useEffect, useState} from 'react';
import NavbarComponent from "./Navbar";
import Editor from "@monaco-editor/react";
import {Col, Collapse, Row, Statistic} from "antd";
import {getServiceDetails} from "../apis/titan";

export default function ServiceDetail() {

    const [data, setData] = useState({})
    useEffect(() => {
        let p = window.location.href.split("/")
        getServiceDetails(p[p.length-1]).then(r => {
            setData(r.msg.metadata)
        })
    }, [])
    return (
        <div style={{backgroundColor: 'white', minHeight: '100vh'}}>
            <NavbarComponent/>
            <div style={{margin : '3% 3%'}}>
                <Collapse defaultActiveKey={['1']}>
                    <Collapse.Panel header="Current Service stats" key="1">
                        <Row gutter={16}>
                            <Col span={4}>
                                <Statistic title="Current Deployed Version" value={data.version}/>
                            </Col>
                            <Col span={4}>
                                <Statistic title="Service Name" value={data.name}/>
                            </Col>
                            <Col span={4}>
                                <Statistic title="first deployed time" value={data.info.first_deployed}/>
                            </Col>
                            <Col span={4}>
                                <Statistic title="last deployed time" value={data.info.last_deployed}/>
                            </Col>
                            <Col span={4}>
                                <Statistic title="Status" value={data.status}/>
                            </Col>
                        </Row>
                    </Collapse.Panel>
                    <Collapse.Panel header="Service values" key="2">
                        <Editor
                            height="50vh"
                            defaultLanguage="yaml"
                            defaultValue="// some comment"
                            code={data.manifest}
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

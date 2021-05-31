import React, {useEffect, useState} from 'react';
import NavbarComponent from "./Navbar";
import Editor from "@monaco-editor/react";
import {Col, Collapse, Row, Spin, Statistic} from "antd";
import {getServiceDetails} from "../apis/titan";
import {useHistory} from "react-router";

export default function ServiceDetail() {

    const history = useHistory();

    const getDate = (date) => {
        var dateParsed = new Date(Date.parse(date.toString()))
        return dateParsed.getDay() + "/" + dateParsed.getMonth() + "/" + dateParsed.getFullYear() + "-" + dateParsed.getHours() + ":" + dateParsed.getUTCMinutes();
    }
    const [data, setData] = useState({info: {first_deployed: "-", last_deployed: "-"}, manifest: ""})
    const [spinner, setSpinner] = useState(true)
    useEffect(() => {
        let p = window.location.href.split("/")
        getServiceDetails(p[p.length - 1]).then(r => {
            try {
                setData(r.msg.metadata)
                setSpinner(false)
            } catch (e) {
                history.push("/")
            }
        })
    }, [])

    return (
        <div style={{backgroundColor: 'white', minHeight: '100vh'}}>
            <NavbarComponent/>
            <div style={{margin: '3% 3%'}}>
                <Collapse defaultActiveKey={['1']}>
                    <Collapse.Panel header="Current Service stats" key="1">
                        <Spin spinning={spinner}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Statistic title="Current Deployed Version" value={data.version}/>
                                </Col>
                                <Col span={6}>
                                    <Statistic title="Service Name" value={data.name}/>
                                </Col>
                                <Col span={6}>
                                    <Statistic title="first deployed time" value={getDate(data.info.first_deployed)}
                                               valueStyle={{fontSize: '1.2rem'}}/>
                                </Col>
                                <Col span={6}>
                                    <Statistic title="last deployed time" value={getDate(data.info.last_deployed)}
                                               valueStyle={{fontSize: '1.2rem'}}/>
                                </Col>
                            </Row>
                        </Spin>
                    </Collapse.Panel>
                    <Collapse.Panel header="Service values" key="2">
                        <Spin spinning={spinner}>
                            <Editor
                                height="50vh"
                                defaultLanguage="yaml"
                                defaultValue={data.manifest}
                                code={data.manifest}
                            />
                        </Spin>
                    </Collapse.Panel>
                    <Collapse.Panel header="Rollbacks and deployments" key="3">
                        <p>soon to be</p>
                    </Collapse.Panel>
                </Collapse>
            </div>
        </div>
    );
}

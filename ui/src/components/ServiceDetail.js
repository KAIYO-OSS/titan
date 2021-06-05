import Editor from "@monaco-editor/react";
import { Col, Collapse, Row, Spin, Statistic } from "antd";
import React, { useEffect, useState } from 'react';
import { Table } from "react-bootstrap";
import { useHistory } from "react-router";
import { getServiceDetails } from "../apis/titan";
import NavbarComponent from "./Navbar";

export default function ServiceDetail() {

    const history = useHistory();

    const getDate = (date) => {
        var dateParsed = new Date(Date.parse(date.toString()))
        return dateParsed.getDay() + "/" + dateParsed.getMonth() + "/" + dateParsed.getFullYear() + "-" + dateParsed.getHours() + ":" + dateParsed.getUTCMinutes();
    }
    const [data, setData] = useState({info: {first_deployed: "-", last_deployed: "-"}, manifest: ""})
    const [revisions, setRevisions] = useState([])
    const [value, setValue] = useState("")
    const [spinner, setSpinner] = useState(true)
    useEffect(() => {
        let p = window.location.href.split("/")
        getServiceDetails(p[p.length - 1]).then(r => {
            try {
                setData(r.msg.metadata)
                setValue(r.msg.values)
                setRevisions(r.msg.revisions.reverse())
                setSpinner(false)
                console.log(r.msg.values)
            } catch (e) {
                history.push("/")
            }
        })
    }, [])

    return (
        <div style={{backgroundColor: 'white', minHeight: '100vh'}}>
            <NavbarComponent/>
            <div style={{margin: '3% 3%'}}>
            <Spin spinning={spinner}>
                <Collapse defaultActiveKey={['1']}>
                    <Collapse.Panel header="Current Service stats" key="1">
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
                    </Collapse.Panel>
                    <Collapse.Panel header="Service values" key="2">
                            <Editor
                                height="50vh"
                                defaultLanguage="yaml"
                                defaultValue={value}
                                code={value}
                            />
                    </Collapse.Panel>
                    <Collapse.Panel header="Rollbacks and deployments" key="3">
                    <Table striped bordered hover>
                    <thead>
                            <tr>
                            <th>Revision number</th>
                            <th>Chart</th>
                            <th>App version</th>
                            <th>Updated at</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {revisions.map((e, key) => {
                                return <tr>
                                    <td>{e.revision}</td>
                                    <td>{e.chart}</td>
                                    <td>{e.app_version}</td>
                                    <td>{e.updated}</td>
                                    <td>{e.status}</td>
                                </tr>;
                            })}
                        </tbody>
                    </Table>
                    </Collapse.Panel>
                </Collapse>
                </Spin>
            </div>
        </div>
    );
}

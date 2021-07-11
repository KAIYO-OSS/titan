import React, {useEffect, useState} from "react";
import {Button, Divider, Input, List, Spin, Tag} from "antd";
import {Card} from "react-bootstrap";
import {useHistory} from "react-router";
import {listAllServices} from "../apis/titan";


export default function Service() {

    const history = useHistory();
    const [data, setData] = useState([]);
    const [services, setService] = useState(data)
    const [defaultServices, DefaultSetService] = useState(data)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        listAllServices().then(res => {
            setData(res.metadata)
            console.log(res.metadata)
            setService(res.metadata)
            DefaultSetService(res.metadata)
            setLoader(false)
        })
    }, [])

    const searchService = (text, data) => {
        var out = []
        for (var i = 0; i < defaultServices.length; i++) {
            debugger
            console.log(data[i].name.toLowerCase().includes(text))
            if (data[i].name.toLowerCase().includes(text)) out.push(data[i])
        }
        setService(out)
    }

    const search = (e) => {
        console.log(e.target.value)
        searchService(e.target.value, defaultServices)
    }

    return (
        <div style={{margin: "1% 1%"}}>

            <div style={{backgroundColor: "#f7f7f7", minHeight: "60px", marginTop: "2px", marginBottom: "25px"}}>
                <Input style={{
                    maxWidth: "300px",
                    marginTop: "10px",
                    float: "right",
                    marginRight: "10px",
                    minHeight: '40px'
                }} placeholder="Search Service"
                       onChange={search}/>
            </div>
            <Spin size="large" spinning={loader}>
                <List
                    grid={{gutter: 16, column: 4, xs: 1, sm: 2, md: 3}}
                    dataSource={services}
                    renderItem={item => (
                        <List.Item>
                            <Card style={{width: '18rem'}}>
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        <Tag color="magenta">{item.namespace}</Tag>
                                        <Tag color="blue">{item.app_version}</Tag>
                                        <Tag color="green">{item.status}</Tag>
                                        <Divider />
                                    </Card.Text>
                                    <Button onClick={() => {
                                        history.push("/service/"  + item.name)
                                    }}>View</Button>
                                </Card.Body>
                            </Card>
                        </List.Item>
                    )}
                />
            </Spin>
        </div>
    )
}

import React, {useState} from "react";
import {Button, Input, List} from "antd";
import {Card} from "react-bootstrap";
import {useHistory} from "react-router";

const data = [
    {
        title: 'nginx 1',
    },
    {
        title: 'nginx 2',
    },
    {
        title: 'redis',
    },
    {
        title: 'redis 4',
    },
    {
        title: 'Title 4',
    },
    {
        title: 'Title 4',
    },
];

export default function Service() {

    const history = useHistory();

    const [services, setService] = useState(data)
    const [defaultServices, DefaultSetService] = useState(data)

    const searchService = (text, data) => {
        var out = []
        for (var i = 0; i < defaultServices.length; i++) {
            debugger
            console.log(data[i].title.toLowerCase().includes(text))
            if (data[i].title.toLowerCase().includes(text)) out.push(data[i])
        }
        console.log(out)
        setService(out)
    }

    const search = (e) => {
        console.log(e.target.value)
        searchService(e.target.value, defaultServices)
    }

    return (
        <div style={{margin: "3% 3%"}}>
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
            <List
                grid={{gutter: 16, column: 4, xs: 1, sm: 2, md: 3}}
                dataSource={services}
                renderItem={item => (
                    <List.Item>
                        <Card style={{width: '18rem'}}>
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>
                                    Service content !
                                </Card.Text>
                                <Button onClick={() => {history.push("/service/1")}}>View</Button>
                            </Card.Body>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    )
}

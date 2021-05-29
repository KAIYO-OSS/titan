import React from "react";
import {Button, Input, List} from "antd";
import {Card} from "react-bootstrap";
import Search from "./Search";


export default function Service() {
    const data = [
        {
            title: 'Title 1',
        },
        {
            title: 'Title 2',
        },
        {
            title: 'Title 3',
        },
        {
            title: 'Title 4',
        },
        {
            title: 'Title 4',
        }, {
            title: 'Title 4',
        },
    ];

    return (
        <div style={{margin: "3% 3%"}}>
            <div style={{backgroundColor: "#f7f7f7", minHeight: "60px", marginTop: "2px", marginBottom: "25px"}}>
                <Input style={{
                    maxWidth: "300px",
                    marginTop: "10px",
                    float: "right",
                    marginRight: "10px",
                    minHeight: '40px'
                }} placeholder="Search Service"/>
            </div>
            <List
                grid={{gutter: 16, column: 4}}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card style={{width: '18rem'}}>
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>
                                    Service content !
                                </Card.Text>
                                <Button>Update</Button>
                            </Card.Body>
                        </Card>
                    </List.Item>
                )}
            />

        </div>
    )
}

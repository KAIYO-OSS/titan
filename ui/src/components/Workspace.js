import React from "react";
import {Button, Card, List} from "antd";
import Search from "./Search";


export default function Workspace() {
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

        <div><Search onChange={() => {
            console.log()
        }}/>
            <Button>
                Create Workspace
            </Button>
            <List
                grid={{gutter: 16, column: 4}}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card title={item.title}
                              actions={[<a key="list-loadmore-edit">Delete</a>, <a key="list-loadmore-more">View</a>]}>
                            content
                        </Card>
                    </List.Item>
                )}
            />

        </div>
    )
}
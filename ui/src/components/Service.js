import React, {useState} from "react";
import {AutoComplete, Button, Card, List} from "antd";
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
        <div>
            <Search onChange={(e) => {console.log(e.target.value)}} searchText={"Search Service"} />
            <List
                grid={{gutter: 16, column: 4}}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card title={item.title}
                              actions={[<a key="list-loadmore-edit">Delete</a>, <a href={"/service/id"} key="list-loadmore-more">View</a>]}>
                            content
                        </Card>
                    </List.Item>
                )}
            />

        </div>
    )
}
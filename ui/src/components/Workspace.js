import React from "react";
import {Button, Card, List} from "antd";
import Search from "./Search";
import {useHistory} from "react-router";


export default function Workspace() {
    const history = useHistory();
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

    const toCreateWorkspace = () => {
        history.push("/workspaces/create")
    }
    return (

        <div>
            <Search onChange={() => {
                console.log()
            }} searchText={"Search Workspace"}/>
            <Button style={{marginTop: "5px", marginBottom: "15px"}} onClick={toCreateWorkspace} type={"primary"}>
                Create Workspace
            </Button>
            <List
                grid={{gutter: 16, column: 4}}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card title={item.title}
                              actions={[<a key="list-loadmore-edit">Delete</a>,
                                  <a href={"/workspace/id"} key="list-loadmore-more">View</a>,
                                  <Button type={"primary"} key="list-loadmore-edit">View services</Button>,]}>
                            content
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    )
}

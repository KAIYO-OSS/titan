import React from "react";
import {List} from "antd";


export default function Deployment() {

    const data = [
        {
            service_name: 'Service name',
            workspace_name: 'workspace staging',
            triggered_by: 'email_address',
            time: 'time',
            repo_link: 'github link'
        },
        {
            service_name: 'Service name',
            workspace_name: 'workspace staging',
            triggered_by: 'email_address',
            time: 'time',
            repo_link: 'github link'
        },
        {
            service_name: 'Service name',
            workspace_name: 'workspace staging',
            triggered_by: 'email_address',
            time: 'time',
            repo_link: 'github link'
        },
        {
            service_name: 'Service name',
            workspace_name: 'workspace staging',
            triggered_by: 'email_address',
            time: 'time',
            repo_link: 'github link'
        },
    ];

    return (
        <div>

            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item actions={[<a key="list-loadmore-edit">Approve</a>, <a key="list-loadmore-more">View</a>]}>
                        <List.Item.Meta
                            title={<a href="https://ant.design">{item.service_name}</a>}
                            description={<div><a href="https://ant.design">{item.workspace_name}</a><br/>
                                <a href="https://ant.design">{item.time}</a><br/>
                                <a href="https://ant.design">{item.triggered_by}</a><br/>
                                <a href="https://ant.design">{item.repo_link}</a></div>}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

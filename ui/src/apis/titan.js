import axios from "axios";
import {notification} from 'antd';

const header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "x-access-token": localStorage.getItem("session-token")
}

const openNotification = (msg) => {
    notification["error"]({
        message: 'Error',
        description: msg,
    });
};

export const doLogin = (username, token) => {
    let data = {
        emailId: username,
        acl: token
    };
    return axios.post("http://localhost:8080/users/login", JSON.stringify(data), {
        headers: header,
    }).then(response => {
        console.log(response)
        if (response.status && response.status < 300) {
            console.log(response.headers)
            localStorage.setItem("session-token", response.headers['x-access-token'])
            return true
        } else {
            openNotification("Error login user")
            return false
        }
    }).catch((error) => {
        console.log(error)
        return false;
    });
}

export const isAuthValid = () => {

}

export const listAllServices = () => {
    return axios.get("http://localhost:8080/api/odin/services/", {
        headers: header,
    }).then(response => {
        if (response.status && response.status < 300) {
            return response.data.msg
        } else {
            openNotification("Error getting All deployed service of the cluster. Please check resources ")
            return []
        }
    }).catch((error) => {
        openNotification("Error getting All deployed service of the cluster. Please check resources " + error)
        return [];
    });
}

export const getServiceDetails = (serviceName) => {
    return axios.get("http://localhost:8080/api/odin/service/" + serviceName + "/status", {
        headers: header,
    }).then(response => {
        if (response.status && response.status < 300) {
            return response.data
        } else {
            openNotification("Error getting deployed service of the cluster. Please check resources ")
            return {}
        }
    }).catch((error) => {
        debugger
        console.log(error)
        openNotification("Error getting deployed service of the cluster. Please check resources " + error)
        return {};
    });
}


export const updateService = (serviceName) => {
    return axios.put("http://localhost:8080/api/odin/service/" + serviceName, {
        headers: header,
    }).then(response => {
        if (response.status && response.status < 300) {
            return response.body
        } else {
            return {}
        }
    }).catch((error) => {
        console.log(error)
        return {};
    });
}

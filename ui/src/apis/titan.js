import axios from "axios";


export const doLogin = (username, token) => {
    let data = {
        emailId: username,
        acl: token
    };
    return axios.post("https://5b0a5c00b6a9.ngrok.io/users/login", JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
        },
    }).then(response => {
        console.log(response)
        if (response.status && response.status < 300) {
            console.log(response.headers)
            localStorage.setItem("session-token", response.headers['x-access-token'])
            return true
        } else {
            return false
        }
    }).catch((error) => {
        console.log(error)
        return false;
    });
}


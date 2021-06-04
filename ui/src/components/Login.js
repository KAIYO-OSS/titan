import React, {useEffect, useState} from "react";
import './login.css'
import {useHistory} from "react-router";
import {doLogin} from "../apis/titan";

const loginInputsInit = [
    {
        label: "Email Address",
        type: "text",
        show: true,
        id: "a"
    }, {
        label: "ACL token",
        type: "password",
        show: true,
        id: "b"
    }
];

const Login = ({inputs, signUp, submitForm,}) => (
    <div>
        <div style={{textAlign: 'center', fontSize: '2rem', marginTop: '3%'}}>Deployment Center</div>
        <div className={signUp ? "login login-closed" : "login"}>
            <h1>Log In</h1>
            <hr/>
            <Form
                inputs={inputs}
                submitForm={submitForm}
            />
        </div>
    </div>
);

const Submit = () => (
    <div>
        <hr/>
        <button className="submit-button" type="submit">
            Submit
        </button>
    </div>
);


const Input = ({label, type, show, id,}) => (
    <div className={show ? "field field-in" : "field"}>
        <label className="label">{label}
        </label>
        <br/>
        <input
            key={id}
            className="input"
            type={type}
        />
    </div>
);

const Form = ({inputs, submitForm}) => {
    const inputsMapped = inputs.map((i) => (
        <Input
            label={i.label}
            type={i.type}
            show={i.show}
            id={i.id}
        />
    ));

    return (
        <form onSubmit={submitForm}>
            {inputsMapped}
            <Submit/>
        </form>
    );
};

export default function LoginComponent() {

    const history = useHistory();

    const [signUp, setSignUp] = useState(false)
    const [loginInputs, setLoginInputs] = useState(loginInputsInit)

    useEffect(() => {

    }, [])

    const submitForm = async (e) => {
        e.preventDefault();
        let isValid = await doLogin(e.target.elements[0].value, e.target.elements[1].value);
        if (isValid)
            history.push("/")
    }

    return (
        <div>
            <Login
                signUp={signUp}
                inputs={loginInputs}
                submitForm={submitForm}
            />
        </div>
    );
}

import React, {useState} from "react";
import './login.css'
import {useHistory} from "react-router";

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

const Login = ({
                   inputs,
                   signUp,
                   submitForm,
               }) => (
    <div className={signUp ? "login login-closed" : "login"}>
        <h1>Log In</h1>
        <hr/>
        <Form
            inputs={inputs}
            submitForm={submitForm}
        />
    </div>
);

const Submit = () => (
    <div>
        <hr/>
        <button
            className="submit-button"
            type="submit"
        > Submit
        </button>
    </div>
);


const Input = ({
                   label,
                   type,
                   show,
                   id,
               }) => (
    <div className={show ? "field field-in" : "field"}>
        <label className="label">{label}
        </label>
        <br/>
        <input
            className="input"
            type={type}
        />
    </div>
);

const Form = ({
                  inputs,
                  submitForm
              }) => {
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

    const inUpClick = () => {
        setSignUp(!signUp)
        animateFields("signupInputs");
        setTimeout(() => {
            animateFields("loginInputs");
        }, 100);
    }

    const animateFields = (formName) => {
        let start, length, newForm;

        newForm = loginInputs.slice();

        start = 0;
        length = newForm.length;

        console.log(newForm);

        let stagger = (i) => {
            if (i < length) {
                setTimeout(() => {
                    newForm[i].show = !newForm[i].show
                    this.setState({[formName]: newForm});
                    stagger(i + 1);
                }, 70);
            }
        };
        stagger(start);
    }

    const submitForm = (e) => {
        e.preventDefault();
        history.push("/")
    }

    return (
        <div>
            <Login
                signUp={signUp}
                inputs={loginInputs}
                inUpClick={inUpClick}
                submitForm={submitForm}
            />
        </div>
    );
}

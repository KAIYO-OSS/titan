import React, {Component} from "react";
import {Button, Result} from "antd";


class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
    }

    render() {
        return (
            <div title="ErrorBoundry">
                {this.state.hasError ? (
                    <Result
                        status="500"
                        title="500"
                        subTitle="Sorry, something went wrong."
                        extra={
                            <Button
                                type="primary"
                                onClick={(e) => (window.location.href = "/")}
                            >
                                Back Home
                            </Button>
                        }
                    />
                ) : (
                    this.props.children
                )}
            </div>
        );
    }
}

export default ErrorBoundary;

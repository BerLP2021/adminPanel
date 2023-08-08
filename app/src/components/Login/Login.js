import React, {Component} from "react";

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.props.login;
        this.state = {
            password: '',
            showPass: false,
            passValid: this.props.passValid,
            passLenErr: false
        };
    }

    componentDidMount() {
        this.focusOnInput();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.passValid !== prevProps.passValid) {
            this.setState({
                passValid: this.props.passValid
            });
        }
    }

    focusOnInput() {
        this.input = document.querySelector('#pass-text');
        this.input.focus();
    }

    onPassChange(e) {
        this.setState({
            password: e.target.value
        });

        if(!this.state.passValid) {
            this.setState({
                passValid: true
            })
        }
        if(e.target.value.length > 5) {
            this.setState({
                passLenErr: false
            });
        }
    }

    onSignIn() {
        if(this.state.password.length > 5) {
            this.login(this.state.password);
        } else {
            this.setState({
                passLenErr: true
            })
        }
    }

    onBack() {
        const homeUrl = window.location.origin;
        history.pushState({}, '', homeUrl);
        window.history.go(-1);
        location.reload();
        history.replaceState({}, '', homeUrl + '/admin');
    }

    onShowPass(e) {
        e.preventDefault();
        this.setState(state => ({
            showPass: !state.showPass
        }));
    }

    render() { 
        const {password, showPass, passLenErr, passValid} = this.state;
        let passLen, passErr;
        passLen =  passLenErr ? 
            (<span className="error uk-margin">Password length min 6 characters</span>) :
            null;
        passErr = !passValid ? 
            (<span className="error uk-margin">Used wrong password</span>) :
            null;

        return ( 
            <div className="login-container uk-flex uk-flex-center uk-flex-middle">
                <div className="login uk-modal-body ">
                    <h1 className="uk-modal-title">Authorization</h1>
                    <form className="uk-form-stacked">
                        <div className="uk-margin-top">
                            <p className="uk-h4 uk-margin-top">Password</p>
                        
                            <div className="uk-inline uk-width-1-1">
                                <a className="uk-form-icon uk-form-icon-flip" 
                                    href="#" 
                                    uk-icon={`icon: ${showPass ? 'eye-slash' : 'eye'}`}
                                    tabIndex={0}
                                    onClick={(e) => this.onShowPass(e)}></a>
                                <input 
                                    className={`uk-input ${this.state.passValid ? "" : "uk-form-danger"}`} 
                                    id="pass-text" 
                                    type={showPass ? "text" : "password" } 
                                    aria-label="Clickable icon" 
                                    placeholder="min 6 characters"
                                    value={password}
                                    onChange={(e) => this.onPassChange(e)}/>
                            </div>
                            {passLen}
                            {passErr}
                        </div>
                    </form>

                    <p className="uk-text-right">
                        <button     
                            className="uk-button uk-button-default uk-margin-small-right" 
                            type="button"
                            tabIndex={0}

                            onClick={() => this.onBack()}>Back</button>
                        <button 
                            tabIndex={0}
                            disabled={passLenErr ? true : false}
                            className="uk-button uk-button-primary" 
                            id='singin-btn'
                            type="button"
                            onClick={() => this.onSignIn()}>Sign in</button>
                    </p>
                </div>
            </div>
        );
    }
}
 
export default Login;
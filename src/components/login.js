import { React, Component } from 'react';
import { Button, Icon, ButtonGroup, InputGroup, FormGroup } from "@blueprintjs/core";
import Main from './main';
import PasswordInput from '../passwordInput';
import '@blueprintjs/core/lib/css/blueprint.css';
import '../App.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: ''
        }
        this.password = '';
    }

    onLoginChange = (e) => {
        this.setState({ login: e.target.value })
    }
    onPasswordChange = (val) => {
        this.setState({ password: val });
    }

    onSubmitClick = (e) => {
        e.preventDefault();
        this.props.onSubmitClick(e, this.state.login, this.state.password);
    }

    render() {
        return (
            <div className="input-form">
                <div className="input-form_wrap">
                    <div className="input-form_title">Вход</div>
                    <form className='form' onSubmit={this.onSubmitClick}>
                        <FormGroup label="Пользователь" labelFor="user-name">
                            <InputGroup
                                id="user-name"
                                leftIcon="user"
                                autoComplete="off"
                                value={this.state.login}
                                onChange={this.onLoginChange}
                            />
                        </FormGroup>
                        <FormGroup label="Пароль" labelFor="user-password">
                            <PasswordInput
                                id="user-password"
                                leftIcon="lock"
                                autoComplete="off"
                                value={this.state.password}
                                onChange={this.onPasswordChange}
                            />
                        </FormGroup>
                        <ButtonGroup>
                            <Button
                                icon="tick"
                                type="submit"
                                text="Войти в систему"
                            />
                        </ButtonGroup>
                    </form>
                </div>
            </div>
        );
    }
}
export default Login;

import { React, Component } from "react";
// import { TextBox } from 'devextreme-react/text-box';
import { Button } from 'devextreme-react/button';
import { Form, ButtonItem, GroupItem, Label, SimpleItem, PatternRule, RequiredRule, CompareRule, EmailRule, StringLengthRule, AsyncRule } from "devextreme-react/form";
import store from "../stores/ShopStore";
import { Link } from 'react-router-dom';
import notify from 'devextreme/ui/notify';
import { observer } from 'mobx-react';
import { LoadPanel } from 'devextreme-react/load-panel';
import md5 from 'md5';

import './Style/signup.css';
import { Popup } from "devextreme-react";

@observer
class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadPanelVisible: false,
            regInfoVisible: false,
            infoMessage: '',
            infoStatus: 0
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loadPanelVisible: true });

        let data = { ...store.signUp };
        data.password = md5(data.password);

        const res = await fetch('/api/usersInsert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: data, origin: window.location.origin })
        });

        const j = await res.json();
        if (res.status === 531) {
            this.setState({ regInfoVisible: true, infoMessage: j.message, infoStatus: res.status });
            notify(j.message, 'error', 3000);
        }
        else {
            this.setState({ regInfoVisible: true, infoMessage: j.message, infoStatus: res.status });
            notify(j.message, 'info', 3000);
        }

        this.setState({ loadPanelVisible: false });
    };

    clearClick = () => {
        store.clearSignup();
    };


    checkUserExists = async (val) => {
        const res = await fetch('/api/checkUserExists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: val })
        });

        const j = await res.json();

        return j.length > 0;
    }

    loginValidation = async (params) => {
        return true;
    }

    hideChangePassword = () => {
        this.setState({ regInfoVisible: false })
    }

    hideLoadPanel = () => {
        this.setState({ loadPanelVisible: false });
    }
    
    getErrorStyle = () => {
        return {width: '350px', marginBottom: this.state.infoStatus !== 200 ? '0' : '9%'};
    }

    render() {
        return (
            <div className="form-auth" style={{ width: '500px', marginBottom: "100px" }}>

                <LoadPanel
                    shadingColor="rgba(0,0,0,0.4)"
                    message="Обработка..."
                    onHiding={this.hideLoadPanel}
                    visible={this.state.loadPanelVisible}
                    showIndicator={true}
                    shading={true}
                    showPane={true}
                    hideOnOutsideClick={false}
                />
                <Popup
                    visible={this.state.regInfoVisible}
                    onHiding={this.hideChangePassword}
                    hideOnOutsideClick={false}
                    showCloseButton={this.state.infoStatus !== 200 ? true : false}
                    title={`${this.state.infoStatus <= 200 ? 'Поздравляем!' : 'Ошибка :('}`}
                    width="400px"
                    height={`${this.state.infoStatus !== 200 ? '150px' : "220px"}`}
                >
                    <div className="form-wrap" style={{
                        color: `${this.state.infoStatus === 200 ? 'green' : 'red'}`,
                        flexDirection: 'column',
                        fontSize: '18px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div className="form-title" style={this.getErrorStyle()}>{this.state.infoMessage}</div>
                        <div>
                            <Link to={`${this.state.infoStatus <= 200 ? '/profile' : `.`}`} style={{ textDecoration: 'none' }} onClick={() => { this.hideLoadPanel() }}>
                                {this.state.infoStatus <= 200 ? <Button stylingMode="contained" type="default" width="200px" style={{ marginLeft: '80%' }}>Далее</Button> : <div></div>}
                            </Link>
                        </div>
                    </div>
                </Popup>

                <form onSubmit={this.onSubmit} action="your-action">
                    <Form
                        showValidationSummary={true}
                        validationGroup='xuz'
                        formData={store.signUp}
                        width="100%"
                        marginLeft="100px"
                        showColonAfterLabel={true}
                    >
                        <GroupItem caption="Основные">
                            <SimpleItem dataField="login" editorType="dxTextBox">
                                <RequiredRule message="Поле обязательно для заполнения" />
                                <AsyncRule message="Пользователь с таким логином уже зарегистрирован!" validationCallback={this.loginValidation} />
                                <Label text="Логин" />
                            </SimpleItem>

                            <SimpleItem dataField="last_name" editorType="dxTextBox">
                                <RequiredRule message="Поле обязательно для заполнения" />
                                <Label text="Фамилия" />
                            </SimpleItem>

                            <SimpleItem dataField="first_name" editorType="dxTextBox">
                                <RequiredRule message="Поле обязательно для заполнения" />
                                <Label text="Имя" />
                            </SimpleItem>

                            <SimpleItem dataField="middle_name" editorType="dxTextBox">
                                <Label text="Отчество" />
                            </SimpleItem>
                        </GroupItem>

                        <GroupItem caption="Пароль">
                            <SimpleItem dataField="password" editorType="dxTextBox" editorOptions={{ mode: "password", placeholder: "Пароль" }}>
                                <RequiredRule message="Поле обязательно для заполнения" />
                                <StringLengthRule min={6} message="Длина пароля должна быть не менее 6 символов" />
                                <Label text="Пароль" />
                            </SimpleItem>

                            <SimpleItem dataField="password2" editorOptions={{ mode: 'password' }}>
                                <RequiredRule message="Пароль не указан" />
                                <CompareRule
                                    message="Пароли не совпадают"
                                    comparisonTarget={() => store.signUp.password}
                                />
                                <Label text="Повторите пароль" />
                            </SimpleItem>
                        </GroupItem>

                        <GroupItem caption="Дополнительно">
                            <SimpleItem dataField="email" editorType="dxTextBox">
                                <RequiredRule message="Поле обязательно для заполнения" />
                                <EmailRule message="Некорректный email-адрес" />
                                <AsyncRule message="Пользователь с таким email уже зарегистрирован!" validationCallback={this.loginValidation} />
                                <Label text="Email" />
                            </SimpleItem>

                            <SimpleItem dataField="phone" editorType="dxTextBox" editorOptions={{
                                mask: '+7 (X00) 000-0000',
                                maskRules: {
                                    X: /[02-9]/,
                                },
                                maskInvalidMessage: 'Телефон должен содержать корректный российский номер'
                            }}>
                                <PatternRule
                                    message="Номер телефона должен иметь российский формат"
                                    pattern={/^[02-9]\d{9}$/}
                                />
                                <Label text="Телефон" />
                                <RequiredRule message="Поле обязательно для заполнения" />
                                <AsyncRule message="Пользователь с таким номером уже зарегистрирован!" validationCallback={this.loginValidation} />
                            </SimpleItem>

                            <SimpleItem dataField="city" editorType="dxTextBox">
                                <Label text="Город" />
                            </SimpleItem>

                            <SimpleItem dataField="address" editorType="dxTextBox">
                                <Label text="Адрес" />
                            </SimpleItem>
                        </GroupItem>


                        <GroupItem caption="" colCount={2}>
                            <ButtonItem horizontalAlignment="left"
                                buttonOptions={{ text: "Очистить поля", type: "danger", icon: "refresh", onClick: this.clearClick }}
                            />
                            <ButtonItem horizontalAlignment="right"
                                buttonOptions={{ text: "Регистрация", type: "success", icon: "save", useSubmitBehavior: true, validationGroup: 'xuz' }}
                            />
                        </GroupItem>
                    </Form>
                </form>
            </div>
        )
    }
}


export default Signup;
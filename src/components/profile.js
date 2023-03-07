import React, { Component } from 'react';
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { Link } from 'react-router-dom';
import notify from 'devextreme/ui/notify';
import store from '../stores/ShopStore';
import { observer } from 'mobx-react';
import NewsEditor from './newsEditor';
import ChangePassword from './changePassword';

import { Form, GroupItem, RequiredRule, PatternRule, EmailRule, SimpleItem, Label, ButtonItem } from 'devextreme-react/form';

import './Style/profile.css';

const loginData = {
    login: "",
    password: ""
}


@observer
class Profile extends Component {
    constructor(props) {
        super(props);


        this.buOK = React.createRef();
        this.changePasswordForm = React.createRef();

        this.state = {
            authenticated: false,
            formVisible: false,
            changePasswordVisible: false,
            oldPassword: "",
            newPassword1: "",
            newPassword2: "",
            password: ""
        }
    }
    twoButtonsRender = () => {
        return (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div>
                    <Button text="Сохранить" type="success" width="178px" icon="save" stylingMode="containded" validationGroup='tratata' useSubmitBehavior={true} />
                </div>

                <div style={{ width: "100px", flexGrow: "6" }}></div>

                <div>
                    <Button text="Изменить пароль" width="178px" type="success" icon="key" stylingMode="containded" onClick={this.onChangePasswordClick} />
                </div>
            </div>
        )
    }

    componentDidMount = async () => {
        //this.buOK.current.instance.registerKeyHandler('return', () => {this.onLoginClick()});

        //localStorage.removeItem('token');
        const token = localStorage.getItem('token');

        if (token) {
            const user_id = localStorage.getItem('user_id');
            const verify = await this.verifyToken(token);

            if (verify.status === 'OK' && user_id) {
                await store.getUserInfo(user_id);
                this.setState({ authenticated: true });
                //console.log(info)
            }
        }
        else {
            this.setState({ authenticated: false });
            this.showLoginForm();
        }
    }

    showLoginForm = () => {
        this.setState({ formVisible: true }, () => { this.buOK.current.instance.registerKeyHandler('enter', () => { this.onLoginClick() }); });
    }

    hideLoginForm = () => {
        this.setState({ formVisible: false });
    }

    getAuth = async () => {
        const { login, password } = loginData;
        const res = await fetch('/api/getAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: null, login: login, password: password })
        });
        return await res.json();
    }

    verifyToken = async (token) => {
        const res = await fetch('/api/verifyToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token })
        });

        if (res.status !== 200)
            this.onLogout();
        //this.setState({ authenticated: false, formVisible: true });

        return await res.json();
    }

    usersUpdate = async () => {
        await fetch('/api/usersUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: [store.userInfo] })
        });
    }

    onLoginClick = async (e) => {
        e.preventDefault();

        const res = await this.getAuth();

        if (res.token) {
            this.hideLoginForm();
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_id', res.user_id);

            await store.getUserInfoByToken();

            this.setState({ authenticated: true, formVisible: false });
        } else {
            notify({
                message: 'Пользователь или пароль указаны неверно!',
                position: {
                    my: 'center top',
                    at: 'center center',
                },
            }, 'error', 3000)
            this.setState({ authenticated: false });
        }
    }

    onLoginChanged = (data) => {
        store.userInfo.login = data.value;
    }

    onPasswordChanged = (data) => {
        this.setState({ password: data.value });
    }

    handleSubmit = async (e) => {
        await this.usersUpdate();
        notify({
            message: 'Изменения сохранены',
            position: {
                my: 'center top',
                at: 'center top',
            },
        }, 'success', 3000);

        e.preventDefault();
    }

    onLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');

        let userInfo = { ...store.userInfo };
        for (let prop in userInfo) {
            if (userInfo.hasOwnProperty(prop) && prop !== 'login')
                userInfo[prop] = undefined;
        }

        store.setUserInfo(userInfo);

        this.setState({ authenticated: false, formVisible: true });
    }

    onChangePasswordClick = (e) => {
        this.changePasswordForm.current.clearState();
        this.setState({ changePasswordVisible: !this.state.changePasswordVisible });
    }

    hideChangePassword = () => {
        this.setState({ changePasswordVisible: false });
    }

    titleRenderer = (data) => {
        return <div style={{ fontSize: "18px", fontWeight: "500" }}>Авторизация</div>;
    }

    render() {
        return (
            <>
                <div className='header-panel'>
                    Личный кабинет
                    <Button text="Выход" type="danger" icon="arrowright" stylingMode="contained" onClick={this.onLogout}></Button>
                </div>


                <ChangePassword
                    ref={this.changePasswordForm}
                    changePasswordVisible={this.state.changePasswordVisible}
                    hideChangePassword={this.hideChangePassword}
                >
                </ChangePassword>

                <Popup
                    ref={this.buOK}
                    visible={this.state.formVisible}
                    onHiding={this.hideLoginForm}
                    dragEnabled={true}
                    hideOnOutsideClick={false}
                    showCloseButton={false}
                    showTitle={true}
                    title="Авторизация"
                    container=".App"
                    titleRender={this.titleRenderer}
                    width={380}
                    height={320}
                >
                    <form onSubmit={this.onLoginClick}>
                        <Form
                            formData={loginData}
                            labelLocation="top"
                            validationGroup="loginData"
                            onEditorEnterKey={() => {this.onLoginClick()}}
                        >
                            <SimpleItem dataField="login" editorType="dxTextBox" editorOptions={{ placeholder: "Логин/Телефон/Email" }} >
                                <RequiredRule message="Логин обязателен для ввода" />
                                <Label text="Пользователь" />
                            </SimpleItem>

                            <SimpleItem dataField="password" editorType="dxTextBox" editorOptions={{mode: "password", placeholder: "Пароль" }} >
                                <RequiredRule message="Пароль обязателен для ввода" />
                                <Label text="Пароль" />
                            </SimpleItem>

                            <GroupItem render={() =>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "17px"}}>
                                    <div> <Link to="/signup" onClick={() => { this.hideLoginForm() }}> Регистрация  </Link> </div>
                                </div>
                            }>
                            </GroupItem>

                            <GroupItem render={() =>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "17px" }}>
                                    <div> <Link to="/" onClick={() => { this.hideLoginForm() }}> На главную  </Link> </div>
                                </div>
                            }>
                            </GroupItem>


                            <ButtonItem 
                                horizontalAlignment="right" 
                                buttonOptions={{ text: "Вход", type: "normal", icon: "check", width: "120px", useSubmitBehavior: "true"  }} 
                                
                                validationGroup="loginData">
                            </ButtonItem>
                        </Form>
                    </form>
                    {/* <div className='profile_row'>
                        <div className='profile_item'>
                            <div className='profile_label'>Пользователь:</div>
                            <TextBox text={store.userInfo.login} className="profile_input" placeholder='Телефон или email' onValueChanged={this.onLoginChanged} />
                        </div>
                        <div className='profile_item'>
                            <div className='profile_label'>Пароль:</div>
                            <TextBox text={this.state.password} className="profile_input" placeholder='Пароль' mode='password' onValueChanged={this.onPasswordChanged} />
                        </div>
                    </div>

                    <div className="dx-field" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div> <Link to="/signup" onClick={() => { this.hideLoginForm() }}> Регистрация  </Link> </div>
                    </div>

                    <div className="dx-field" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div> <Link to="/" onClick={() => { this.hideLoginForm() }}> На главную  </Link> </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}><Button text="Вход" width="120px" type="normal" icon="check" stylingMode="outlined" onClick={this.onLoginClick} /></div> */}
                </Popup>

                <div>
                    {this.state.authenticated ?
                        <TabPanel
                            height="100vh"
                            selectedIndex={0}
                            loop={false}
                            animationEnabled={true}
                            swipeEnabled={false}
                        >
                            <Item title="Личные данные">
                                <div style={{ width: "600px", maxWidth: "97%", marginTop: "10px", marginLeft: "10px", paddingRight: "10px", marginBottom: "50px" }}>

                                    <form onSubmit={this.handleSubmit}>
                                        <Form
                                            action="our-action"
                                            readOnly={false}
                                            validationGroup='tratata'
                                            formData={store.userInfo}
                                            width="100%"
                                            colCount={1}
                                            showColonAfterLabel={true}
                                            showValidationSummary={true}
                                        >
                                            <GroupItem caption="Основные" itemType="group">
                                                <SimpleItem dataField="login" editorType="dxTextBox">
                                                    <RequiredRule message="Логин обязателен для ввода" />
                                                    <Label text="Логин" />
                                                </SimpleItem>

                                                <SimpleItem dataField="last_name" editorType="dxTextBox">
                                                    <RequiredRule message="Фамилия обязательна для ввода" />
                                                    <Label text="Фамилия" />
                                                </SimpleItem>

                                                <SimpleItem dataField="first_name" editorType="dxTextBox">
                                                    <RequiredRule message="Имя обязательно для ввода" />
                                                    <Label text="Имя" />
                                                </SimpleItem>

                                                <SimpleItem dataField="middle_name" editorType="dxTextBox">
                                                    <Label text="Отчество" />
                                                </SimpleItem>

                                            </GroupItem>

                                            <GroupItem caption="Дополнительно">
                                                <SimpleItem dataField="email" editorType="dxTextBox">
                                                    <RequiredRule message="Email обязателен для ввода" />
                                                    <EmailRule message="Некорректный email-адрес" />
                                                    <Label text="Email" />
                                                </SimpleItem>

                                                <SimpleItem dataField="phone" editorType="dxTextBox" editorOptions={{
                                                    mask: '+7 (X00) 000-0000',
                                                    maskRules: {
                                                        X: /[02-9]/,
                                                    },
                                                    maskInvalidMessage: 'Телефон должен содержать корректный российский номер'
                                                }}>
                                                    <RequiredRule message="Телефон обязателен для ввода" />
                                                    <PatternRule
                                                        message="Номер телефон указан неверно!"
                                                        pattern={/^[02-9]\d{9}$/}
                                                    />
                                                    <Label text="Телефон" />
                                                </SimpleItem>

                                                <SimpleItem dataField="city" editorType="dxTextBox">
                                                    <Label text="Город" />
                                                </SimpleItem>

                                                <SimpleItem dataField="address" editorType="dxTextBox">
                                                    <Label text="Адрес" />
                                                </SimpleItem>

                                            </GroupItem>

                                            <GroupItem render={this.twoButtonsRender} />
                                        </Form>
                                    </form>
                                </div>
                            </Item>

                            <Item title="Категории"></Item>
                            {store.userInfo.isadmin ?  <Item title="Новости" > <NewsEditor /> </Item> : <div />}
                        </TabPanel>
                        :
                        <div></div>}

                </div>
            </>
        )
    }
}

export default Profile;

import { React, Component } from 'react';
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import { Toast } from 'devextreme-react/toast';
import { Button } from 'devextreme-react/button';
import { Link } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import store from '../stores/ShopStore';
import { observer } from 'mobx-react';
//import {makeObservable} from 'mobx';

import './Style/profile.css';

@observer
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false,
            formVisible: false,
            errorVisible: false,
            password: ""
        }
    }

    componentDidMount = async () => {
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
        else
            this.showLoginForm();

    }

    showLoginForm = () => {
        this.setState( {formVisible: true} );
    }

    hideLoginForm = () => {
        this.setState( {formVisible: false} );
    }

    getAuth = async () => {
        const { login } = store.userInfo;
        const res = await fetch('/api/getAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: null, login: login, password: this.state.password })
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
        const res = await this.getAuth();

        if (res.token) {
            this.hideLoginForm();
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_id', res.user_id);

            await store.getUserInfoByToken();

            this.setState({ authenticated: true, errorVisible: false, formVisible: false });
        } else {
            this.setState({ authenticated: false, errorVisible: true });
        }
    }

    onHiding = () => {
        this.setState({ errorVisible: false });
    }

    onLoginChanged = (data) => {
        store.userInfo.login = data.value;
    }

    onFirstNameChanged = (data) => {
        store.userInfo.first_name = data.value;
    }

    onLastNameChanged = (data) => {
        store.userInfo.last_name = data.value;
    }

    onMiddleNameChanged = (data) => {
        store.userInfo.middle_name = data.value;
    }

    onEmailChanged = (data) => {
        store.userInfo.email = data.value;
    }

    onPhoneChanged = (data) => {
        store.userInfo.phone = data.value;
    }

    onCityChanged = (data) => {
        store.userInfo.city = data.value;
    }

    onAddressChanged = (data) => {
        store.userInfo.address = data.value;
    }

    onPasswordChanged = (data) => {
        this.setState({ password: data.value });
    }

    onSaveProfile = async (e) => {
        await this.usersUpdate();
    }

    onExit = (e) => {
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

    titleRenderer = (data) => {
        return <div style={{ fontSize: "18px", fontWeight: "500" }}>Авторизация</div>;
    }

    render() {
        return (
            <>
                <Toast
                    visible={this.state.errorVisible}
                    message="Пользователь или пароль указаны неверно!"
                    type="error"
                    onHiding={this.onHiding}
                    displayTime={800}
                />

                <Popup
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
                    height={300}
                >
                    <ToolbarItem
                        widget="dxButton"
                        toolbar="bottom"
                        location="after"
                        options={{ text: "Вход", icon: "check", onClick: this.onLoginClick }}
                    />
                    {/* <ToolbarItem
                        widget="dxButton"
                        toolbar="bottom"
                        location="before"
                        options={{ text: 'Отмена', icon: "clear", onClick: this.hideLoginForm }}>
                        <Link to="/signup"></Link>
                    </ToolbarItem> */}

                    <div className='profile_row'>
                        <div className='profile_item'>
                            <div className='profile_label'>Пользователь:</div>
                            <TextBox text={store.userInfo.login} className="profile_input" placeholder='Телефон или email' onValueChanged={this.onLoginChanged}/>
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
                </Popup>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    textAlign: "center",
                    backgroundColor: "#959aad",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "10px"
                }}
                >
                    Личный кабинет
                    <Button text="Выход" type="danger" icon="arrowright" stylingMode="contained" onClick={this.onExit}></Button>
                </div>

                <div>
                    {this.state.authenticated ?
                        <TabPanel
                            height="100vh"
                            selectedIndex={0}
                            loop={false}
                            animationEnabled={true}
                            swipeEnabled={true}
                        >
                            <Item title="Личные данные">
                                <div className='profile_wrap'>
                                    <div className='profile_row'>
                                        <div className='profile_item'>
                                            <div className='profile_label'>Логин:</div>
                                            <TextBox text={store.userInfo.login} className="profile_input" onValueChanged={this.onLoginChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Фамилия:</div>
                                            <TextBox text={store.userInfo.last_name} className="profile_input" onValueChanged={this.onLastNameChanged}/>
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Имя:</div>
                                            <TextBox text={store.userInfo.first_name} className="profile_input" onValueChanged={this.onFirstNameChanged}/>
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Отчество:</div>
                                            <TextBox value={store.userInfo.middle_name} className="profile_input" onValueChanged={this.onMiddleNameChanged}/>
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Email:</div>
                                            <TextBox text={store.userInfo.email} mode="email" className="profile_input" onValueChanged={this.onEmailChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Телефон:</div>
                                            <TextBox text={store.userInfo.phone} className="profile_input" mode="tel" onValueChanged={this.onPhoneChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Город:</div>
                                            <TextBox text={store.userInfo.city} className="profile_input" onValueChanged={this.onCityChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Адрес:</div>
                                            <TextBox text={store.userInfo.address} className="profile_input" onValueChanged={this.onAddressChanged} />
                                        </div>

                                        <div className='profile_item' style={{ marginTop: "20px", marginLeft: "10px" }}>
                                            <Button text="Сохранить" type="success" icon="save" stylingMode="containded" onClick={this.onSaveProfile} />
                                        </div>
                                    </div>
                                </div>
                            </Item>

                            <Item title="Мои заказы"></Item>
                        </TabPanel>
                        :
                        <div></div>}

                </div>
            </>
        )
    }
}

export default Profile;

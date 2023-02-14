import { React, Component } from 'react';
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import { Toast } from 'devextreme-react/toast';
import { Button } from 'devextreme-react/button';
import { Link } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';

import './Style/profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false,
            formVisible: false,
            errorVisible: false,
            password: "",
            userInfo: {}
        }
    }

    componentDidMount = async () => {
        //localStorage.removeItem('token');
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');
        const verify = await this.verifyToken(token);

        if (verify.status === 'OK' && user_id) {
            const info = await this.getUserInfo(user_id);
            this.setState({ authenticated: true, userInfo: info });
            //console.log(info)
        }
        else
            this.showLoginForm();

    }

    showLoginForm = () => {
        this.setState({
            formVisible: true
        });
    }

    hideLoginForm = () => {
        this.setState({
            formVisible: false
        });
    }

    getAuth = async () => {
        const { login } = this.state.userInfo;
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

    getUserInfo = async (user_id) => {
        const res = await fetch('/api/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user_id })
        });
        const li = await res.json();

        return li[0];
    }

    usersUpdate = async () => {
        await fetch('/api/usersUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: [this.state.userInfo] })
        });
        // const li = await res.json();

        // return li[0];
    }

    onLoginClick = async (e) => {
        const res = await this.getAuth();

        if (res.token) {
            this.hideLoginForm();
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_id', res.user_id);
            const info = await this.getUserInfo(res.user_id);

            if (this.props.setUserInfo)
                this.props.setUserInfo(info);

            this.setState({ authenticated: true, errorVisible: false, formVisible: false, userInfo: info });
        } else {
            this.setState({ authenticated: false, errorVisible: true });
        }
    }

    onHiding = () => {
        this.setState({ errorVisible: false });
    }

    onLoginChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.login = data.value;
            return { userInfo };
        });
    }

    onFirstNameChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.first_name = data.value;
            return { userInfo };
        });
    }

    onLastNameChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.last_name = data.value;
            return { userInfo };
        });
    }

    onMiddleNameChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.middle_name = data.value;
            return { userInfo };
        });
    }

    onEmailChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.email = data.value;
            return { userInfo };
        });
    }

    onPhoneChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.phone = data.value;
            return { userInfo };
        });
    }

    onCityChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.city = data.value;
            return { userInfo };
        });
    }

    onAddressChanged = (data) => {
        this.setState(prevState => {
            let userInfo = { ...prevState.userInfo };
            userInfo.address = data.value;
            return { userInfo };
        });
    }

    onPasswordChanged = (data) => {
        this.setState({password: data.value});
    }

    onSaveProfile = async (e) => {
        await this.usersUpdate();
    }

    onExit = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        let userInfo = { ...this.state.userInfo };
        for (let prop in userInfo) {
            if (userInfo.hasOwnProperty(prop) && prop !== 'login')
                userInfo[prop] = typeof userInfo[prop] === 'number' ? 0 : "";
        }
    
        if (this.props.setUserInfo)
            this.props.setUserInfo(userInfo);

        this.setState({ authenticated: false, userInfo: userInfo, formVisible: true });
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
                            <TextBox text={this.state.userInfo.login} className="profile_input" placeholder='Телефон или email' onValueChanged={this.onLoginChanged} />
                        </div>
                        <div className='profile_item'>
                            <div className='profile_label'>Пароль:</div>
                            <TextBox text={this.state.password} className="profile_input" placeholder='Пароль' mode='password' onValueChanged={this.onPasswordChanged} />
                        </div>
                    </div>

                    {/* <div className="dx-field">
                        <div className="dx-field-label">Пользователь:</div>
                        <div className="dx-field-value">
                            <TextBox
                                placeholder="Телефон или email"
                                value={this.state.userInfo.login}
                                onValueChanged={this.onLoginChanged}
                            >
                            </TextBox>
                        </div>
                    </div>

                    <div className="dx-field">
                        <div className="dx-field-label">Пароль:</div>
                        <div className="dx-field-value">
                            <TextBox
                                placeholder="Пароль"
                                mode="password"
                                value={this.state.userInfo.password}
                                onValueChanged={this.onPasswordChanged}
                            >
                            </TextBox>
                        </div>
                    </div> */}

                    {/* <div className="dx-field" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div>Забыли пароль?</div>
            </div> */}

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
                            // onOptionChanged={this.onSelectionChanged}
                            loop={false}
                            animationEnabled={true}
                            swipeEnabled={true}
                        >
                            <Item title="Личные данные">
                                <div className='profile_wrap'>
                                    <div className='profile_row'>
                                        <div className='profile_item'>
                                            <div className='profile_label'>Логин:</div>
                                            <TextBox text={this.state.userInfo.login} className="profile_input" onValueChanged={this.onLoginChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Фамилия:</div>
                                            <TextBox text={this.state.userInfo.last_name} className="profile_input" onValueChanged={this.onLastNameChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Имя:</div>
                                            <TextBox text={this.state.userInfo.first_name} className="profile_input" onValueChanged={this.onFirstNameChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Отчество:</div>
                                            <TextBox value={this.state.userInfo.middle_name} className="profile_input" onValueChanged={this.onMiddleNameChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Email:</div>
                                            <TextBox text={this.state.userInfo.email} mode="email" className="profile_input" onValueChanged={this.onEmailChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Телефон:</div>
                                            <TextBox text={this.state.userInfo.phone} className="profile_input" mode="tel" onValueChanged={this.onPhoneChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Город:</div>
                                            <TextBox text={this.state.userInfo.city} className="profile_input" onValueChanged={this.onCityChanged} />
                                        </div>

                                        <div className='profile_item'>
                                            <div className='profile_label'>Адрес:</div>
                                            <TextBox text={this.state.userInfo.address} className="profile_input" onValueChanged={this.onAddressChanged} />
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
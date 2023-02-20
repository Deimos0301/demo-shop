import { React, Component } from "react";
import logo from './components/Style/logo.svg';
import { HashLink } from 'react-router-hash-link';
import { Button } from 'devextreme-react/button';
import { Link } from 'react-router-dom';
import { Popover } from 'devextreme-react/popover';
import store from "./stores/ShopStore";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";

import SideBar from "./sidebar";
import './header.css';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupVisible: false,
            errorVisible: false,
            hintProfileVisible: false,
            hintBasketVisible: false,
            login: "",
            password: "",
            userInfo: {}
        }
    }

    toggleHintProfile = () => {
        this.setState({ hintProfileVisible: !this.state.hintProfileVisible });
    }

    toggleHintBasket = () => {
        this.setState({ hintBasketVisible: !this.state.hintBasketVisible });
    }

    componentDidMount = async () => {
        let { user_id } = this.props.userInfo;

        if (user_id) {
            this.setState({ userInfo: this.props.userInfo });
        } else {
            const info = await store.getUserInfo();
            this.setState({ userInfo: info });
        }
    }
    render() {
        let fullName = "";

        if (this.state.userInfo) {
            let { first_name, last_name } = this.state.userInfo;
            last_name = last_name || "";
            first_name = first_name || "";
            fullName = last_name + ' ' + first_name;
        }

        return (
            <>
                <div className='header'>
                    <Popover
                        target="#profile"
                        position="top"
                        width={150}
                        visible={this.state.hintProfileVisible}
                    >
                        Личный кабинет
                    </Popover>

                    <Popover
                        target="#basket"
                        position="top"
                        width={150}
                        visible={this.state.hintBasketVisible}
                    >
                        Корзина
                    </Popover>

                    <div className='sidebar'>
                        <SideBar width={380} onFocusedRowChanged={this.props.onFocusedRowChanged} />
                    </div>

                    <HashLink smooth to="/#top" className='logo'>
                        <img src={logo} style={{ color: 'black' }} alt="logo"></img>

                    </HashLink>

                    <div style={{ flexGrow: "6" }}></div>
                    <div className="user-fullname">{fullName}</div>

                    <div className="head_tools">
                        <Link to="/profile" style={{ textDecoration: "none" }} onMouseEnter={this.toggleHintProfile} onMouseLeave={this.toggleHintProfile} >
                            <Button text="" id="profile" type="success" icon="user" stylingMode="outlined" />
                        </Link>
                    </div>
                    <div className="head_tools">
                        <Link to="/basket" style={{ textDecoration: "none" }} onMouseEnter={this.toggleHintBasket} onMouseLeave={this.toggleHintBasket}>
                            <Button text="" id="basket" type="success" icon="cart" stylingMode="outlined" />
                        </Link>
                    </div>
                </div>

            </>
        );
    }
}

export default Header;

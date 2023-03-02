import { React, Component } from "react";
import logo from './components/Style/logo.svg';
import { HashLink } from 'react-router-hash-link';
import { Button } from 'devextreme-react/button';
import { Link } from 'react-router-dom';
import { Tooltip } from 'devextreme-react/tooltip';
import store from "./stores/ShopStore";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import { observer } from 'mobx-react';
import SideBar from "./sidebar";
import Menu from "./components/menu";
import './header.css';

@observer
class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupVisible: false,
            errorVisible: false,
            // hintProfileVisible: false,
            // hintBasketVisible: false,
            login: "",
            password: ""
        }
    }

    // toggleHintProfile = () => {
    //     this.setState({ hintProfileVisible: !this.state.hintProfileVisible });
    // }

    // toggleHintBasket = () => {
    //     this.setState({ hintBasketVisible: !this.state.hintBasketVisible });
    // }

    componentDidMount = async () => {
        await store.getUserInfoByToken();
        const arr = await store.getBasket();
        store.setBasketData(arr);
    }

    getCounterStyle = () => {
        return {display: store.basketCounter ? 'block' : 'none'};
    }

    render() {
        let fullName = "";

        if (store.userInfo) {
            let { first_name, last_name } = store.userInfo;
            last_name = last_name || "";
            first_name = first_name || "";
            fullName = last_name + ' ' + first_name;
        }

        return (
            <>
                <Tooltip
                    target="#profile"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                >
                    <div>Личный кабинет</div>
                </Tooltip>

                <Tooltip
                    target="#basket"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                >
                    <div>Корзина</div>
                </Tooltip>

                <div className='header'>

                    <div className='sidebar'>
                        <SideBar width={380} onFocusedRowChanged={this.props.onFocusedRowChanged} />
                    </div>

                    <HashLink smooth to="/#top" className='logo'>
                        <img src={logo} style={{color: 'black'}} alt=""></img>
                    </HashLink>

                    <Menu></Menu>

                    <div style={{ flexGrow: "6" }}></div>

                    <div className="user-fullname">{fullName}</div>

                    <div className="head_tools">
                        <Link to="/profile" style={{ textDecoration: "none" }}  >
                            <Button text="" id="profile" type="success" icon="user" stylingMode="outlined" />
                        </Link>
                    </div>
                    <div className="head_tools">
                        <Link to="/basket" style={{ textDecoration: "none" }} >
                            <Button text="" id="basket" type="success" icon="cart" stylingMode="outlined" />
                        </Link>
                    </div>
                    <div className="basket-counter" style={this.getCounterStyle()}>{store.basketCounter}</div>
                </div>

            </>
        );
    }
}

export default Header;

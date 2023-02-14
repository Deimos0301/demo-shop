import { React, Component } from "react";
import { ReactComponent as LogoSVG } from './components/Style/logo.svg';
import { HashLink } from 'react-router-hash-link';
import { Button } from 'devextreme-react/button';
import { Link } from 'react-router-dom';
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
            login: "",
            password: ""
        }
    }

    itemClick = (e) => {
        this.props.itemClick(e);
    }

    render() {
        return (
            <>
                <div className='header'>
                    <div className='sidebar'>
                        <SideBar width={380} onFocusedRowChanged={this.props.onFocusedRowChanged} />
                    </div>

                    <HashLink smooth to="/#top" className='logo'>
                        <LogoSVG fill='#476070' />
                    </HashLink>

                    <div style={{ flexGrow: "6" }}></div>

                    <div className="head_tools">
                        <Link to="/profile" style={{textDecoration: "none"}}> <Button text="Кабинет" type="success" icon="user" stylingMode="outlined" /> </Link>
                    </div>
                    <div className="head_tools">
                        <Link to="/basket" style={{textDecoration: "none"}}> <Button text="Корзина" type="success" icon="cart" stylingMode="outlined" /> </Link>
                    </div>
                </div>

            </>
        );
    }
}

export default Header;
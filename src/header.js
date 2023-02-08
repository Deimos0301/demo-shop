import { React, Component } from "react";
import { ReactComponent as LogoSVG } from './components/Style/logo.svg';
import { HashLink } from 'react-router-hash-link';
import SideBar from "./sidebar";
import './header.css';

class Header extends Component {
    itemClick = (e) => {
        this.props.itemClick(e);
    }

    render() {
        return (
            <div className='header'>
                <div className='sidebar'>
                    <SideBar width={380} itemClick={this.itemClick}/>
                </div>

                <HashLink smooth to="/#top" className='logo'>
                   <LogoSVG fill='#476070' />
                </HashLink>
            </div>
        );
    }
}

export default Header;
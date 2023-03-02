import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './Style/menu.css'

export default class Menu extends Component {
    render() {
        return (
            <div style={{display: "flex", flexGrow: "6"}}>
                <ul className="header-menu">
                    <li> <Link to="/" className='header-menu__item'> Главная </Link> </li>
                    <li> <Link to="/catalog" className='header-menu__item'> Каталог </Link> </li>
                    <li> <Link to="/about" className='header-menu__item'> О нас </Link> </li>
                </ul>
            </div>
        );
    }
}
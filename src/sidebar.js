import { slide as Burger } from "react-burger-menu";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './sidebar.css';
import './components/Style/moon.css';
//import "devextreme/dist/css/moon.css";
import Category from "./components/category";
import { observer } from 'mobx-react';
import store from "./stores/ShopStore";

@observer
class SideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //isOpen: false,
            treeSource: [],
            listSource: []
        }
    }

    componentDidMount = async () => {
        const data = await this.getCategories2();
        const list = await this.getCategoriesJson();

        this.setState({ treeSource: data, listSource: list });
    }

    getCategories2 = async () => {
        const arr = await fetch('/api/getCategories2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return await arr.json();
    }

    getCategoriesJson = async () => {
        const arr = await fetch('/api/getCategoriesJson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const a = await arr.json();

        return a[0].val;
    }

    handleIsOpen = () => {
        store.setSideBarIsOpen( !store.sideBarIsOpen );
    }

    onLinkClick = () => {
        store.setSideBarIsOpen(false);
    }

    render() {
        return (
            <Burger 
                right={false} 
                width={this.props.width} 
                isOpen={store.sideBarIsOpen} 
                onOpen={this.handleIsOpen} 
                onClose={this.handleIsOpen} 
                outerContainerId="header"
            >
                <div style={{ color: 'maroon', fontSize: "20px", fontWeight: "600", lineHeight: "40px", textDecoration: "none" }}>
                    <div> <Link to="/" style={{ color: "#aec5d8" }} onClick={this.onLinkClick}> Главная</Link></div>
                    <div> <Link to="/catalog" style={{ color: "#aec5d8" }} onClick={this.onLinkClick}> Каталог</Link></div>
                    <div> <Link to="/about" style={{ color: "#aec5d8" }} onClick={this.onLinkClick}> О нас</Link></div>
                    <div> <Link to="/profile" style={{ color: "#aec5d8" }} onClick={this.onLinkClick}> Личный кабинет</Link></div>
                    <div> <Link to="/basket" style={{ color: "#aec5d8" }} onClick={this.onLinkClick} >Корзина</Link></div>

                    <div style={{display: `${window.location.pathname === '/catalog' ? 'block' : 'none'}`}}>
                        <div style={{borderStyle: "none", backgroundColor: "aliceblue", height: "1px", marginTop: "20px"}}></div>
                        <div style={{ color: "#ff9999" }}>Категории товаров:</div>
                        <div style={{borderStyle: "none", backgroundColor: "aliceblue", height: "1px"}}></div>

                    <div className="dx-swatch-moon" style={{height: "500px"}}>
                        <Category 
                            onFocusedRowChanged={this.props.onFocusedRowChanged}
                        />
                    </div>
                </div>
                </div>
            </Burger>
        );
    }
}

export default SideBar;
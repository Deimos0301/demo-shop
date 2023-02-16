import { slide as Burger } from "react-burger-menu";
import { React, Component } from "react";
import { Link } from 'react-router-dom';
// import List from 'devextreme-react/list';
// import Menu from 'devextreme-react/menu';
import './sidebar.css';
import './components/Style/moon.css';
//import "devextreme/dist/css/moon.css";
import Category from "./components/category";
//import "devextreme/dist/css/dx.common.css";

// function GroupTemplate(item) {
//     return <div style={{ fontSize: "18px" }}>{item.name}</div>;
// }

class SideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
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

    closeMenu = () => {
        this.setState({ isOpen: false });
    }

    handleIsOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    itemClick = (e) => {
        //this.setState({isOpen: false});
        this.props.itemClick(e);
    }

    render() {
        return (
            <Burger right={false} width={this.props.width} isOpen={this.state.isOpen} onOpen={this.handleIsOpen} onClose={this.handleIsOpen} outerContainerId="header">
<<<<<<< Updated upstream
                <div style={{color: 'maroon', fontSize: "20px", fontWeight: "600", lineHeight: "40px", textDecoration: "none"}}>
=======
                <div style={{ color: 'maroon', fontSize: "20px", fontWeight: "600", lineHeight: "40px", textDecoration: "none" }}>
>>>>>>> Stashed changes
                    <div> <Link to="/profile" style={{color: "#aec5d8"}}>Личный кабинет</Link></div>
                    <div> <Link to="/basket" style={{color: "#aec5d8"}}>Корзина</Link></div>

                    {/* <div className="list-container">
                        <List
                            dataSource={this.state.listSource}
                            height="100%"
                            grouped={true}
                            collapsibleGroups={true}
                            displayExpr="name"
                            // grouped={false}
                            groupRender={GroupTemplate}
                        />
                    </div> */}

                    <div style={{color: "#ff9999"}}>Каталог:</div>

                    <div className="dx-swatch-moon" style={{height: "500px"}}>
                        <Category 
                            onFocusedRowChanged={this.props.onFocusedRowChanged}
                        />
                    </div>


                    {/* <Menu
                        dataSource={this.state.treeSource}
                        displayExpr="name"
                        showFirstSubmenuMode="onHover"
                        orientation="horizontal"
                        hideSubmenuOnMouseLeave={true}
                        onItemClick={this.itemClick}
                    >
                    </Menu> */}
                </div>
            </Burger>
        );
    }
}

export default SideBar;
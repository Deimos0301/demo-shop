import { slide as Burger } from "react-burger-menu";
import { React, Component } from "react";
import { Link } from 'react-router-dom';
import Menu from 'devextreme-react/menu';
import './sidebar.css';


class SideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            treeSource: []
        }
    }

    componentDidMount = async () => {
        const data = await this.getCategories2();

        this.setState({ treeSource: data });
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
            <Burger right={false} width={this.props.width} isOpen={this.state.isOpen} onOpen={this.handleIsOpen} onClose={this.handleIsOpen}>
                <div style={{color: 'maroon', fontSize: "20px", fontWeight: "600", lineHeight: "40px", textDecoration: "none"}}>
                    <div> <Link to="/profile">Личный кабинет</Link></div>
                    <div >Каталог:</div>
                    <Menu
                        dataSource={this.state.treeSource}
                        displayExpr="name"
                        showFirstSubmenuMode="onHover"
                        orientation="horizontal"
                        hideSubmenuOnMouseLeave={true}
                        onItemClick={this.itemClick}
                    >
                    </Menu>
                </div>
            </Burger>
        );
    }
}

export default SideBar;
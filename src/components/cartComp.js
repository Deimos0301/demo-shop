import { React, Component } from 'react';
import '../App.css';
import { Column, DataGrid } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import './Style/catalog.css';
import { List } from 'devextreme-react';


let formatter = new Intl.NumberFormat("ru", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0
});

class CartComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            basketData: []
        };
    }

    getBasket = async () => {
        const arr = await fetch('/api/getBasket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: null })
        });
        return await arr.json();
    }

    getSmallImage = (e) => {
        console.log(e)
        if (!e.row.data.product_image_short) return;

        const url = e.row.data.product_image_short;
        console.log(url)
        const href = `/product/${e.row.data.product_id}`;

        return <a href={href}>  <img src={url} alt=""></img> </a>;

    }

    componentDidMount = async () => {
        const arr = await this.getBasket();
        this.setState({ basketData: arr });
        // console.log(this.props.userInfo);
    }

    priceRender = (e) => {
        const price = e.data.summa;
        return <div style={{ fontFamily: 'Courier New', fontWeight: "700", fontSize: "18px" }}>{formatter.format(price.toFixed([0]))}</div>
    }

    cartList = (e) => {
        const price = e.summa
        return <div className='cart-list'>
            <img className='cart-img' src={e.product_image_short}></img>
            <div className='cart-prod-name'>{e.product_name}</div>
            <div className='cart-prod-price'>{formatter.format(price.toFixed([0]))}</div>
        </div>
    }

    render() {
        return (
            <div className='cart-wrap'>
                <DataGrid
                    dataSource={this.state.basketData}>
                    <Column
                        dataField='product_image_short'
                        allowFiltering={false}
                        allowSorting={false}
                        cellRender={this.getSmallImage}
                        width={170}></Column>
                    <Column
                        dataField='product_name'
                        width={350}></Column>
                    <Column
                        dataField='total'
                        width={100}></Column>
                    <Column
                        dataField='summa'
                        cellRender={this.priceRender}
                        width={150}
                        format=",##0"></Column>
                </DataGrid>
                <List
                    dataSource={this.state.basketData}
                    itemRender={this.cartList}>
                </List>
            </div>
        )
    }
};
export default CartComp;
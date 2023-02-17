import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column, DataGrid } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { NumberBox } from 'devextreme-react/number-box';
import 'devextreme/dist/css/dx.light.css';
import './Style/cartComp.css';
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
            total: 0, // Сумма к оплате
            basketData: [] // Массив, содержащий данные корзины:
            /*
                basket_id,
                product_id,
                product_name,
                produc_image_short,
                quantity,
                price,
                product_articul,
                brand_name
            */
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
        if (!e.row.data.product_image_short) return;

        const url = e.row.data.product_image_short;

        const href = `/product/${e.row.data.product_id}`;

        return <Link to={href}><img src={url} alt=""></img></Link>
    }

    getTotal = (data) => {
        // По массиву вычисляем сумму к оплате, умножая цену на количество
        return data.reduce((sum, current) => sum + (current.price * current.quantity), 0);
    }

    deleteItem = async (e) => {
        if (!window.confirm("Удалить товар из корзины?")) return;

        // Делаем копию массива basketData
        let data = [...this.state.basketData];

        // Ищем индекс элемента в массиве по по basket_id, переданного через props в кнопку "Удалить"
        const idx = data.findIndex(item => item.basket_id === e.component._props.basket_id);

        // Оператор splice удаляет один элемент с индексом idx из массива data
        data.splice(idx, 1);
        await this.basketDelete(e.component._props.basket_id);
        this.setState({ basketData: data });
    }

    componentDidMount = async () => {
        // Получаем с сервера данные корзины
        const arr = await this.getBasket();
        
        // Отрисовываем список List и сумму к оплате
        this.setState({ basketData: arr, total: this.getTotal(arr) });
    }

    priceRender = (e) => {
        const price = e.data.price;
        return <div style={{ fontFamily: 'Courier New', fontWeight: "700", fontSize: "18px" }}>{formatter.format(price.toFixed([0]))}</div>
    }

    onMinusClick = async (e) => {
        let data = [...this.state.basketData];
        const idx = data.findIndex(item => item.basket_id === e.component._props.basket_id);

        data[idx].quantity -= 1;

        await this.basketUpdate(e.component._props.basket_id, data[idx].quantity);
        this.setState({ basketData: data, total: this.getTotal(data) });
    }

    onPlusClick = async (e) => {
        // Делаем копию массива basketData. (...) - оператор spread развертывает массив
        // Без spread мы бы имели не копию массива, а один массив внутри другого
        let data = [...this.state.basketData];

        // Ищем индекс элемента в массиве по по basket_id, переданного через props в кнопку (+)
        const idx = data.findIndex(item => item.basket_id === e.component._props.basket_id);

        if (idx < 0) return;
        
        // В найденном элемента массива увеличиваем количество товаров на 1
        data[idx].quantity += 1;

        // Записывам изменения в БД
        await this.basketUpdate(e.component._props.basket_id, data[idx].quantity);

        // Отображаем сделанные изменения на странице
        // Так ка наш List построен на источнике this.state.basketData,
        // то именно в него мы и "записываем" изменения из копии массива data
        // Заодно здесь же меняем и итоговую сумму к оплате
        this.setState({ basketData: data, total: this.getTotal(data) });
    }

    basketDelete = async (basket_id) => {
        await fetch('/api/basketDelete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ basket_id: basket_id })
        });
    }

    basketUpdate = async (basket_id, quantity) => {
        await fetch('/api/basketUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ basket_id: basket_id, quantity: quantity })
        });
    }

    onQuantityChanged = (e) => {
        alert('Изменили значения вручную')
    }

    cartItem = (e) => {
        const href = `/product?product_id=${e.product_id}`;

        return <div className='cart-list'>
            <Link to={href}> <div className='cart_image' style={{backgroundImage: `url(${e.product_image_short})`}}>  </div> </Link>
            

            <div className='cart-item' >
                <div style={{fontSize: "15px", lineHeight: "20px"}}>{e.product_name}</div>
                <div style={{marginTop: "10px", }}>Бренд: {e.brand_name}</div>
                <div style={{marginTop: "2px", }}>Артикул: {e.product_articul}</div>
                <div style={{marginTop: "7px", fontWeight: "500"}}>Цена: {formatter.format(e.price.toFixed([0]))}</div>

                <div className='cart-action'>
                    <div>
                        <Button icon="minus" onClick={this.onMinusClick} disabled={e.quantity < 2} basket_id={e.basket_id} />
                    </div>

                    <NumberBox
                        basket_id={e.basket_id}
                        width="55px"
                        defaultValue={1}
                        value={e.quantity}
                        min={1}
                        onValueChanged={this.onQuantityChanged}
                        showSpinButtons={false}
                    />

                    <div><Button icon="plus" onClick={this.onPlusClick} basket_id={e.basket_id}/></div>
                    <div style={{flexGrow: "6"}}></div>
                    <div> <Button text="Удалить" onClick={this.deleteItem} basket_id={e.basket_id}></Button> </div>
                </div>
            </div>
        </div>
    }


    render() {
        return (
            <div className='cart-wrap'>

                <List
                    dataSource={this.state.basketData}
                    itemRender={this.cartItem}
                    repaintChangesOnly={false}>
                </List>

                <div style={{ fontSize: "16px", fontWeight: "600", marginRight: "10px", textAlign: "end" }}>К оплате: {formatter.format(this.state.total.toFixed([0]))} </div>
            </div>
        );
    }
};
export default CartComp;
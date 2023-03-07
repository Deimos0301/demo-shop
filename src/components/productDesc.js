import { React, Component } from "react";
import { DataGrid, Column, Grouping, Paging } from 'devextreme-react/data-grid';
import { NumberBox } from 'devextreme-react/number-box';
import Gallery from 'devextreme-react/gallery';
import 'devextreme/dist/css/dx.light.css';
//import { Button } from "@blueprintjs/core";
import { Button } from 'devextreme-react/button';
import './Style/productDesc.css';
import '../App.css';
import store from "../stores/ShopStore";

class ProductDesc extends Component {
    constructor(props) {
        super(props);

        this.product_id = this.props.data ? this.props.data.data.product_id : 0;

        this.state = {
            prod: {},
            minusDisabled: true,
            quantity: 1,
            desc: []
        }
    }

    componentDidMount = async () => {
        if (!this.product_id) {
            const queryParameters = new URLSearchParams(window.location.search);
            this.product_id = queryParameters.get("product_id");
        }

        await store.getUserInfoByToken();

        if (this.product_id) {
            const prod = await this.getProducts();

            const desc = await this.getProductDesc();

            this.setState({ desc: desc, prod: prod[0] });
        }
    }

    getProductDesc = async () => {
        const arr = await fetch('/api/getProductDesc2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: this.product_id })
        });

        return await arr.json();
    }

    getProducts = async () => {
        const arr = await fetch('/api/getProducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: this.product_id })
        });

        return await arr.json();
    }

    basketInsert = async () => {
        await fetch('/api/basketInsert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: this.props.data.data.product_id,
                quantity: this.state.quantity,
                user_id: store.userInfo ? store.userInfo.user_id : undefined
            })
        });

        const arr = await store.getBasket();
        store.setBasketData(arr);
        // Добавить элемент в store.basketData

        //store.setBasketCounter(store.basketCounter );
    }

    renderGroup = (data) => {
        return <p style={{ color: "maroon", fontSize: '18px' }}>{data.displayValue}</p>;
    }

    onMinusClick = (e) => {
        if (this.state.quantity === 1) return;

        const val = this.state.quantity - 1;
        this.setState({ quantity: val, minusDisabled: this.state.quantity <= 2 })
    }

    onPlusClick = (e) => {
        const val = this.state.quantity + 1;
        this.setState({ quantity: val, minusDisabled: false });
    }

    render() {
        let formatter = new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 0
        });

        const {
            product_full_name,
            product_price_retail_rub,
            brand_name,
            product_articul,
            product_partnumber,
            category_name,
            product_warranty,
            product_remain_text,
            image_prefix,
            product_image_main,
            product_image_additional,
        } = this.state.prod;

        let images = [image_prefix + product_image_main];

        if (product_image_additional) {
            let arr = product_image_additional.split(',');
            arr.map(item => images.push(image_prefix + item));
        }

        return <div className="prod-superwrap" style={{ alignItems: `${window.location.pathname === '/catalog' ? 'flex-start' : 'center'}` }}>
            <div className="prod-wrap">
                <div className="photo-desc">

                    <div className="wrap_photo" style={{ display: "flex" }}>
                        {/* <div className="prod_photo" style={{ backgroundImage: `url(${image_prefix + product_image_main})` }} /> */}
                        <div className="prod_photo">
                            <Gallery
                                dataSource={images}
                                loop={true}
                                showNavButtons={true}
                            >
                            </Gallery> </div>
                    </div>

                    <div className="prod-desc">
                        <div className="product_full_name" >{product_full_name}</div>

                        <div style={{ display: "flex", flexDirection: "column", flexGrow: "3" }}>
                            <table style={{ maxWidth: "400px" }}>
                                <tr>
                                    <td className="desc_head"> Бренд: </td>
                                    <td className="desc_value"> {brand_name} </td>
                                </tr>
                                <tr>
                                    <td className="desc_head"> Артикул: </td>
                                    <td className="desc_value"> {product_articul} </td>
                                </tr>
                                <tr>
                                    <td className="desc_head"> УИН: </td>
                                    <td className="desc_value"> {product_partnumber} </td>
                                </tr>
                                <tr>
                                    <td className="desc_head"> Категория: </td>
                                    <td className="desc_value"> {category_name} </td>
                                </tr>
                                <tr>
                                    <td className="desc_head"> Гарантия: </td>
                                    <td className="desc_value"> {product_warranty} мес. </td>
                                </tr>
                                <tr>
                                    <td className="desc_head"> Наличие на складе: </td>
                                    <td className="desc_value"> {product_remain_text} </td>
                                </tr>
                            </table>

                            <div style={{ flexGrow: "3" }}></div>

                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", marginTop: "10px", marginBottom: "20px" }}>
                                <div className="price" style={{ fontSize: "20px", fontWeight: 500, flexGrow: 1 }}>Цена: {product_price_retail_rub ? formatter.format(product_price_retail_rub.toFixed(0)) : 0}</div>

                                <div style={{ display: "flex", marginLeft: "5px", justifyContent: "center", alignItems: "center" }}>
                                    <div><Button icon="minus" onClick={this.onMinusClick} disabled={this.state.minusDisabled} /></div>

                                    <NumberBox
                                        width="50px"
                                        defaultValue={1}
                                        value={this.state.quantity}
                                        min={1}
                                        showSpinButtons={false}
                                    />

                                    <div><Button icon="plus" onClick={this.onPlusClick} /></div>
                                </div>

                                <div style={{ display: "flex", marginLeft: "5px", marginRight: "0px" }}>
                                    <Button text="В корзину" type="success" icon="arrowright" stylingMode="contained" onClick={this.basketInsert} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ margin: "0 0px 0 0px" }}>

                    <div className="header-panel" >
                        Технические характеристики
                    </div>

                    <div>
                        <DataGrid
                            dataSource={this.state.desc}
                            showBorders={true}
                            keyExpr="attribute_id"
                            showColumnHeaders={false}
                            wordWrapEnabled={true}
                        >
                            <Grouping autoExpandAll={true} />
                            <Paging pageSize={100} />
                            <Column dataField="group_name" groupIndex={0} groupCellRender={this.renderGroup} />
                            <Column dataField="attr_name" alignment="left" />
                            <Column dataField="value" alignment="left" />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductDesc;

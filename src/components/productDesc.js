import { React, Component } from "react";
import { DataGrid, Column, Grouping, Paging } from 'devextreme-react/data-grid';
import { NumberBox } from 'devextreme-react/number-box';
import 'devextreme/dist/css/dx.light.css';
//import { Button } from "@blueprintjs/core";
import { Button } from 'devextreme-react/button';
import './Style/productDesc.css';

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
                quantity: this.state.quantity
            })
        });
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
            product_image_main
        } = this.state.prod;

        return <div style={{ marginLeft: "10px", marginTop: "10px" }}>
<<<<<<< Updated upstream
            <div className="full_name" style={{maxWidth: '800px'}}>{product_full_name}</div>
=======
            <div className="full_name" style={{ maxWidth: '800px' }}>{product_full_name}</div>
>>>>>>> Stashed changes

            <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="desc_row">
                    <div className="desc_head">Бренд:</div>
                    <div className="desc_value">{brand_name}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Артикул:</div>
                    <div className="desc_value">{product_articul}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">УИН:</div>
                    <div className="desc_value">{product_partnumber}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Категория:</div>
                    <div className="desc_value">{category_name}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Гарантия:</div>
                    <div className="desc_value">{product_warranty} мес.</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Наличие на складе:</div>
                    <div className="desc_value">{product_remain_text}</div>
                </div>

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", marginBottom: "20px", maxWidth: '800px' }}>
                <div className="price" style={{ fontSize: "20px", fontWeight: 500 }}>Цена: {product_price_retail_rub ? formatter.format(product_price_retail_rub.toFixed(0)) : 0}</div>
                <div style={{ flexGrow: 6 }}></div>

                <div style={{ display: "flex", marginLeft: "5px", justifyContent: "center", alignItems: "center" /*height: "28px"*/ }}>
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

                <div style={{ display: "flex", marginLeft: "5px", marginRight: "10px" /*height: "28px"*/ }}>
                    <Button text="В корзину" type="success" icon="add" stylingMode="contained" onClick={this.basketInsert}>  </Button>
                </div>
            </div>

            <div className="wrap_photo" style={{ display: "flex" }}>
                <div className="prod_photo" style={{ backgroundImage: `url(${image_prefix + product_image_main})` }} />
            </div>

            <div style={{ width: "100%", textAlign: "center", backgroundColor: "#959aad", color: "white", fontSize: "20px", fontWeight: "600", marginBottom: "10px", maxWidth: "800px" }} >
                Технические характеристики
            </div>

<<<<<<< Updated upstream
            <div style={{maxWidth: "800px"}}>
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
=======
            <div style={{ maxWidth: "800px" }}>
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
>>>>>>> Stashed changes
            </div>

        </div>
    }
}

export default ProductDesc;
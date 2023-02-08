import { React, Component } from "react";
import { DataGrid, Column, Grouping, Paging } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import { Button } from "@blueprintjs/core";

class ProductDesc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            desc: []
        }
    }

    componentDidMount = async () => {
        const desc = await this.getProductDesc(this.props.data.data.product_id);

        this.setState({ desc: desc });
    }

    getProductDesc = async (product_id) => {
        const arr = await fetch('/api/getProductDesc2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: product_id })
        });

        const r = await arr.json();
        //console.log(r)

        // let cnt = 0;
        // r.map(item => cnt = cnt + item.attribs.length);
        // r.count = cnt;
        return r;
    }

    renderGroup = (data) => {
        return <p style={{ color: "maroon", fontSize: '18px' }}>{data.displayValue}</p>;
    }

    render() {
        const prod = this.props.data.data;

        let formatter = new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 0
        });

        //console.log('render', this.desc);

        return <div>
            <p className="full_name">{prod.product_full_name}</p>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="desc_row">
                    <div className="desc_head">Бренд:</div>
                    <div className="desc_value">{prod.brand_name}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Артикул:</div>
                    <div className="desc_value">{prod.product_articul}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">УИН:</div>
                    <div className="desc_value">{prod.product_partnumber}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Категория:</div>
                    <div className="desc_value">{prod.category_name}</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Гарантия:</div>
                    <div className="desc_value">{prod.product_warranty} мес.</div>
                </div>

                <div className="desc_row">
                    <div className="desc_head">Наличие на складе:</div>
                    <div className="desc_value">{prod.product_remain_text}</div>
                </div>

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <div className="price" style={{ fontSize: "20px", fontWeight: 500 }}>Цена: {formatter.format(prod.product_price_retail_rub.toFixed(0))}</div>
                <Button style={{marginBottom: "5px"}} className="bp4-intent-success" large={false} rightIcon="circle-arrow-right">В корзину</Button>
            </div>

            <div className="wrap_photo" style={{ display: "flex" }}>
                <div className="prod_photo" style={{ backgroundImage: `url(${prod.image_prefix + prod.product_image_main})` }}>
                    {/* <img src={prod.image_prefix + prod.product_image_main} alt="Фото отсутстует" /> */}
                </div>
            </div>

            <div style={{width: "100%", textAlign: "center", backgroundColor: "#959aad", color: "white", fontSize: "20px", fontWeight: "600", marginBottom: "10px"}}>Технические характеристики</div>

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
    }
}

export default ProductDesc;
import { React, Component } from "react";
import { Column, DataGrid, Pager, Paging, SearchPanel, HeaderFilter, LoadPanel, MasterDetail, StateStoring, Toolbar, Item } from 'devextreme-react/data-grid';
//import "devextreme/dist/css/dx.darkmoon.css";
import { Link } from 'react-router-dom';
import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";
import ProductDesc from "./productDesc";
import store from "../stores/ShopStore";

import 'devextreme/dist/css/dx.light.css';
import './Style/catalog.css';


let formatter = new Intl.NumberFormat("ru", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0
});

class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: []
        }

        loadMessages(ruMessages);
        locale(navigator.language);
    }

    componentDidMount = async () => {
        const arr = await this.getCategories2();
        this.setState({treeData: arr});
        //console.log(arr)
    }

    getCategories2 = async () => {
        const arr = await fetch('/api/getCategories2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({withBrands: 'false'})
        });

        const r = await arr.json();
        r[0].expanded = true;
        return r;
    }

    getSmallImage = (e) => {
        if (!e.row.data.product_image_short) return;
        const url = e.row.data.image_prefix + e.row.data.product_image_short;
        const href = `/product?product_id=${e.row.data.product_id}`;
        //const href = '/product';
        return <Link to={href}><img src={url} alt=""></img></Link>
    }

    priceRender = (e) => {
        const price = e.data.product_price_retail_rub;
        return <div style={{fontWeight: "700", fontSize: "17px"}}>{formatter.format(price.toFixed(0))}</div>
    }

    render() {
        return (
            <div className="prod_grid">
               
                <DataGrid
                    dataSource={store.gridSource}
                    showBorders={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    keyExpr="product_id"
                    showRowLines={true}
                    //rowAlternationEnabled={true}
                    hoverStateEnabled={true}
                    focusedRowEnabled={true}
                    columnHidingEnabled={true}
                    onFocusedRowChanged={this.props.onGridFocusedRowChanged}
                //dataRowRender={ProductCard}
                >
                    <StateStoring enabled={true} type="localStorage" storageKey="prod_grid" />

                    <Toolbar>
                        <Item location="before"><div className="currentNode">{store.currentNode}</div></Item>

                        <Item name="searchPanel" />
                    </Toolbar>
                    <MasterDetail
                        enabled={true}
                        component={ProductDesc}
                    />
                    <LoadPanel enabled={true} />
                    <SearchPanel visible={true} />
                    <HeaderFilter visible={true} />
                    <Paging
                        pageSize={24}
                    />
                    <Pager
                        visible={true}
                        allowedPageSizes={true}
                        showPageSizeSelector={false}
                        showInfo={true}
                        showNavigationButtons={true}
                    />
                    <Column
                        dataField='product_image_short'
                        allowFiltering={false}
                        allowSorting={false}
                        alignment="center"

                        caption="" 
                        // cssClass="prod_small_image"
                        cellRender={this.getSmallImage}
                        width={70}
                    >
                    </Column>
                    <Column
                        dataField='brand_name'
                        caption="Бренд"
                    // width={110}
                    >
                    </Column>
                    <Column
                        dataField='product_articul'
                        caption="Артикул"
                        hidingPriority={2}
                    // width={110}
                    >
                    </Column>
                    <Column
                        dataField='product_id'
                        caption="ID"
                        visible={false}
                        dataType="number">
                    </Column>
                    <Column
                        dataField='product_partnumber'
                        caption="УИН"
                        hidingPriority={1}
                    // width={150}
                    >
                    </Column>
                    <Column
                        dataField='product_retailname'
                        sortOrder="asc"
                        hidingPriority={0}
                        caption="Название товара">
                    </Column>
                    <Column
                        dataField='product_price_retail_rub'
                        format=",##0"
                        //cssClass="prod_price"
                        cellRender={this.priceRender}
                        // width={150}
                        caption="Цена">
                    </Column>

                </DataGrid>
            </div>
        )
    }
}
export default Products
import { React, Component } from "react";
import { Column, DataGrid, Pager, Paging, SearchPanel, HeaderFilter, LoadPanel, MasterDetail, StateStoring, Toolbar, Item } from 'devextreme-react/data-grid';
import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";
import ProductDesc from "./productDesc";

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

        // this.state = {
        //     currentNode: ""
        // }

        loadMessages(ruMessages);
        locale(navigator.language);
    }

    getSmallImage = (e) => {
        if (!e.row.data.product_image_short) return;
        const url = e.row.data.image_prefix + e.row.data.product_image_short;
        const href = `/product/${e.row.data.product_id}`;
        //console.log(e.row.data)
        return <a href={href}>  <img src={url}></img> </a>;
    }

    priceRender = (e) => {
        const price = e.data.product_price_retail_rub;
        return <div style={{fontFamily: 'Courier New', fontWeight: "700", fontSize: "18px"}}>{formatter.format(price.toFixed(0))}</div>
    }

    render() {
        return (
            <div className="prod_grid">
                <DataGrid
                    dataSource={this.props.dataSource}
                    showBorders={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    keyExpr="product_id"
                    //rowAlternationEnabled={true}
                    hoverStateEnabled={true}
                    focusedRowEnabled={true}
                    columnHidingEnabled={true}
                //dataRowRender={ProductCard}
                >
                    <StateStoring enabled={true} type="localStorage" storageKey="prod_grid" />

                    <Toolbar>
                        <Item location="before"><div className="currentNode">{this.props.currentNode}</div></Item>

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
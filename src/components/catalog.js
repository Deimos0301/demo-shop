import React, { Component } from "react";
//import TreeList, { Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, StateStoring } from 'devextreme-react/tree-list';
import Products from "./products";
import Category from "./category";
//import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import '../App.css';
import './Style/catalog.css'

class Catalog extends Component {

    renderCell = (data) => {
        return data.data.iscat ? <div style={{ color: 'darkblue', fontSize: "17px", fontWeight: "500" }}>{data.text}</div> : <div style={{ color: 'black', fontSize: "15px" }}>{data.text}</div>;
    };

    render() {
        return (
            <div className="catalog">
                <div className="category_list">
                    <div className="grid_header"> Каталог </div>

                    <Category
                        onFocusedRowChanged={this.props.onFocusedRowChanged}
                        // focusedRowKey={this.state.focusedRowKey}
                        renderCell={this.renderCell}
                        />
                </div>

                <div className="product_list">
                    <div className="grid_header"> Товары </div>

                <Products
                        dataSource={this.props.gridData}
                        currentNode={this.props.currentNode}
                />
            </div>
            </div>

        )
    }
}
export default Catalog;
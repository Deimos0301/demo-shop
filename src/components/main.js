import React, { Component, Fragment } from "react";
import TreeList, { Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, Lookup } from 'devextreme-react/tree-list';
import Products from "./products";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import '../App.css';
import './Style/main.css'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category_id: 0,
            brand_id: 0,
            data: []
        };
    }

    getCategories = async () => {
        const arr = await fetch('/api/getCategories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const li = await arr.json();
        // console.log(li)
        return li;
    }

    componentDidMount = async () => {
        this.setState({ data: await this.getCategories() });
    }

    onFocusedRowChanged = (e) => {
        const rowData = e.row && e.row.data;

        console.log(rowData)
        this.setState({ category_id: rowData.category_id, brand_id: rowData.brand_id });
    }

    render() {


        return (
            <>
                <TreeList
                    dataSource={this.state.data}
                    showBorders={false}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    keyExpr="id"
                    parentIdExpr="parent_id"
                    defaultExpandedRowKeys={[1]}
                    focusedRowEnabled={true}
                    onFocusedRowChanged={this.onFocusedRowChanged}
                >
                    <Selection mode="single" />
                    <Column
                        dataField="name"
                        caption="Категории и бренды"
                        width={300}
                    />
                    <Column
                        dataField="category_id"
                        visible={false}
                        allowSorting={false}
                    />
                    <Column
                        dataField="brand_id"
                        visible={false}
                        allowSorting={false}
                    />
                </TreeList>
                <Products
                    category_id={this.state.category_id}
                    brand_id={this.state.brand_id}
                />
            </>

        )
    }
}
export default Main;
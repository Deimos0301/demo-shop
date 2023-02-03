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

            treeData: [],
            gridData: []
        };
    }

    getCategories = async () => {
        const arr = await fetch('/api/getCategories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return await arr.json();
    }

    getProducts = async (category_id, brand_id) => {
        const arr = await fetch('/api/getProducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_id: category_id, brand_id: brand_id })
        });

        return await arr.json();
    }

    componentDidMount = async () => {
        this.setState({ treeData: await this.getCategories() });
    }

    onFocusedRowChanged = async (e) => {
        const rowData = e.row && e.row.data;

        //console.log(rowData)
        const data = await this.getProducts(rowData.category_id, rowData.brand_id);

        this.setState({ gridData: data });
    }

    render() {
        return (
            <>
                <TreeList
                    dataSource={this.state.treeData}
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
                    dataSource={this.state.gridData}
                />
            </>

        )
    }
}
export default Main;
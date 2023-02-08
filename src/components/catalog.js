import React, { Component, Fragment } from "react";
import TreeList, { Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, StateStoring } from 'devextreme-react/tree-list';
import Products from "./products";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import '../App.css';
import './Style/catalog.css'

class Catalog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category_id: 0,
            brand_id: 0,
            currentNode: "",
            focusedRowKey: this.props.focusedRowKey,

            treeData: [],
            gridData: []
        };

        this.tl = React.createRef();
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
        //console.log(this.props.focusedRowKey)
        this.setState({ treeData: await this.getCategories(), focusedRowKey: this.props.focusedRowKey });
        // /setInterval(() => {this.setState({focusedRowKey: 17})}, 5000)
    }

    onFocusedRowChanged = async (e) => {
        const rowData = e.row && e.row.data;

        //console.log(e.component.option('focusedRowKey'));
        let data = [];

        if (rowData.brand_id !== null)
            data = await this.getProducts(rowData.category_id, rowData.brand_id);

        this.setState({
            gridData: data,
            currentNode: rowData.node_name,
            //focusedRowKey: e.component.option('focusedRowKey'),
            category_id: rowData.category_id,
            brand_id: rowData.brand_id
        });
    }

    renderCell = (data) => {
        return data.data.iscat ? <div style={{ color: 'darkblue', fontSize: "17px" }}>{data.text}</div> : <div style={{ color: 'black', fontSize: "15px" }}>{data.text}</div>;
    };

    shouldComponentUpdate = async (nextProps, nextState) => {
        const res = nextProps.focusedRowKey !== nextState.focusedRowKey;
        if (res) {
            const row = this.state.treeData.find((item) => item.id === nextProps.focusedRowKey);

            let data = [];

            if (row) {
                if (row.brand_id !== null)
                    data = await this.getProducts(row.category_id, row.brand_id);

                if (data.length)
                    this.setState({
                        gridData: data,
                        focusedRowKey: nextProps.focusedRowKey,
                        currentNode: row.node_name,
                    });

                return true;
            }
        }
        return true;
        // return res;
    }

    // onKeyChange = (key) => {
    //     console.log(key);
    //     this.setState({focusedRowKey: key})
    // }

    render() {
        return (
            <div className="catalog">
                <div className="category_list">
                    <TreeList
                        ref={this.tl}
                        dataSource={this.state.treeData}
                        showBorders={false}
                        columnAutoWidth={true}
                        wordWrapEnabled={true}
                        keyExpr="id"
                        parentIdExpr="parent_id"
                        defaultExpandedRowKeys={[1]}
                        focusedRowEnabled={true}
                        focusedRowKey={this.state.focusedRowKey}
                        //onFocusedRowKeyChange={this.onKeyChange}
                        onFocusedRowChanged={this.onFocusedRowChanged}
                    >
                        <StateStoring enabled={true} type="localStorage" storageKey="category_tree" />
                        <Selection mode="single" />
                        <Column
                            dataField="name"
                            caption="Категории и бренды"
                            width={300}
                            cellRender={this.renderCell}
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
                </div>

                <Products
                    dataSource={this.state.gridData}
                    currentNode={this.state.currentNode}
                />
            </div>

        )
    }
}
export default Catalog;
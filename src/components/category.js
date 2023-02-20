import React, { Component } from "react";
import { TreeList, Column, Selection, Scrolling, StateStoring } from 'devextreme-react/tree-list';
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import store from "../stores/ShopStore";

//themes.current("generic.dark");

export default class Category extends Component {
    constructor(props) {
        super(props);

        this.tree = React.createRef();

        this.state = {
            category_id: 0,
            brand_id: 0,
            currentNode: "",
            focusedRowKey: this.props.focusedRowKey,
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

    onFocusedRowChanged = async (e) => {
        const rowData = e.row && e.row.data;

        //console.log(e.component.option('focusedRowKey'));

        this.setState({
            currentNode: rowData.node_name,
            //focusedRowKey: e.component.option('focusedRowKey'),
            category_id: rowData.category_id,
            brand_id: rowData.brand_id
        });
    }

    componentDidMount = async () => {
        store.setTreeSource(await this.getCategories());
    }

    render() {
        return (
            <TreeList
                ref={this.tree}
                dataSource={store.treeSource}
                showBorders={false}
                columnAutoWidth={true}
                wordWrapEnabled={false}
                keyExpr="id"
                parentIdExpr="parent_id"
                defaultExpandedRowKeys={[1]}
                focusedRowEnabled={true}
                showRowLines={false}
                // focusedRowKey={this.props.focusedRowKey}
                showColumnHeaders={false}
                //onFocusedRowKeyChange={this.onKeyChange}
                onFocusedRowChanged={this.props.onFocusedRowChanged}
                height="100vh"
            >
                <Scrolling
                    mode="standard" />

                {/* <Paging
                    enabled={true}
                    defaultPageSize={20} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={false}
                    showInfo={true} /> */}

                <StateStoring enabled={true} type="localStorage" storageKey="category_tree" />

                <Selection mode="single" />
                <Column
                    dataField="name"
                    caption="Категории и бренды"
                    width={300}
                    cellRender={this.props.renderCell}
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
        );
    }
}
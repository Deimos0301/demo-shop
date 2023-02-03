import { React, Component } from "react";
import { Column, DataGrid } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import './Style/main.css';

class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    getProducts = async () => {
        const arr = await fetch('/api/getProducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_id: this.props.category_id, brand_id: this.props.brand_id })
        });
        const li = await arr.json();
        // console.log(li)
        return li;
    }

    componentDidMount = async () => {
        this.setState({ data: await this.getProducts() });
        console.log(this.props)
    }



    render() {
        return (
            <DataGrid
                dataSource={this.state.data}
                showBorders={true}
                columnAutoWidth={true}
                wordWrapEnabled={true}
                keyExpr="product_id"
                parentIdExpr="parent_id"
                defaultExpandedRowKeys={[1]}
                focusedRowEnabled={true}
            >
                <Column
                    dataField='product_articul'
                    caption="Артикул">
                </Column>
                <Column
                    dataField='product_id'
                    caption="ID"
                    visible={false}
                    dataType="number">
                </Column>
                <Column
                    dataField='product_partnumber'
                    caption="УИН">
                </Column>
                <Column
                    dataField='product_full_name'
                    caption="Название товара">
                </Column>

            </DataGrid>
        )
    }
}
export default Products
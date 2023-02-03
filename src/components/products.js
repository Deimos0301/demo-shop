import { React, Component } from "react";
import { Column, DataGrid, Pager, Paging } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import './Style/main.css';

class Products extends Component {

    render() {
        return (
            <div className="prod_grid">
                <DataGrid
                    dataSource={this.props.dataSource}
                    showBorders={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    keyExpr="product_id"
                    focusedRowEnabled={true}
                >
                    <Paging
                        defaultpageSize={25}
                    />
                    <Pager
                        visible={true}
                        allowedPageSizes={true}
                        showPageSizeSelector={true}
                        showInfo={true}
                        showNavigationButtons={true}
                    />
                    <Column
                        dataField='product_articul'
                        caption="Артикул"
                        width={110}>
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
                        width={250}>
                    </Column>
                    <Column
                        dataField='product_retailname'
                        caption="Название товара">
                    </Column>

                </DataGrid>
            </div>
        )
    }
}
export default Products
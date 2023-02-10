import { React, Component } from 'react';
import '../App.css';
import { Column, DataGrid } from 'devextreme-react/data-grid';

class CartComp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            basketData: []
        };
    }

    getBasket = async () => {
        const arr = await fetch('/api/getBasket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: null })
        });
        return await arr.json();
    }

    componentDidMount = async () => {
        const arr = await this.getBasket();
        this.setState({ basketData: arr });

        console.log(this.props.userInfo);
    }

    render() {
        return (
            <div className='cart-wrap'>
                <DataGrid
                    dataSource={this.state.basketData}>
                    <Column
                        dataField='product_id'></Column>
                    <Column
                        dataField='total'></Column>
                </DataGrid>
            </div>
        )
    }
};
export default CartComp;
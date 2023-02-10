import { React, Component } from 'react';
import '../App.css';
import CartComp from './cartComp';

class Cart extends Component {
    constructor(props) {
        super(props)
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


    render() {
        return (
            <CartComp />
        )
    }
};
export default Cart;
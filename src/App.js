import Login from './components/login';
import Catalog from './components/catalog';
import Signup from './components/signup';
import Profile from './components/profile';
import { React, Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './header';
import './App.css';
import CartComp from './components/cartComp';
import ProductDesc from './components/productDesc';
import { observer } from 'mobx-react';
import store from './stores/ShopStore';

//set DANGEROUSLY_DISABLE_HOST_CHECK=true && 

@observer
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            authenticated: false,
            // currentNode: "",
            gridRow: {}
        }
    }

    onChangePage = (idx) => {
        this.setState({ currentPageIndex: idx });
    }

    getAuth = async (login, password) => {
        const res = await fetch('/api/getAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: login, password: password })
        });
        const li = await res.json();
        return li;
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

    onFocusedRowChanged = async (e) => {
        const rowData = e.row && e.row.data;

        if (!rowData) return;

        //console.log(e.component.option('focusedRowKey'));
        let data = [];

        if (rowData.brand_id !== null) {
            data = await this.getProducts(rowData.category_id, rowData.brand_id);
            store.setGridSource(data);
            store.setCurrentNode(rowData.node_name);
        }

        
        this.setState({
            // currentNode: rowData.node_name,
            category_id: rowData.category_id,
            brand_id: rowData.brand_id
        });
    }

    onGridFocusedRowChanged = (e) => {
        this.setState({ rowData: e.row.data });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Header onFocusedRowChanged={this.onFocusedRowChanged} />

                    <Routes>
                        <Route exact path='/' element={
                            <Catalog
                                onFocusedRowChanged={this.onFocusedRowChanged}
                                onGridFocusedRowChanged={this.onGridFocusedRowChanged}
                                currentNode={store.currentNode}
                            />}
                        />
                        <Route exact path='/auth' element={<Login onSubmitClick={this.onSubmitClick} />}></Route>
                        <Route exact path='/signup' element={<Signup />}></Route>
                        <Route exact path='/profile' element={<Profile />}></Route>
                        <Route exact path='/basket' element={<CartComp  />}></Route>
                        <Route path='/product' element={<ProductDesc /*rowData={this.state.rowData}*/ />} />
                    </Routes>
                </div>
            </BrowserRouter>

        );
    }
}

export default App;

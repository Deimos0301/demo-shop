import Login from './components/login';
import Catalog from './components/catalog';
import Signup from './components/signup';
import Profile from './components/profile';
import { React, Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './header';
import './App.css';
import Cart from './components/cart';

//set DANGEROUSLY_DISABLE_HOST_CHECK=true && 


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            authenticated: false,
            focusedRowKey: 0,
            userInfo: {}
        }
    }

    componentDidMount = () => {
        // const token = localStorage.getItem('token');

        // if (token)
            this.setState({ authenticated: true });
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

    onSubmitClick = (e, login, password) => {
        //e.preventDefault();
        this.getAuth(login, password)
            .then((res) => {
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    this.setState({ authenticated: true });
                } else {
                    this.setState({ authenticated: false });
                }
            });
    };

    itemClick = (e) => {
        this.setState({focusedRowKey: e.itemData.id});
        //console.log(e.itemData.id)
    }

    setUserInfo = (info) => {
        this.setState({userInfo: info});
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Header itemClick={this.itemClick}/>
                    <Routes>
                        <Route exact path='/' element={this.state.authenticated ? <Catalog focusedRowKey={this.state.focusedRowKey}/> : <Login onSubmitClick={this.onSubmitClick} />} />
                        <Route exact path='/auth' element={<Login onSubmitClick={this.onSubmitClick} />}></Route>
                        <Route exact path='/signup' element={<Signup />}></Route>
                        <Route exact path='/profile' element={<Profile setUserInfo={this.setUserInfo}/>}></Route>
                        <Route exact path='/basket' element={<Cart onSubmitClick={this.onSubmitClick} userInfo={this.state.userInfo}/>}></Route>
                    </Routes>
                </div>
            </BrowserRouter>

        );
    }
}

export default App;

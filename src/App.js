import logo from './logo.svg';
import Login from './components/login';
import Main from './components/main';
import { React, Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
//set DANGEROUSLY_DISABLE_HOST_CHECK=true && 


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            authenticated: false
        }
    }

    componentDidMount = () => {
        const token = localStorage.getItem('token');

        if (token)
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
                if (res === true) {
                    localStorage.setItem('token', 'ура!');
                    this.setState({ authenticated: true });
                } else {
                    this.setState({ authenticated: false });
                }
            });
    };

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        <Route exact path='/' element={this.state.authenticated ? <Main /> : <Login onSubmitClick={this.onSubmitClick} />} />
                        <Route exact path='/auth' element={<Login onSubmitClick={this.onSubmitClick} />}></Route>
                    </Routes>
                </div>
            </BrowserRouter>

        );
    }
}

export default App;

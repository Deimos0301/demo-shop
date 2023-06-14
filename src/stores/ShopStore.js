import { action, observable, makeObservable, computed } from 'mobx';

class Store {
    constructor() {
        makeObservable(this);
    }

    @observable gridSource = [];

    @observable treeSource = [];

    @observable newsData = [];

    @observable currentNode = '';

    @observable userInfo = {};

    @observable signUp = {
        login: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        city: '',
        address: ''
    };

    @observable sideBarIsOpen = false;

    @computed get basketCounter() {
        let cnt = 0;
        this.basketData.map(item => cnt += item.quantity);
        return cnt;
    };

    @observable basketData = [];

    @action setNewsData = (data) => {
        this.newsData = [...data];
    }

    @action setTreeSource = (data) => {
        this.treeSource = [...data];
    }

    @action setGridSource = (data) => {
        this.gridSource = [...data];
    }

    @action setCurrentNode = (data) => {
        this.currentNode = data;
    }

    @action setUserInfo = (info) => {
        this.userInfo = { ...info };
    }

    @action clearSignup = () => {
        let data = { ...this.signUp };

        for (let prop in data) {
            if (data.hasOwnProperty(prop))
                data[prop] = "";
        }

        this.signUp = { ...data };
    }

    @action setSideBarIsOpen = (val) => {
        this.sideBarIsOpen = val;
    }

    @action setBasketData = (data) => {
        this.basketData = [...data];
    }

    getUserInfoByToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return undefined;

        const res = await this.fetchPost('/api/getUserInfoByToken', { token: token });
        this.setUserInfo(res[0]);
        return res[0];
    }

    getUserInfo = async (user_id) => {
        const res = await this.fetchPost('/api/getUserInfo', { user_id: user_id });

        this.setUserInfo(res[0]);

        return res[0];
    }

    getBasket = async () => {
        const res = await this.fetchPost('/api/getBasket', { user_id: this.userInfo.user_id });
        return res;
    }

    getNewsData = async () => {
        const res = await this.fetchPost('/api/getNews');

        this.setNewsData(res);

        return res;
    }

    fetchPost = async (url, params) => {
        const arr = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params || {})
        });

        const res = await arr.json();

        return res;
    }

    fetchPut = async (url, params) => {
        const arr = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params || {})
        });
    }

    fetchDelete = async (url, params) => {
        const arr = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params || {})
        });
    }
}

const store = new Store();
export default store;


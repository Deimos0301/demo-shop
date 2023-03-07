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
        if (token) {
            const arr = await fetch('/api/getUserInfoByToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token })
            });

            const res = await arr.json();

            this.setUserInfo(res[0]);

            return res[0];
        }

        return undefined;
    }

    getUserInfo = async (user_id) => {
        const res = await fetch('/api/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user_id })
        });
        const li = await res.json();

        this.setUserInfo(li[0]);

        return li[0];
    }

    getBasket = async () => {
        const arr = await fetch('/api/getBasket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: this.userInfo.user_id })
        });
        return await arr.json();
    }

    getNewsData = async () => {
        const arr = await fetch('/api/getNews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ })
        });
        const res = await arr.json();

        this.setNewsData(res);

        return res;
    }
}

const store = new Store();
export default store;


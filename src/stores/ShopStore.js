import { action, observable, makeObservable } from 'mobx';

class Store {
    constructor() {
        makeObservable(this);
    }

    @observable gridSource = [];

    @observable treeSource = [];

    @observable currentNode = '';
    @observable userInfo = {};
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

            return res[0];
        }

        return undefined;
    }
}

const store = new Store();
export default store;
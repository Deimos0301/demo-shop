import { action, observable } from 'mobx';

class Store {
    @observable gridSource = [];

    @observable treeSource = [];

    @action setTreeSource = (data) => {
        this.treeSource = [...data];
    }

    @action setGridSource = (data) => {
        this.gridSource = [...data];
    }

    getUserInfo = async() => {
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
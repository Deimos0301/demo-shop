import React, { Component } from "react";
import { List } from 'devextreme-react';
import { Link } from 'react-router-dom';
import store from "../stores/ShopStore";
import './Style/news.css';
import '../App.css';
import { Button } from "devextreme-react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Hits from "./hits";


@observer
export default class News extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = async () => {
        const arr = await store.getNewsData();
    }

    newsItem = (e) => {
        const href = `/news?news_id=${e.news_id}`;

        return (
            <div style={{ display: "flex", flexDirection: "column" }} >
                <Link to={href} style={{textDecoration: "none"}}>
                    <div>{e.news_short}</div>
                    <div style={{ color: "gray", fontSize: "13px" }}>{new Date(e.news_date).toLocaleString('ru-RU')}</div>
                </Link>
            </div>
        );
    }

    render() {
        return (
            <div className="news-main">
                <div className="hits">
                    <div className="header-panel">Новинки</div>
                    <div className="hit_desc"><Hits /></div>
                </div>

                <div className="news">
                    <div className="header-panel">Новости</div>

                    <List
                        key={store.newsData.news_id}
                        dataSource={store.newsData}
                        itemRender={this.newsItem}
                        repaintChangesOnly={true}>
                    </List>
                </div>
            </div>
        );
    }
}
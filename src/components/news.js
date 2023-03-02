import React, { Component } from "react";
import './Style/news.css';
import '../App.css';

export default class News extends Component {
    render() {
        return (
            <div className="news-main">
                <div className="hits">
                    <div className="header-panel">Новинки</div>
                </div>

                <div className="news">
                    <div className="header-panel">Новости</div>
                </div>
            </div>
        );
    }
}
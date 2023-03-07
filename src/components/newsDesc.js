import React, { Component } from 'react';
import store from '../stores/ShopStore';
import { observer } from 'mobx-react';
import HtmlEditor, {
    Toolbar, MediaResizing, ImageUpload, Item,
} from 'devextreme-react/html-editor';
// import parse from 'html-react-parser';

@observer
export default class NewsDesc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newsInfo: {}
        };
    }

    componentDidMount = async () => {
        const queryParameters = new URLSearchParams(window.location.search);
        const news_id = queryParameters.get("news_id");

        let arr = [];

        //console.log(store.newsData.news_id)
        if (!store.newsData.news_id) {
            arr = await store.getNewsData();
            const item = arr.find((item) => item.news_id === Number(news_id));            
            //console.log(item)
            this.setState({ newsInfo: item });
        }
        else {
            const item = store.newsData.find((item) => item.news_id === Number(news_id));
            this.setState({ newsInfo: item })
        }
    }

    render() {
        // console.log(this.state.newsInfo.news_text)
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{ display: "flex", width: "60%" }}>
                <HtmlEditor
                    // height="525px"
                        width="900px"
                    readOnly={true}
                    value={this.state.newsInfo.news_text || ""}
                >
                </HtmlEditor>
                {/* <div>{parse(this.state.newsInfo.news_text || "")}</div> */}
                </div>
            </div>
        );
    }
}
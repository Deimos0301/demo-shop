import React, { Component } from "react";
import { List } from 'devextreme-react';
import { Tooltip } from 'devextreme-react/tooltip';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import DateBox from 'devextreme-react/date-box';
import { observer } from 'mobx-react';
import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";
import { confirm } from 'devextreme/ui/dialog';
import HtmlEditor, {Toolbar, MediaResizing, Item} from 'devextreme-react/html-editor';
import config from "devextreme/core/config";
import store from "../stores/ShopStore";

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const headerValues = [false, 1, 2, 3, 4, 5];

@observer
export default class NewsEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            news_id: 0,
            news_date: "",
            news_short: "",
            news_text: ""
        }
        
        config({forceIsoDateParsing: false});

        loadMessages(ruMessages);
        locale(navigator.language);
    }

    componentDidMount = async () => {
        await store.getNewsData();
    }

    newsItemRender = (e) => {
        //const href = `/news?news_id=${e.news_id}`;

        return (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column" }} >
                    <div>{e.news_short}</div>
                    <div style={{ color: "gray", fontSize: "13px" }}>{new Date(e.news_date).toLocaleString('ru-RU')}</div>
                </div>
                <div style={{ flexGrow: "1", minWidth: "10px" }}></div>
                <div> <Button id="delete" icon="minus" onClick={this.onDelClick} news_id={e.news_id} /> </div>
            </div>
        );
    }

    onItemClick = (e) => {
        //const D = new Date(e.itemData.news_date);
        //console.log(D.toLocaleString('ru-RU', {timeZone: "Europe/Moscow"}), D.toISOString())
        this.setState({
            news_id: e.itemData.news_id,
            news_text: e.itemData.news_text,
            news_date: e.itemData.news_date,
            news_short: e.itemData.news_short
        });
    }

    onAddClick = () => {
        const item = { news_id: -1, news_date: new Date(), news_short: "Новая новость", news_text: "Содержание" };
        const arr = [item, ...store.newsData];

        this.setState({
            news_id: item.news_id,
            news_text: item.news_text,
            news_date: item.news_date,
            news_short: item.news_short
        });

        store.setNewsData(arr);
    }

    onDelClick = async (e) => {
        if (e.component._props.news_id > 0) {
            const res = await confirm("Удалить запись?", "Подтверждение");
            if (!res) return;
        }

        if (e.component._props.news_id === -1) {
            const arr = [...store.newsData];
            const idx = arr.find(item => item === e.component._props.news_id);
            arr.splice(idx, 1);
            store.setNewsData(arr);
        }
        else {
            await fetch('/api/newsDelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ news_id: e.component._props.news_id })
            });

            await store.getNewsData();
        }

        this.setState({ news_id: 0 });
    }

    onCanelClick = async () => {
        this.setState( {
            news_id: 0,
            news_date: "",
            news_short: "",
            news_text: ""
        });
        await store.getNewsData();
    }

    onSaveClick = async () => {
        if (!this.state.news_id) return;

        if (this.state.news_id >= 0)
            await fetch('/api/newsUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ news_id: this.state.news_id, news_short: this.state.news_short, news_text: this.state.news_text, news_date: this.state.news_date })
            });
        else
            await fetch('/api/newsInsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ news_short: this.state.news_short, news_text: this.state.news_text, news_date: this.state.news_date })
            });

        await store.getNewsData();
    }

    onNewsShortChanged = (e) => {
        this.setState({ news_short: e.value });
    }

    onNewsDateChanged = (e) => {
        this.setState({ news_date: e.value });
    }

    onNewsTextChanged = (e) => {
        this.setState({ news_text: e.value });
    }

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Tooltip
                    target="#add"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                >
                    <div> Добавить запись </div>
                </Tooltip>

                <Tooltip
                    target="#cancel"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                >
                    <div> Отмена </div>
                </Tooltip>
                
                <Tooltip
                    target="#delete"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                >
                    <div> Удалить запись </div>
                </Tooltip>
                <div style={{ display: "flex", flexDirection: "column", width: "450px", minWidth: "450px", paddingRight: "5px", background: "aliceblue", borderRightStyle: "groove" }}>
                    <div style={{ display: "flex", flexDirection: "row", height: "52px", margin: "8px 0 8px 0", borderBottomStyle: "groove" }}>
                        <div style={{ marginLeft: "5px" }}> <Button icon="save" type="default" text="Сохранить" stylingMode="outlined" onClick={this.onSaveClick} disabled={this.state.news_id === 0}> </Button> </div>
                        <div style={{ flexGrow: "1" }} />
                        <div> <Button icon="plus" id="add" type="success" stylingMode="outlined" onClick={this.onAddClick} disabled={this.state.news_id < 0} /> </div>
                        <div> <Button icon="close" id="cancel" type="danger" stylingMode="outlined" onClick={this.onCanelClick} disabled={this.state.news_id >= 0} /> </div>
                        {/* <div> <Button icon="minus" onClick={this.onDelClick} /> </div> */}
                    </div>

                    <List
                        dataSource={store.newsData}
                        itemRender={this.newsItemRender}
                        // selectionMode='single'
                        // showSelectionControls={true}
                        onItemClick={this.onItemClick}
                        itemDeleteMode="static"
                        //onItemDeleting={this.onItemDeleting}
                        // allowItemDeleting={true}
                        repaintChangesOnly={true}>
                    </List>

                </div>

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                    <div style={{ paddingLeft: "5px", fontSize: "16px", fontWeight: "500", background: "rgb(247,247,247,0.4)" }}> Дата/время: </div>
                    <div style={{ marginBottom: "2px" }}> <DateBox defaultValue={this.now} displayFormat="dd.MM.yyyy HH.mm" placeholder="дд.мм.гггг чч:мм:сс" useMaskBehavior={true} value={this.state.news_date} onValueChanged={this.onNewsDateChanged} type="datetime" /> </div>
                    <div style={{ marginTop: "8px", paddingLeft: "5px", fontSize: "16px", fontWeight: "500", background: "rgb(247,247,247,0.4)" }}> Заголовок: </div>
                    <div style={{ marginBottom: "2px" }}> <TextBox placeholder="Введите заголовок..." value={this.state.news_short} onValueChanged={this.onNewsShortChanged}></TextBox> </div>

                    <div style={{ marginTop: "8px", paddingLeft: "5px", fontSize: "16px", fontWeight: "500", background: "rgb(247,247,247,0.4)" }}> Содержание: </div>
                    <HtmlEditor height="80vh" width="900px"
                        value={this.state.news_text}
                        onValueChanged={this.onNewsTextChanged}
                    >
                        <MediaResizing enabled={true} />
                        <Toolbar multiline={true}>
                            <Item name="undo" />
                            <Item name="redo" />
                            <Item name="separator" />
                            <Item
                                name="size"
                                acceptedValues={sizeValues}
                            />
                            <Item
                                name="font"
                                acceptedValues={fontValues}
                            />
                            <Item name="separator" />
                            <Item name="bold" />
                            <Item name="italic" />
                            <Item name="strike" />
                            <Item name="underline" />
                            <Item name="separator" />
                            <Item name="alignLeft" />
                            <Item name="alignCenter" />
                            <Item name="alignRight" />
                            <Item name="alignJustify" />
                            <Item name="separator" />
                            <Item name="orderedList" />
                            <Item name="bulletList" />
                            <Item name="separator" />
                            <Item
                                name="header"
                                acceptedValues={headerValues}
                            />
                            <Item name="separator" />
                            <Item name="color" />
                            <Item name="background" />
                            <Item name="separator" />
                            <Item name="link" />
                            <Item name="image" />
                            <Item name="separator" />
                            <Item name="clear" />
                            <Item name="codeBlock" />
                            <Item name="blockquote" />
                            <Item name="separator" />
                            <Item name="insertTable" />
                            <Item name="deleteTable" />
                            <Item name="insertRowAbove" />
                            <Item name="insertRowBelow" />
                            <Item name="deleteRow" />
                            <Item name="insertColumnLeft" />
                            <Item name="insertColumnRight" />
                            <Item name="deleteColumn" />
                        </Toolbar>
                    </HtmlEditor>
                </div>
            </div>
        );
    }
}
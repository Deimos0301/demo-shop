import React, { Component } from 'react';
import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import { Form, GroupItem, SimpleItem, Label } from 'devextreme-react/form';

import store from '../stores/ShopStore';
import md5 from 'md5';
import {
    RequiredRule,
    CompareRule,
    StringLengthRule,
    CustomRule
} from 'devextreme-react/validator';
//import { Form } from 'react-router-dom';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.oldPass = React.createRef();
    }

    componentDidMount = () => {
        //        console.log(this.oldPass.current)
        //this.oldPass.current.focus();
    }

    clearState = () => {
        this.setState({ oldPassword: "", newPassword1: "", newPassword2: "" });
    }

    titleRenderer = (data) => {
        return <div style={{ fontSize: "18px", fontWeight: "500" }}>Смена пароля</div>;
    }

    userChangePassword = async (user_id, password) => {
        await fetch('/api/userChangePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user_id, password: password })
        });
    }

    onSaveNewPassword = async (e) => {
        const { userInfo } = store;

        if (userInfo.user_id >= 0) {
            await this.userChangePassword(userInfo.user_id, this.formData.newPassword1);
        }

        this.props.hideChangePassword();
    }

    formData = {
        oldPassword: "",
        newPassword1: "",
        newPassword2: ""
    }

    okCancelRender = () => {
        return (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: "15px" }}>
                <div>
                    <Button text="OK" type="success" width="120px" icon="todo" stylingMode="outlined" validationGroup='changePassword' useSubmitBehavior={true} />
                </div>

                <div style={{ width: "10px" }}></div>

                <div>
                    <Button text="Отмена" width="120px" type="danger" icon="remove" stylingMode="outlined" onClick={() => { this.props.hideChangePassword() }} />
                </div>
            </div>
        )
    }

    validateOldPasword = (e) => {
        return md5(e.value) === store.userInfo.password;
    }

    render() {
        return (
            <Popup
                visible={this.props.changePasswordVisible}
                onHiding={this.hideChangePassword}
                dragEnabled={true}
                hideOnOutsideClick={true}
                showCloseButton={false}
                showTitle={true}
                title="Смена пароля"
                container=".App"
                titleRender={this.titleRenderer}
                width={380}
                height={280}
            >
                <form onSubmit={this.onSaveNewPassword}>
                    <Form
                        formData={this.formData}
                        validationGroup="changePassword"
                        onEditorEnterKey={() => { this.onSaveNewPassword() }}
                    >
                        <SimpleItem ref={this.oldPass} autoFocus dataField="oldPassword" editorType="dxTextBox" editorOptions={{ mode: "password", placeholder: "Старый пароль" }} >
                            <RequiredRule message="Пароль обязателен для ввода" />
                            <CustomRule message="Старый пароль указан неверно!" validationCallback={this.validateOldPasword} />
                            <Label text="" visible={false} />
                        </SimpleItem>

                        <SimpleItem dataField="newPassword1" editorType="dxTextBox" editorOptions={{ mode: "password", placeholder: "Новый пароль" }} >
                            <RequiredRule message="Пароль обязателен для ввода" />
                            <StringLengthRule message="Пароль должен содержать не менее 6 символов!" min={6} />
                            <Label text="" visible={false} />
                        </SimpleItem>

                        <SimpleItem dataField="newPassword2" editorType="dxTextBox" editorOptions={{ mode: "password", placeholder: "Новый пароль еще раз" }} >
                            <RequiredRule message="Пароль обязателен для ввода" />
                            <CompareRule message="Старый и новый пароли не совпадают!" comparisonTarget={() => this.formData.newPassword1} />
                            <Label text="" visible={false} />
                        </SimpleItem>

                        <GroupItem render={this.okCancelRender} />
                    </Form>
                </form>

                {/* <div style={{ display: 'flex', flexDirection: "column" }}>
                    <TextBox width="100%" value={this.state.oldPassword} className="profile_input" placeholder='Старый пароль' mode='password' onValueChanged={this.onOldPasswordChanged} >
                        <Validator>
                            <RequiredRule message="Старый пароль не указан" />
                        </Validator>
                    </TextBox>

                    <TextBox width="100%" value={this.state.newPassword1} className="profile_input" placeholder='Новый пароль' mode='password' onValueChanged={this.onNewPassword1Changed} >
                        <Validator>
                            <StringLengthRule message="Пароль должен содержать не менее 6 символов!" min={6} />
                        </Validator>
                    </TextBox>

                    <TextBox width="100%" value={this.state.newPassword2} className="profile_input" placeholder='Новый пароль еще раз' mode='password' onValueChanged={this.onNewPassword2Changed} >
                        <Validator>
                            <CompareRule message="Старый и новый пароли не совпадают!" comparisonTarget={() => this.state.newPassword1} />
                        </Validator>
                    </TextBox>

                    <div style={{ display: "flex", marginTop: "32px", width: "100%", justifyContent: "flex-end" }} >
                        <div><Button text="OK    " width="120px" type="success" icon="todo" stylingMode="outlined" useSubmitBehavior={true} validationGroup="changePassword"/></div>
                        <div style={{ minWidth: "7px" }}></div>
                        <div><Button text="Отмена" width="120px" type="danger" icon="remove" stylingMode="outlined" onClick={() => { this.props.hideChangePassword() }} /></div>
                    </div>
                </div> */}
            </Popup>

        );
    }
}
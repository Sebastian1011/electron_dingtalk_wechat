import React, { Component } from 'react';
import '../scss/content.scss';

export default class Content extends Component {
    constructor(props){
        super(props)
        this.renderContent = this.renderContent.bind(this);
    }

    renderContent() {
        switch (this.props.navTab){
            case "1":
                return <webview src="https://im.dingtalk.com/">this is dingding </webview>
            case "2":
                return <webview src="https://wx.qq.com/">this is wechat </webview>
            default:
                return <webview src="https://im.dingtalk.com/">this is dingding </webview>
        }
    }

    render() {
        return <div className="main-container">
            {
                this.renderContent()
            }
        </div>
    }
}
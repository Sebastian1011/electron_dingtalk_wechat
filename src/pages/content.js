import React, { Component } from 'react';
import '../scss/content.scss';
import Webview from '../components/webview/webview';

export default class Content extends Component {
    constructor(props){
        super(props)
        this.state = {
            autosize: true,
            allowpopups: true
        }
        this.renderContent = this.renderContent.bind(this);
    }

    renderContent() {
        switch (this.props.navTab){
            case "1":
                return <Webview title={"dingding"}/>
                // return <webview src="">this is dingding </webview>
            case "2":
                return <Webview title={"wechat"}/>
                // return <webview src="">this is wechat </webview>
            default:
                return <Webview title={"dingding"}/>
        }
    }

    render() {
        return <div className="main-container">
            {
                <Webview {...this.state} display={this.props.navTab === '1'} src={"https://im.dingtalk.com/"}/>
            }
            {
                <Webview preload="build/wechat.js" {...this.state} display={this.props.navTab === '2'} src={"https://wx.qq.com/"}/>
            }
        </div>
    }
}
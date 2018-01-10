import React, { Component } from 'react';
import './scss/app.scss';
import { Layout, Menu, Icon } from 'antd';
import MainContent from './pages/content';

const { Header, Footer, Sider, Content } = Layout;

export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            navTab: "1"
        }
        this.changeTab = this.changeTab.bind(this);
    }
    componentDidMount(){
        console.log('did mount')
        // setInterval(()=>{
        //     let myNotification = new Notification(new Date().getTime().toString(), {
        //         body: '通知正文内容'
        //     })
        // }, 2000)
    }

    changeTab(item){
        item && this.setState({navTab: item.key})
    }

    render() {
        return<div className="main-app">
            <Layout className="layout">
                <Header>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                        onClick={this.changeTab}
                    >
                        <Menu.Item key="1">钉钉</Menu.Item>
                        <Menu.Item key="2">微信</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '0'}}>
                    <MainContent {...this.state}/>
                </Content>
            </Layout>
        </div>
    }
}
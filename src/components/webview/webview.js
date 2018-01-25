import React, { Component } from 'react';
import { shell } from 'electron';
import reactDom from 'react-dom';
import './webview.scss';


export default class Webview extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const container = reactDom.findDOMNode(this.container);
        const excludes = ['display', 'className'];
        const single = ['autosize', 'allowpopups'];
        let propStr = "";
        Object.keys(this.props).forEach(prop => {
            if (!excludes.includes(prop)){
                if(single.includes(prop)){
                    this.props[prop] && (propStr += `${prop} `);
                }else {
                    propStr += `${prop}=${JSON.stringify(this.props[prop].toString())} `;
                }
            }
        });
        if(this.props.className){
            propStr += `class=${this.props.className} `;
        }
        container.innerHTML = `<webview ${propStr}/>`
        this.webview = container.firstChild;
        this.webview.addEventListener('new-window', e => {
            if(e.url !== this.props.src){
                shell.openExternal(e.url);
            }
        })
    }

    render(){
        const containerClass = `web-view ${this.props.display? '': 'hide-view'}`;
        return<div ref={(container) => this.container = container} className={containerClass}>
        </div>
    }
}
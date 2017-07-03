/**
 * Created by zmzhang2 on 6/30/17.
 *
 */
const {ipcRenderer} = require('electron');
const path = require('path');
const msgMap = {};

function loadPage () {
	console.log('Page loaded! ')
	setTimeout(function () {
		var menu = angular.element('.menu-item-content')[0];
		console.log("menu is : ", menu);
		if (!menu){
			console.log('load again!');
			loadPage()
		} else {
			const rootScope = angular.element(document.body).injector().get('$rootScope')
			initMsgMap();
			rootScope.$watch(function () {
				return parseInt(menu.textContent);
			}, function (newVal, oldVal) {
				if (newVal !== oldVal){
					newVal = isNaN(newVal) ? 0 : newVal;
					doNotify(newVal, oldVal);
				}
			})
		}
	}, 2000)
}
function initMsgMap() {
	const convItems = angular.element('.conv-lists conv-item');
	for (let i = 0; i < convItems.length; i++){
		const convItem = convItems[i];
		const convObj = {};
		const key = convItem.attributes['con-id'].value;
		const item = angular.element(convItem)
		msgMap[key] = convObj;
		convObj.latestMsg = item.find('.latest-msg')[0].outerText;
		convObj.title = item.find('.title-wrap .name')[0].outerText;
		const backgroundImg = item.find('.group-avatar').children()[0].style['backgroundImage'];
		const regex = /url\(\"(.*)\"\)/;
		const url = regex.exec(backgroundImg);
		if (url){
			convObj.background = regex.exec(backgroundImg)[1];
		}else {
			convObj.background = path.join(__dirname, '../../assets/icons/png/icon.png');
		}
	}
}

function doNotify (newVal, oldVal) {
	if (newVal > oldVal){
		notify();
		ipcRenderer.send('new-message', newVal);
	}else {
		ipcRenderer.send('update-status', newVal);
	}
}

function notify () {
	const convItems = angular.element('.conv-lists conv-item');
	const diffList = [];
	for (let i = 0; i < convItems.length; i++){
		const convItem = convItems[i];
		const key = convItem.attributes['con-id'].value;
		const item = angular.element(convItem)
		const latestMsg = item.find('.latest-msg')[0].outerText;
		const convObj = msgMap[key];
		// update latest message
		if (!convObj){
			diffList.push(key);
			const backgroundImg = item.find('.group-avatar').children(0).style['backgroundImage'];
			const title = item.find('.title-wrap .name')[0].outerText;
			const regex = new RegExp('url\\((.*)\\)', 'g');
			msgMap[key] = {
				title: title,
				latestMsg: latestMsg,
				background: regex.exec(backgroundImg)[1]
			}
		}else if (latestMsg !== convObj.latestMsg){
			diffList.push(key);
			convObj.latestMsg = latestMsg
		}
		
		// update mute status
		const muteList = item.find('.icon-conv-mute');
		if (muteList.length > 0){
			convObj.isMute = muteList[0].className.indexOf('ng-hide') < 0
		}else {
			convObj.isMute = false;
		}
	}
	
	for (let j = 0; j <diffList.length ; j++){
		const id = diffList[j];
		const notifyObj = msgMap[id];
		if (notifyObj.isMute) continue;
		const notification = new Notification(notifyObj.title, {
			icon: notifyObj.background,
			body: notifyObj.latestMsg
		})
		notification.onclick = function () {
			ipcRenderer.send('open-main-window');
		}
	}
}


ipcRenderer.on('new-message-reply', (event, arg) => {
	console.log(arg) // prints "pong"
})

window.onload = loadPage;

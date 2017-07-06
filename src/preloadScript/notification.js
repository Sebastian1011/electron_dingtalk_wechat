/**
 * Created by zmzhang2 on 6/30/17.
 *
 */
const {ipcRenderer} = require('electron');
const notifier = require('electron-notifications');
const path = require('path');
const msgMap = {};

function loadPage () {
	console.log('Page loaded! ')
	setTimeout(function () {
		const menu = angular.element('.menu-item-content')[0];
		const convList = angular.element('.conv-lists conv-item')
		console.log("menu is : ", menu);
		if (!menu || convList.length === 0){
			console.log('load again!');
			loadPage()
		} else {
			setTimeout(function () {
				const rootScope = angular.element(document.body).injector().get('$rootScope')
				initMsgMap();
				rootScope.$watch(function () {
					const menuInfo = angular.element('.menu-item-content')[0];
					return parseInt(menuInfo.textContent);
				}, function (newVal, oldVal) {
					if (newVal !== oldVal){
						newVal = isNaN(newVal) ? 0 : newVal;
						oldVal = isNaN(oldVal) ? 0 : oldVal;
						doNotify(newVal, oldVal);
					}
				})
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
		const matchList = regex.exec(backgroundImg);
		if (url){
			convObj.background = matchList && matchList[1] || path.join(__dirname, '../../assets/icons/png/icon.png');
		}else {
			convObj.background = path.join(__dirname, '../../assets/icons/png/icon.png');
		}
	}
}

function doNotify (newVal, oldVal) {
	if (newVal > oldVal){
		setTimeout(function () {
			notify();
		});
		ipcRenderer.send('new-message', newVal);
	}else {
		setTimeout(function () {
			initMsgMap();
		});
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
		const backgroundImg = item.find('.group-avatar').children()[0].style['backgroundImage'];
		const title = item.find('.title-wrap .name')[0].outerText;
		const regex = /url\(\"(.*)\"\)/;
		const matchList = regex.exec(backgroundImg);
		const icon = matchList && matchList[1] || path.join(__dirname, '../../assets/icons/png/icon.png');
		if (!convObj){
			diffList.push(key);
			msgMap[key] = {
				title: title,
				latestMsg: latestMsg,
				background: icon
			}
		}else if (latestMsg !== convObj.latestMsg){
			diffList.push(key);
			convObj.latestMsg = latestMsg;
			convObj.title = title;
			convObj.background = icon;
		}
		
		// update mute status
		const muteList = item.find('.icon-conv-mute');
		if (muteList.length > 0){
			msgMap[key].isMute = muteList[0].className.indexOf('ng-hide') < 0
		}else {
			msgMap[key].isMute = false;
		}
	}
	
	for (let j = 0; j <diffList.length ; j++){
		const id = diffList[j];
		const notifyObj = msgMap[id];
		if (notifyObj.isMute) continue;
		if (j > 5)break; // 最多显示5条通知
		
		const notification = notifier.notify(notifyObj.title, {
			message: notifyObj.latestMsg,
			buttons: ['open', 'close'],
			icon: notifyObj.background,
			id: id
		})
		
		notification.on('buttonClicked', (text, buttonIndex, options) => {
			if (text === 'open'){
				triggerClickConv(options.id);
				ipcRenderer.send('open-main-window');
			}
			notification.close()
		})
	}
}

function triggerClickConv (id) {
	const convItems = angular.element('.conv-lists conv-item');
	for (let i = 0; i < convItems.length; i++) {
		const convItem = convItems[i];
		const key = convItem.attributes['con-id'].value;
		if (key === id){
			angular.element(convItem).click()
		}
	}
}


ipcRenderer.on('new-message-reply', (event, arg) => {
	console.log(arg) // prints "pong"
})

window.onload = loadPage;

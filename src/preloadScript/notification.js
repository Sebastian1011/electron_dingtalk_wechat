/**
 * Created by zmzhang2 on 6/30/17.
 *
 */
const {ipcRenderer} = require('electron');

function loadPage () {
	console.log('Page loaded! ')
	setTimeout(function () {
		var menu = angular.element('.menu-item-content')[0];
		console.log("menu is : ", menu);
		if (!menu){
			console.log('load again!');
			loadPage()
		} else {
			var rootScope = angular.element(document.body).injector().get('$rootScope')
			rootScope.$watch(function () {
				return parseInt(menu.textContent);
			}, function (newVal, oldVal) {
				// // test
				// console.log(newVal);
				// newVal = isNaN(newVal) ? 0 : newVal;
				// doNotify(newVal, oldVal);
				// // test === end
				if (newVal !== oldVal){
					newVal = isNaN(newVal) ? 0 : newVal;
					doNotify(newVal, oldVal);
				}
			})
		}
	}, 2000)
}

function doNotify (newVal, oldVal) {
	if (newVal > oldVal){
		getNotifyInfo();
		ipcRenderer.send('new-message', newVal);
	}else {
		ipcRenderer.send('update-status', newVal);
	}
	console.log('show notification');
}

function getNotifyInfo () {
	console.log('get notification');
}

ipcRenderer.on('new-message-reply', (event, arg) => {
	console.log(arg) // prints "pong"
})

window.onload = loadPage;

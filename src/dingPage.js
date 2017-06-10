/**
 * Created by Sebastian on 04/06/2017.
 */
const path = require('path');
'use strict';
class DingPage{
}
DingPage.WEB_DT = "https://im.dingtalk.com/";
DingPage.DING_SIZE = {
    width: 990,
    height: 590,
	icon: path.join(__dirname, '../assets/icons/png/icon.png'),
};
DingPage.WINDOW_SIZE_LOGIN = {
    width: 380,
    height: 540,
};
DingPage.WINDOW_SIZE_LOADING = {
    width: 380,
    height: 120,
};
DingPage.WINDOW_SIZE_SETTINGS = {
    width: 990,
    height: 590,
};

DingPage.USER_AGENT = {
    freebsd: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    sunos: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    win32: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    linux: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    darwin: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
};
module.exports = DingPage;

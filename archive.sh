rm -rf dingtalk-linux-x64
rm dingtalk-linux-x64.tar.gz
npm run package
tar -zcvf dingtalk-linux-x64.tar.gz dingtalk-linux-x64

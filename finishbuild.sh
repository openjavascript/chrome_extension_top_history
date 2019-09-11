rm -rf ./top-history/icons*/manifest.* 
cp -rf ./src/chrome ./top-history 
cp -rf ./src/_locales ./top-history 
cp -rf ./src/manifest.json ./top-history/manifest.json

cp -rf ./top-history/index.html ./top-history/sync.html
cp -rf ./top-history/index.html ./top-history/importExport.html
cp -rf ./top-history/index.html ./top-history/dataManage.html
cp -rf ./top-history/index.html ./top-history/setting.html

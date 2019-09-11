rm -rf ./top_history/icons*/manifest.* 
cp -rf ./src/chrome ./top_history 
cp -rf ./src/manifest.json ./top_history/manifest.json

cp -rf ./top_history/index.html ./top_history/sync.html
cp -rf ./top_history/index.html ./top_history/importExport.html
cp -rf ./top_history/index.html ./top_history/dataManage.html
cp -rf ./top_history/index.html ./top_history/setting.html

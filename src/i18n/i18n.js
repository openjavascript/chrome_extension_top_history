
import VueI18n from 'vue-i18n'
import deepmerge from 'deepmerge'

const packInfo = require( '@root/package.json' );

// 准备翻译的语言环境信息
const messages = {
	en: {
        "mainPage": packInfo.name,
        "importExport": "import/export",
        "dataManage": "data manage",
        "popupPage": "popup page",
        "setting": "setting"

		, "searchPlaceholder": "search text"
		, "nodata": "nothing in there"

        , "synchronous_short": "sync"
        , "synchronous_in_processing": "data synchronous in processing, please waiting..."
        , "synchronous_in_processing_short": "syncing..."

        , "sync": "synchronous"
        , "login_github": "login github"
        , "no_login_sync_msg": "synchronous data must be login @github!"
        , "synchronous_data": "synchronous data from remote server"
        , "synchronous": "data synchronous"

        , "logout": "logout"
        , "login": "login"
	},
	zh: {
        "mainPage": packInfo.name,
        "importExport": "导入/导出",
        "dataManage": "数据管理",
        "popupPage": "popup 页面",
        "setting": "设置"

		, "searchPlaceholder": "请输入内容"
		, "nodata": "暂无数据"

        , "synchronous_short": "同步"
        , "synchronous_in_processing": "数据同步中，请稍候..."
        , "synchronous_in_processing_short": "数据同步中..."

        , "sync": "同步数据"
        , "login_github": "login github"
        , "no_login_sync_msg": "同步数据需要先登陆@github"
        , "synchronous_data": "从服务器同步数据"
        , "synchronous": "data synchronous"

        , "logout": "退出"
        , "login": "登陆"
	}
}

function fixLocale( lang ){
	let zh = clone( lang.zh ), en = clone( lang.en );
	lang.en = deepmerge( zh, lang.en );
	lang.zh  = deepmerge( en, lang.zh );

    lang['zh-CN'] = lang['zh']
    lang['en-US'] = lang['en']
}

function clone( item ){
	return JSON.parse( JSON.stringify( item ) )
}

export default {
    supportLang: {
        'zh': '中文'
        , 'en': 'English'
    }
    , init( locale = zh, page = 'index' ) {
        let json = require( `./pages/${page}/index.js` );
        let merged = deepmerge( messages, json );
        fixLocale( merged );

        const i18n = new VueI18n({
            locale: locale, // 设置地区
            messages: merged, // 设置地区信息
        })

        return i18n;
    }

    , getLocale(){
		let locale = localStorage.getItem( 'locale' ) || navigator.language.replace( /\-.*/, '' );
		return locale;
    }

	, updateLocale( lang ) {
		localStorage.setItem( 'locale', lang );
		return lang;
	}
};

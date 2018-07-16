var baseUrl = getApp().globalData.baseUrl
var initSign = getApp().globalData.initSign
Page({
	data: {
		newsData: null,
        url: ''
	},
	// onLoad: function () {
	// 	var uid = swan.getStorageSync('uid')
 //        if (!uid) {
 //            uid = 0
 //        }
 //        var login_sign = swan.getStorageSync('sign')
 //        if (!login_sign) {
 //            login_sign = initSign
 //        }
 //        var _this = this
 //        swan.request({
 //            url: baseUrl + 'api/news/newsdetails',
 //            method: 'POST',
 //            dataType: 'json',
 //            data: {
 //                uid: uid,
 //                login_sign: login_sign,
 //                id: 20
 //            },
 //            header: {
 //                'content-type': 'application/json' // 默认值
 //            },
 //            success: function(res) {
 //            	console.log(res)       
 //                if (res.data.status == 1) {
 //                   _this.setData({newsData: res.data.data})
 //                   console.log(_this.data.newsData)

 //                }
 //            },
 //            fail: function(res) {}
 //        });
	// }
    onLoad: function (options) {


        // var url = 'https://api.diy.yxecg.com/wap/discover/newsdetails/'
        var id = options.id
        // url += 'id/'+ id
        // var uid = swan.getStorageSync('uid')
        // if (uid) {
        //     url += '/login/1'
            
        // } else {
        //     url += '/login/0'
        // }
        var uid = swan.getStorageSync('uid')
        var login=1
        if (!uid) {
            uid = 0
            login = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }
        var _this = this
        swan.request({
            url: baseUrl + 'api/news/getDetail',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                login: login,
                id: id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
             console.log(res)       
                if (res.data.status == 1) {
                  _this.setData({url: res.data.data})

                }
            },
            fail: function(res) {}
        });
    }
})
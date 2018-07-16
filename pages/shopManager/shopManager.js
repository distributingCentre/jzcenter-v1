const baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        shopData: null
    },
    onLoad: function() {
        swan.showLoading({
            title: '加载中',
            mask: 'true'
        });
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        swan.request({
            url: baseUrl + 'api/myshop/sellList',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.status == 1) {
                    if (res.data.status == 1) {
                        var shopData = res.data.data
                        _this.setData({ shopData: shopData })
                        swan.hideLoading();
                    }
                }

            },
            fail: function(res) {
                console.log(res);

            }
        });
    }
})
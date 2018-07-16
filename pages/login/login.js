//获取应用实
var app = getApp()
//获取api
var API_URL = app.globalData.login
//更新用户信息
var API_URLS = app.globalData.setUserInfo

// 获取初始化登陆凭证 login-sign
const initSign = app.globalData.initSign

Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: '',
        openid: '',
        avatarUrl: ''
    },

    authorize: function(that, openid) {
        swan.authorize({
            scope: 'scope.userInfo',
            success: function(res) {
                // 用户同意授权
                that.getUserInfo(that, openid)
            },
            fail: function() {
                swan.getSetting({
                    success: function(res) {
                        // 设置中授权是开启的
                        if (res.authSetting['scope.userInfo']) {

                        } else {
                            // 设置中授权未开启
                            swan.showModal({
                                title: '提示',
                                content: '登录功能需要获取您的基本信息，是否前往设置开启授权',
                                cancelColor: '#999999',
                                confirmColor: '#0099cc',
                                success: function(res) {
                                    if (res.confirm) {
                                        console.log('用户点击了确定');
                                        swan.openSetting({
                                            success: function(res) {
                                                if (res.res.authSetting['scope.userInfo']) {
                                                    swan.reLaunch({
                                                        url: '/pages/mine/mine'
                                                    });
                                                } else {
                                                    swan.showToast({
                                                        title: '授权失败！',
                                                        icon: 'loading',
                                                        duration: 1000,
                                                    });
                                                }
                                            }
                                        })
                                    } else if (res.cancel) {
                                        swan.reLaunch({
                                            url: '/pages/index/index'
                                        })
                                    }
                                }
                            })

                        }
                    }
                })
            }
        })
    },
    click: function() {

        var that = this
        // this.authorize()
        this.getCode(that)
    },
    getCode: function(that) {
        swan.login({
            success: function(res) {

                var code = res.code
                if (code) {
                    console.log(res)
                    that.getOpenId(code, that)
                } else {
                    that.getCode(that)
                }
            },
            fail: function(err) {
                that.getCode(that)
            }
        });
    },

    getOpenId: function(code, that) {
        swan.request({
            url: API_URL,
            data: {
                code: code,
                login_sign: initSign
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var openid = res.data.data
                that.data.openid = openid
                that.authorize(that ,openid)
                // that.getUserInfo(that, openid)
            }
        })
    },

    // 获取用户信息
    getUserInfo: function(that, openid) {
        swan.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo
                // 页面显示用户百度账号头像
                // that.setData({ avatarUrl: userInfo.avatarUrl })
                swan.setStorageSync('userInfo', userInfo)
                var params = {
                    nickname: userInfo.nickName,
                    username: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                    login_sign: initSign,
                    openid: openid
                }
                swan.showLoading({
                    title: '登录中',
                    mask: 'true'
                });
                that.login(params)
            },

            // 获取用户信息失败
            fail: function(err) {
                swan.reLaunch({
                    url: '/pages/index/index'
                })
            }
        });
    },

    login: function(params) {
        console.log(params)
        swan.request({
            url: API_URLS,
            data: params,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    var uid = res.data.data.uid
                    var login_sign = res.data.data.login_sign
                    swan.setStorageSync('uid', uid)
                    swan.setStorageSync('sign', login_sign)
                    swan.hideLoading()
                    swan.reLaunch({
                        url: '/pages/mine/mine'
                    })
                } else {
                    swan.hideLoading()
                }

            },
            //错误处理
            fail: function(params) {

            }
        })
    }
})
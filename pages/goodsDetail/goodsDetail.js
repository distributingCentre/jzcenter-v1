const baseUrl = getApp().globalData.baseUrl
const initSign = getApp().globalData.initSign
Page({
    data: {
        currentNav: 'goods',
        goodsData: null,
        commentData: null,
        currentGoodsId: '',
        shopId: '',
        goodsNum: 1
    },
    reduceNum: function() {
        var num = this.data.goodsNum
        if (num > 1) {
            num--
            this.setData({ goodsNum: num })
        }
    },
    goBuy: function() {
        var temp = this.data.goodsData.goods_info
        var goods_info = [{ diy: temp.diy, goods_num: this.data.goodsNum, goods_id: temp.id }]
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            swan.showModal({
                title: '提示',
                content: '当前用户未登陆,是否前去登陆？',
                success: function(res) {
                    if (res.confirm) {
                        swan.navigateTo({
                            url: '/pages/login/login'
                        })
                    } else if (res.cancel) {
                    }
                }
            })
        } else {
            swan.navigateTo({
                url: '/pages/orderdetail/orderdetail?goods_info=' + JSON.stringify(goods_info)
            })
        }

    },
    plusNum: function() {
        var num = this.data.goodsNum
        num++
        this.setData({ goodsNum: num })
    },

    // 加入购物车
    addCart: function() {
        var goods_id = this.data.goodsData.goods_info.id
        var goods_num = this.data.goodsNum
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        // 未登录
        if (!uid) {
            swan.showModal({
                title: '提示',
                content: '当前用户未登陆,是否前去登陆？',
                success: function(res) {
                    if (res.confirm) {
                        swan.navigateTo({
                            url: '/pages/login/login'
                        })
                    } else if (res.cancel) {
                    }
                }
            })
        } else {
            // 已登录发送请求添加到购物车
            swan.request({
                url: baseUrl + 'api/shop/addCart',
                method: 'POST',
                dataType: 'json',
                data: {
                    uid: uid,
                    login_sign: login_sign,
                    goods_id: goods_id,
                    goods_num: goods_num
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    if (res.data.status == 0) {
                        swan.showToast({
                            title: res.data.msg,
                            icon: 'normal',
                            duration: 500
                        })
                    }
                    if (res.data.status == 1) {
                        swan.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1000
                        })
                    }
                },
                fail: function(res) {
                }
            });
        }

    },
    viewAllComment: function() {
        var event = {}
        event['currentTarget'] = {}
        event['currentTarget']['dataset'] = {}
        event['currentTarget']['dataset']['nav'] = 'comment'
        this.toggleNav(event)
    },
    // 进入店铺
    linkToShop: function() {
        var shop_id = this.data.shopId
        swan.setStorageSync('shop_id', shop_id);
        swan.navigateTo({
            url: '/pages/host/host'
        })
    },

    // 进入购物车
    linkToCart: function() {
        swan.switchTab({
            url: '/pages/cart/cart',
        });
    },
    // 头部导航切换
    toggleNav: function(event) {
        var currentNav = event.currentTarget.dataset.nav
        this.setData({ currentNav: currentNav })
        var id = this.data.currentGoodsId
        if (currentNav == 'goods') {

        } else if (currentNav == 'comment') {
            swan.showLoading({
                title: '加载中',
                mask: true
            })
            var uid = swan.getStorageSync('uid')
            if (!uid) {
                uid = 0
            }
            var login_sign = swan.getStorageSync('sign')
            if (!login_sign) {
                login_sign = initSign
            }
            var _this = this
            swan.request({
                url: baseUrl + 'api/shop/appraise',
                method: 'POST',
                dataType: 'json',
                data: {
                    uid: uid,
                    login_sign: login_sign,
                    goods_id: id
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    if (res.data.status == 1) {
                        var data = res.data.data
                        _this.setData({ commentData: data })
                        swan.hideLoading()
                    }
                },
                fail: function(res) {
                    swan.hideLoading()
                }
            });
        } else {

        }
    },

    // 请求商品详情数据方法
    goodsRequest: function(_this, goods_id) {
        swan.showLoading({
            title: '加载中',
            mask: true
        })
        var uid = swan.getStorageSync('uid')
        if (!uid) {
            uid = 0
        }
        var login_sign = swan.getStorageSync('sign')
        if (!login_sign) {
            login_sign = initSign
        }

        swan.request({
            url: baseUrl + 'api/shop/details',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                goods_id: goods_id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                if (res.data.status == 1) {
                    var data = res.data.data
                    _this.setData({ goodsData: data })
                    swan.hideLoading()
                }
            },
            fail: function(res) {
                swan.hideLoading()
            }
        });
    },
    onLoad: function(options) {
        var shop_id = options.shop_id
        this.setData({ shopId: shop_id })
        var goods_id = options.id
        this.data.currentGoodsId = goods_id
        var _this = this
        this.goodsRequest(_this, goods_id)

    }
})
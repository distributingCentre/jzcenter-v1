var baseUrl = getApp().globalData.baseUrl
Page({
    data: {
        addressLists: null,
        default: null,
        orderList: {},
        lists: [],
        isSwitchAddress: false,
        currentAddressId: null,
        tempAddressId: null,
        ids: null,
        userAddressId: null,
    },

    addaddress: function() {
        swan.navigateTo({
            url: '/pages/addaddress/addaddress'
        })
    },
    handleAddress: function(event) {
        var id = event.currentTarget.dataset.id
        this.setData({ isSwitchAddress: true })
        this.setData({ currentAddressId: id })

    },
    checkboxChange: function(event) {
        var id = event.detail.value[0]
        if (id) {
            this.setData({ currentAddressId: id })
            this.data.tempAddressId = id
        }
    },
    confirm: function() {
        console.log(this.data.addressLists)
        this.setData({ isSwitchAddress: false })
        var id = this.data.tempAddressId
        this.data.userAddressId = id
        if (id) {
            var _this = this
            this.data.addressLists.forEach(function(item, key) {
                if (item.id == id) {
                    _this.setData({ default: item })
                }
            })
        }
    },

    // 提交订单
    submit: function() {
        console.log('提交订单')
        var _this = this
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        swan.request({
            url: baseUrl + 'api/order/addorder',
            method: 'POST',
            dataType: 'json',
            data: {
                uid: uid,
                login_sign: login_sign,
                ids: _this.data.ids,
                userAddressId: _this.data.userAddressId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res.data)

                // 获取订单编号
                var data = res.data.data

                if (res.data.status == 1) {
                    var msg = res.data.msg
                    swan.navigateTo({
                        url: '/pages/payfor/payfor?data=' + data
                    })

                } else if (res.data.status == 0) {
                    var msg = res.data.msg
                    swan.showToast({
                        title: msg,
                        icon: 'normal',
                        duration: 2000,
                        success: function(res) {
                            // swan.navigateTo({
                            //     url: '/pages/payfor/payfor'
                            // })
                        },
                        // fail: function(res) {
                        //     console.log(res);
                        // }
                    });
                }
            }
        })

    },
    onLoad: function(options) {
        var uid = swan.getStorageSync('uid')
        var login_sign = swan.getStorageSync('sign')
        var _this = this
        var goods_info = options.goods_info
        if (goods_info) {
            // 再次购买入口
            goods_info = JSON.parse(options.goods_info)
            console.log(11111111)
            console.log(goods_info)
            var ids = []
            goods_info.forEach(function(item) {
                // type=1为官方自营 将goods_id转为single_id
                if (item.type == 1) {
                    var params = { single_id: item.goods_id, goods_id: 0, cart_id: 0, goods_num: item.goods_num }
                } else if (item.type == 0) {
                    var params = { single_id: 0, goods_id: item.goods_id, cart_id: 0, goods_num: item.goods_num }
                } else if (item.diy == 0) {
                    console.log('jdkdjfkdjfkdjflskfslfkjsflksdjfldskjfldsfjdslfj')
                    var params = { single_id: 0, goods_id: item.goods_id, cart_id: 0, goods_num: item.goods_num}
                }
                ids.push(params)

            })
            this.data.ids = ids
            swan.request({
                url: baseUrl + 'api/order/settlement',
                method: 'POST',
                dataType: 'json',
                data: {
                    uid: uid,
                    login_sign,
                    ids: ids,
                    ajax: 1
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    if (res.data.status == 1) {
                        swan.request({
                            url: baseUrl + 'api/order/settlement',
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                uid: uid,
                                login_sign: login_sign,
                                ids: ids
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function(res) {
                                console.log(res)
                                if (res.data.status == 1) {
                                    // var data = JSON.stringify(res.data)
                                    // var ids = JSON.stringify(that.data.ids)
                                    // swan.navigateTo({
                                    //     url: '/pages/orderdetail/orderdetail?data=' + data + '&ids=' + ids
                                    // })
                                    // console.log(res)
                                    // _this.data.orderList = res.data.data
                                    _this.setData({ orderList: res.data })
                                    console.log(_this.data.orderList)
                                    var lists = res.data.data.new_data
                                    Object.keys(lists).forEach(function(key) {
                                        _this.data.lists.push(lists[key])
                                        _this.setData({ lists: _this.data.lists })
                                    })
                                }
                            }
                        })
                    }
                }
            })

        } else {

            // 购物车入口
            console.log(options)

            var ids = JSON.parse(options.ids)
            this.data.ids = ids
            swan.request({
                url: baseUrl + 'api/order/settlement',
                method: 'POST',
                dataType: 'json',
                data: {
                    uid: uid,
                    login_sign: login_sign,
                    ids: ids
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    // console.log(res)
                    if (res.data.status == 1) {
                        console.log(res)
                        _this.data.orderList = res.data
                        _this.setData({orderList: res.data})
                        var lists = res.data.data.new_data
                        Object.keys(lists).forEach(function(key) {
                            _this.data.lists.push(lists[key])
                            _this.setData({ lists: _this.data.lists })
                        })
                    }
                }
            })           
        }

        swan.request({
            url: baseUrl + 'api/order/getaddress',
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
                if (res.data && res.data.length > 0) {
                    _this.setData({ addressLists: res.data })
                    res.data.forEach(function(item) {
                        if (item.is_default == 1) {
                            _this.data.default = item
                            _this.setData({ default: _this.data.default })
                            _this.data.userAddressId = item.id
                        }
                    })

                    // 如果没有默认地址则选择第一条数据中在地址
                    if (!_this.data.userAddressId) {
                        _this.data.userAddressId = res.data[0].id
                    }
                }
            }
        })

    }
})
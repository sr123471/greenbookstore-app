import Taro from "@tarojs/taro";

const login = () => {
    return new Promise((resolve, reject) => {
        if (!getUserFlag()) {
            Taro.showModal({
                title: '温馨提示',
                content: '亲，授权微信登录后才能正常使用小程序功能',
                success(res) {
                    console.log(res)
                    //如果用户点击了确定按钮
                    if (res.confirm) {
                        Taro.getUserProfile({
                            desc: '申请获取基本信息',
                            success: (res) => {
                                Taro.checkSession({
                                    success: function () {
                                        console.log(Taro.getStorageSync('openid'));
                                        console.log(Taro.getStorageSync('user'));
                                        console.log(Taro.getStorageSync('hasUserInfo'));
                                        //session_key 未过期，并且在本生命周期一直有效
                                    },
                                    fail: function () {
                                        Taro.showLoading({
                                            title: '小二处理中',
                                            mask: true,
                                        });
                                        // session_key 已经失效，需要重新执行登录流程
                                        Taro.login({
                                            success: function (res) {
                                                if (res.code) {
                                                    //发起网络请求
                                                    let data = {
                                                        action: 'login',
                                                        code: res.code,
                                                    };

                                                    let name = 'school';

                                                    console.log(res)

                                                    Taro.cloud.callFunction({
                                                        name,
                                                        data
                                                    }).then(res => {
                                                        Taro.setStorageSync('openid', res.result);
                                                        Taro.hideLoading();
                                                        resolve(true)
                                                    })
                                                } else {
                                                    Taro.hideLoading();
                                                    console.log('登录失败！' + res.errMsg)
                                                }
                                            }
                                        })
                                    }
                                })
                                Taro.setStorageSync('user', res.userInfo);
                                Taro.setStorageSync('hasUserInfo', true);
                            },

                            fail: (res) => {
                                console.log(res)
                                Taro.setStorageSync('user', {});
                                Taro.setStorageSync('hasUserInfo', false);
                            }
                        })
                    }
                }
            })
        }
        else {
            resolve('already login');
        }
    })
}


const getUserFlag = () => {
    let userInfoFlag = Taro.getStorageSync('hasUserInfo');
    if (userInfoFlag === false || userInfoFlag === '') {
        return false;
    }
    return true;
}

export { login, getUserFlag }
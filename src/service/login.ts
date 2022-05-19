import Taro from "@tarojs/taro";

const login = () => {
    return new Promise((resolve, reject) => {
        if (!getUserFlag()) {
            Taro.showModal({
                title: '温馨提示',
                content: '亲，授权微信登录后才能正常使用小程序功能',
                showCancel: false,
                success(res) {
                    Taro.getUserProfile({
                        desc: '申请获取基本信息',
                        success: (res) => {
                            Taro.showLoading({
                                title: '小二处理中',
                                mask: true,
                            });
                            Taro.login({
                                success: function (res) {
                                    if (res.code) {
                                        //发起网络请求
                                        let data = {
                                            action: 'login',
                                            code: res.code,
                                        };
                                        let name = 'school';

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
                            });
                            Taro.setStorageSync('user', res.userInfo);
                            Taro.setStorageSync('hasUserInfo', true);
                        },
                        fail: (res) => {
                            Taro.setStorageSync('user', {});
                            Taro.setStorageSync('hasUserInfo', false);
                            // 若用户拒绝，重新循环登录流程
                            //login();
                        }
                    })
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
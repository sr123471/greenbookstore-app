import Taro from "@tarojs/taro";

const login = () => {
    return new Promise((resolve, reject) => {
        if (!getUserFlag()) {
            Taro.getUserProfile({
                desc: '申请获取您的基本信息',
                success: (res) => {
                    Taro.showLoading({ title: '小二处理中' });
                    Taro.checkSession({
                        success: function () {
                            console.log(Taro.getStorageSync('openid'));
                            console.log(Taro.getStorageSync('user'));
                            console.log(Taro.getStorageSync('hasUserInfo'));
                            //session_key 未过期，并且在本生命周期一直有效
                        },
                        fail: function () {
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

                fail: () => {
                    Taro.setStorageSync('user', {});
                    Taro.setStorageSync('hasUserInfo', false);
                }
            })
        }
    })



    // if (loginFlag === false || loginFlag === '') {
    //     Taro.getUserProfile({
    //         lang: 'zh_CN',
    //         desc: '获取您的昵称、头像、性别',

    //         success: res => {
    //             let data = res.userInfo;
    //             console.log(res)
    //             Taro.showLoading({
    //                 title: '小二处理中',
    //             });
    //             Taro.setStorageSync('user', data);
    //             Taro.setStorageSync('loginFlag', true);
    //             Taro.hideLoading();

    //         },

    //         fail: () => {
    //             Taro.setStorageSync('loginFlag', false);
    //             return;
    //         }
    //     })
    // }
}


const getUserFlag = () => {
    let userInfoFlag = Taro.getStorageSync('hasUserInfo');
    if (userInfoFlag === false || userInfoFlag === '') {
        return false;
    }
    return true;
}

export { login, getUserFlag }
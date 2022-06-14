import Taro from "@tarojs/taro";

const login = () => {
    return new Promise((resolve, reject) => {
        Taro.showLoading({
            title: '处理中',
            mask: true,
        });
        Taro.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    Taro.cloud.callFunction({
                        name: 'login',
                        data: {
                            action: 'login',
                            code: res.code,
                        }
                    }).then((res: any) => {
                        console.log(res)
                        if (res.result.isNewUser) {
                            Taro.setStorageSync('isNewUser', true)
                            Taro.setStorageSync('openid', res.result.openid);
                        } else {
                            // 若用户已存在数据库中，则直接是登录态
                            Taro.setStorageSync('isNewUser', false)
                            Taro.setStorageSync('openid', res.result.openid);
                            Taro.setStorageSync('userInfo', {
                                name: res.result.userInfo.name,
                                phone: res.result.userInfo.phone
                            });
                        }
                        resolve(true)
                        Taro.hideLoading();
                    })
                } else {
                    Taro.hideLoading();
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    })
}

export { login }
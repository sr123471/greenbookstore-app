import { Component, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './index.less'


export default function Login() {
  const openid = Taro.getStorageSync('openid')
  const time = Date.now()
  const getPhoneNumber = (e) => {
    if (e.detail.cloudID && openid) {
      Taro.cloud.callFunction({
        name: 'login',
        data: {
          action: 'getPhoneNumber',
          openid,
          name: '书友' + time,
          cloudID: e.detail.cloudID
        }
      }).then((res: any) => {
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000,
        }).then(() => {
          console.log(res);
          Taro.setStorageSync('isNewUser', false)
          Taro.setStorageSync('userInfo', {
            name: '书友' + time,
            phone: res.result.list[0].data.phoneNumber
          })
          Taro.reLaunch({
            url: '../home/index'
          })
        })
      })
    }
  }

  return (
    <View>
      <View className='imgWrapper'>
        <Image className='img' src='https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/logo.png' mode='widthFix'></Image>
      </View>
      <View className='introduce'>文客淘书致力于为同学们提供便捷的二手书交易渠道，实现高校内部书籍的循环流转，建立资源节约型高校，热烈欢迎同学们的使用！</View>
      <Button className='bt' type='primary' open-type="getPhoneNumber" onGetPhoneNumber={getPhoneNumber}>微信手机号快捷登录</Button>
    </View>
  )

}

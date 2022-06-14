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
        <Image className='img' src='https://s1.ax1x.com/2022/06/14/X4s8fK.png' mode='widthFix'></Image>
      </View>
      <View className='introduce'>文客淘书角致力于为高校书籍环保流转、建立节约节能型高校出一份力。</View>
      <Button className='bt' type='primary' open-type="getPhoneNumber" onGetPhoneNumber={getPhoneNumber}>微信手机号快捷登录</Button>
    </View>
  )

}

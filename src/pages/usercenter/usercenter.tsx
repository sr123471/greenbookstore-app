import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './usercenter.less'

function UserCenter() {

  let data = {
    nickName: !Taro.getStorageSync('isNewUser') ? Taro.getStorageSync('userInfo').name : null,
  }

  const [user, setUser] = useState(data);

  const handleIsLogin = () => {
    if (Taro.getStorageSync('isNewUser')) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return false
    }
    return true;
  }

  const userLogin = () => {
    handleIsLogin();
  }

  const toAllOrder = () => {
    const isLogin = handleIsLogin();
    if (!isLogin) return;

    Taro.navigateTo({
      url: '../order/order',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('toOrder', { showMode: 'allorder' })
      }
    }).then(() => {
      console.log("OK！")
    })
  }

  const toUnReceived = () => {
    const isLogin = handleIsLogin();
    if (!isLogin) return;

    Taro.navigateTo({
      url: '../order/order',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('toOrder', { showMode: 'unReceived' })
      }
    }).then(() => {
      console.log("OK！")
    })
  }

  const toDone = () => {
    const isLogin = handleIsLogin();
    if (!isLogin) return;

    Taro.navigateTo({
      url: '../order/order',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('toOrder', { showMode: 'done' })
      }
    }).then(() => {
      console.log("OK！")
    })
  }

  const toUserInfo = () => {
    const isLogin = handleIsLogin();
    if (!isLogin) return;

    Taro.navigateTo({ url: '../userinfo/userinfo' }).then(() => {
      console.log("OK！")
    })
  }

  const toSellBooks = () => {
    Taro.navigateTo({ url: '../sellbooks/sellbooks' }).then(() => {
      console.log("OK！")
    })
  }

  const toAdvice = () => {
    const isLogin = handleIsLogin();
    if (!isLogin) return;

    Taro.navigateTo({ url: '../advice/advice' }).then(() => {
      console.log("OK！")
    })
  }

  return (
    <View className='bg'>
      <View className='container0' onClick={userLogin}>
        <Image className='avatar' src="https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/avatar.png" />
        <View className={user.nickName === null ? 'username' : 'username_login'}>{user.nickName === null ? '登录/注册' : user.nickName}
          {/* <View className='school'>XXX大学</View> */}
        </View>
      </View>
      <View className='container1'>
        <View onClick={toAllOrder}>
          <Image className='icon1' src='https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/allorder.png' />
          <View>全部订单</ View>
        </View>

        <View onClick={toUnReceived}>
          <Image className='icon1' src='https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/package.png' />
          <View>待取货</View>
        </View>

        <View onClick={toDone}>
          <Image className='icon1' src='https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/star.png' />
          <View>已完成</View>
        </View>

        <View onClick={toUserInfo}>
          <Image className='icon1' src='https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/userinfo.png' />
          <View>个人信息</View>
        </View>

        <View onClick={toSellBooks}>
          <Image className='icon1' src='https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/recycle.png' />
          <View>图书回收</View>
        </View>

        <View onClick={toAdvice}>
          <Image className='icon1' src='https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/advice.png' />
          <View>意见反馈</View>
        </View>
      </View>
    </View>
  )
}


export default UserCenter
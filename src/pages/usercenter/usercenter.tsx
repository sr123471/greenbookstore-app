import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { login, getUserFlag } from '../../service/login'
import './usercenter.less'


function UserCenter() {

  let data = {
    nickName: null,
    avatarUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F00%2F92%2F67%2F9056f22f463e465.jpg&refer=http%3A%2F%2Fku.90sjimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652014245&t=1adff36eb44f0128a03f40a4fdbf4e50',
  }

  if (getUserFlag()) {
    data = Taro.getStorageSync('user')
  }

  const [user, setUser] = useState(data);

  async function getUser() {
    await login();
    setUser(Taro.getStorageSync('user'));
  }

  useEffect(() => {
    if (!getUserFlag()) {
      getUser();
    }
  }, [])

  const toUserInfo = () => {
    if (!getUserFlag()) {
      getUser();
      return;
    }

    Taro.navigateTo({ url: '../userinfo/userinfo' }).then(() => {
      console.log("OK！")
    })

  }

  const toSellBooks = () => {
    if (!getUserFlag()) {
      getUser();
      return;
    }

    Taro.navigateTo({ url: '../sellbooks/sellbooks' }).then(() => {
      console.log("OK！")
    })
  }

  const toAdvice = () => {
    if (!getUserFlag()) {
      getUser();
      return;
    }

    Taro.navigateTo({ url: '../advice/advice' }).then(() => {
      console.log("OK！")
    })
  }

  const toAllOrder = () => {
    if (!getUserFlag()) {
      getUser();
      return;
    }

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

  const toDone = () => {
    if (!getUserFlag()) {
      getUser();
      return;
    }

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

  const toUnReceived = () => {
    if (!getUserFlag()) {
      getUser();
      return;
    }

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

  return (
    <View className='bg'>
      <View className='container0'>
        <Image className='avatar' src={user.avatarUrl} />
        <View className='username'>{user.nickName === null ? '暂未登陆' : user.nickName}
          <View className='line' />
          {/* <View className='school'>XXX大学</View> */}
        </View>
      </View>
      <View className='container1'>
        <View onClick={toAllOrder}>
          <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/allorder.png' />
          <View>全部订单</ View>
        </View>

        <View onClick={toUnReceived}>
          <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/package.png' />
          <View>待取货</View>
        </View>

        <View onClick={toDone}>
          <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/star.png' />
          <View>已完成</View>
        </View>

        <View onClick={toUserInfo}>
          <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/userinfo.png' />
          <View>个人信息</View>
        </View>

        <View onClick={toSellBooks}>
          <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/recycle.png' />
          <View>图书回收</View>
        </View>

        <View onClick={toAdvice}>
          <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/advice.png' />
          <View>意见反馈</View>
        </View>
      </View>
    </View>
  )
}


export default UserCenter
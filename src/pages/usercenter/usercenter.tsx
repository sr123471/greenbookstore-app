import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './usercenter.less'


function UserCenter() {

  return (
    <View className='bg'>
      <View className='container0'>
        <Image className='avatar' src='https://joeschmoe.io/api/v1/random' />
        <View className='username'>王小明
          <View className='line' />
          <View className='school'>XXX大学</View>
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

const toUserInfo = () => {
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
  Taro.navigateTo({ url: '../advice/advice' }).then(() => {
    console.log("OK！")
  })
}

const toAllOrder = () => {
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


export default UserCenter
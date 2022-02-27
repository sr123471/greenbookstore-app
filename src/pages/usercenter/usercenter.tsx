import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './usercenter.less'


function UserCenter() {

  return (
    <View className='bg'>
      <View className='gridshow'>
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
          <View onClick={toUnPaid}>
            <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/payment.png' />
            <View>待付款</View>
          </View>

          <View onClick={toUnSent}>
            <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/package.png' />
            <View>待发货</View>
          </View>

          <View onClick={toUnReceived}>
            <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/delivery.png' />
            <View>待收货</View>
          </View>

          <View onClick={toMyStar}>
            <Image className='icon1' src='https://labeler.oss-cn-hangzhou.aliyuncs.com/img/star.png' />
            <View>我的收藏</View>
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

const toAllOrder=()=>{
  Taro.navigateTo({ url: '../allorder/allorder' }).then(() => {
    console.log("OK！")
  })
}

const toUnPaid=()=>{
  Taro.navigateTo({ url: '../unpaid/unpaid' }).then(() => {
    console.log("OK！")
  })
}

const toUnSent=()=>{
  Taro.navigateTo({ url: '../unsent/unsent' }).then(() => {
    console.log("OK！")
  })
}

const toUnReceived=()=>{
  Taro.navigateTo({ url: '../unreceived/unreceived' }).then(() => {
    console.log("OK！")
  })
}

const toMyStar=()=>{
  Taro.navigateTo({ url: '../mystar/mystar' }).then(() => {
    console.log("OK！")
  })
}

export default UserCenter
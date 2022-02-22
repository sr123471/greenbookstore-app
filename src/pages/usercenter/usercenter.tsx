import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './usercenter.less'


function UserCenter() {

  return (
    <View className='gridshow'>
      <Image className='avatar' src='https://img2.baidu.com/it/u=1537133661,1519623815&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' />
      <View className='username'>haha</View>
      <View className='container1'>
        <Image className='icon1' src='../../resource/home.png' />
        <View>我的收藏</View>
      </View>

      <View className='container1' onClick={test}>
        <Image className='icon1' src='../../resource/home.png' />
        <View>个人信息</View>
      </View>

      <View className='container1'>
        <Image className='icon1' src='../../resource/home.png' />
        <View>全部订单</View>
      </View>

      <View className='container1'>
        <Image className='icon1' src='../../resource/home.png' />
        <View>图书回收</View>
      </View>

      <View className='container1'>
        <Image className='icon1' src='../../resource/home.png' />
        <View>待付款</View>
      </View>

      <View className='container1'>
        <Image className='icon1' src='../../resource/home.png' />
        <View>待发货</View>
      </View>

      <View className='container1'>
        <Image className='icon1' src='../../resource/home.png' />
        <View>待收货</View>
      </View>

      <View className='container1'>
        <Image className='icon1' src='../../resource/home.png' />
        <View>意见反馈</View>
      </View>
    </View>
  )
}

const test=()=>{
  console.log("test")
}

export default UserCenter
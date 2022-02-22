import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './usercenter.less'


function UserCenter() {

  return (
    <View className='bg'>
      <View className='gridshow'>
        <View className='container0'>
          <Image className='avatar' src='https://joeschmoe.io/api/v1/random' />
          <View className='username'>王小明
          <View className='line'/>
          <View className='school'>XXX大学</View>
          </View>
        </View>
        <View className='container1'>
          <View>
            <Image className='icon1' src='../../resource/allorder.png' />
            <View>全部订单</ View>
          </View>
          <View>
            <Image className='icon1' src='../../resource/payment.png' />
            <View>待付款</View>
          </View>

          <View>
            <Image className='icon1' src='../../resource/package.png' />
            <View>待发货</View>
          </View>

          <View>
            <Image className='icon1' src='../../resource/delivery.png' />
            <View>待收货</View>
          </View>

          <View>
            <Image className='icon1' src='../../resource/star.png' />
            <View>我的收藏</View>
          </View>
          <View onClick={test}>
            <Image className='icon1' src='../../resource/userinfo.png' />
            <View>个人信息</View>
          </View>

          <View>
            <Image className='icon1' src='../../resource/recycle.png' />
            <View>图书回收</View>
          </View>

          <View>
            <Image className='icon1' src='../../resource/advice.png' />
            <View>意见反馈</View>
          </View>
        </View>
      </View>
    </View>
  )
}

const test = () => {
  console.log("test")
}

export default UserCenter
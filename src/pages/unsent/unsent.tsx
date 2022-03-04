import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from "taro-ui"
import { View, Image, Text } from '@tarojs/components'
import './unsent.less'

export default class UnSent extends Component<any, any> {

  detail(record) {
    Taro.navigateTo({ url: '../orderdetail/orderdetail' })
  }

  pay() {
    console.log('payment')
  }

  toAllOrder=()=>{
    Taro.redirectTo({ url: '../allorder/allorder' }).then(() => {
      console.log("OK！")
    })
  }
  
  toUnPaid=()=>{
    Taro.redirectTo({ url: '../unpaid/unpaid' }).then(() => {
      console.log("OK！")
    })
  }
  
  toUnReceived=()=>{
    Taro.redirectTo({ url: '../unreceived/unreceived' }).then(() => {
      console.log("OK！")
    })
  }

  render() {
    return (
      <View className='bg'>
        <View className='nav'>
          <Text onClick={this.toAllOrder.bind(this)} className='nav1'>全部订单</Text>
          <Text onClick={this.toUnPaid.bind(this)} className='nav1'>待付款</Text>
          <Text className='nav1 navSelected'>待发货</Text>
          <Text onClick={this.toUnReceived.bind(this)} className='nav1'>待收货</Text>
        </View>
        <View className='card' onClick={this.detail.bind(this)}>
          <Image
            className='bookpic'
            src='https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg'
          />
          <View className='bookinfo'>
            <AtIcon className='arrow' value='chevron-right' size='20' color='#8c8c8c' />
            <View className='booktitle'>
              四大皆空少放辣椒配全网人气危旧房屋记得前几位妇女去外婆发的书的小
            </View>
            <View className='price'>
              <Text className='priceint'>¥10.</Text>
              <Text className='pricedecimal'>50</Text>
            </View>
            <View className='btncontainer'>
              {/* 阻止事件冒泡 */}
              <AtButton onClick={(e) => { e.stopPropagation(), this.pay() }} circle={true} className='btn' size='small'>待定</AtButton>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
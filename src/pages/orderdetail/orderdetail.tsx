import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtListItem, AtList } from "taro-ui"
import { View, Image, Text } from '@tarojs/components'
import './orderdetail.less'

export default class UnReceived extends Component<any, any> {

  detail(record) {
    console.log(record)
  }

  pay() {
    console.log('payment')
  }

  render() {
    return (
      <View className='bg'>
        <View className='card' onClick={this.detail.bind(this)}>
          <Image
            className='bookpic'
            src='https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg'
          />
          <View className='bookinfo'>
            <View className='booktitle'>
              马克思主义基本原理概论
            </View>
            <View className='price'>
              <Text className='priceint'>¥10.</Text>
              <Text className='pricedecimal'>50</Text>
            </View>
          </View>

          <AtList className='list'>
            <AtListItem title='订单编号' note='123123123123123123123' />
            <AtListItem title='收货信息' note='浙江省杭州市西湖区XX大学XX校区' />
            <AtListItem title='创建时间' note='2022-01-01 19:19:19' />
            <AtListItem title='付款时间' note='2022-01-01 19:19:19' />
            <AtListItem title='发货时间' note='2022-01-01 19:19:19' />
            <AtListItem title='成交时间' note='2022-01-01 19:19:19' />
          </AtList>

        </View>
      </View>
    )
  }
}
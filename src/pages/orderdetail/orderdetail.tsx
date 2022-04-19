import Taro from '@tarojs/taro'
import { useState } from 'react'
import { useReady, getCurrentPages } from '@tarojs/taro'
import { AtListItem, AtList } from "taro-ui"
import { View, Image, Text } from '@tarojs/components'
import './orderdetail.less'

export default function OrderDetail() {
  const [order, setOrder] = useState(Object)

  useReady(() => {
    let pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    eventChannel.on('toDetail', function (data) {
      setOrder(data)
    })
  })

  return (
    <View className='bg'>
      <View className='card'>
        <Image
          className='bookpic'
          src={order.imgURL}
        />
        <View className='bookinfo'>
          <View className='booktitle'>
            {order.bookName}
          </View>
          <View className='price'>
            <Text className='priceint'>¥{order.priceInt}</Text>
            <Text className='pricedecimal'>.{order.priceDecimal}</Text>
          </View>
        </View>

        <AtList className='list'>
          <AtListItem title='订单编号' note={order._id} />
          <AtListItem title='付款时间' note={order.createTime} />
          <AtListItem title='成交时间' note={order.receiveTime} />
        </AtList>

      </View>
    </View>
  )
}
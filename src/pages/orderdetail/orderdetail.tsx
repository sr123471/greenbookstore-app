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
      let receiveTime = new Date(data.receiveTime)
      let createTime = new Date(data.createTime)

      let year = receiveTime.getFullYear()
      let month = receiveTime.getMonth() + 1
      let day = receiveTime.getDate()
      let h = receiveTime.getHours().toString()
      let m = receiveTime.getMinutes().toString()
      let s = receiveTime.getSeconds().toString()

      if (h.length == 1) {
        h = '0' + h
      }

      if (m.length == 1) {
        m = '0' + m
      }

      if (s.length == 1) {
        s = '0' + s
      }

      data.receiveTime = `${year}-${month}-${day} ${h}:${m}:${s}`

      if (year === 1970) {
        data.receiveTime = '未签收'
      }



      year = createTime.getFullYear()
      month = createTime.getMonth() + 1
      day = createTime.getDate()
      h = createTime.getHours().toString()
      m = createTime.getMinutes().toString()
      s = createTime.getSeconds().toString()

      if (h.length == 1) {
        h = '0' + h
      }

      if (m.length == 1) {
        m = '0' + m
      }

      if (s.length == 1) {
        s = '0' + s
      }

      data.createTime = `${year}-${month}-${day} ${h}:${m}:${s}`


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
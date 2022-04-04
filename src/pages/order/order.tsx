import { useState } from 'react'
import { getCurrentPages } from '@tarojs/taro'
import { useReady } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import OrderCard from '../../components/orderCard/orderCard'
import './order.less'

let
  order = [{
    img: 'https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg',
    bookName: '彷徨',
    price: 10.50,
    status: 'done'
  }, {
    img: 'https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg',
    bookName: '彷徨',
    price: 0.00,
    status: 'unReceived'
  }]

export default function Order() {

  const [showMode, setShowMode] = useState('allorder')

  useReady(() => {
    let pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    eventChannel.on('toOrder', function (data) {
      setShowMode(data.showMode)
    })
  })

  const toAllOrder = () => {
    if (showMode !== 'allorder')
      setShowMode('allorder')
  }

  const toDone = () => {
    if (showMode !== 'done')
      setShowMode('done')
  }

  const toUnReceived = () => {
    if (showMode !== 'unReceived')
      setShowMode('unReceived')
  }

  return (
    <View className='bg'>
      <View className='nav'>
        <Text onClick={toAllOrder} className={`nav1 ${showMode === 'allorder' ? 'navSelected' : null}`}>全部订单</Text>
        <Text onClick={toUnReceived} className={`nav1 ${showMode === 'unReceived' ? 'navSelected' : null}`}>待取货</Text>
        <Text onClick={toDone} className={`nav1 ${showMode === 'done' ? 'navSelected' : null}`}>已完成</Text>
      </View>
      {order.map((item) => {
        if (showMode === 'allorder')
          return (<OrderCard order={item}></OrderCard>)

        else if (showMode === item.status) {
          return (<OrderCard order={item}></OrderCard>)
        }
      })}
    </View>
  )
}
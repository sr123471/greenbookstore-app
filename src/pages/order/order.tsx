import { useState } from 'react'
import { getCurrentPages } from '@tarojs/taro'
import { useReady } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import OrderCard from '../../components/orderCard/orderCard'
import Taro from '@tarojs/taro'
import './order.less'
import { useEffect } from 'react'
import { cloudCall, dataCreator } from '../../service/order'

// let
//   order = [{
//     img: 'https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg',
//     bookName: '彷徨',
//     price: 10.50,
//     status: 'done'
//   }, {
//     img: 'https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg',
//     bookName: '彷徨',
//     price: 0.00,
//     status: 'unReceived'
//   }]

export default function Order() {

  const [showMode, setShowMode] = useState('allorder')
  const [order, setOrder] = useState([]);
  const [hasUnReceived, setHasUnReceived] = useState(false);
  const [hasDone, setHasDone] = useState(false);

  useReady(() => {
    let pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    eventChannel.on('toOrder', function (data) {
      setShowMode(data.showMode)
    })
  })

  useEffect(() => {
    let data = dataCreator('getOrderList', Taro.getStorageSync('openid'), 'allorder')
    cloudCall('school', data).then((res: any) => {
      setOrder(res.result);
      console.log(res.result);

      let flag = 0;
      for (let i = 0; i < res.result.length; i++) {
        if (res.result[i].status === 'unReceived') {
          setHasUnReceived(true);
          flag++;
        }
        else if (res.result[i].status === 'done') {
          setHasDone(true);
          flag++;
        }

        if (flag === 2) {
          break;
        }
      }
    })
  }, [])

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

  const empty = () => {
    return (
      <View className='emptyCart'>
        <AtIcon value='shopping-cart' size='80' color='#000'></AtIcon>
        <View>暂无此类订单哦</View>
      </View>
    )
  }

  const showEmpty = () => {
    if (!hasDone && showMode === 'done') {
      return empty();
    }
    else if (!hasUnReceived && showMode === 'unReceived') {
      return empty();
    }
    else if (order.length === 0) {
      return empty();
    }
  }

  return (
    <View className='bg'>
      <View className='nav'>
        <Text onClick={toAllOrder} className={`nav1 ${showMode === 'allorder' ? 'navSelected' : null}`}>全部订单</Text>
        <Text onClick={toUnReceived} className={`nav1 ${showMode === 'unReceived' ? 'navSelected' : null}`}>待取货</Text>
        <Text onClick={toDone} className={`nav1 ${showMode === 'done' ? 'navSelected' : null}`}>已完成</Text>
      </View>
      {!hasDone || !hasUnReceived ?
        showEmpty() :
        order.map((item) => {
          if (showMode === 'allorder')
            return (<OrderCard order={item}></OrderCard>)

          else if (showMode === item.status) {
            return (<OrderCard order={item}></OrderCard>)
          }
        })}
    </View>
  )
}
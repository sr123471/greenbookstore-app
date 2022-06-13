import { useState } from 'react'
import { getCurrentPages } from '@tarojs/taro'
import { useReady } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtIcon, AtDivider, AtActivityIndicator } from 'taro-ui'
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
  const [loading, setLoading] = useState(true);
  const [isActivityIndicatorOpened, setIndicator] = useState(false)

  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(5);


  const emptyJudge = (res) => {
    let flag1 = false;
    let flag2 = false;
    for (let i = 0; i < res.result.length; i++) {
      if (!flag1 && res.result[i].status === 'unReceived') {
        setHasUnReceived(true);
        flag1 = true;
      }
      else if (!flag2 && res.result[i].status === 'done') {
        setHasDone(true);
        flag2 = true;
      }

      if (flag1 && flag2) {
        break;
      }
    }
  }

  useReady(() => {
    let pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    eventChannel.on('toOrder', function (data) {
      setShowMode(data.showMode)
    })
  })

  useEffect(() => {
    setLoading(true);
    Taro.showLoading({
      title: '小二处理中',
      mask: true
    })

    setHasDone(false);
    setHasUnReceived(false);

    let data = dataCreator('getOrderCounts',
      Taro.getStorageSync('openid'), limit, skip, showMode)
    cloudCall('school', data)
      .then((res: any) => {
        setOrder([]);
        setTotal(res.result.total);
      })
      .then(() => {
        let data = dataCreator('getOrderList',
          Taro.getStorageSync('openid'), limit, 0, showMode)
        cloudCall('school', data)
          .then((res: any) => {
            setOrder(res.result);
            emptyJudge(res);
            setSkip(limit);
            Taro.hideLoading();
            setLoading(false);
          })
      })
  }, [showMode])

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
    if (!loading) {
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
  }

  const scrollToBottom = () => {
    // 如果偏移量大于等于数据库中书本的总数，则说明已显示完所有的书本，直接return
    console.log(order);
    if (skip >= total) return;
    let canLoading = true;

    return () => {
      setIndicator(true)

      if (!canLoading) return;
      canLoading = false;

      let data = dataCreator('getOrderList',
        Taro.getStorageSync('openid'), limit, skip, showMode)

      cloudCall('school', data)
        .then((res: any) => {
          const newOrderList = order.concat(res.result);

          setOrder(newOrderList);
          setIndicator(false)
          if (total - skip < limit) {
            setSkip(total)
          }
          else {
            setSkip(skip + limit);
          }
          canLoading = true;

        })
    };
  }


  return (
    <ScrollView
      scrollY
      onScrollToLower={scrollToBottom()}
    >

      <View className='nav'>
        <Text onClick={toAllOrder} className={`nav1 ${showMode === 'allorder' ? 'navSelected' : null}`}>全部订单</Text>
        <Text onClick={toUnReceived} className={`nav1 ${showMode === 'unReceived' ? 'navSelected' : null}`}>待取货</Text>
        <Text onClick={toDone} className={`nav1 ${showMode === 'done' ? 'navSelected' : null}`}>已完成</Text>
      </View>
      {(hasDone && showMode === 'done') ||
        (hasUnReceived && showMode === 'unReceived') ||
        (showMode === 'allorder' && (hasDone || hasUnReceived))
        ?
        order.map((item) => {
          if (showMode === 'allorder') {
            return (<OrderCard order={item}></OrderCard>)
          }

          else if (showMode === item.status) {
            return (<OrderCard order={item}></OrderCard>)
          }
        }) : showEmpty()}

      <AtActivityIndicator
        className='activityIndicator'
        color='#FFFFFF'
        isOpened={isActivityIndicatorOpened}
      ></AtActivityIndicator>

    </ScrollView>

  )
}
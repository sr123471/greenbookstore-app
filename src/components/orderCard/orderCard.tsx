import { useState } from 'react'
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon } from "taro-ui"

import './orderCard.less'

function OrderCard(props) {
  const order = useOrder(props.order)

  function detail() {
    // console.log(this)
    Taro.navigateTo({
      url: '../orderdetail/orderdetail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('toDetail', order)
      }
    })
  }

  return (
    <View className='card' onClick={detail.bind(order)}>
      <Image
        className='bookpic'
        src={order.imgURL}
      />
      <View className='bookinfo'>
        <AtIcon className='arrow' value='chevron-right' size='20' color='#8c8c8c' />
        <View className='booktitle'>
          {order.book[0].name}{order.book.length > 1 ? '等书籍' : ''}
        </View>
        <View className='price'>
          <Text className='priceint'>¥{order.priceInt}.</Text>
          <Text className='pricedecimal'>{order.priceDecimal}</Text>
        </View>
        <View className='btncontainer'>
          {/* 阻止事件冒泡 */}
          <View className='finish'>{order.status === 'done' ? '交易已完成' : '待取货'}</View>
        </View>
      </View>
    </View>
  );
}

interface OrderInfo {
  bookName: string;
  book: Array<object>;
  imgURL: string;
  price: number;
  status: string;
  _id: string;
  createTime: Date;
  receiveTime: Date;
}

interface OrderShow {
  bookName: string;
  book: Array<object>;
  imgURL: string;
  priceInt: string;
  priceDecimal: string;
  status: string;
  _id: string;
  createTime: Date;
  receiveTime: Date;
}

function useOrder(props: OrderInfo): OrderShow {
  const [bookName, setBookName] = useState(props.bookName);
  const [book, setBook] = useState(props.book)
  const [imgURL, setImg] = useState(props.imgURL);

  let int = Math.floor(props.price);
  let decimal = (props.price - int).toFixed(2);
  decimal = decimal.split('.')[1];

  const [priceInt, setPriceInt] = useState(int.toString());
  const [priceDecimal, setPriceDecimal] = useState(decimal);

  const [status, setStatus] = useState(props.status);

  const [_id, set_id] = useState(props._id);
  const [createTime, setCreateTime] = useState(props.createTime);
  const [receiveTime, setReceiveTime] = useState(props.receiveTime);

  return { bookName, book, imgURL, priceInt, priceDecimal, status, _id, createTime, receiveTime };
}

export default OrderCard


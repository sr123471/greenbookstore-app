import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { Book } from '../../components/common/common'
import './index.less'

// const receiveInformationList = [
//   {
//     location: '江苏省南京市江宁区',
//     specificAddress: '佛城西路8号',
//     consignee: '沈荣',
//     phoneNumber: '17326030622',
//     default: true,
//   },
//   {
//     location: '浙江省杭州市西湖区',
//     specificAddress: '留和路288号',
//     consignee: '沈荣',
//     phoneNumber: '17326030622',
//     default: false,
//   }
// ]

// const receiveInformation = receiveInformationList.find(item =>
//   item.default === true
// )

export default function Purchase() {

  const [bookList, setBookList] = useState<Book[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    const bookList: Book[] = Taro.getStorageSync('settleList');
    const totalPrice: number = bookList.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.presentPrice * currentValue.selectQuantity;
    }, 0);
    setBookList(bookList);
    setTotalPrice(totalPrice);
  }, [])

  // const handleLinkToAddressPage = (): void => {
  //   Taro.navigateTo({ url: '/pages/address/address' })
  // }

  // 提交订单
  const handleSubmitOrder = (): void => {
    // if (receiveInformationList.length === 0)
    //   Taro.showToast({
    //     title: '请先选择地址',
    //     icon: 'none'
    //   })
  }

  return (
    <View className='purchasePage'>
      <View className='content'>
        {/* 地址选择部分--暂略 */}
        {/* <View className='addressArea' onClick={this.handleLinkToAddressPage}>
            <AtIcon prefixClass='icon' value='zuobiao' size='25'></AtIcon>
            {
              receiveInformationList.length === 0 ?
                <Text className='addAddressText'>添加收货地址</Text> :
                <View className='addressText'>
                  <View className='location'>{receiveInformation.location}</View>
                  <View className='specificAddress'>{receiveInformation.specificAddress}</View>
                  <Text className='consignee'>{receiveInformation.consignee}</Text>
                  <Text className='phoneNumber'>{receiveInformation.phoneNumber}</Text>
                </View>
            }
            <AtIcon className='icon-right' value='chevron-right' size='20' color='#9D9D9D'></AtIcon>
          </View> */}
        <View className='orderMessage'>
          <AtIcon prefixClass='icon' className='icon-home' value='shouye' size='18'></AtIcon>
          <Text>绿色书屋</Text>
          <View>
            {
              bookList.map(item =>
                <View className='bookDetailMessage'>
                  <View className='bookImageBg'>
                    <Image className='bookImage' src={item.imgURL} mode='heightFix'></Image>
                  </View>
                  <View className='bookMessage'>
                    <View className='bookNameAndPrice'>
                      <View className='bookName'>{item.bookName}</View>
                      <View className='bookPrice'>¥{item.presentPrice}</View>
                    </View>
                    <View className='quantity'>×{item.selectQuantity}</View>
                  </View>
                </View>
              )
            }
          </View>
          <View className='distribution'>
            <View>配送方式</View>
            <View>自提点自提</View>
          </View>
        </View>
        <View className='purchaseWay'>
          <View>支付方式</View>
          <View className='wechatPurchase'>
            <AtIcon prefixClass='icon' value='weixinzhifu' size='40'></AtIcon>
            <View>微信支付</View>
            <AtIcon className='icon-gou' prefixClass='icon' value='gou-copy' size='20'></AtIcon>
          </View>
        </View>
      </View>
      <View className='footer'>
        <View>合计<Text className='totalPrice'>¥{totalPrice}</Text></View>
        <AtButton className='submitBt' onClick={handleSubmitOrder} type='primary' size='normal' circle={true}>提交订单</AtButton>
      </View>
    </View>
  )
}

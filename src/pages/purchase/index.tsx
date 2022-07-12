import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtTextarea } from 'taro-ui'
import { Book } from '../../components/common/common'
import pay from '../../service/pay'
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
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [note, setNote] = useState<string>('')
  const [finalNote, setFinalNote] = useState<string>('')

  useEffect(() => {
    const bookList: Book[] = Taro.getStorageSync('settleList');
    const totalPrice: number = bookList.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.presentPrice * currentValue.selectQuantity;
    }, 0);
    setBookList(bookList);
    setTotalPrice(Math.round(totalPrice * 100) / 100);
  }, [])

  // const handleLinkToAddressPage = (): void => {
  //   Taro.navigateTo({ url: '/pages/address/address' })
  // }

  const handleShowModal = () => {
    setIsOpened(true)
  }

  const handleCloseModal = () => {
    setIsOpened(false)
    setNote(finalNote)
  }

  const handleChange = (value) => {
    setNote(value)
  }

  const handleConfirm = () => {
    setFinalNote(note)
    setIsOpened(false)
  }

  // 提交订单
  const handleSubmitOrder = () => {
    let timer;

    let run = () => {
      pay(bookList, totalPrice, finalNote)
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, 4000);
    }

    return function () {
      if (!timer) {
        run();
      }
    }
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
          <Text>文客淘书</Text>
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
            <View>浙外图书馆五楼淘书阁自提</View>
          </View>
          <View className='orderNotes' onClick={handleShowModal}>
            <View>订单备注</View>
            <View className='note'>
              {
                finalNote ? <View className='finalNote'>{finalNote}</View> : <View className='noneNote'>无备注</View>
              }
              <AtIcon className='icon-right' value='chevron-right' size='20' color='#9D9D9D'></AtIcon>
            </View>
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
        <View className='disclaimer'>
          <View className='text1'>免责声明：</View>
          <View className='text2'>在下单前，请确认书籍是否为自己想要的版本，付款前请确保您已知晓并理解，一旦支付下单，除库存问题导致无法供应外，本交易默认【不支持】无理由退货退款（具体规则由书籍墙确认），涉及具体售后问题请咨询书籍墙微信号：heshan0314。</View>
        </View>
      </View>
      <View className='footer'>
        <View>合计<Text className='totalPrice'>¥{totalPrice}</Text></View>
        <AtButton className='submitBt' onClick={handleSubmitOrder()} type='primary' size='normal' circle={true}>提交订单</AtButton>
      </View>
      <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
        <AtModalHeader>添加备注</AtModalHeader>
        <AtModalContent>
          <AtTextarea
            value={note}
            onChange={handleChange}
            maxLength={200}
            placeholder='选填，若您有其他需求，请添加备注'
          />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={handleCloseModal}>取消</Button>
          <Button onClick={handleConfirm}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}

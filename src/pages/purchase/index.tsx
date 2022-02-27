import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtInputNumber, AtButton } from 'taro-ui'
import './index.less'

const mockBook =
{
  id: 1,
  name: '马克思主义基本原理概论',
  author: '本书编写组',
  publisher: '高等教育出版社',
  publishTime: 2013,
  ISBN: '1111111111',
  originalPrice: '23.00',
  presentPrice: '5.00',
  inventory: 8,
  imgURL: 'https://s3.bmp.ovh/imgs/2022/02/42d913af68766c41.png'
}

const receiveInformationList = [
  {
    location: '江苏省南京市江宁区',
    specificAddress: '佛城西路8号',
    consignee: '沈荣',
    phoneNumber: '17326030622',
    default: true,
  },
  {
    location: '浙江省杭州市西湖区',
    specificAddress: '留和路288号',
    consignee: '沈荣',
    phoneNumber: '17326030622',
    default: false,
  }
]

const receiveInformation = receiveInformationList.find(item =>
  item.default === true
)

export default class Index extends Component {

  state = { value: 1 };

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLinkToAddressPage = () => {
    Taro.navigateTo({ url: '/pages/address/address' })
  }

  // 计数器
  handleChange = (value) => {
    this.setState({
      value
    })
  }

  // 提交订单
  handleSubmitOrder = () => {
    if (receiveInformationList.length === 0)
      Taro.showToast({
        title: '请先选择地址',
        icon: 'none'
      })
  }

  render() {
    const { value } = this.state;

    return (
      <View className='purchasePage'>
        <View className='content'>
          <View className='addressArea' onClick={this.handleLinkToAddressPage}>
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
          </View>
          <View className='orderMessage'>
            <AtIcon prefixClass='icon' className='icon-home' value='shouye' size='18'></AtIcon>
            <Text>绿色书屋</Text>
            <View className='bookDetailMessage'>
              <View className='bookImageBg'>
                <Image className='bookImage' src={mockBook.imgURL} mode='heightFix'></Image>
              </View>
              <View className='bookMessage'>
                <View className='bookNameAndPrice'>
                  <View className='bookName'>{mockBook.name}</View>
                  <View className='bookPrice'>¥{mockBook.presentPrice}</View>
                </View>
                <AtInputNumber
                  className='quantity'
                  type='digit'
                  min={1}
                  max={mockBook.inventory}
                  step={1}
                  width={60}
                  value={value}
                  onChange={this.handleChange.bind(this)}
                />
              </View>
            </View>
            <View className='distribution'>
              <View>配送方式</View>
              <View>免费送货上门 ¥0.00</View>
            </View>
            <View className='subtotal'>共{value}件商品，小计<Text className='subtotalPrice'>¥{value * parseFloat(mockBook.presentPrice)}</Text></View>
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
          <View>合计<Text className='totalPrice'>¥{value * parseFloat(mockBook.presentPrice)}</Text></View>
          <AtButton className='submitBt' onClick={this.handleSubmitOrder} type='primary' size='normal' circle={true}>提交订单</AtButton>
        </View>
      </View>
    )
  }
}

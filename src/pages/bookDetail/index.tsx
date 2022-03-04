import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtDivider } from 'taro-ui'
import './index.less'

const mockBook =
{
  id: 1,
  name: '马克思主义基本原理概论',
  author: '本书编写组',
  publisher: '高等教育出版社',
  publishTime: 2013,
  ISBN: '1111111111',
  originalPrice: 23,
  presentPrice: 5,
  inventory: 8,
  imgURL: 'https://s3.bmp.ovh/imgs/2022/02/42d913af68766c41.png'
}

const arr = [
  {
    id: 1,
    title: '正版保证',
  },
  {
    id: 2,
    title: '快递免费',
  },
  {
    id: 3,
    title: '急速发货',
  },
  {
    id: 4,
    title: '消毒清洁',
  },
]

const bookDetailMessageList = [
  {
    key: '作者',
    value: mockBook.author,
  },
  {
    key: '出版社',
    value: mockBook.publisher,
  },
  {
    key: 'ISBN',
    value: mockBook.ISBN,
  },
  {
    key: '出版时间',
    value: mockBook.publishTime,
  },
  {
    key: '定价',
    value: mockBook.originalPrice + '元',
  },
]

export default class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLinkToCartPage = () => {
    //Taro.navigateTo({ url: '/pages/cart/index' })
  }

  handleAddToCart = () => {

  }

  handleLinkToPurchasePage = () => {
    Taro.navigateTo({ url: '/pages/purchase/index' })
  }

  render() {
    return (
      <View className='bookPage'>
        <View className='bookImageArea'>
          <Image className='bookImage' src={mockBook.imgURL} mode='heightFix'></Image>
        </View>
        <View className='bookMessage'>
          <View className='bookName'>{mockBook.name}</View>
          <View className='priceMessage'>
            <View className='presentPrice'>¥ {mockBook.presentPrice}</View>
            <View className='originalPrice'>{mockBook.originalPrice}</View>
          </View>
          <View className='saleMessage'>
            {
              arr.map(item =>
                <View className='saleMessageItem' key={item.id}>
                  <AtIcon value='check-circle' size='15' color='red'></AtIcon>
                  <View>{item.title}</View>
                </View>
              )
            }
          </View>
        </View>
        <View className='bookDetailMessage'>
          {
            bookDetailMessageList.map(item =>
              <View className='bookDetailMessageItem'>
                <Text className='bookDetailMessageKey'>{item.key}</Text>
                <Text className='bookDetailMessageValue'>{item.value}</Text>
              </View>
            )
          }
        </View>
        <AtDivider className='divider' content='没有更多了' fontColor='#9D9D9D' lineColor='#9D9D9D' />
        <View className='footer at-row'>
          <View className='linkToCartBt at-col' onClick={this.handleLinkToCartPage}>
            <AtIcon className='shoppingIcon' value='shopping-cart' size='30'></AtIcon>
          </View>
          <View className='addToCartBt at-col' onClick={this.handleAddToCart}>加入购物车</View>
          <View className='buyBt at-col' onClick={this.handleLinkToPurchasePage}>立即购买</View>
        </View>
      </View>
    )
  }
}

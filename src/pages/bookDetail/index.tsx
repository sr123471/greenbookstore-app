import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtDivider } from 'taro-ui'
import { Book } from '../../components/common/common'
import './index.less'

interface BookDetailMessage {
  key: string,
  value: string,
}
interface State {
  book: Book,
  bookDetailMessageList: BookDetailMessage[],
}

const arr = [
  {
    id: 1,
    title: '正版保证',
  },
  {
    id: 2,
    title: '急速取货',
  },
  {
    id: 3,
    title: '消毒清洁',
  },
]

export default class Index extends Component<any, State> {
  readonly state: Readonly<State> = {
    book: Taro.getStorageSync('currentBook'),
    bookDetailMessageList: [],
  }

  componentDidMount(): void {
    const { book } = this.state;
    this.setState({
      bookDetailMessageList: [
        {
          key: '作者',
          value: book.author,
        },
        {
          key: '出版社',
          value: book.press,
        },
        {
          key: 'ISBN',
          value: book.ISBN,
        },
        {
          key: '出版时间',
          value: book.publishTime,
        },
        {
          key: '定价',
          value: book.originalPrice + '元',
        },
      ]
    });
  }

  handleLinkToCartPage = (): void => {
    Taro.switchTab({ url: '/pages/cart/index' })
  }

  // 防止用户在短时间内快速点击导致调用多次接口，需要做数据节流
  handleAddToCart = (): () => void => {
    const { book } = this.state;
    let canClick = true;

    return () => {
      if (!canClick) return;
      canClick = false;
      Taro.cloud.callFunction({
        name: 'school',
        data: {
          action: 'hasBookInCart',
          userId: Taro.getStorageSync('openid'),
          ISBN: book.ISBN,
        }
      }).then(res => {
        if (!!res.result === false) {
          Taro.showToast({
            title: '已加入购物车',
            icon: 'success',
          });
          Taro.cloud.callFunction({
            name: 'school',
            data: {
              action: 'addCart',
              userId: Taro.getStorageSync('openid'),
              book,
            }
          }).then(res => {
            canClick = true;
          })
        } else {
          Taro.showToast({
            title: '该书已存在购物车中哦',
            icon: 'none',
          });
          canClick = true;
        }
      })
    };
  }

  handleLinkToPurchasePage = (): void => {
    const { book } = this.state;
    Taro.setStorageSync('settleList', [book]);
    Taro.navigateTo({ url: '/pages/purchase/index' })
  }

  render() {
    const { book, bookDetailMessageList } = this.state;

    return (
      <View className='bookPage'>
        <View className='bookImageArea'>
          <Image className='bookImage' src={book.imgURL} mode='heightFix'></Image>
        </View>
        <View className='bookMessage'>
          <View className='bookName'>{book.bookName}</View>
          <View className='priceMessage'>
            <View className='presentPrice'>¥ {book.presentPrice}</View>
            <View className='originalPrice'>{book.originalPrice}</View>
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
          <View className='addToCartBt at-col' onClick={this.handleAddToCart()}>加入购物车</View>
          <View className='buyBt at-col' onClick={this.handleLinkToPurchasePage}>立即购买</View>
        </View>
      </View>
    )
  }
}

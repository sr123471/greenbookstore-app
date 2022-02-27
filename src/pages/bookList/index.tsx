import { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtSearchBar, AtIcon } from 'taro-ui'
import './index.less'

const mockProfessionalBooks = [
  {
    id: 1,
    name: '马克思主义基本原理概论',
    author: '本书编写组',
    publisher: '高等教育出版社',
    originalPrice: 23,
    presentPrice: 5,
    imgURL: 'https://s3.bmp.ovh/imgs/2022/02/42d913af68766c41.png'
  },
  {
    id: 2,
    name: '马克思主义基本原理概论',
    author: '本书编写组',
    publisher: '高等教育出版社',
    originalPrice: 23,
    presentPrice: 5,
    imgURL: 'https://s3.bmp.ovh/imgs/2022/02/42d913af68766c41.png'
  },
  {
    id: 3,
    name: '马克思主义基本原理概论',
    author: '本书编写组',
    publisher: '高等教育出版社',
    originalPrice: 23,
    presentPrice: 5,
    imgURL: 'https://s3.bmp.ovh/imgs/2022/02/42d913af68766c41.png'
  },
  {
    id: 4,
    name: '马克思主义基本原理概论',
    author: '本书编写组',
    publisher: '高等教育出版社',
    originalPrice: 23,
    presentPrice: 5,
    imgURL: 'https://s3.bmp.ovh/imgs/2022/02/42d913af68766c41.png'
  },
]

export default class Index extends Component {

  state = {
    value: '',
    activeSort: 'synthesis',
    activeSortOfPrice: '',
  }

  componentWillMount() {
    Taro.setNavigationBarTitle({
      title: getCurrentInstance().router.params.type // 接收路由的传参
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleToSearchPage = () => {
    Taro.navigateTo({ url: '/pages/search/index' });
  }

  onChange = () => {

  }

  handleChangeSortWay = (value) => {
    const { activeSort } = this.state;
    this.setState({
      activeSort: value,
      activeSortOfPrice: value !== 'price' ? '' : activeSort === 'price' ? 'up' : 'down',
    })
  }

  handleLinkBookPage = () => {
    Taro.navigateTo({ url: '/pages/bookDetail/index' });
  }

  render() {
    const { activeSort, activeSortOfPrice } = this.state;

    return (
      <View className='publicBookPage'>
        <View className='header'>
          <View onClick={this.handleToSearchPage}>
            <AtSearchBar
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              placeholder='搜索书名、作者、ISBN'
              disabled
            />
          </View>
          <View className='sortWay'>
            <View className={activeSort === 'synthesis' ? 'active' : ''} onClick={this.handleChangeSortWay.bind(this, 'synthesis')}>综合</View>
            <View className={activeSort === 'sales' ? 'active' : ''} onClick={this.handleChangeSortWay.bind(this, 'sales')}>销量</View>
            <View className='sortOfPrice'>
              <View className={activeSort === 'price' ? 'active' : ''} onClick={this.handleChangeSortWay.bind(this, 'price')}>价格</View>
              <View className='sortIcon'>
                <AtIcon className={activeSortOfPrice === 'up' ? 'active-up' : ''} value='chevron-up' size='15'></AtIcon>
                <AtIcon className={activeSortOfPrice === 'down' ? 'active-down' : ''} value='chevron-down' size='15'></AtIcon>
              </View>
            </View>
          </View>
        </View>
        <View className='content'>
          {
            mockProfessionalBooks.map(item =>
              <View className='bookItem' key={item.id}>
                <View className='bookArea' onClick={this.handleLinkBookPage}>
                  <View className='imageWrapper'>
                    <Image className='bookImage' src={item.imgURL} mode='heightFix'></Image>
                  </View>
                  <View className='bookMessage'>
                    <View className='bookName'>{item.name}</View>
                    <View>作者：{item.author}</View>
                    <View>出版社：{item.publisher}</View>
                    <View className='priceMessage'>
                      <View className='presentPrice'>¥ {item.presentPrice}</View>
                      <View className='originalPrice'>{item.originalPrice}</View>
                    </View>
                  </View>
                </View>
                <View className='shoppingIconBg'>
                  <AtIcon className='shoppingIcon' value='shopping-cart' size='20'></AtIcon>
                </View>
              </View>
            )
          }
        </View>
      </View>
    )
  }
}

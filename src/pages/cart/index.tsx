import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtInputNumber, AtButton } from 'taro-ui'
import './index.less'
import Taro, { useTabItemTap } from '@tarojs/taro'

// 当前用户购物车中的图书
const mockCartList = [
  {
    id: 1,
    bookName: '马克思主义基本原理概论',
    presentPrice: 5,
    inventory: 8,
    imgURL: 'https://s3.bmp.ovh/imgs/2022/02/42d913af68766c41.png',
    selectQuantity: 1,
    isSelect: false,
  },
  {
    id: 2,
    bookName: '毛泽东思想和中国特色社会主义理论体系概论',
    presentPrice: 7,
    inventory: 1,
    imgURL: 'https://s3.bmp.ovh/imgs/2022/02/03db656daa4eed80.png',
    selectQuantity: 1,
    isSelect: false,
  },
]

export default class Index extends Component {

  state = {
    value: 1,
    isManagement: true,
    cartList: mockCartList,
    selectAll: false,
    selectItemNum: 0,
    totalPrice: 0,
  };

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLinkToHome = () => {
    Taro.switchTab({ url: '/pages/home/index' })
  }

  handleLinkToBookDetailPage = () => {
    Taro.navigateTo({ url: '/pages/bookDetail/index' })
  }

  // 管理购物车
  handleManage = () => {
    const { isManagement } = this.state
    this.setState({ isManagement: !isManagement })
  }

  // 计算合计价格
  calculateTotalPrice(cartList) {
    return cartList.reduce((previousValue, currentValue) => {
      return (previousValue.isSelect ? previousValue.presentPrice : 0) * previousValue.selectQuantity + (currentValue.isSelect ? currentValue.presentPrice : 0) * currentValue.selectQuantity;
    });
  }

  // 计算选中的商品数量
  calculateSelectItemNum(cartList) {
    const newCartList = cartList.map(item => (
      { ...item, isSelect: item.isSelect ? 1 : 0 }
    ));
    return newCartList.reduce((previousValue, currentValue) => {
      return previousValue.isSelect + currentValue.isSelect;
    });
  }

  // 增加或减少商品购买数量
  handleChange = (id, value) => {
    const { cartList } = this.state;
    const newCartList = cartList.map(item =>
      ({ ...item, selectQuantity: item.id === id ? value : item.selectQuantity })
    )
    const totalPrice = this.calculateTotalPrice(newCartList);
    const selectItemNum = this.calculateSelectItemNum(newCartList);
    this.setState({
      value,
      cartList: newCartList,
      totalPrice,
      selectItemNum,
    });
  }

  // 选择购物车中的商品,type为selectOne时是点击了一个商品，为selectAll时点击了全选按钮
  handleSelectItem = (id, type) => {
    const { cartList, selectAll } = this.state;
    const newCartList = cartList.map(item => (
      { ...item, isSelect: type === 'selectOne' ? (item.id === id ? !item.isSelect : item.isSelect) : !selectAll }
    ));
    const totalPrice = this.calculateTotalPrice(newCartList);
    const selectItemNum = this.calculateSelectItemNum(newCartList);
    this.setState({
      cartList: newCartList,
      // 如果是点击了全选按钮，则取反即可；如果是点击了一个商品，则进一步判断点击的该商品是否是最后一个未点击的商品，若是，则全选按钮应亮起
      selectAll: type === 'selectOne' ? (cartList.length === selectItemNum ? true : false) : !selectAll,
      totalPrice,
      selectItemNum,
    });
  }

  // 结算或者删除购物车中商品
  handleFinishOrDelete = () => {
    const { isManagement, selectItemNum } = this.state;
    if (isManagement) {
      if (selectItemNum === 0) {
        Taro.showToast({
          title: '您还没有选择商品哦',
          icon: 'none',
        })
      } else {
        // feat：后端结算商品接口
      }
    } else {
      if (selectItemNum === 0) {
        Taro.showToast({
          title: '您还没有选择要删除的商品哦',
          icon: 'none',
        })
      } else {
        // feat：后端删除商品接口
      }
    }
  }

  render() {
    const { value, isManagement, cartList, selectAll, selectItemNum, totalPrice } = this.state;

    return (
      <View className='cartPage'>
        {
          // 购物车为空或不为空
          cartList.length === 0 ?
            <View className='emptyCart'>
              <AtIcon prefixClass='icon' value='gouwuchekong' size='80'></AtIcon>
              <View>购物车是空的</View>
              <AtButton className='emptyCartBt' onClick={this.handleLinkToHome}>去逛逛</AtButton>
            </View> :
            <View>
              <View className='manageArea'>
                <Text className='manageText' onClick={this.handleManage}>{isManagement ? '管理' : '完成'}</Text>
              </View>
              <View className='itemList'>
                {cartList.map(item =>
                  <View className='item'>
                    <View className={item.isSelect === true ? 'iconBg iconBg-active' : 'iconBg'} onClick={this.handleSelectItem.bind(this, item.id, 'selectOne')}>
                      <AtIcon className='icon-check' value='check' size='15'></AtIcon>
                    </View>
                    <View className='bookArea' onClick={this.handleLinkToBookDetailPage}>
                      <View className='bookImageBg'>
                        <Image className='bookImage' src={item.imgURL} mode='heightFix'></Image>
                      </View>
                      <View className='bookMessage'>
                        <View className='bookName'>{item.bookName}</View>
                        <View className='price'>¥{item.presentPrice}</View>
                      </View>
                    </View>
                    <AtInputNumber
                      className='quantity'
                      type='digit'
                      min={1}
                      max={item.inventory}
                      step={1}
                      width={60}
                      value={value}
                      onChange={this.handleChange.bind(this, item.id)}
                    />
                  </View>
                )}
              </View>
              <View className='settlement'>
                <View className={selectAll === true ? 'iconBg iconBg-active' : 'iconBg'} onClick={this.handleSelectItem.bind(this, 0, 'selectAll')}>
                  <AtIcon className='icon-check' value='check' size='15'></AtIcon>
                </View>
                <View>全选</View>
                <View className='totalArea'>
                  {
                    isManagement ?
                      <View className='total'>合计<Text>¥{totalPrice}</Text></View> :
                      ''
                  }
                  <AtButton className='settlementBt' type='primary' onClick={this.handleFinishOrDelete}>
                    {isManagement ? `结算(${selectItemNum})` : '删除'}
                  </AtButton>
                </View>
              </View>
            </View>
        }
      </View>
    )
  }
}

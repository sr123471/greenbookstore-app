import { Component } from 'react'
import Taro, { useTabItemTap } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtInputNumber, AtButton } from 'taro-ui'
import './index.less'

export default class Index extends Component {

  state = {
    showContent: false,
    isManagement: true,
    cartList: [],
    selectAll: false,
    selectItemNum: 0,
    totalPrice: 0,
  };

  componentWillMount() {
    Taro.showLoading({
      title: '小二处理中',
      mask: true
    });
    Taro.cloud.callFunction({
      name: 'school',
      data: {
        action: 'getCartList',
        userId: Taro.getStorageSync('openid'),
      }
    }).then(res => {
      console.log(res)
      this.setState({
        cartList: res.result?.cartList,
        showContent: true,
      })
      Taro.hideLoading();
    })
  }

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
    // reduce从数组的第一项开始归并
    return cartList.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.isSelect ? currentValue.presentPrice : 0) * currentValue.selectQuantity;
    }, 0);
  }

  // 计算选中的商品数量
  calculateSelectItemNum(cartList) {
    const newCartList = cartList.map(item => (
      { ...item, isSelect: item.isSelect ? 1 : 0 }
    ));
    return newCartList.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.isSelect;
    }, 0);
  }

  // // 选中的商品列表
  // selectedBookList = (type) => {
  //   const { cartList } = this.state;
  //   if (type === 'delete') {

  //   }
  // }

  // 增加或减少商品购买数量
  handleChange = (ISBN, value) => {
    const { cartList } = this.state;
    const newCartList = cartList.map(item =>
      ({ ...item, selectQuantity: item.ISBN === ISBN ? value : item.selectQuantity })
    )
    const totalPrice = this.calculateTotalPrice(newCartList);
    const selectItemNum = this.calculateSelectItemNum(newCartList);
    this.setState({
      cartList: newCartList,
      totalPrice,
      selectItemNum,
    });
  }

  // 选择购物车中的商品,type为selectOne时是点击了一个商品，为selectAll时点击了全选按钮
  handleSelectItem = (ISBN, type) => {
    const { cartList, selectAll } = this.state;
    const newCartList = cartList.map(item => (
      { ...item, isSelect: type === 'selectOne' ? (item.ISBN === ISBN ? !item.isSelect : item.isSelect) : !selectAll }
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
    const { cartList, isManagement, selectItemNum } = this.state;
    if (isManagement) {
      if (selectItemNum === 0) {
        Taro.showToast({
          title: '您还没有选择商品哦',
          icon: 'none',
        })
      } else {
        // 结算商品
        const selectedBookList = cartList.filter(item =>
          item.isSelect === true
        )
        Taro.setStorageSync('settleList', selectedBookList);
        Taro.navigateTo({ url: '/pages/purchase/index' })
      }
    } else {
      if (selectItemNum === 0) {
        Taro.showToast({
          title: '您还没有选择要删除的商品哦',
          icon: 'none',
        })
      } else {
        // 删除商品
        Taro.showLoading({
      title: '小二处理中',
      mask: true
    });
        const ISBNList = [];
        cartList.forEach(item => {
          if (item.isSelect === true) {
            ISBNList.push(item.ISBN);
          }
        });
        const unselectedBookList = cartList.filter(item =>
          item.isSelect === false
        )
        Taro.cloud.callFunction({
          name: 'school',
          data: {
            action: 'deleteCart',
            userId: Taro.getStorageSync('openid'),
            ISBNList,
          }
        }).then(res => {
          this.setState({ cartList: unselectedBookList })
          Taro.hideLoading();
        })
      }
    }
  }

  render() {
    const {
      showContent,
      isManagement,
      cartList,
      selectAll,
      selectItemNum,
      totalPrice
    } = this.state;

    return (
      <View className='cartPage'>
        {
          /*
          showContent的作用是等待接口调用获取到购物车列表
          再去判断购物车为空还是不为空，否则就算用户购物车有商品，
          会出现一上来就展示空购物车状态，再展示商品列表
          */
          showContent && cartList?.length === 0 ?
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
                {cartList?.map(item =>
                  <View className='item'>
                    <View className={item.isSelect === true ? 'iconBg iconBg-active' : 'iconBg'} onClick={this.handleSelectItem.bind(this, item.ISBN, 'selectOne')}>
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
                      max={item.stock}
                      step={1}
                      width={60}
                      value={item.selectQuantity}
                      onChange={this.handleChange.bind(this, item.ISBN)}
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

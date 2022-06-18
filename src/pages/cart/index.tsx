import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtInputNumber, AtButton } from 'taro-ui'
import { Book } from '../../components/common/common'
import './index.less'
interface State {
  showContent: boolean,
  isManagement: boolean,
  cartList: Book[],
  selectAll: boolean,
  selectItemNum: number,
  totalPrice: number,
  hasLogin: boolean,
}
export default class Index extends Component<any, State> {

  readonly state: Readonly<State> = {
    showContent: false,
    isManagement: true,
    cartList: [],
    selectAll: false,
    selectItemNum: 0,
    totalPrice: 0,
    hasLogin: !Taro.getStorageSync('isNewUser'),
  };

  // 每次点击购物车都要重新加载一遍页面，防止用户刚刚添加进购物车的商品看不到
  componentDidShow() {
    Taro.showLoading({
      title: '加载中',
      mask: true
    });
    Taro.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'getCartList',
        userId: Taro.getStorageSync('openid'),
      }
    }).then((res: any) => {
      console.log(res)
      const totalPrice = Math.round(this.calculateTotalPrice(res.result) * 100) / 100;
      const selectItemNum = this.calculateSelectItemNum(res.result);
      this.setState({
        cartList: res.result || [],
        showContent: true,
        selectAll: res.result?.every(item => item.isSelect === true),
        totalPrice,
        selectItemNum
      })
      Taro.hideLoading();
    })
  }

  handleLinkToLoginOrHome = (): void => {
    const { hasLogin } = this.state;
    if (hasLogin) {
      Taro.switchTab({ url: '/pages/home/index' })
    } else {
      Taro.navigateTo({ url: '/pages/login/index' });
    }
  }

  handleLinkToBookDetailPage = (book): void => {
    Taro.setStorageSync('currentBook', book);
    Taro.navigateTo({ url: '/pages/bookDetail/index' })
  }

  // 管理购物车
  handleManage = (): void => {
    const { isManagement } = this.state
    this.setState({ isManagement: !isManagement })
  }

  // 计算合计价格
  calculateTotalPrice(cartList: Book[]): number {
    // reduce从数组的第一项开始归并
    return cartList?.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.isSelect ? currentValue.presentPrice : 0) * currentValue.selectQuantity;
    }, 0);
  }

  // 计算选中的商品数量
  calculateSelectItemNum(cartList: Book[]): number {
    const newCartList = cartList?.map(item => (
      { ...item, isSelect: item.isSelect ? 1 : 0 }
    ));
    return newCartList?.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.isSelect;
    }, 0);
  }

  // 增加或减少商品购买数量
  handleChange = (ISBN: string, value: number): void => {
    const { cartList } = this.state;

    Taro.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'alertSelectQuantity',
        openid: Taro.getStorageSync('openid'),
        ISBN,
        selectQuantity: value,
      }
    })
    const newCartList = cartList.map(item =>
      ({ ...item, selectQuantity: item.ISBN === ISBN ? value : item.selectQuantity })
    )
    const totalPrice = Math.round(this.calculateTotalPrice(newCartList) * 100) / 100;
    const selectItemNum = this.calculateSelectItemNum(newCartList);
    this.setState({
      cartList: newCartList,
      totalPrice,
      selectItemNum,
    });
  }

  // 选择购物车中的商品,type为selectOne时是点击了一个商品，为selectAll时点击了全选按钮
  handleSelectItem = (ISBN: string, type: string): void => {
    const { cartList, selectAll } = this.state;

    // 云开发不能将Boolean字段值直接取反，所以得前端传值到后端，后端不能直接取反
    if (type === 'selectOne') {
      Taro.cloud.callFunction({
        name: 'cart',
        data: {
          action: 'selectOneItem',
          openid: Taro.getStorageSync('openid'),
          ISBN,
          isSelect: !cartList.find(item => item.ISBN === ISBN)?.isSelect,
        }
      })
    } else {
      Taro.cloud.callFunction({
        name: 'cart',
        data: {
          action: 'selectAllItem',
          openid: Taro.getStorageSync('openid'),
          isSelect: !selectAll,
        }
      })
    }
    // 同步更新state
    const newCartList = cartList.map(item => (
      { ...item, isSelect: type === 'selectOne' ? (item.ISBN === ISBN ? !item.isSelect : item.isSelect) : !selectAll }
    ));
    // js中的小数相加会出现无限循环的情况，用四舍五入解决
    const totalPrice = Math.round(this.calculateTotalPrice(newCartList) * 100) / 100;
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
  handleFinishOrDelete = (): void => {
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
          title: '处理中',
          mask: true
        });
        const ISBNList: string[] = [];
        cartList.forEach(item => {
          if (item.isSelect === true) {
            ISBNList.push(item.ISBN);
          }
        });
        const unselectedBookList = cartList.filter(item =>
          item.isSelect === false
        )
        Taro.cloud.callFunction({
          name: 'cart',
          data: {
            action: 'deleteCart',
            userId: Taro.getStorageSync('openid'),
            ISBNList,
          }
        }).then(res => {
          this.setState({
            cartList: unselectedBookList,
            selectItemNum: 0,
            totalPrice: 0,
          })
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
      totalPrice,
      hasLogin
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
              <AtButton className='emptyCartBt' onClick={this.handleLinkToLoginOrHome}>{hasLogin ? '去逛逛' : '去登录'}</AtButton>
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
                    <View className='bookArea' onClick={this.handleLinkToBookDetailPage.bind(this, item)}>
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

import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtSearchBar, AtIcon, AtDivider, AtActivityIndicator } from 'taro-ui'
import './index.less'
export default class Index extends Component {

  state = {
    currentSchool: Taro.getStorageSync('currentSchool'),
    currentBookType: Taro.getStorageSync('currentBookType'),
    value: '',
    activeSort: 'synthesis',
    activeSortOfPrice_up: false,
    activeSortOfPrice_down: false,
    bookList: [],
    offset: 0,
    total: 0,
    limit: 4,
    isActivityIndicatorOpened: false,
  }

  componentWillMount() {
    const { currentSchool, currentBookType, offset, limit } = this.state;
    Taro.setNavigationBarTitle({
      title: getCurrentInstance().router.params.type // 接收路由的传参
    })

    Taro.showLoading();
    Taro.cloud.callFunction({
      name: 'school',
      data: {
        action: 'getBookList',
        schoolName: currentSchool,
        bookType: currentBookType,
        academyName: getCurrentInstance().router.params.academyName,
        detailType: getCurrentInstance().router.params.type,
        offset: offset,
        limit: limit,
      }
    }).then(res => {
      this.setState({
        bookList: res.result[currentBookType],
        offset: offset + limit,
        total: res.result.total,
      })
      Taro.hideLoading();
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleToSearchPage = () => {
    Taro.navigateTo({ url: '/pages/search/index' });
  }

  onChange = () => { }

  handleChangeSortWay = (value) => {
    const { activeSort, activeSortOfPrice_up, activeSortOfPrice_down } = this.state;
    this.setState({
      activeSort: value,
      activeSortOfPrice_up: value !== 'price' ? false : activeSort !== 'price' ? true : !activeSortOfPrice_up,
      activeSortOfPrice_down: value !== 'price' ? false : activeSort !== 'price' ? false : !activeSortOfPrice_down,
    })
  }

  // 加入购物车
  handleAddToCart = () => {
    let canClick = true;
    return (item) => {
      if (!canClick) return;
      canClick = false;
      Taro.cloud.callFunction({
        name: 'school',
        data: {
          action: 'hasBookInCart',
          userId: '1',
          ISBN: item.ISBN,
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
              userId: '1',
              book: item,
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

  handleLinkBookPage = (book) => {
    Taro.setStorageSync('currentBook', book);
    Taro.navigateTo({ url: '/pages/bookDetail/index' });
  }

  // onScrollToLower方法存在问题，靠近底部时会多次调用，而不是只调用一次，要做触发限制
  // 通过函数节流来解决，运用到了闭包
  scrollToBottom = () => {
    const { currentSchool, currentBookType, bookList, offset, total, limit } = this.state;
    // 如果偏移量大于等于数据库中书本的总数，则说明已显示完所有的书本，直接return
    if (offset >= total) return;
    let canLoading = true;

    return () => {
      if (!canLoading) return;
      canLoading = false;
      this.setState({ isActivityIndicatorOpened: true })
      Taro.cloud.callFunction({
        name: 'school',
        data: {
          action: 'getBookList',
          schoolName: currentSchool,
          bookType: currentBookType,
          detailType: getCurrentInstance().router.params.type,
          offset: offset,
          limit: limit,
        }
      }).then(res => {
        const newBookList = bookList.concat(res.result[currentBookType]);
        this.setState({
          bookList: newBookList,
          offset: offset + limit,
          isActivityIndicatorOpened: false,
        });
        canLoading = true;
      })
    };
  }

  render() {
    const {
      activeSort,
      activeSortOfPrice_up,
      activeSortOfPrice_down,
      bookList,
      offset,
      total,
      isActivityIndicatorOpened,
    } = this.state;

    return (
      <ScrollView
        className='publicBookPage'
        scrollY
        onScrollToLower={this.scrollToBottom()}
      >
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
            <View
              className={activeSort === 'synthesis' ? 'active' : ''}
              onClick={this.handleChangeSortWay.bind(this, 'synthesis')}
            >综合</View>
            {/* <View
              className={activeSort === 'sales' ? 'active' : ''}
              onClick={this.handleChangeSortWay.bind(this, 'sales')}
            >销量</View> */}
            <View
              className='sortOfPrice'
              onClick={this.handleChangeSortWay.bind(this, 'price')}
            >
              <View className={activeSort === 'price' ? 'active' : ''}>价格</View>
              <View className='sortIcon'>
                <AtIcon
                  className={activeSortOfPrice_up === true ? 'active-up' : ''}
                  value='chevron-up'
                  size='15'
                ></AtIcon>
                <AtIcon
                  className={activeSortOfPrice_down === true ? 'active-down' : ''}
                  value='chevron-down'
                  size='15'
                ></AtIcon>
              </View>
            </View>
          </View>
        </View>
        <View className='content'>
          {
            bookList?.map(item =>
              item.stock !== 0 ? (
                <View className='bookItem' key={item.ISBN}>
                  <View className='bookArea' onClick={this.handleLinkBookPage.bind(this, item)}>
                    <View className='imageWrapper'>
                      <Image className='bookImage' src={item.imgURL} mode='heightFix'></Image>
                    </View>
                    <View className='bookMessage'>
                      <View className='bookName'>{item.bookName}</View>
                      <View>作者：{item.author}</View>
                      <View>出版社：{item.press}</View>
                      <View className='priceMessage'>
                        <View className='presentPrice'>¥ {item.presentPrice}</View>
                        <View className='originalPrice'>{item.originalPrice}</View>
                      </View>
                    </View>
                  </View>
                  <View className='shoppingIconBg' onClick={this.handleAddToCart().bind(this, item)}>
                    <AtIcon className='shoppingIcon' value='shopping-cart' size='20'></AtIcon>
                  </View>
                </View>
              ) : ''
            )
          }
        </View>
        <AtActivityIndicator
          className='activityIndicator'
          content='加载中...'
          color='#52c41a'
          isOpened={isActivityIndicatorOpened}
        ></AtActivityIndicator>
        {
          offset >= total &&
          <AtDivider className='divider' content='没有更多了' fontColor='#9D9D9D' lineColor='#9D9D9D' />
        }
      </ScrollView>
    )
  }
}

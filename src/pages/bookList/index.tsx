import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtSearchBar, AtIcon, AtDivider, AtActivityIndicator } from 'taro-ui'
import { cloudCall, dataCreator } from '../../service/bookList'
import { Book } from '../../components/common/common'
import './index.less'
interface State {
  //当前学校
  currentSchool: string;
  //当前书籍列表展示界面展示的书籍类型
  currentBookType: 'publicBook' | 'majorBook' | 'examBook';
  //搜索框内容
  searchValue: string;
  //排序方式，默认按综合synthesis排序
  activeSort: string;
  activeSortOfPrice_asc: boolean;
  activeSortOfPrice_desc: boolean;
  //书籍列表
  bookList: Book[];
  //用于分页，偏移量
  offset: number;
  //用于分页，每次请求书本的数量
  limit: number;
  //数据库中书本的总数
  total: number;
  //下滑加载的loading样式
  isActivityIndicatorOpened: boolean;
}
export default class Index extends Component<any, State> {

  readonly state: Readonly<State> = {
    currentSchool: Taro.getStorageSync('currentSchool'),
    currentBookType: Taro.getStorageSync('currentBookType'),
    searchValue: '',
    activeSort: 'synthesis',
    activeSortOfPrice_asc: false,
    activeSortOfPrice_desc: false,
    bookList: [],
    offset: 0,
    limit: 4,
    total: 0,
    isActivityIndicatorOpened: false,
  }

  componentDidMount(): void {
    //search页搜索书本返回bookList页时搜索框的书本名称
    this.setState({ searchValue: getCurrentInstance().router.params.bookName })
    const { currentSchool, currentBookType, activeSort, offset, limit } = this.state;
    Taro.setNavigationBarTitle({
      title: getCurrentInstance().router.params.type // 接收路由的传参
    })

    Taro.showLoading();
    let data = dataCreator('getBookList', currentSchool, currentBookType, offset, limit, activeSort);
    cloudCall('school', data).then((res: any) => {
      this.setState({
        bookList: res.result.data,
        offset: offset + limit,
        total: res.result.total,
      })
      Taro.hideLoading();
    })
  }

  handleToSearchPage = (): void => {
    const { searchValue } = this.state;
    if (searchValue === undefined) {
      Taro.navigateTo({ url: '/pages/search/index' });
    } else {
      Taro.navigateBack();
    }
  }

  onChange = (): void => { }

  handleChangeSortWay = (value: string): void => {
    const { activeSort, activeSortOfPrice_asc, activeSortOfPrice_desc, } = this.state;
    this.setState({
      activeSort: value,
      activeSortOfPrice_asc: value !== 'price' ? false : activeSort !== 'price' ? true : !activeSortOfPrice_asc,
      activeSortOfPrice_desc: value !== 'price' ? false : activeSort !== 'price' ? false : !activeSortOfPrice_desc,
      offset: 0,
    }, () => {
      const { activeSort, activeSortOfPrice_asc, currentSchool, currentBookType, offset, limit } = this.state;
      if (activeSort === 'price') {
        let data = dataCreator('getBookList', currentSchool,
          currentBookType, offset, limit, activeSortOfPrice_asc === true ? 'asc' : 'desc');
        Taro.showLoading();
        cloudCall('school', data).then((res: any) => {
          this.setState({
            bookList: res.result.data,
            offset: offset + limit,
            total: res.result.total,
          })
          Taro.hideLoading();
        })
      } else {
        let data = dataCreator('getBookList', currentSchool, currentBookType, offset, limit, 'synthesis');
        Taro.showLoading();
        cloudCall('school', data).then((res: any) => {
          this.setState({
            bookList: res.result.data,
            offset: offset + limit,
            total: res.result.total,
          })
          Taro.hideLoading();
        })
      }
    })
  }

  // 加入购物车
  handleAddToCart = (): (item: Book) => void => {
    let canClick = true;
    return (item) => {
      if (!canClick) return;
      canClick = false;
      // 判断是否已在购物车中
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

  handleLinkBookPage = (book: Book): void => {
    Taro.setStorageSync('currentBook', book);
    Taro.navigateTo({ url: '/pages/bookDetail/index' });
  }

  // onScrollToLower方法存在问题，靠近底部时会多次调用，而不是只调用一次，要做触发限制
  // 通过函数节流来解决，运用到了闭包
  scrollToBottom = (): () => void => {
    const { currentSchool, currentBookType, activeSort, activeSortOfPrice_asc, bookList, offset, total, limit } = this.state;
    // 如果偏移量大于等于数据库中书本的总数，则说明已显示完所有的书本，直接return
    if (offset >= total) return;
    let canLoading = true;

    return () => {
      if (!canLoading) return;
      canLoading = false;

      this.setState({ isActivityIndicatorOpened: true })
      let data = dataCreator('getBookList', currentSchool, currentBookType,
        offset, limit, activeSort === 'synthesis' ? 'synthesis' : activeSortOfPrice_asc === true ? 'asc' : 'desc');
      cloudCall('school', data).then((res: any) => {
        const newBookList = bookList.concat(res.result.data);
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
      searchValue,
      activeSort,
      activeSortOfPrice_asc,
      activeSortOfPrice_desc,
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
              value={searchValue}
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
                  className={activeSortOfPrice_asc === true ? 'active-up' : ''}
                  value='chevron-up'
                  size='15'
                ></AtIcon>
                <AtIcon
                  className={activeSortOfPrice_desc === true ? 'active-down' : ''}
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

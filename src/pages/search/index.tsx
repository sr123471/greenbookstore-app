import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import './index.less'

export default class Index extends Component {
  state = {
    value: '',
    searchedNameList: [],
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChange = (value) => {
    this.setState({ value });
    if (value !== '') {
      Taro.cloud.callFunction({
        name: 'school',
        data: {
          action: 'searchBook',
          value: value,
        }
      }).then(res => {
        this.setState({
          searchedNameList: res.result
        })
      })
    } else {
      this.setState({
        searchedNameList: [],
      })
    }
  }

  handleLinkToBookListPage = (bookName) => {
    Taro.setStorageSync('currentBookType', 'searchBook');
    Taro.navigateTo({ url: `/pages/bookList/index?bookName=${bookName}&type=搜索` })
  }

  render() {
    const { value, searchedNameList } = this.state;
    return (
      <View className='searchPage'>
        <AtSearchBar
          className='searchBar'
          value={value}
          placeholder='搜索书名、作者、ISBN'
          focus={true}
          onChange={this.handleChange}
          onActionClick={this.handleLinkToBookListPage.bind(this, value)}
        />
        <View className='searchedName'>
          {
            searchedNameList.map(item =>
              <View
                className='bookNameItem'
                onClick={this.handleLinkToBookListPage.bind(this, item.bookName)}
              >
                {item.bookName}
              </View>
            )
          }
        </View>
      </View>
    )
  }
}

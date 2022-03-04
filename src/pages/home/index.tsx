import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.less'

const homeModuleList = [
  {
    id: 1,
    title: '公共课书籍',
    url: '/pages/bookList/index?type=公共课书籍',
  },
  {
    id: 2,
    title: '专业课书籍',
    url: '/pages/professionalBook/index',
  },
  {
    id: 3,
    title: '各类考试书籍',
    url: '/pages/examBook/index',
  },
]

export default class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLink = (url) => {
    Taro.navigateTo({ url });
  }

  render() {
    return (
      <View className='homePage'>
        {homeModuleList.map(item =>
          <View className='homeItem' key={item.id} onClick={this.handleLink.bind(this, item.url)}>{item.title}</View>
        )}
      </View>
    )
  }
}

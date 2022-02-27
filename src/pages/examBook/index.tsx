import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'

const examType = [
  {
    id: 1,
    title: '英语四六级',
  },
  {
    id: 2,
    title: '研究生考试',
  },
  {
    id: 3,
    title: '公务员考试',
  },
  {
    id: 4,
    title: '教师资格证',
  },
  {
    id: 5,
    title: '计算机等级考',
  },
  {
    id: 6,
    title: '雅思托福',
  },
]

export default class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLinkToBookListPage = (title) => {
    Taro.navigateTo({ url: `/pages/bookList/index?type=${title}` })
  }

  render() {
    return (
      <View className='examBookPage'>
        <View className='examList'>
          {
            examType.map(item =>
              <View className='examItem' onClick={this.handleLinkToBookListPage.bind(this, item.title)} key={item.id}>
                <AtIcon prefixClass='icon' value='shubenfei' size='40'></AtIcon>
                <View>{item.title}</View>
              </View>
            )
          }
        </View>
      </View>
    )
  }
}

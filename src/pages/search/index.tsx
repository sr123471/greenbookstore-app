import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import './index.less'

export default class Index extends Component {
  state = {
    value: '',
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onChange = () => {

  }

  render() {
    return (
      <View className='searchPage'>
        <AtSearchBar
          className='searchBar'
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          placeholder='搜索书名、作者、ISBN'
        />
      </View>
    )
  }
}

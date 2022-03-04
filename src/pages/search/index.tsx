import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtSearchBar } from 'taro-ui'
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

  onClick = () => {
    Taro.cloud.init({
      env: 'cloud1-0g9mnrv48dfc20a1'
    })
    Taro.cloud.callFunction({
      // 要调用的云函数名称
      name: 'user_selectUser',
      // 传递给云函数的event参数
    }).then(res => {
      console.log(res)
    }).catch(err => {
      // handle error
    })
    // const db = Taro.cloud.database()
    // db.collection('user').where({
    //   name: '沈荣'
    // }).get().then(res => {
    //   console.log(res)
    // })
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
        <AtButton onClick={this.onClick}>点击</AtButton>
      </View>
    )
  }
}

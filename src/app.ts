import { Component } from 'react'
import Taro from '@tarojs/taro'
import '../src/style/font/iconfont.less'
import './app.scss'
import { login } from './service/login'

class App extends Component {

  componentDidMount() {
    Taro.cloud.init({
      env: 'cloud1-0g9mnrv48dfc20a1'
    })
  }

  componentDidShow() {
  }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App

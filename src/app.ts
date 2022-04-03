import { Component } from 'react'
import Taro from '@tarojs/taro'
import '../src/style/font/iconfont.less'
import './app.scss'

class App extends Component {

  componentDidMount() {
    Taro.cloud.init({
      env: 'cloud1-0g9mnrv48dfc20a1'
    })
    // 之后要改，应该根据用户信息中的学校来设置
    Taro.setStorageSync('currentSchool', '浙江外国语学院');
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App

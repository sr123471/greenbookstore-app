import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtTextarea, AtButton, AtMessage } from "taro-ui"
import { View } from '@tarojs/components'

import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/textarea.scss";
import "taro-ui/dist/style/components/message.scss";

import './advice.less'

export default class Index extends Component<any, any> {
  handleChangebrief(value) {
    this.setState({
      brief: value
    })
  }

  handleChangedetail(value) {
    this.setState({
      detail: value
    })
  }

  send() {
    console.log(this.state.brief)
    console.log(this.state.detail)

    if (this.state.brief === ''||this.state.detail==='') {
      Taro.atMessage({
        'message': '您不能提交空消息哦',
        'type': 'error',
      })
    }

    else if(this.state.brief.length<15 || this.state.detail.length<30){
      Taro.atMessage({
        'message': '概括和详细展开分别需要至少15字和30字哦',
        'type': 'error',
      })
    }

    else{
      Taro.atMessage({
        'message': '感谢您的反馈！我们会努力改进！',
        'type': 'success',
      })

      this.setState({
        brief: '',
        detail: ''
      })
    }
  }

  state = {
    brief: '',
    detail: ''
  }

  render() {
    return (
      <View>
        <AtMessage />
        <View className='text'>
          <AtTextarea
          className='brief'
            value={this.state.brief}
            onChange={this.handleChangebrief.bind(this)}
            maxLength={30}
            placeholder='简要概括一下您的意见或反馈'
            height={50}
          />
          <AtTextarea
            className='detail'
            value={this.state.detail}
            onChange={this.handleChangedetail.bind(this)}
            maxLength={400}
            placeholder='详细展开....'
            height={300}
          />

        </View>
        <AtButton onClick={this.send.bind(this)} className='btn' type='primary' circle={true}>提交</AtButton>
      </View>
    )
  }
}
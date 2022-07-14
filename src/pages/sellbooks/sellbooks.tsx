import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtSteps, AtDivider } from "taro-ui"
import { View, Image } from '@tarojs/components'
import './sellbooks.less'

const steps = [
  {
    id: 1,
    step: [
      {
        title: '步骤一',
        desc: '将要回收的书籍运到浙外图书馆5楼淘书阁',
        icon: {
          value: 'shopping-bag',
          activeColor: '#fff',
          inactiveColor: '#78A4FA',
          size: '14',
        }
      },
    ]
  },
  {
    id: 2,
    step: [
      {
        title: '步骤二',
        desc: '工作人员检查书籍并进行扫码登记',
        icon: {
          value: 'search',
          activeColor: '#fff',
          inactiveColor: '#78A4FA',
          size: '14',
        }
      },
    ]
  },
  {
    id: 3,
    step: [
      {
        title: '步骤三',
        desc: '收到转账，完成书籍回收！',
        icon: {
          value: 'check',
          activeColor: '#fff',
          inactiveColor: '#78A4FA',
          size: '14',
        }
      },
    ]
  },
]

export default class Index extends Component<any, any> {

  stepChange() {
    return;
  }

  render() {
    return (
      <View >
        <View className='container0'>
          <View className='title'>收书流程</View>
          <View className='line' />
        </View>

        {
          steps.map(item =>
            <AtSteps
              key={item.id}
              className='list'
              items={item.step}
              current={0}
              onChange={this.stepChange}
            />
          )
        }

        <AtDivider content='联系方式' fontColor='#eb2f96' lineColor='#faad14' />

        <View className='contact'>
          <View className='wechat'>微信号：heshan0314</View>
          <Image
            className='code'
            mode='aspectFit'
            showMenuByLongpress={true}
            src="https://greenbookstore.oss-cn-hangzhou.aliyuncs.com/img/scan2.png" />
        </View>
      </View>
    )
  }
}
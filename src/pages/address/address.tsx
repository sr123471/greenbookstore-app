import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtAvatar, AtIcon, AtButton } from "taro-ui"
import { View, Text } from '@tarojs/components'

import "taro-ui/dist/style/components/avatar.scss";
import "taro-ui/dist/style/components/button.scss";
import './address.less'

export default class Address extends Component<any, any> {

  editAddr() {
    Taro.navigateTo({ url: '../addressedit/addressedit' })
  }

  render() {
    return (
      <View className='bg'>
        <View className='card'>
          <AtAvatar size='small' className='avatar' circle text='王小明'></AtAvatar>
          <View>
            <AtIcon onClick={this.editAddr.bind(this)} className='edit' value='edit' size='20' color='#8c8c8c' />
            <View className='name'>
              王小明
              <Text className='phone'> 151xxxxxxxx</Text>
            </View>
            <View className='address'>
              浙江省杭州市西湖区XX大学XX校区asdasdasdasdasdasdasdasdaddasdasaasdas
            </View>
            <View className='btncontainer'>
              {/* 阻止事件冒泡 */}
            </View>
          </View>
        </View>
        <AtButton className='btn' circle={true} type='primary' size='normal' onClick={this.editAddr.bind(this)}>添加地址</AtButton>
      </View>
    )
  }
}
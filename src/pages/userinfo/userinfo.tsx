import { Component, ReactNode } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { cloudCall } from '../../service/order'
import { AtList, AtListItem } from "taro-ui"
import './userinfo.less'


export default class Index extends Component<any, any> {

  state = {
    name: '',
    phone: '',
  }

  componentDidMount(): void {
    let data = {
      action: 'getUserInfo',
      openid: Taro.getStorageSync('openid')
    }

    Taro.showLoading({
      title: '加载中',
      mask: true,
    });
    cloudCall('login', data)
      .then((res: any) => {
        let rst = res.result;
        this.setState({
          name: rst.name,
          phone: rst.phone,
        });
        Taro.hideLoading();
      })
  }

  toChangeUserInfo() {
    Taro.navigateTo({ url: '../changeUserInfo/changeUserInfo' })
  }

  render(): ReactNode {
    return (
      <View className='bg'>
        <View className='container0'>
          <View className='title'>个人信息</View>
          <View className='line' />
        </View>
        <View className='info'>
          <AtList>
            <AtListItem title='昵称' extraText={this.state.name} />
            <AtListItem title='电话号码' extraText={this.state.phone} />

            <AtListItem
              onClick={this.toChangeUserInfo.bind(this)}
              title='个人信息编辑'
              note='修改您的个人信息'
              arrow='right'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
            />

          </AtList>
        </View>
      </View>
    )
  }

}

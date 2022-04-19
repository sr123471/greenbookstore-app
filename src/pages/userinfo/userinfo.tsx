import { Component, ReactNode } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { cloudCall } from '../../service/order'
import { AtList, AtListItem } from "taro-ui"
import './userinfo.less'


export default class Index extends Component<any, any> {

  state = {
    name: '',
    school: '',
    academy: '',
    major: '',
    phone: '',
  }

  componentDidMount(): void {
    let data = {
      action: 'getUserInfo',
      openid: Taro.getStorageSync('openid')
    }

    cloudCall('school', data)
      .then((res) => {
        let rst = res.result;
        console.log(rst);
        this.setState({
          name:rst.name,
          school:rst.school,
          academy:rst.academy,
          major:rst.major,
          phone:rst.phone,
        })
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
            <AtListItem title='姓名' extraText={this.state.name} />
            <AtListItem title='学校' extraText={this.state.school} />
            <AtListItem title='学院' extraText={this.state.academy} />
            <AtListItem title='专业' extraText={this.state.major} />
            <AtListItem title='电话' extraText={this.state.phone} />

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
      //修改个人信息页面暂时未做
    )
  }

}

import { Component, ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"

import "taro-ui/dist/style/components/list.scss";

import './userinfo.less'


export default class Index extends Component<any, any> {

  state = {
    name: '',
    sex: '',
    age: '',
    school: '',
    major: '',
    phone: '',
  }

  render(): ReactNode {
    return (
      <View>
        <View className='container0'>
          <View className='title'>个人信息</View>
          <View className='line' />
        </View>
        <AtList>
          <AtListItem title='姓名' extraText='王小明' />
          <AtListItem title='性别' extraText='男' />
          <AtListItem title='年龄' extraText='18' />
          <AtListItem title='学校' extraText='xxx大学' />
          <AtListItem title='专业' extraText='软件工程' />
          <AtListItem title='电话' extraText='1xxxxxxxxxx' />
        </AtList>
      </View>
      //修改个人信息页面暂时未做
    )
  }

}

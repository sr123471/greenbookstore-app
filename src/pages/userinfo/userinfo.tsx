import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"

import "taro-ui/dist/style/components/list.scss";

import './userinfo.less'

function UserInfo() {

  return (
    <AtList>
      <AtListItem title='标题文字' />
      <AtListItem title='标题文字' arrow='right' />
      <AtListItem title='标题文字' extraText='详细信息' />
      <AtListItem title='禁用状态' disabled extraText='详细信息' />
    </AtList>
  )
}

export default UserInfo
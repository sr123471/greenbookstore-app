import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtInput, AtForm, AtMessage } from 'taro-ui'
import { useState, useEffect } from 'react'
import { cloudCall } from '../../service/order'
import './changeUserInfo.less'

let isopened = true;

export default function changeUserInfo() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  let rsv;
  let flag = new Promise((resolve, reject) => {
    rsv = resolve;
  })

  useEffect(() => {
    Taro.atMessage({
      'message': '您需要完善个人信息才能使用本小程序',
      'type': 'info'
    })
    let data = {
      action: 'getUserInfo',
      openid: Taro.getStorageSync('openid')
    }

    cloudCall('school', data)
      .then((res: any) => {
        let rst = res.result;
        setName(rst.name === '' ? Taro.getStorageSync('user').nickName : rst.name);
        setPhone(rst.phone);
        rsv();
      })

    setTimeout(() => {
      isopened = false;
    }, 3000)
  }, [])

  function nameChange(value) {
    setName(value)
  }

  function phoneChange(value) {
    setPhone(value)
  }

  function submit() {
    Taro.setStorageSync('userInfo', {
      userName: name,
      userPhone: phone,
      openid: Taro.getStorageSync('openid'),
    })

    Taro.showLoading({
      title: '处理中',
      mask: true
    })
    let data = {
      action: 'setUserInfo',
      openid: Taro.getStorageSync('openid'),
      name,
      phone
    }
    cloudCall('school', data)
      .then((res) => {
        Taro.hideLoading()
        if (res.result) {
          Taro.reLaunch({
            url: '../home/index'
          })
        }
      })
  }

  return (
    <View className='bg'>
      <AtMessage />
      <View className='container0'>
        <View className='title'>编辑个人信息</View>
        <View className='line' />
      </View>
      <View className='info'>
        <AtForm>
          <AtInput
            className='form'
            name='name'
            title='昵称'
            type='text'
            value={name}
            onChange={nameChange}
          />
          <AtInput
            className='form'
            name='phone'
            maxlength={11}
            title='手机号码'
            type='phone'
            value={phone}
            border={false}
            onChange={phoneChange}
          />
        </AtForm>
        <AtButton onClick={submit} className='button' type='primary'>确定</AtButton>
      </View>
    </View >
  )

}

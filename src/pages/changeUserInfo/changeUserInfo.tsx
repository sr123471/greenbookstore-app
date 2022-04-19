import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { useState } from 'react'
import { AtInput, AtForm, AtMessage } from 'taro-ui'
import './changeUserInfo.less'
import { useEffect } from 'react'
import { cloudCall } from '../../service/order'
import { Picker } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'

let isopened = true;

export default function changeUserInfo() {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [academy, setAcademy] = useState('');
  const [major, setMajor] = useState('');
  const [phone, setPhone] = useState('');

  const [schoolSelector, setSchoolSelector] = useState([])
  const [academySelector, setAcademySelector] = useState([])
  const [majorSelector, setMajorSelector] = useState([])

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
      .then((res) => {
        let rst = res.result;
        setName(rst.name);
        setMajor(rst.major);
        setPhone(rst.phone);
        setAcademy(rst.academy);
        setSchool(rst.school);
        rsv();
      })

    getSchool()

    setTimeout(() => {
      isopened = false;
    }, 3000)
  }, [])

  async function getSchool() {
    await flag;
    let selectRequest = {
      action: 'getSchool',
    }
    cloudCall('school', selectRequest)
      .then((res) => {
        // res.result
        setSchoolSelector(res.result)
      })
  }

  function getAcademy() {
    Taro.showLoading({
      title: '获取学院信息中',
      mask: true
    })
    let selectRequest = {
      action: 'getAcademy',
      schoolName: school
    }
    cloudCall('school', selectRequest)
      .then((res) => {
        // res.result
        setAcademySelector(res.result)
        Taro.hideLoading()
      })
  }

  function getMajor() {
    Taro.showLoading({
      title: '获取专业信息中',
      mask: true
    })
    let selectRequest = {
      action: 'getMajor',
      schoolName: school,
      academyName: academy
    }
    cloudCall('school', selectRequest)
      .then((res) => {
        // res.result
        setMajorSelector(res.result)
        Taro.hideLoading()
      })
  }


  useEffect(() => {
    getAcademy()
  }, [school])

  useEffect(() => {
    getMajor()
  }, [school, academy])

  function nameChange(value) {
    setName(value)
  }

  function schoolChange(value) {
    setSchool(schoolSelector[value.detail.value])
  }

  function academyChange(value) {
    setAcademy(academySelector[value.detail.value])
  }

  function majorChange(value) {
    setMajor(majorSelector[value.detail.value])
  }

  function phoneChange(value) {
    setPhone(value)
  }

  function submit() {
    Taro.showLoading({
      title: '小二处理中',
      mask: true
    })
    let data = {
      action: 'setUserInfo',
      openid: Taro.getStorageSync('openid'),
      name,
      school,
      academy,
      major,
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
            title='姓名'
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

          <Picker mode='selector' range={schoolSelector} onChange={schoolChange}>
            <AtList>
              <AtListItem
                title='学校'
                extraText={school}
              />
            </AtList>
          </Picker>
          <Picker mode='selector' range={academySelector} onChange={academyChange}>
            <AtList>
              <AtListItem
                className='selector'
                title='学院'
                extraText={academy}
              />
            </AtList>
          </Picker>
          <Picker mode='selector' range={majorSelector} onChange={majorChange}>
            <AtList>
              <AtListItem
                title='专业'
                extraText={major}
              />
            </AtList>
          </Picker>

        </AtForm>
        <AtButton onClick={submit} className='button' type='primary'>确定</AtButton>
      </View>
    </View >
  )

}

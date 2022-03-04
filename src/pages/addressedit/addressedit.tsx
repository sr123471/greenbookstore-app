import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtInput, AtDivider, AtButton, AtTextarea } from "taro-ui"
import { View } from '@tarojs/components'
import Citypicker from '../../components/cityPicker/cityPicker'
import './addressedit.less'

export default class Address extends Component<any, any> {

  onGetRegion(region) {
    // 参数region为选择的省市区
    console.log(region);
  }

  state = {
    name: '',
    phone: '',
    detailaddr: '',
    city: '',
  }

  nameChange(value) {
    this.setState({
      name: value
    })
    return value
  }

  phoneChange(value) {
    this.setState({
      phone: value
    })
    return value
  }

  detailaddrChange(value) {
    this.setState({
      detailaddr: value
    })
    return value
  }

  onSubmit() {
    console.log(this.state)
  }

  cityChange(value) {
    this.setState({ city: value })
  }

  onReset() {
    this.setState({
      name: '',
      phone: '',
      detailaddr: ''
    })
  }

  render() {
    return (
      <View className='bg'>
        <View className='card'>

          <AtDivider content='收件人信息' />

          <AtInput
            name='name'
            title='姓名'
            type='text'
            placeholder='收件人姓名'
            value={this.state.name}
            onChange={this.nameChange.bind(this)}
          />

          <AtInput
            name='phone'
            title='电话'
            type='text'
            placeholder='收件人电话'
            value={this.state.phone}
            onChange={this.phoneChange.bind(this)}
          />

          <AtDivider className='line' content='收件人地址' />

          <Citypicker Division="-" getCity={this.cityChange.bind(this)}></Citypicker>

          <AtTextarea
            className='detail'
            value={this.state.detailaddr}
            onChange={this.detailaddrChange.bind(this)}
            maxLength={80}
            placeholder='详细地址'
          />

          <AtButton className='btn' type='primary' onClick={this.onSubmit.bind(this)}>确定</AtButton>
          <AtButton className='btn' onClick={this.onReset.bind(this)}>重置</AtButton>
        </View>
      </View>
    )
  }
}
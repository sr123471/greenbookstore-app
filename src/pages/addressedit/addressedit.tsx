import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtForm, AtInput, AtDivider, AtButton, AtTextarea } from "taro-ui"
import { View } from '@tarojs/components'
import Citypicker from '../../components/cityPicker/cityPicker'

import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/divider.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/textarea.scss";
import './addressedit.less'

export default class Address extends Component<any, any> {

  onGetRegion(region) {
    // 参数region为选择的省市区
    console.log(region);
  }

  cityEnd(city) {
    console.log(city)
  }

  state = {
    name: '',
    phone: '',
    detailaddr: '',
    province: '',
    provinceSelector: [],
    city: '',
    citySelector: []
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

  onSubmit(event) {
    console.log(this.state)
  }

  provinceChange(e) {
    var selected = this.state.provinceSelector[e.detail.value]
    this.setState({
      province: selected,

    })
  }

  cityChange(e) {
    console.log(e.detail.value)
    this.setState({ city: this.state.citySelector[e.detail.value] })
  }

  onReset(event) {
    this.setState({
      name: '',
      phone: '',
      detailaddr: '',
      province: '',
    })
  }

  render() {
    return (
      <View className='bg'>
        <View className='card'>
          <AtForm
            onSubmit={this.onSubmit.bind(this)}
            onReset={this.onReset.bind(this)}
          >

            <AtDivider content='收件人信息' />

            <AtInput
              name='value'
              title='姓名'
              type='text'
              placeholder='收件人姓名'
              value={this.state.name}
              onChange={this.nameChange.bind(this)}
            />

            <AtInput
              name='value'
              title='电话'
              type='text'
              placeholder='收件人电话'
              value={this.state.phone}
              onChange={this.phoneChange.bind(this)}
            />

            <AtDivider className='line' content='收件人地址' />

            <Citypicker Division="-" getCity={this.cityEnd.bind(this)}></Citypicker>

            <AtTextarea
              className='detail'
              value={this.state.detailaddr}
              onChange={this.detailaddrChange.bind(this)}
              maxLength={80}
              placeholder='详细地址'
            />

            <AtButton className='btn' type='primary' formType='submit'>确定</AtButton>
            <AtButton className='btn' formType='reset'>重置</AtButton>
          </AtForm>
        </View>
      </View>
    )
  }
}
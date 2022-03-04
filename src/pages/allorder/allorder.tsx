import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from "taro-ui"
import { View, Image, Text } from '@tarojs/components'
import './allorder.less'

export default class AllOrder extends Component<any, any> {

  detail(record) {
    Taro.navigateTo({ url: '../orderdetail/orderdetail' })
  }

  pay() {
    console.log('payment')
  }

  render() {
    return (
      <View className='bg'>
        <View className='card' onClick={this.detail.bind(this)}>
          <Image
            className='bookpic'
            src='https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg'
          />
          <View className='bookinfo'>
            <AtIcon className='arrow' value='chevron-right' size='20' color='#8c8c8c' />
            <View className='booktitle'>
              彷徨
            </View>
            <View className='price'>
              <Text className='priceint'>¥10.</Text>
              <Text className='pricedecimal'>50</Text>
            </View>
            <View className='btncontainer'>
              {/* 阻止事件冒泡 */}
              <AtButton onClick={(e) => { e.stopPropagation(), this.pay() }} circle={true} className='btn' size='small'>付款</AtButton>
            </View>
          </View>
        </View>

        <View className='card' onClick={this.detail.bind(this)}>
          <Image
            className='bookpic'
            src='https://img1.baidu.com/it/u=1678787950,4104437334&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
          />
          <View className='bookinfo'>
            <AtIcon className='arrow' value='chevron-right' size='20' color='#8c8c8c' />
            <View className='booktitle'>
              大学·中庸
            </View>
            <View className='price'>
              <Text className='priceint'>¥10.</Text>
              <Text className='pricedecimal'>50</Text>
            </View>
            <View className='btncontainer'>
              {/* 阻止事件冒泡 */}
              <AtButton onClick={(e) => { e.stopPropagation(), this.pay() }} circle={true} className='btn' size='small'>查看物流</AtButton>
            </View>
          </View>
        </View>

        <View className='card' onClick={this.detail.bind(this)}>
          <Image
            className='bookpic'
            src='https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg'
          />
          <View className='bookinfo'>
            <AtIcon className='arrow' value='chevron-right' size='20' color='#8c8c8c' />
            <View className='booktitle'>
              【书名最多显示两行，多余的会自动被裁减为省略号】屋记得前几位妇女去外婆发的书的小
            </View>
            <View className='price'>
              <Text className='priceint'>¥10.</Text>
              <Text className='pricedecimal'>50</Text>
            </View>
            <View className='btncontainer'>
              {/* 阻止事件冒泡 */}
              <AtButton onClick={(e) => { e.stopPropagation(), this.pay() }} circle={true} className='btn' size='small'>确认收货</AtButton>
            </View>
          </View>
        </View>

        <View className='card' onClick={this.detail.bind(this)}>
          <Image
            className='bookpic'
            src='https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg'
          />
          <View className='bookinfo'>
            <AtIcon className='arrow' value='chevron-right' size='20' color='#8c8c8c' />
            <View className='booktitle'>
              [test for english books] mkl;lsakd;laskfl;k;alsfk;alskd;laskdl;askd;sak
            </View>
            <View className='price'>
              <Text className='priceint'>¥10.</Text>
              <Text className='pricedecimal'>50</Text>
            </View>
            <View className='btncontainer'>
              <View className='finish'>交易已完成</View>
            </View>
          </View>
        </View>

        <View className='card' onClick={this.detail.bind(this)}>
          <Image
            className='bookpic'
            src='https://img.pddpic.com/mms-material-img/2021-06-15/016e1bf5-2f24-4250-8a07-eaa413810c24.jpeg.a.jpeg'
          />
          <View className='bookinfo'>
            <AtIcon className='arrow' value='chevron-right' size='20' color='#8c8c8c' />
            <View className='booktitle'>
              四大皆空少放辣椒配全网人气危旧房屋记得前几位妇女去外婆发的书的小
            </View>
            <View className='price'>
              <Text className='priceint'>¥10.</Text>
              <Text className='pricedecimal'>50</Text>
            </View>
            <View className='btncontainer'>
              {/* 阻止事件冒泡 */}
              <AtButton onClick={(e) => { e.stopPropagation(), this.pay() }} circle={true} className='btn' size='small'>查看物流</AtButton>
            </View>
          </View>
        </View>

      </View>
    )
  }
}
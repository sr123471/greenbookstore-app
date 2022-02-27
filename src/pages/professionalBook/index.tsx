import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.less'

const mockSchoolList = [
  {
    schoolId: 1,
    schoolName: '浙江外国语学院',
    academyList: [
      {
        academyId: 1,
        academyName: '中国语言文化学院',
        majorList: [
          {
            majorId: 1,
            majorName: '中国语言文化学院专业',
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',

          },
        ]
      },
      {
        academyId: 2,
        academyName: '计算机学院',
        majorList: [
          {
            majorId: 1,
            majorName: '计算机科学与技术',
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
          },
          {
            majorId: 2,
            majorName: '软件工程',
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          },
          {
            majorId: 3,
            majorName: '网络工程',
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          },
          {
            majorId: 4,
            majorName: '大数据',
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          },
        ]
      },
    ]
  },
  {
    schoolId: 2,
    schoolName: '浙江工业大学',
    academyList: [],
  },
  {
    schoolId: 3,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 4,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 5,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 6,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 7,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 8,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 9,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 10,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 11,
    schoolName: '浙江大学',
    academyList: [],
  },
  {
    schoolId: 12,
    schoolName: '浙江大学',
    academyList: [],
  },
]

export default class Index extends Component {
  state = { currentSchool: 1 }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChangeSchool = (schoolId) => {
    this.setState({ currentSchool: schoolId })
  }

  handleLinkToBookList = (majorName) => {
    Taro.navigateTo({ url: `/pages/bookList/index?type=${majorName}` })
  }

  render() {
    const { currentSchool } = this.state;
    const { academyList } = mockSchoolList.find((item) => item.schoolId === currentSchool);

    return (
      <View className='professionalBookPage'>
        <View className='leftSide'>
          {
            mockSchoolList.map(item =>
              <View
                className={item.schoolId === currentSchool ? 'schoolItemActive' : 'schoolItem'}
                key={item.schoolId}
                onClick={() => this.handleChangeSchool(item.schoolId)}
              >
                {item.schoolName}
              </View>)
          }
        </View>
        <View className='rightSide'>
          {academyList.map(item =>
            <View className='academyItem'>
              <View className='academyName' key={item.academyId}>{item.academyName}</View>
              <View className='majorList'>
                {item.majorList.map(item =>
                  <View className='majorItem' onClick={this.handleLinkToBookList.bind(this, item.majorName)}>
                    <Image className='image' src={item.image}></Image>
                    <View className='text'>{item.majorName}</View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}

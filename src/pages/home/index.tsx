import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon, AtDrawer } from 'taro-ui'
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
]

const schoolList = ['浙江外国语学院', '浙江工业大学', '浙江大学'];

const bookTypeList = [
  {
    id: 1,
    title: '公共课书籍',
  },
  {
    id: 2,
    title: '专业课书籍',
  },
  {
    id: 3,
    title: '考试书籍',
  },
]

const examType = [
  {
    id: 1,
    title: '英语四六级',
  },
  {
    id: 2,
    title: '研究生考试',
  },
  {
    id: 3,
    title: '公务员考试',
  },
  {
    id: 4,
    title: '教师资格证',
  },
  {
    id: 5,
    title: '计算机等级考',
  },
  {
    id: 6,
    title: '雅思托福',
  },
]

export default class Index extends Component {
  state = {
    showDrawer: false,
    currentSchool: '浙江外国语学院',
    currentBookType: 1,
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleShowDrawer = () => {
    this.setState({ showDrawer: true })
  }

  handleCloseDrawer = () => {
    this.setState({ showDrawer: false })
  }

  handleItemClick = (index) => {
    this.setState({ currentSchool: schoolList[index] })
  }

  handleChangeBookType = (id) => {
    this.setState({ currentBookType: id })
  }

  handleLinkToBookList = (name) => {
    Taro.navigateTo({ url: `/pages/bookList/index?type=${name}` })
  }

  handleLinkToBookListPage = (title) => {
    Taro.navigateTo({ url: `/pages/bookList/index?type=${title}` })
  }

  render() {
    const { showDrawer, currentSchool, currentBookType } = this.state;
    const { academyList } = mockSchoolList.find((item) => item.schoolName === currentSchool);

    return (
      <View className='professionalBookPage'>
        <View className='header' onClick={this.handleShowDrawer}>
          <AtIcon prefixClass='icon' className='icon-weizhi' value='weizhi-xianxing' size='20' color='#9D9D9D'></AtIcon>
          <View className='selectSchool'>{currentSchool}</View>
          <AtIcon className='icon-right' value='chevron-right' size='20' color='#9D9D9D'></AtIcon>
        </View>
        <AtDrawer
          show={showDrawer}
          width='180px'
          onClose={this.handleCloseDrawer.bind(this)}
          onItemClick={this.handleItemClick}
          items={schoolList}
        ></AtDrawer>
        <View className='container'>
          <View className='sidebar'>
            {
              bookTypeList.map(item =>
                <View
                  className={item.id === currentBookType ? 'bookTypeItemActive' : 'bookTypeItem'}
                  key={item.id}
                  onClick={() => this.handleChangeBookType(item.id)}
                >
                  {item.title}
                </View>)
            }
          </View>
          <View className='rightSide'>
            {/* 公共课书籍 */}
            {
              currentBookType === 1 &&
              <View className='publishBookArea' onClick={this.handleLinkToBookList.bind(this, '公共课书籍')}>公共课书籍</View>
            }
            {/* 专业课书籍 */}
            {
              currentBookType === 2 &&
              academyList.map(item =>
                <View className='academyItem'>
                  <View className='academyName' key={item.academyId}>{item.academyName}</View>
                  <View className='majorList'>
                    {item.majorList.map(item =>
                      <View className='majorItem' onClick={this.handleLinkToBookList.bind(this, item.majorName)}>
                        <AtIcon prefixClass='icon' value='zhuanye1' size='40'></AtIcon>
                        <View className='text'>{item.majorName}</View>
                      </View>
                    )}
                  </View>
                </View>
              )
            }
            {/* 考试书籍 */}
            {
              currentBookType === 3 &&
              <View className='examList'>
                {
                  examType.map(item =>
                    <View className='examItem' onClick={this.handleLinkToBookListPage.bind(this, item.title)} key={item.id}>
                      <AtIcon prefixClass='icon' value='shubenfei' size='45'></AtIcon>
                      <View>{item.title}</View>
                    </View>
                  )
                }
              </View>
            }
          </View>
        </View>
      </View>
    )
  }
}

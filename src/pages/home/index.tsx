import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtDrawer } from 'taro-ui'
import './index.less'

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

export default class Index extends Component {
  state = {
    showDrawer: false,
    schoolList: [],
    academyList: [],
    examList: [],
    currentSchool: '',
    currentBookType: 1,
  }

  // 如果不用async和await，则setState方法会比callFunction方法先执行
  componentWillMount() {
    // 当前学校要根据用户信息来
    const currentSchool = Taro.getStorageSync('currentSchool');
    this.setState({ currentSchool })

    // 初始化首页信息，包括学校、学院、专业、考试书籍种类
    Taro.cloud.callFunction({
      name: 'school',
      data: {
        action: 'getHomepageInitialData',
        schoolName: currentSchool,
      }
    }).then(res => {
      console.log(res)
      this.setState({
        schoolList: res.result.schoolData,
        academyList: res.result.academyData.academyList,
        examList: res.result.examData.data,
      })
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 打开抽屉
  handleShowDrawer = () => {
    this.setState({ showDrawer: true })
  }

  // 关闭抽屉
  handleCloseDrawer = () => {
    this.setState({ showDrawer: false })
  }

  // 选择抽屉中的学校
  handleItemClick = (index) => {
    const { schoolList, currentSchool } = this.state;
    if (schoolList[index] !== currentSchool) {
      Taro.setStorageSync('currentSchool', schoolList[index]);
      this.setState({ currentSchool: schoolList[index] })
      // 更新学校时，重新请求学院、专业、考试书籍种类
      Taro.cloud.callFunction({
        name: 'school',
        data: {
          action: 'getHomepageInitialData',
          schoolName: schoolList[index],
        }
      }).then(res => {
        this.setState({
          academyList: res.result.academyData.academyList,
          examList: res.result.examData.data,
        })
      })
    }
  }

  // 选择公共课书籍or专业课书籍or考试书籍
  handleChangeBookType = (id) => {
    this.setState({ currentBookType: id })
  }

  // 根据选择的书籍类型跳转到书籍列表展示界面
  handleLinkToBookListPage = (bookType, academyName, type) => {
    Taro.setStorageSync('currentBookType', bookType);
    Taro.navigateTo({ url: `/pages/bookList/index?academyName=${academyName}&type=${type}` })
  }

  render() {
    const { showDrawer, schoolList, academyList, examList, currentSchool, currentBookType } = this.state;

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
              <View className='publishBookArea' onClick={this.handleLinkToBookListPage.bind(this, 'publicBookList', 0, '公共课书籍')}>
                <AtIcon prefixClass='icon' value='shujijiaocai-copy' size='50'></AtIcon>
                <View className='publishBookText'>公共课书籍</View>
              </View>
            }
            {/* 专业课书籍 */}
            {
              currentBookType === 2 &&
              academyList?.map(item =>
                <View className='academyItem' key={item.academyId}>
                  <View className='academyName' key={item.academyId}>{item.academyName}</View>
                  <View className='majorList'>
                    {item.majorList?.map(item =>
                      <View className='majorItem' onClick={this.handleLinkToBookListPage.bind(this, 'majorBookList', item.academyName, item.majorName)}>
                        <AtIcon prefixClass='icon' value='shuji-copy' size='50'></AtIcon>
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
                  examList?.map(item =>
                    <View className='examItem' onClick={this.handleLinkToBookListPage.bind(this, 'examBookList', 0, item.examName)} key={item._id}>
                      <AtIcon prefixClass='icon' value='shijuan' size='45'></AtIcon>
                      <View>{item.examName}</View>
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

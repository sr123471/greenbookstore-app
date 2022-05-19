import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtDrawer } from 'taro-ui'
import { cloudCall, dataCreator } from '../../service/home'
import { Academy, Major, Exam } from '../../components/common/common'
import { login } from '../../service/login'
import './index.less'

interface State {
  showDrawer: boolean,
  schoolList: string[],
  academyList: Academy[],
  majorList: Major[],
  examList: Exam[],
  currentSchool: string,
  currentBookType: number,
}

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

export default class Index extends Component<any, State> {
  // 防止用this.state=...直接修改state
  readonly state: Readonly<State> = {
    showDrawer: false,
    schoolList: [],
    academyList: [],
    majorList: [],
    examList: [],
    currentSchool: Taro.getStorageSync('userInfo').userSchool,
    currentBookType: 1,
  }

  componentDidMount(): void {
    this.getUser();

    const { userSchool, userAcademy } = Taro.getStorageSync('userInfo');
    if (userSchool !== undefined) {
      // 初始化首页信息，包括学校列表和当前选中的学校信息
      let data = dataCreator('getHomepageInitialData', userSchool);
      cloudCall('school', data).then((res: any) => {
        // 浏览首页的专业课书籍模块时，将当前用户的学院显示在最上面
        const academyList = res.result.academyList;
        let obj = {};
        academyList.forEach((item, index) => {
          if (item.academyName === userAcademy) {
            obj = item;
            academyList.splice(index, 1)
            return;
          }
        });
        academyList.unshift(obj);

        this.setState({
          schoolList: res.result.schoolList,
          academyList: res.result.academyList,
          majorList: res.result.majorList,
          examList: res.result.examList,
        });
      });
    }
  }

  async getUser() {
    const a = await login();
    let rst = await this.isInfoComplete();

    Taro.hideLoading();
    if (!rst) {
      Taro.reLaunch({
        url: '../changeUserInfo/changeUserInfo'
      })
    }
  }

  isInfoComplete() {
    return new Promise((resolve, reject) => {
      Taro.cloud.callFunction({
        name: 'school',
        data: {
          action: 'isInfoComplete',
          openid: Taro.getStorageSync('openid')
        }
      }).then(res => {
        resolve(res.result)
      })
    })
  }

  // 打开抽屉
  handleShowDrawer = (): void => {
    this.setState({ showDrawer: true })
  }

  // 关闭抽屉
  handleCloseDrawer = (): void => {
    this.setState({ showDrawer: false })
  }

  // 选择抽屉中的学校
  handleItemClick = (index: number): void => {
    const { schoolList, currentSchool } = this.state;
    const { userSchool, userAcademy } = Taro.getStorageSync('userInfo');

    if (schoolList[index] !== currentSchool) {
      this.setState({ currentSchool: schoolList[index] })
      // 更新学校时，重新请求当前选中的学校信息
      let data = dataCreator('getHomepageInitialData', schoolList[index]);
      cloudCall('school', data).then((res: any) => {
        const academyList = res.result.academyList;
        let obj = {};
        // 切换学校时，当切换的学校是用户所在的学校时才将用户的学院显示在最上面
        if (schoolList[index] === userSchool) {
          academyList.forEach((item, index) => {
            if (item.academyName === userAcademy) {
              obj = item;
              academyList.splice(index, 1)
              return;
            }
          });
          academyList.unshift(obj);
        }

        this.setState({
          academyList,
          majorList: res.result.majorList,
          examList: res.result.examList,
        })
      })
    }
  }

  // 选择公共课书籍or专业课书籍or考试书籍
  handleChangeBookType = (id: number): void => {
    this.setState({ currentBookType: id })
  }

  // 根据选择的书籍类型跳转到书籍列表展示界面
  handleLinkToBookListPage = (bookType: string, academyName: string, type: string): void => {
    Taro.setStorageSync('currentBookType', bookType);
    Taro.navigateTo({ url: `/pages/bookList/index?academyName=${academyName}&type=${type}` })
  }

  render() {
    const {
      showDrawer,
      schoolList,
      academyList,
      majorList,
      examList,
      currentSchool,
      currentBookType
    } = this.state;

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
              bookTypeList?.map(item =>
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
              <View className='publishBookArea' onClick={this.handleLinkToBookListPage.bind(this, 'publicBook', '', '公共课书籍')}>
                <AtIcon prefixClass='icon' value='shujijiaocai-copy' size='50'></AtIcon>
                <View className='publishBookText'>公共课书籍</View>
              </View>
            }
            {/* 专业课书籍 */}
            {
              currentBookType === 2 &&
              academyList?.map(item =>
                <View className='academyItem' key={item._id}>
                  <View className='academyName' key={item._id}>{item.academyName}</View>
                  <View className='majorList'>
                    {majorList.map(i => i.academyName === item.academyName ?
                      <View className='majorItem' key={item._id} onClick={this.handleLinkToBookListPage.bind(this, 'majorBook', item.academyName, i.majorName)}>
                        <AtIcon prefixClass='icon' value='shuji-copy' size='50'></AtIcon>
                        <View className='text'>{i.majorName}</View>
                      </View> : ''
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
                    <View className='examItem' key={item._id} onClick={this.handleLinkToBookListPage.bind(this, 'examBook', '', item.examName)}>
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

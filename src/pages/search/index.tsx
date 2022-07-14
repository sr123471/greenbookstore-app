import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import './index.less'

export default function Search() {

  const [value, setValue] = useState('')
  const [searchedNameList, setSearchedNameList] = useState([])
  const [timer, setTimer] = useState(0)

  const handleChange = (value: string): void => {
    setValue(value);
    if (value !== '') {
      // 延迟请求，避免当用户连续输入连续请求接口的问题，函数防抖
      clearTimeout(timer);
      setTimer(
        window.setTimeout(() => {
          Taro.cloud.callFunction({
            name: 'book',
            data: {
              action: 'searchBook',
              value: value,
            }
          }).then((res: any) => {
            setSearchedNameList(res.result)
          })
        }, 500)
      )
    } else {
      // 若太快删除搜索内容，则删除全部内容后，由于搜索最后一个字符内容的定时器
      // 依旧会执行，会导致35行执行后，27行又执行一次，所有会显示最后一个字符的搜索记录，所以需要去除定时器
      clearTimeout(timer);
      setSearchedNameList([])
    }
  }

  const handleLinkToBookListPage = (bookName: string): void => {
    Taro.setStorageSync('currentBookType', 'searchBook');
    Taro.navigateTo({ url: `/pages/bookList/index?bookName=${bookName}&type=搜索` })
  }

  return (
    <View className='searchPage'>
      <AtSearchBar
        className='searchBar'
        value={value}
        placeholder='输入书名、作者、ISBN进行全局搜索'
        focus={true}
        onChange={handleChange}
        onActionClick={() => handleLinkToBookListPage(value)}
      />
      <View className='searchedName'>
        {
          searchedNameList.map((item: any) =>
            <View
              className='bookNameItem'
              onClick={() => handleLinkToBookListPage(item.bookName)}
            >
              {item.bookName}
            </View>
          )
        }
      </View>
    </View>
  )
}

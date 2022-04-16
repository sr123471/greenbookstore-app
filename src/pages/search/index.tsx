import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import './index.less'

export default function Search() {

  const [value, setValue] = useState('')
  const [searchedNameList, setSearchedNameList] = useState([])

  const handleChange = (value: string): void => {
    setValue(value);
    if (value !== '') {
      Taro.cloud.callFunction({
        name: 'school',
        data: {
          action: 'searchBook',
          value: value,
        }
      }).then((res: any) => {
        setSearchedNameList(res.result)
      })
    } else {
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
        placeholder='搜索书名、作者、ISBN'
        focus={true}
        onChange={handleChange}
        onActionClick={() => handleLinkToBookListPage(value)}
      />
      <View className='searchedName'>
        {
          searchedNameList.map(item =>
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

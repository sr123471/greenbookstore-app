import Taro, { getCurrentInstance } from '@tarojs/taro'

function cloudCall(name: string, data: object) {
    return Taro.cloud.callFunction({
        name,
        data
    })
}

interface BookListData {
    action: string,
    schoolName: string,
    bookType: string,
    academyName: string,
    detailType: string,
    bookName: string,
    offset: number,
    limit: number,
    sortType: string,
}

function dataCreator(action: string, schoolName: string, bookType: string, offset: number, limit: number, sortType: string): BookListData {
    return {
        action,
        schoolName,
        bookType,
        academyName: getCurrentInstance().router.params.academyName,
        detailType: getCurrentInstance().router.params.type,
        bookName: getCurrentInstance().router.params.bookName,
        offset,
        limit,
        sortType,
    }
}

export { cloudCall, dataCreator }
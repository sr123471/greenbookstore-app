import Taro from '@tarojs/taro'

export function cloudCall(name: string, data: object) {
    return Taro.cloud.callFunction({
        name,
        data
    })
}

interface HomeData {
    action: string,
    schoolName: string,
}

export function dataCreator(action: string, schoolName: string): HomeData {
    return {
        action,
        schoolName,
    }
}

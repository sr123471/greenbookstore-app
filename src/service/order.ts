import Taro, { getCurrentInstance } from '@tarojs/taro'

function cloudCall(name: string, data: object) {
    return Taro.cloud.callFunction({
        name,
        data
    })
}

interface OrderData {
    action: string,
    open_id: string,
    limit: number,
    skip: number,
    status: string
}


function dataCreator(action: string, open_id: string, limit: number, skip: number, status: string): OrderData {
    return {
        action,
        open_id,
        limit,
        skip,
        status
    }
}

export { cloudCall, dataCreator }

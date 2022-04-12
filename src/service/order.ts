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
    status: string
}


function dataCreator(action: string, open_id: string, status: string): OrderData {
    return {
        action,
        open_id,
        status
    }
}

export { cloudCall, dataCreator }

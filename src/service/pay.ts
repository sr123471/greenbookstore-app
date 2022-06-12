import Taro from '@tarojs/taro'
import { sortedUniq } from 'lodash'

const pay = (bookList, money) => {
    console.log(bookList)

    let tobuy = []
    let temp

    bookList.forEach(item => {
        temp = {
            ISBN: item.ISBN,
            name: item.bookName,
            presentPrice: item.presentPrice,
            num: item.selectQuantity
        }

        tobuy.push(temp)
    });

    console.log(tobuy)

    Taro.cloud.callFunction({
        name: 'do_pay',
        data: {
            type: 'pay',
            book: tobuy,
            total: money
        },
        success: res => {
            // get resource ID
            const payment = res.result.payment
            Taro.requestPayment({
                ...payment,
                success(res) {
                    Taro.cloud.callFunction({
                        name: 'do_pay',
                        data: {
                            type: 'done'
                        }
                    }).then((res) => {
                        Taro.switchTab({ url: '../home/index' }).then(() => {
                            Taro.showToast({
                                title: '购买成功！',
                                icon: 'success',
                            });
                        })
                    })
                },
                fail(err) {
                    console.log(err);
                }
            })
        },
        fail: err => {
            // handle error
            console.log(err);
        }
    })
}

export default pay
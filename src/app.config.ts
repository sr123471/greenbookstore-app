export default {
  pages: [
    'pages/home/index',
    'pages/cart/index',
    'pages/mine/index',
    'pages/bookList/index',
    'pages/professionalBook/index',
    'pages/examBook/index',
    'pages/search/index',
    'pages/bookDetail/index',
    'pages/purchase/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    "list": [{
      "pagePath": "pages/home/index",
      "text": "首页"
    }, {
      "pagePath": "pages/cart/index",
      "text": "购物车"
    }, {
      "pagePath": "pages/mine/index",
      "text": "个人中心"
    }]
  },
}

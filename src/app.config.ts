export default {
  pages: [
    // sr
    'pages/home/index',
    'pages/cart/index',
    'pages/bookList/index',
    'pages/search/index',
    'pages/bookDetail/index',
    'pages/purchase/index',
    // zcy
    'pages/usercenter/usercenter',
    'pages/addressedit/addressedit',
    'pages/address/address',
    'pages/orderdetail/orderdetail',
    'pages/mystar/mystar',
    'pages/unreceived/unreceived',
    'pages/order/order',
    'pages/userinfo/userinfo',
    // 'pages/index/index',
    'pages/advice/advice',
    'pages/sellbooks/sellbooks'
  ],
  tabBar: {
    list: [{
      'iconPath': 'resource/home.png',
      'selectedIconPath': 'resource/home_on.png',
      'pagePath': 'pages/home/index',
      'text': '图书商店'
    }, {
      'iconPath': 'resource/cart.png',
      'selectedIconPath': 'resource/cart_on.png',
      'pagePath': 'pages/cart/index',
      'text': '购物车'
    }, {
      'iconPath': 'resource/user.png',
      'selectedIconPath': 'resource/user_on.png',
      'pagePath': 'pages/usercenter/usercenter',
      'text': '个人中心'
    }],
    'color': '#000',
    'selectedColor': '#389e0d',
    'backgroundColor': '#fff',
    'borderStyle': 'white'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  cloud: true
}

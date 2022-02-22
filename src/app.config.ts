export default {
  pages: [
    'pages/index/index',
    'pages/usercenter/usercenter',
  ],
  tabBar: {
    list: [{
      'iconPath': 'resource/home.png',
      'selectedIconPath': 'resource/user.png',
      'pagePath': 'pages/index/index',
      'text': '图书商店'
    }, {
      'iconPath': 'resource/user.png',
      'selectedIconPath': 'resource/home.png',
      'pagePath': 'pages/usercenter/usercenter',
      'text': '个人中心'
    }],
    'color': '#000',
    'selectedColor': '#56abe4',
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

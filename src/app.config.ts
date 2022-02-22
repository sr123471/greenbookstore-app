export default {
  pages: [
    'pages/usercenter/usercenter',
    'pages/userinfo/userinfo',
    'pages/index/index',
    'pages/advice/advice'
  ],
  tabBar: {
    list: [{
      'iconPath': 'resource/home.png',
      'selectedIconPath': 'resource/home_on.png',
      'pagePath': 'pages/index/index',
      'text': '图书商店'
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

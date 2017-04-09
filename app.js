// app.js
const regeneratorRuntime = require('./lib/runtime');
const co = require('./lib/co');
const wx = require('./lib/wx');
const Api = require('./utils/api.js');
const wxapp = require('./lib/wxapp');

App({
  onLaunch: wxapp.handler(function* onLaunch(next) {
    yield this.checkWxSession();
    yield next;
  }),

  getUser() {
    return wx.getStorageSync('user');
  },

  getUserId() {
    const user = wx.getStorageSync('user');
    const userId = user ? user.user_id : '';
    return userId;
  },

  getUsername() {
    const user = wx.getStorageSync('user');
    const username = user ? user.user_name : '';
    return username;
  },

  goToLogin: co.wrap(function* goToLogin() {
    yield wx.redirectTo({ url: '../login/login' });
  }),

  generateRequestHeader: () => {
    const user = wx.getStorageSync('user');
    const userId = user ? user.user_id : '';
    const userName = user ? user.user_name : '';
    const accessToken = wx.getStorageSync('accessToken') || '';
    const authorizationCode = wx.getStorageSync('authorizationCode') || '';
    const businessType = user ? user.business_type : '';
    const openId = wx.getStorageSync('openId') || '';
    const sessionId = wx.getStorageSync('sessionId') || null;
    const cookie = sessionId ? `SessionId=${sessionId};` : '';
    return {
      'content-type': 'application/json',
      'jia-access-token': accessToken,
      'user-id': userId,
      'device-id': openId,
      'jia-app-id': 'com.jia.weapp.construction',
      'jia-oauth2-api-version': '1.0.0',
      'jia-erp-channel': 'weapp',
      'jia-erp-app-version': '1.0.0',
      'user-name': userName,
      platform: 'weapp',
      'business-type': businessType,
      'authorization-code': authorizationCode,
      Cookie: cookie,
    };
  },

  getBusinessType: () => {
    const user = wx.getStorageSync('user');
    return user ? user.business_type : '';
  },

  // Action Log
  recordActionLog: function* recordActionLog(customerId, opType) {
    yield wx.request({
      url: Api.recordActionLog({}),
      method: 'POST',
      header: this.generateRequestHeader(),
      data: {
        customer_id: customerId,
        op_type: opType,
        log_type: 'db',
        content: 'json',
      },
    });
  },

  checkWxSession: function* checkWxSession() {
    try {
      yield wx.checkSession();
    } catch (e) {
      yield this.wxLogin();
    }

    const openId = wx.getStorageSync('openId');
    const wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (!openId || !wxUserInfo) {
      yield this.wxLogin();
    }
  },

  wxLogin: function* wxLogin() {
    const loginResponse = yield wx.login();
    const wxUserInfo = yield wx.getUserInfo();
    if (wxUserInfo && wxUserInfo.userInfo) {
      wx.setStorageSync('wxUserInfo', wxUserInfo.userInfo);
    }

    if (loginResponse.code) {
      yield this.getAndSaveOpenId(loginResponse.code);
    }
  },

  getAndSaveOpenId: function* getAndSaveOpenId(code) {
    const res = yield wx.request({
      url: Api.getOpenId(code),
      method: 'GET',
      header: this.generateRequestHeader(),
    });
    if (res.statusCode === 200 && res.data) {
      wx.setStorageSync('openId', res.data);
    }
  },

  clearAccount: () => {
    wx.clearStorageSync();
  },

  globalData: {
    userInfo: null,
  },

  convertObj: (basicUrl, obj) => {
    function concatenate(k) {
      return `${encodeURIComponent(k)}=${obj[k]}`;
    }

    if (basicUrl && obj) {
      const postfix = Object.keys(obj).map(concatenate).join('&');
      return `${basicUrl}?${postfix}`;
    }

    return basicUrl;
  },

});
const app = getApp();
wxapp.use(function* logininterceptor(next) {
  try {
    const pages = getCurrentPages();
    const currentPage = pages && pages.length > 0 ? pages[pages.length - 1] : null;
    const ignoreCheckLogin = currentPage ? currentPage.data.ignoreCheckLogin : null;
    // const user = wx.getStorageSync('user');
    // if (!ignoreCheckLogin && !user) {
    //   yield app.goToLogin();
    // }
  } catch (error) {
    // console.error(`error:${JSON.stringify(error)}`);
    if (error && error.name === 'LoginRequiredError') {
      console.log(error);
    } else {
      throw error;
    }
  }

  yield next;
});

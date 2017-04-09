'use strict'
const _ = require('lodash');

const registerApp = (appHolder) => {
  global.appHolder = appHolder;
  global.App = (app) => {
    appHolder.app = app;
    app.setData = (data) => {
      appHolder.app.data = data;
    };
  };

  global.getApp = () => appHolder.app;
};

const registerPage = (appHolder) => {
  global.Page = (page) => {
    appHolder.page = page;
    page.setData = (data) => {
      appHolder.page.data = _.assign(appHolder.page.data, data);
    };
  };
};

global.wx = {
  getStorageSync: () => {

  },

  setStorageSync: () => {

  },

  request: () => {

  },

  checkSession: () => {

  },

  login: () => {

  },

  getUserInfo: () => {

  },

  showModal: () => {

  },

  showToast: () => {

  },

  navigateTo: () => {

  },

  redirectTo: () => {

  },

  makePhoneCall: () => {

  },

  stopPullDownRefresh: () => {

  },

  onReachBottom: () => {

  },

  showNavigationBarLoading: () => {

  },

  hideNavigationBarLoading: () => {

  },
};

class AppHolder {
  initApp(file) {
    require(file);
    return this.app;
  }

  initPage(file) {
    require(file);
    return this.page;
  }
}

module.exports = AppHolder;
module.exports.registerApp = registerApp;
module.exports.registerPage = registerPage;

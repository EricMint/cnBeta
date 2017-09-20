// index.js
const regeneratorRuntime = require('../../lib/runtime');
const wxapp = require('../../lib/wxapp');
const wx = require('../../lib/wx');
const co = require('../../lib/co');
const Api = require('../../utils/api.js');
const WxParse = require('../../lib/wxParse/wxParse.js');

// 获取应用实例
const app = getApp();
Page({
  data: {
    newsList: {},
    pageIndex: 1,
    pageSize: 5,
    gotFullList: false,
    loadingMore: false,
    fetchingLatest: true,
    emptyList: false,
  },

  fetchLatestData: function* fetchLatestData(stage) {
    const pageIndex = 1;
    this.setData({
      pageIndex,
      gotFullList: false,
      fetchingLatest: true,
      emptyList: false,
    });
    const newsList = yield this.getNewsListFromSweetUI(pageIndex);
    if (newsList && newsList.length > 0) {
      console.log(newsList);
      this.setData({
        fetchingLatest: false,
        newsList,
        pageIndex: pageIndex + 1,
      });
    } else {
      this.setData({
        fetchingLatest: false,
        emptyList: true,
      });
    }
  },

  // 获取新闻
  getNewsListFromSweetUI: function* getNewsListFromSweetUI(pageIndex) {
    const res = yield wx.request({
      url: Api.getNewsListFromSweetUI(pageIndex),
      method: 'GET',
    });

    if (res.statusCode === 200 && res.data && res.data.data) {
      const newsList = res.data.data || [];
      return newsList;
    }
  },

  // 获取下一页客户列表数据
  fetchDataOfNextPage: function* fetchDataOfNextPage() {
    this.setData({
      gotFullList: false,
      loadingMore: true,
    });
    const pageIndex = this.data.pageIndex;
    const newsList = yield this.getNewsListFromSweetUI(pageIndex);
    if (newsList && newsList.length > 0) {
      const currentList = this.data.newsList;
      const nextList = currentList.concat(newsList);
      this.setData({
        loadingMore: false,
        newsList: nextList,
        pageIndex,
      });
    } else {
      this.setData({
        gotFullList: true,
        loadingMore: false,
      });
      wx.showToast({
        title: '加载完毕',
      });
    }
  },

  goToArticleDetail: wxapp.handler(function* goToArticleDetail(next, e) {
    const id = e.currentTarget.dataset.id;
    const classify = e.currentTarget.dataset.classify;
    const url = `../articleDetail/articleDetail?classify=${classify}&id=${id}`;
    yield wx.navigateTo({
      url,
    });
    yield next;
  }),

  // 页面顶部下拉刷新以获取最新数据
  onPullDownRefresh: wxapp.handler(function* onPullDownRefresh(next) {
    yield this.fetchLatestData();
    wx.stopPullDownRefresh();
    yield next;
  }),

  // 页面底部上拉加载以获取下一页数据
  onReachBottom: wxapp.handler(function* onReachBottom(next) {
    yield this.fetchDataOfNextPage();
    // console.log(this.data.fetchingLatest);
    // if (this.data.fetchingLatest) {
    //   return;
    // }
    //
    // this.setData({
    //   pageIndex: this.data.pageIndex + 1,
    //   loadingMore: !this.data.gotFullList,
    // });
    //
    // console.log(this.data.gotFullList);
    // if (!this.data.gotFullList) {
    //   yield this.fetchDataOfNextPage();
    // } else {
    //   wx.showToast({
    //     title: '加载完毕',
    //   });
    // }

    yield next;
  }),

  onLoad: co.wrap(function* onLoad() {
    yield this.fetchLatestData();
    console.log('end');
  }),

});

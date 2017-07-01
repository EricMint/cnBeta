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
    this.setData({
      gotFullList: false,
      fetchingLatest: true,
      emptyList: false,
    });
    const pageIndex = this.data.pageIndex;
    const res = yield wx.request({
      url: Api.getNewsListFromSweetUI(pageIndex),
      method: 'GET',
    });

    if (res.statusCode === 200 && res.data && res.data.data) {
      let newsList = res.data.data;
      console.log(newsList);
      this.setData({
        fetchingLatest: false,
        newsList,
      });
    } else {
      this.setData({
        fetchingLatest: false,
        emptyList: true,
      });
    }

  },

  getItemList: function (itemList) {
    return itemList[0].child[1].child[1].child[3].child[0].child[0].child[1].child;
  },

  // 获取下一页客户列表数据
  fetchDataOfNextPage: function* fetchDataOfNextPage() {
    this.setData({
      gotFullList: false,
      loadingMore: true,
    });
    const res = yield wx.request({
      url: Api.getProjectList({}),
      method: 'GET',
      header: app.generateRequestHeader(),
      data: {
        page_index: this.data.pageIndex,
        page_size: this.data.pageSize,
        project_stage: this.data.currentStage.value,
      },
    });

    if (res.statusCode === 200 && res.data) {
      const nextProjects = res.data.projects || {};
      if (nextProjects.length > 0) {
        const pageData = this.data;
        const currentProjects = pageData.projectStageMap.get(pageData.currentStage.name);
        const newProjects = currentProjects.concat(nextProjects);
        pageData.projectStageMap.set(pageData.currentStage.name, newProjects);
        this.setStageProjects(pageData.currentStage);
        this.setData({
          loadingMore: false,
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
    }
  },

  goToArticleDetail: wxapp.handler(function* goToArticleDetail(next, e) {
    const articleId = e.currentTarget.dataset.id;
    const url = `../articleDetail/articleDetail?articleId=${articleId}`;
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
    if (this.data.fetchingLatest) {
      return;
    }

    this.setData({
      pageIndex: this.data.pageIndex + 1,
      loadingMore: !this.data.gotFullList,
    });

    if (!this.data.gotFullList) {
      yield this.fetchDataOfNextPage();
    } else {
      wx.showToast({
        title: '加载完毕',
      });
    }

    yield next;
  }),

  onLoad: co.wrap(function* onLoad() {
    yield this.fetchLatestData();
    console.log('end');
  }),

});

// index.js
const regeneratorRuntime = require('../../lib/runtime');
const wxapp = require('../../lib/wxapp');
const wx = require('../../lib/wx');
const co = require('../../lib/co');
const Api = require('../../utils/api.js');
const WxParse = require('../../lib/wxParse/wxParse.js');
const DOMParser = require('../../lib/xmldom/dom-parser.js').DOMParser;

// 获取应用实例
const app = getApp();
Page({
  data: {
    newsList: {},
    pageIndex: 0,
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
    // var doc = new DOMParser().parseFromString(
    //   '<xml xmlns="a" xmlns:c="./lite">\n' +
    //   '\t<child>test</child>\n' +
    //   '\t<child></child>\n' +
    //   '\t<child/>\n' +
    //   '</xml>'
    //   , 'text/xml');
    // doc.documentElement.setAttribute('x', 'y');
    // doc.documentElement.setAttributeNS('./lite', 'c:x', 'y2');
    // var nsAttr = doc.documentElement.getAttributeNS('./lite', 'x')
    // console.info(nsAttr)
    // console.info(doc)


    const res = yield wx.request({
      url: Api.getNewsList({}),
      method: 'GET',
    });

    if (res.statusCode === 200 && res.data) {
      let newsList = [];
      const rawJson = new DOMParser().parseFromString(res.data, 'text/html');
      var nsAttr = rawJson.documentElement.getElementsByTagName('body');
      var nsAttr2 = rawJson.documentElement.getElementsByTagName('cnbeta-update').className;
      console.log(rawJson);
      console.log(nsAttr);
      console.log(nsAttr2);
    }

    if (res.statusCode === 200 && res.data) {
      let newsList = [];
      const rawJson = WxParse('html', res.data);
      const rawList = this.getItemList(rawJson);
      for (let i = 0; i < rawList.length; i++) {
        let item = this.formatItem(rawList[i]);
        newsList.push(item);
      }

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

  formatItem: function (item) {
    let formattedItem = {};
    const itemInfo = item.child[0];
    const itemTitle = itemInfo.child[0].child[0].child[0].text;
    const itemHref = itemInfo.child[0].child[0].attr.href;
    const itemId = this.getItemId(itemHref);
    // const itemText = this.formatItemText(itemInfo.child[1].child[0].child);
    const itemPic = itemInfo.child[2].child[0].attr.src;
    formattedItem.title = itemTitle;
    formattedItem.href = itemHref;
    formattedItem.id = itemId;
    // formattedItem.text = itemText;
    formattedItem.pic = itemPic;
    return formattedItem;
  },

  formatItemText: function (textList) {
    let itemText = '';
    for (var i = 0; i < textList.length; i++) {
      if (textList[i].text) {
        itemText += textList[i].text;
      } else {
        itemText += textList[i].child[0].text;
      }
    }

    return itemText;
  },

  getItemId: function (itemHref) {
    if (itemHref) {
      return parseInt(itemHref.substr(-10, 6));
    }
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
    console.log('start');
    yield this.fetchLatestData();
    console.log('end');
  }),

});

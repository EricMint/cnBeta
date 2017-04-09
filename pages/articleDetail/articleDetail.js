// projectDetail.js
const regeneratorRuntime = require('../../lib/runtime');
const wxapp = require('../../lib/wxapp');
const wx = require('../../lib/wx');
const Api = require('../../utils/api.js');
const WxParse = require('../../lib/wxParse/wxParse.js');

// 获取应用实例
const app = getApp();
Page({
  data: {
    articleId: null,
    articleInfo: {},
    currentStageId: null,
    tappedStageId: null,
    tappedStageInfo: {},
    emptyArticle: false,
    loading: true,
  },

  // 获取阶段信息详情
  getArticleDetail: function* getArticleDetail(articleId) {
    const res = yield wx.request({
      url: Api.getArticleDetail(articleId),
      method: 'GET',
    });

    if (res.statusCode === 200 && res.data) {
      let articleInfo = {};
      const rawJson = WxParse('html', res.data);
      const rawArticle = this.getItem(rawJson);
      articleInfo = this.formatItem(rawArticle);
      this.setData({
        articleInfo,
        loading: false,
      });
    }
  },

  getItem: function (raw) {
    return raw[0].child[1].child[1].child[0].child[1].child[0].child;
  },

  formatItem: function (item) {
    let formattedItem = {};
    const article = item[0];
    const comment = item[1];

    const title = article.child[0].child[0].child[0].text;
    const articleSumaryJson = article.child[1].child[0].child[1].child;
    const articleSumary = this.formatItemText(articleSumaryJson);
    // const articleContentJson = article.child[1].child[1].child;
    // const itemDate = itemContent.child[2].child[0].child[0].text;
    const author = article.child[2].child[0].child[0].text;


    // const itemContent = item.child[0];
    // const itemHotComment = itemInfo.child[0].child[0].attr.href;
    // const itemId = this.getItemId(itemHref);
    // const itemText = this.formatItemText(itemInfo.child[1].child[0].child);
    // const itemPic = itemInfo.child[2].child[0].attr.src;
    formattedItem.title = title;
    formattedItem.articleSumary = articleSumary;
    // formattedItem.id = itemId;
    // formattedItem.text = itemText;
    // formattedItem.pic = itemPic;
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

  formatArticleContent: function (articleContent) {
    let articleContentList = [];
    for (let i = 0; i < articleContent.length; i++) {
      const target = articleContent[i];
      if (target.hasOwnProperty(tag) && target[tag]) {
        let item = {};
        item.type = 'img';
        item.value = target.attr.src;
      } else if (target.hasOwnProperty(tag) && target[tag]) {
        itemText += textList[i].child[0].text;
      }
    }

    return itemText;
  },

  // 预览图片
  previewImage: wxapp.handler(function* previewImage(next, e) {
    const current = e.target.dataset.src;
    const nodeId = e.target.dataset.nodeId;
    const processId = e.target.dataset.processId;
    const tappedStageInfo = this.data.tappedStageInfo;
    const projectNodes = tappedStageInfo.project_nodes;
    let tappedImageList = [];
    let photoGroups = [];
    for (let i = 0; i < projectNodes.length; i += 1) {
      if (projectNodes[i].project_node_id === nodeId) {
        let processes = projectNodes[i].project_processes;
        for (let j = 0; j < processes.length; j++) {
          if (processes[j].project_process_id === processId) {
            photoGroups = processes[j].photo_groups;
          }
        }
      }
    }

    if (photoGroups) {
      for (let i = 0; i < photoGroups.length; i++) {
        let photos = photoGroups[i].photos;
        for (let j = 0; j < photos.length; j++) {
          let photo = photos[j];
          tappedImageList.push(photo.url);
        }
      }
    }

    yield wx.previewImage({
      current,
      urls: tappedImageList,
    });
    yield next;
  }),

  // 导向上传单据页面
  goToUploadInvoicePage: wxapp.handler(function* goToUploadInvoicePage(next) {
    const tappedStageId = this.data.tappedStageId || '';
    const projectId = this.data.projectId || '';
    const url = `../invoice/invoice?projectId=${projectId}&stageId=${tappedStageId}`;
    yield wx.navigateTo({
      url,
    });
    yield next;
  }),

  onLoad: wxapp.handler(function* onLoad(next, options) {
    const articleId = options.articleId;
    if (articleId) {
      yield this.getArticleDetail(articleId);
      this.setData({
        articleId,
      });
    } else {
      this.setData({
        emptyArticle: true,
      });
    }

    yield next;
  }),
});

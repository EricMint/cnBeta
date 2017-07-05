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
    classify: '',
    id: null,
    articleInfo: {},
    emptyArticle: false,
    loading: true,
  },

  // 获取阶段信息详情
  getArticleDetail: function* getArticleDetail(classify, id) {
    const res = yield wx.request({
      url: Api.getArticleDetail(classify, id),
      method: 'GET',
    });

    if (res.statusCode === 200 && res.data && res.data.data) {
      const articleInfo = res.data.data;
      this.setData({
        articleInfo,
        loading: false,
      });
    }
  },

  getItem: function (raw) {
    return raw[0].child[1].child[1].child[0].child[1].child[0].child;
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
    const classify = options.classify;
    const id = options.id;
    if (classify, id) {
      yield this.getArticleDetail(classify, id);
      this.setData({
        classify,
        id,
      });
    } else {
      this.setData({
        emptyArticle: true,
      });
    }

    yield next;
  }),
});

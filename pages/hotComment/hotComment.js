// invoiceList.js
const regeneratorRuntime = require('../../lib/runtime');
const wxapp = require('../../lib/wxapp');
const wx = require('../../lib/wx');
const Api = require('../../utils/api.js');

const app = getApp();
Page({
  data: {
    currentStageId: '',
    currentStageEmpty: true,
    stageList: [],
    tappedStage: {},
    invoiceList: [],
    projectId: '',
    emptyInvoiceList: false,
    fetchingStageList: false,
    fetchingInvoiceList: false,
  },

  getStagesByProjectId: function* getStagesByProjectId(projectId) {
    this.setData({
      fetchingStageList: true,
    });
    const res = yield wx.request({
      url: Api.getStagesByProjectId(projectId),
      method: 'GET',
      header: app.generateRequestHeader(),
    });

    if (res.statusCode === 200 && res.data) {
      const stageList = res.data.stages || {};
      const currentStageId = res.data.current_stage_id;
      if (stageList.length > 0) {
        let tappedStage = {};
        for (let i = 0; i < stageList.length; i += 1) {
          if (stageList[i].project_stage_id === currentStageId) {
            tappedStage = stageList[i];
          }
        }

        this.setData({
          stageList,
          currentStageId,
          tappedStage,
          fetchingStageList: false,
        });
      }
    } else {
      this.setData({
        fetchingStageList: false,
      });
      wx.showModal({
        title: '获取信息失败',
        content: '请检查您的网络连接, 或者稍后重试',
        showCancel: false,
      });
    }
  },

  getInvoiceList: function* getInvoiceList(stage) {
    this.setData({
      emptyInvoiceList: false,
      fetchingInvoiceList: true,
    });
    const projectId = this.data.projectId || '';
    const res = yield wx.request({
      url: Api.getInvoiceListByProjectIdAndStageId(projectId, stage.project_stage_id),
      method: 'GET',
      header: app.generateRequestHeader(),
    });
    if (res.statusCode === 200 && res.data && res.data.status === 1) {
      const photoGroups = res.data.photo_groups || [];
      if (photoGroups.length > 0) {
        const invoiceList = [];
        for (let i = 0; i < photoGroups.length; i += 1) {
          if (photoGroups[i] && photoGroups[i].status === 1) {
            invoiceList.push(photoGroups[i]);
          }
        }

        this.setData({
          invoiceList,
          fetchingInvoiceList: false,
        });
      } else {
        this.setData({
          emptyInvoiceList: true,
          fetchingInvoiceList: false,
        });
      }

    } else {
      this.setData({
        fetchingInvoiceList: false,
      });
      wx.showModal({
        title: '获取信息失败',
        content: '请检查您的网络连接, 或者稍后重试',
        showCancel: false,
      });
    }

    yield next;
  },

  // 顶部tab切换
  tabSwitch: wxapp.handler(function* tabSwitch(next, e) {
    const tappedStage = e.target.dataset.value;
    this.setData({
      tappedStage,
      currentStageName: tappedStage.name,
      invoiceList: [],
    });
    yield this.getInvoiceList(tappedStage);
    yield next;
  }),

  // 查看大图
  previewImage: wxapp.handler(function* previewImage(next, e) {
    const current = e.target.dataset.src;
    const idx = e.target.dataset.idx;
    const photoList = this.data.invoiceList[idx].photos;
    let photoUrls = [];
    if (photoList) {
      for (let i = 0; i < photoList.length; i += 1) {
        let photo = photoList[i];
        if (photo && photo.url) {
          photoUrls.push(photo.url);
        }
      }
    }

    yield wx.previewImage({
      current: current,
      urls: photoUrls,
    });
    yield next;
  }),

  onLoad: wxapp.handler(function* onLoad(next, options) {
    if (options.projectId) {
      this.setData({
        projectId: options.projectId,
      });
      yield this.getStagesByProjectId(options.projectId);
      yield this.getInvoiceList(this.data.tappedStage);
    }

    yield next;
  }),

  onShow: wxapp.handler(function* onShow(next) {
    yield next;
  }),
})
  ;

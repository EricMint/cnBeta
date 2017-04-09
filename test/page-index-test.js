/* eslint-env node, mocha */
process.env.NODE_ENV = 'test';

const co = require('co');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const AppHolder = require('./wxa-test-support');
const registerApp = require('./wxa-test-support').registerApp;
const registerPage = require('./wxa-test-support').registerPage;
const wxapi = require('../lib/wx');
const sinon = require('sinon');
const Api = require('../utils/api');
const _ = require('lodash');

const expect = chai.expect;
chai.use(dirtyChai);

before(() => {
  if (!global.appHolder) {
    const appHolder = new AppHolder();
    registerApp(appHolder);
    appHolder.initApp('../app');
  }
});

describe('Page/Index/Fetch Latest Data', () => {
  it('Fetch Latest Data Empty', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          total_count: 0,
          customer_list: [],
          push_list: [],
        },
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.data.query_type === '未接单'))
        .returns(mockRes);

      mockWXAPI.expects('showModal')
        .once()
        .withExactArgs(
        sinon.match(value => value.title === '您目前没有新订单！'
          && value.content === '有新订单时，我们将会短信/电话通知您，请耐心等待。'));

      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          _.isNull(value.data.customer_id) &&
          value.data.op_type === '查收订单'))
        .returns(mockRes);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/index/index');

      yield page.getNewCustomer();
      mockWXAPI.verify();
      expect(page.data.skHidden).to.be.false();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Fetch Latest Data 401', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 401,
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.data.query_type === '未接单'))
        .returns(mockRes);

      mockWXAPI.expects('redirectTo')
        .once()
        .withExactArgs(sinon.match(value => value.url === '../login/login'));

      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          _.isNull(value.data.customer_id) &&
          value.data.op_type === '查收订单'))
        .returns(mockRes);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/index/index');

      yield page.getNewCustomer();
      mockWXAPI.verify();
      expect(page.data.skHidden).to.be.false();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Fetch Latest Data Not Empty', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          total_count: 0,
          customer_list: [
            {
              phone: '13200010131',
              designerStatus: '未接单',
              cancelOrder: false,
              createDate: '2016-10-31T14:38:34.000+08:00',
              customer_id: 9845,
              customer_name: '李铭',
              bind_with_consultant: false,
              virtual_phone_status: 0,
              is_cancel: true,
              designer_real_name: '王小二',
              building_name: '国贸新城',
            },
            {
              phone: '13200021888',
              designerStatus: '未接单',
              cancelOrder: false,
              createDate: '2016-10-31T14:38:34.000+08:00',
              customer_id: 9846,
              customer_name: '胡歌',
              bind_with_consultant: false,
              virtual_phone_status: 0,
              is_cancel: true,
              designer_real_name: '张晓明',
              building_name: '康城',
            },
          ],
          push_list: [],
        },
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.data.query_type === '未接单'))
        .returns(mockRes);
      mockWXAPI.expects('navigateTo')
        .once();

      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === mockRes.data.customer_list[0].customer_id &&
          value.data.op_type === '查收订单'))
        .returns(mockRes);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/index/index');

      yield page.getNewCustomer();
      mockWXAPI.verify();
      expect(page.data.skHidden).to.be.false();
      expect(page.data.customerId).to.equal(mockRes.data.customer_list[0].customer_id);

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/Index/onShow', () => {
  it('onShow Logged In', (done) => {
    co(function* callback() {
      const mockRes = {
        user: {
          access_token: '9ed9dea6-68f0-4937-ae68-ea271c2e962d',
          authorization_code: '47644be2-3d67-4c99-973f-f30c36545801',
          certificate: '国家一级资质',
          department: '独立设计师',
          designerAppActivated: 1,
          designer_id: 331,
          designer_status: '002',
          designer_type: '独立',
          good_style: '中式,简约,北欧',
          head_img: 'http://192.168.254.188:8095/image-service/null',
          is_consultant: false,
          message: '您处于待审核状态,需要审核通过后才能接单！',
          name: '人人1',
          phone: '13200096666',
          role: '平台分站设计师',
          sex: '',
          status: 1,
          user_id: 2018,
          user_name: '13200096666',
          user_type: 'designer',
        },
        openId: 'nlaisudhcaiusdhcliausdghcliasuygdcuiyg',
        wxUserInfo: {
          avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/jasuydgcyu/0',
          city: '',
          country: '',
          gender: 1,
          language: 'en',
          nickName: 'TestNickName',
          province: '',
        },
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);
      mockWXAPI.expects('checkSession')
        .once()
        .returns({});
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'wxUserInfo'))
        .returns(mockRes.wxUserInfo);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/index/index');

      yield page.onShow();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('onShow Not Logged In', (done) => {
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns('');

      mockWXAPI.expects('redirectTo')
        .once()
        .withExactArgs(sinon.match(value => value.url === '../login/login'))
        .returns({ errMsg: 'redirectTo:ok', url: 'pages/login/login.html', webviewId: 0 });

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/index/index');

      yield page.onShow();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('onShow Logged In But WX Session Expired', (done) => {
    co(function* callback() {
      const mockRes = {
        user: {
          access_token: '9ed9dea6-68f0-4937-ae68-ea271c2e962d',
          authorization_code: '47644be2-3d67-4c99-973f-f30c36545801',
          certificate: '国家一级资质',
          department: '独立设计师',
          designerAppActivated: 1,
          designer_id: 331,
          designer_status: '002',
          designer_type: '独立',
          good_style: '中式,简约,北欧',
          head_img: 'http://192.168.254.188:8095/image-service/null',
          is_consultant: false,
          message: '您处于待审核状态,需要审核通过后才能接单！',
          name: '人人1',
          phone: '13200096666',
          role: '平台分站设计师',
          sex: '',
          status: 1,
          user_id: 2018,
          user_name: '13200096666',
          user_type: 'designer',
        },
        openId: null,
        openIdToGet: 'nlaisudhcaiusdhcliausdghcliasuygdcuiyg',
        wxUserInfo: null,
        wxUserInfoToGet: {
          encryptData: 'XHVCR/CdB9hUkgAPagZNdVwxb0JakvfahSZIo5bZNINyIATnzns7Zn+',
          encryptedData: 'aQYNpLvW0sKWripaTNktQjWo4SAcxxoMtxbWQR0NJgubgCKvEttMUFcKPRKjqh',
          errMsg: 'getUserInfo:ok',
          iv: 'HuopbzGqM0LE71/Pyk9Wnw==',
          rawData: '',
          signature: 'a196acd580483487c2958c0ff427ea4540b0d83d',
          userInfo: {
            avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eq',
            city: '',
            country: '',
            gender: 1,
            language: 'en',
            nickName: 'Peeintothewind',
            province: '',
          },
        },
        loginResponse: {
          errMsg: 'login:ok',
          code: '041BOMnR0yAj1c2K28nR0KTVnR0BOMnj',
        },
        getOpenIdResponse: {
          errMsg: 'request:ok',
          data: 'o4IgJ0SK9Spu0C-oC7iWIooaglM4',
          statusCode: 200,
        },
      };

      const mockWXAPI = sinon.mock(wxapi);

      // checkLogin once, generateRequestHeader once
      mockWXAPI.expects('getStorageSync')
        .twice()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);

      // checkWxSession
      mockWXAPI.expects('checkSession')
        .once()
        .returns({});

      // checkWxSession once, generateRequestHeader once
      mockWXAPI.expects('getStorageSync')
        .twice()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);

      // checkWxSession
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'wxUserInfo'))
        .returns(mockRes.wxUserInfo);

      // wxLogin
      mockWXAPI.expects('login')
        .once()
        .returns(mockRes.loginResponse);

      // wxLogin
      mockWXAPI.expects('getUserInfo')
        .once()
        .returns(mockRes.wxUserInfoToGet);

      // wxLogin
      mockWXAPI.expects('setStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'wxUserInfo'),
        sinon.match(value => _.isEqual(value, mockRes.wxUserInfoToGet.userInfo)));

      // getAndSaveOpenId
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getOpenId(mockRes.loginResponse.code)))
        .returns(mockRes.getOpenIdResponse);

      // getAndSaveOpenId
      mockWXAPI.expects('setStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'),
        sinon.match(value => value === mockRes.getOpenIdResponse.data));

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/index/index');

      yield page.onShow();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

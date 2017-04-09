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

const expect = chai.expect;
chai.use(dirtyChai);

before(() => {
  if (!global.appHolder) {
    const appHolder = new AppHolder();
    registerApp(appHolder);
    appHolder.initApp('../app');
  }
});

describe('Page/Login', () => {
  it('onShow', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 200,
        data: {
          status: 1,
          session_id: '248d1a15-5dba-4597-a852-c3446516b0a8',
          image: 'image:base64',
        },
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
          sinon.match(value => value === 'sessionId'));

      mockWXAPI.expects('request')
        .withArgs(
          sinon.match(value => value.url === Api.getCaptchaCode()))
        .once()
        .returns(mockRes);

      mockWXAPI.expects('setStorageSync')
        .once()
        .withExactArgs(
          sinon.match(value => value === 'sessionId'),
          sinon.match(value => value === '248d1a15-5dba-4597-a852-c3446516b0a8'));

      mockWXAPI.expects('checkSession')
        .once()
        .returns({});

      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
          sinon.match(value => value === 'openId'))
        .returns('openId');

      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
          sinon.match(value => value === 'wxUserInfo'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/login/login');

      yield page.onShow();

      mockWXAPI.verify();
      expect(page.data.captchaCode).to.equal('image:base64');

      done();
    }).then(() => {}, (err) => {
      done(err);
    });
  });
});

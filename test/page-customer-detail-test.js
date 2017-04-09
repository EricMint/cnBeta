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

const e = {
  currentTarget: {
    dataset: {},
    id: 1234,
  },
};
const customerId = e.currentTarget.id;
const user = {
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
};
const openId = 'nlaisudhcaiusdhcliausdghcliasuygdcuiyg';

describe('Page/CustomerDetail/Fetch Detail', () => {
  it('Fetch Detail Success', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          customer_detail: {
            phone: '150*****628',
            designerStatus: '已接单',
            cancelOrder: false,
            updateDate: '2017-03-06T16:48:40.000+08:00',
            createDate: '2017-03-06T14:40:23.000+08:00',
            income: 0.00,
            phoneEncrypt: '1db7fa4502159a10e3ee930f3e4bda03',
            city: '深圳',
            district: '龙岗区',
            houseType2: null,
            houseStructure: 'simon房型',
            memo: '店铺备注:12312--客服备注:3123123123123',
            customer_id: 10961,
            customer_name: '爱香',
            bind_with_consultant: false,
            virtual_phone_status: 0,
            house_address: '深圳龙岗区123',
            designer_real_name: '',
            assign_order_date: '2017-03-06 14:40',
            service_status: '待确定服务',
            building_name: '123',
            order_id: '316',
            decoration_type: 'simon全包',
            house_area: 12.00,
            budget_amount: '100.01',
            room_num: 0,
            hall_num: 0,
            bathroom_num: 0,
            kitchen_num: 1,
            balcony_num: 0,
            house_rooms: '1厨',
            house_type2: 'simon现房',
          },
        },
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('showNavigationBarLoading')
        .once();
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerDetail(customerId)))
        .returns(mockRes);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);
      mockWXAPI.expects('hideNavigationBarLoading')
        .once();

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

      yield page.fetchDetail(customerId);
      mockWXAPI.verify();
      expect(_.isEqual(page.data.customerDetail, mockRes.data.customer_detail));
      expect(page.data.customerId).to.equal(mockRes.data.customer_detail.customer_id);
      expect(page.data.orderId).to.equal(mockRes.data.customer_detail.order_id);
      expect(page.data.designerStatus).to.equal(mockRes.data.customer_detail.designerStatus);
      expect(page.data.serviceStatus).to.equal(mockRes.data.customer_detail.service_status);

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Fetch Detail 401', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 401,
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('showNavigationBarLoading')
        .once();
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerDetail(customerId)))
        .returns(mockRes);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);
      mockWXAPI.expects('redirectTo')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === '../login/login'))
        .returns({});
      mockWXAPI.expects('hideNavigationBarLoading')
        .once();

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

      yield page.fetchDetail(customerId);
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/CustomerDetail/Get Customer Phone', () => {
  it('Get Customer Phone Success', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          data: {
            status: 0,
            message: 'success',
            cancel: 0,
            open: 'N',
            has_template: false,
            customer_phone: 18912340001,
            virtual_phone_reach_limit: 0,
          },
        },
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerPhone(customerId)))
        .returns(mockRes);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

      yield page.getCustomerPhone(customerId);
      mockWXAPI.verify();
      expect(page.data.customerPhone).to.equal(mockRes.data.customer_phone);
      expect(page.data.fetchPhoneCompleted).to.equal(true);

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Get Customer Phone 401', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 401,
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerPhone(customerId)))
        .returns(mockRes);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);
      mockWXAPI.expects('redirectTo')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === '../login/login'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

      yield page.getCustomerPhone(customerId);
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/CustomerDetail/Call Customer', () => {
  it('Call Customer: Fetch Phone Not Completed', (done) => {
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);

      mockWXAPI.expects('showToast')
        .once()
        .withExactArgs(
        sinon.match(value => value.title === '请稍后，正在获取虚拟号'
          && value.icon === 'loading'));
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === customerId &&
          value.data.op_type === '点击联系业主'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        fetchPhoneCompleted: false,
        customerId,
      });

      yield page.callCustomer();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Call Customer: Fetch Phone Completed Without Phone', (done) => {
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);

      mockWXAPI.expects('showModal')
        .once()
        .withExactArgs(
        sinon.match(value => value.title === '暂无虚拟号可用'
          && value.content === '请稍后重试或者联系客服'));
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === customerId &&
          value.data.op_type === '无虚拟号可用'))
        .returns({});
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === customerId &&
          value.data.op_type === '点击联系业主'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        fetchPhoneCompleted: true,
        customerId,
      });

      yield page.callCustomer();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Call Customer: Fetch Phone Completed With Phone 待确定服务', (done) => {
    const customerPhone = 18912340001;
    const assignOrderDate = '2017-03-02 15:09';
    const orderId = 274;
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('makePhoneCall')
        .once()
        .withExactArgs(
        sinon.match(value => value.phoneNumber === customerPhone))
        .returns({});

      // 测试内部方法app.convertObj(basicUrl, object);
      mockWXAPI.expects('navigateTo')
        .once()
        .withExactArgs(
        sinon.match(value => value.url ===
          `${'../confirmOrder/confirmOrder?' +
          'customerId='}${customerId
          }&assignOrderDate=${assignOrderDate
          }&orderId=${orderId}`))
        .returns({});
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === customerId &&
          value.data.op_type === '点击联系业主'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        fetchPhoneCompleted: true,
        serviceStatus: '待确定服务',
        customerPhone,
        customerId,
        assignOrderDate,
        orderId,
      });

      yield page.callCustomer();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Call Customer: Fetch Phone Completed With Phone 已确定服务', (done) => {
    const customerPhone = 18912340001;
    const assignOrderDate = '2017-03-02 15:09';
    const orderId = 274;
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('makePhoneCall')
        .once()
        .withExactArgs(
        sinon.match(value => value.phoneNumber === customerPhone))
        .returns({});
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === customerId &&
          value.data.op_type === '点击联系业主'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        fetchPhoneCompleted: true,
        serviceStatus: '已确定服务',
        customerPhone,
        customerId,
        assignOrderDate,
        orderId,
      });

      yield page.callCustomer();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/CustomerDetail/Call Customer Real Phone', () => {
  it('Call Customer Real Phone: Fetch Phone Not Completed', (done) => {
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);

      mockWXAPI.expects('showModal')
        .once()
        .withExactArgs(
        sinon.match(value => value.title === '请稍候'
          && value.content === '正在获取用户手机号'))
        .returns({});
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === customerId &&
          value.data.op_type === '点击真实手机号'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        customerPhone: '',
        customerId,
      });

      yield page.callCustomerRealPhone();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Call Customer Real Phone: Fetch Phone Completed', (done) => {
    const customerPhone = 18912340001;
    const assignOrderDate = '2017-03-02 15:09';
    const orderId = 274;
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('makePhoneCall')
        .once()
        .withExactArgs(
        sinon.match(value => value.phoneNumber === customerPhone))
        .returns({});
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.recordActionLog({}) &&
          value.data.customer_id === customerId &&
          value.data.op_type === '点击真实手机号'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        fetchPhoneCompleted: true,
        customerPhone,
        customerId,
        assignOrderDate,
        orderId,
      });

      yield page.callCustomerRealPhone();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/CustomerDetail/Pick Order', () => {
  it('Pick Order Success', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
        },
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.pickOrder(customerId, user.user_name)))
        .returns(mockRes);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      // this.pickOrder() -> app.getUsername()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        designerStatus: '未接单',
      });

      yield page.pickOrder();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('Pick Order 401', (done) => {
    co(function* callback() {
      const mockRes = {
        statusCode: 401,
      };

      const mockWXAPI = sinon.mock(wxapi);
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.pickOrder(customerId, user.user_name)))
        .returns(mockRes);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      // app.getUsername()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);

      mockWXAPI.expects('redirectTo')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === '../login/login'))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        designerStatus: '未接单',
      });

      yield page.pickOrder();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/CustomerDetail/Go To Confirm Order', () => {
  it('Go To Confirm Order', (done) => {
    const assignOrderDate = '2017-03-02 15:09';
    const orderId = 274;
    co(function* callback() {
      const mockWXAPI = sinon.mock(wxapi);

      // 测试内部方法app.convertObj(basicUrl, object);
      mockWXAPI.expects('navigateTo')
        .once()
        .withExactArgs(
        sinon.match(value => value.url ===
          `${'../confirmOrder/confirmOrder?' +
          'customerId='}${customerId
          }&assignOrderDate=${assignOrderDate
          }&orderId=${orderId}`))
        .returns({});

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        customerId,
        assignOrderDate,
        orderId,
      });

      yield page.goToConfirmOrder();
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/CustomerDetail/Get Last 4 Digits', () => {
  it('Get Last 4 Digits Success', (done) => {
    const mockWXAPI = sinon.mock(wxapi);

    // app.getUser()
    mockWXAPI.expects('getStorageSync')
      .once()
      .withExactArgs(
      sinon.match(value => value === 'user'))
      .returns(user);

    const appHolder = global.appHolder;
    registerPage(appHolder);
    const page = appHolder.initPage('../pages/customerDetail/customerDetail');

    const last4Digits = page.getLast4Digits();
    mockWXAPI.verify();
    expect(last4Digits).to.equal('6666');

    done();
  });

  it('Get Last 4 Digits user is null', (done) => {
    const mockWXAPI = sinon.mock(wxapi);
    const userNull = null;

    // app.getUser()
    mockWXAPI.expects('getStorageSync')
      .once()
      .withExactArgs(
      sinon.match(value => value === 'user'))
      .returns(userNull);

    const appHolder = global.appHolder;
    registerPage(appHolder);
    const page = appHolder.initPage('../pages/customerDetail/customerDetail');

    const last4Digits = page.getLast4Digits();
    mockWXAPI.verify();
    expect(last4Digits).to.equal('');

    done();
  });

  it('Get Last 4 Digits user phone is null', (done) => {
    const mockWXAPI = sinon.mock(wxapi);
    const userWithPhoneNull = _.clone(user);
    userWithPhoneNull.phone = null;

    // app.getUser()
    mockWXAPI.expects('getStorageSync')
      .once()
      .withExactArgs(
      sinon.match(value => value === 'user'))
      .returns(userWithPhoneNull);

    const appHolder = global.appHolder;
    registerPage(appHolder);
    const page = appHolder.initPage('../pages/customerDetail/customerDetail');

    const last4Digits = page.getLast4Digits();
    mockWXAPI.verify();
    expect(last4Digits).to.equal('');

    done();
  });
});

describe('Page/CustomerDetail/onLoad', () => {
  const options = {
    customerId,
  };

  it('onLoad Logged In', (done) => {
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
      const mockResOfFetchDetail = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          customer_detail: {
            phone: '150*****628',
            designerStatus: '未接单',
            cancelOrder: false,
            updateDate: '2017-03-06T16:48:40.000+08:00',
            createDate: '2017-03-06T14:40:23.000+08:00',
            income: 0.00,
            phoneEncrypt: '1db7fa4502159a10e3ee930f3e4bda03',
            city: '深圳',
            district: '龙岗区',
            houseType2: null,
            houseStructure: 'simon房型',
            memo: '店铺备注:12312--客服备注:3123123123123',
            customer_id: 1234,
            customer_name: '爱香',
            bind_with_consultant: false,
            virtual_phone_status: 0,
            house_address: '深圳龙岗区123',
            designer_real_name: '',
            assign_order_date: '2017-03-06 14:40',
            service_status: '待确定服务',
            building_name: '123',
            order_id: '316',
            decoration_type: 'simon全包',
            house_area: 12.00,
            budget_amount: '100.01',
            room_num: 0,
            hall_num: 0,
            bathroom_num: 0,
            kitchen_num: 1,
            balcony_num: 0,
            house_rooms: '1厨',
            house_type2: 'simon现房',
          },
        },
      };
      const mockResOfGetCustomerPhone = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          data: {
            status: 0,
            message: 'success',
            cancel: 0,
            open: 'N',
            has_template: false,
            customer_phone: 18912340001,
            virtual_phone_reach_limit: 0,
          },
        },
      };
      const mockResOfPickOrder = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
        },
      };

      const mockWXAPI = sinon.mock(wxapi);

      // app.checkLogin()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);

      // app.checkWxSession()
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

      // this.fetchDetail()
      mockWXAPI.expects('showNavigationBarLoading')
        .once();
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerDetail(customerId)))
        .returns(mockResOfFetchDetail);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);

      // this.getCustomerPhone()
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerPhone(customerId)))
        .returns(mockResOfGetCustomerPhone);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      // this.pickOrder()
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.pickOrder(customerId, user.user_name)))
        .returns(mockResOfPickOrder);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      // this.pickOrder() -> app.getUsername()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);

      // this.getLast4Digits()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        customerId,
      });

      yield page.onLoad(options);

      mockWXAPI.verify();
      expect(_.isEqual(page.data.customerDetail, mockResOfFetchDetail.data.customer_detail));
      expect(page.data.customerId).to.equal(mockResOfFetchDetail.data.customer_detail.customer_id);
      expect(page.data.orderId).to.equal(mockResOfFetchDetail.data.customer_detail.order_id);
      expect(page.data.designerStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.designerStatus);
      expect(page.data.serviceStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.service_status);

      expect(page.data.customerPhone).to.equal(mockResOfGetCustomerPhone.data.customer_phone);
      expect(page.data.fetchPhoneCompleted).to.equal(true);

      expect(page.data.last4DigitsOfDesignerPhone).to.equal('6666');

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('onLoad Not Logged In', (done) => {
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
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

      yield page.onLoad(options);
      mockWXAPI.verify();

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });

  it('onLoad Logged In But WX Session Expired', (done) => {
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
      const mockResOfFetchDetail = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          customer_detail: {
            phone: '150*****628',
            designerStatus: '未接单',
            cancelOrder: false,
            updateDate: '2017-03-06T16:48:40.000+08:00',
            createDate: '2017-03-06T14:40:23.000+08:00',
            income: 0.00,
            phoneEncrypt: '1db7fa4502159a10e3ee930f3e4bda03',
            city: '深圳',
            district: '龙岗区',
            houseType2: null,
            houseStructure: 'simon房型',
            memo: '店铺备注:12312--客服备注:3123123123123',
            customer_id: 1234,
            customer_name: '爱香',
            bind_with_consultant: false,
            virtual_phone_status: 0,
            house_address: '深圳龙岗区123',
            designer_real_name: '',
            assign_order_date: '2017-03-06 14:40',
            service_status: '待确定服务',
            building_name: '123',
            order_id: '316',
            decoration_type: 'simon全包',
            house_area: 12.00,
            budget_amount: '100.01',
            room_num: 0,
            hall_num: 0,
            bathroom_num: 0,
            kitchen_num: 1,
            balcony_num: 0,
            house_rooms: '1厨',
            house_type2: 'simon现房',
          },
        },
      };
      const mockResOfGetCustomerPhone = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          data: {
            status: 0,
            message: 'success',
            cancel: 0,
            open: 'N',
            has_template: false,
            customer_phone: 18912340001,
            virtual_phone_reach_limit: 0,
          },
        },
      };
      const mockResOfPickOrder = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
        },
      };

      const mockWXAPI = sinon.mock(wxapi);

      // app.checkLogin()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);

      // app.checkWxSession()
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

      // app.wxLogin()
      mockWXAPI.expects('login')
        .once()
        .returns(mockRes.loginResponse);
      mockWXAPI.expects('getUserInfo')
        .once()
        .returns(mockRes.wxUserInfoToGet);
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
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);
      mockWXAPI.expects('setStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'),
        sinon.match(value => value === mockRes.getOpenIdResponse.data));

      // this.fetchDetail()
      mockWXAPI.expects('showNavigationBarLoading')
        .once();
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerDetail(customerId)))
        .returns(mockResOfFetchDetail);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);

      // this.getCustomerPhone()
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerPhone(customerId)))
        .returns(mockResOfGetCustomerPhone);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      // this.pickOrder()
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.pickOrder(customerId, user.user_name)))
        .returns(mockResOfPickOrder);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      // this.pickOrder() -> app.getUsername()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);

      // this.getLast4Digits()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

      yield page.onLoad(options);
      mockWXAPI.verify();
      expect(_.isEqual(page.data.customerDetail, mockResOfFetchDetail.data.customer_detail));
      expect(page.data.customerId).to.equal(mockResOfFetchDetail.data.customer_detail.customer_id);
      expect(page.data.orderId).to.equal(mockResOfFetchDetail.data.customer_detail.order_id);
      expect(page.data.designerStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.designerStatus);
      expect(page.data.serviceStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.service_status);

      expect(page.data.customerPhone).to.equal(mockResOfGetCustomerPhone.data.customer_phone);
      expect(page.data.fetchPhoneCompleted).to.equal(true);

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});

describe('Page/CustomerDetail/onShow', () => {
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

      const mockResOfFetchDetail = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          customer_detail: {
            phone: '150*****628',
            designerStatus: '已接单',
            cancelOrder: false,
            updateDate: '2017-03-06T16:48:40.000+08:00',
            createDate: '2017-03-06T14:40:23.000+08:00',
            income: 0.00,
            phoneEncrypt: '1db7fa4502159a10e3ee930f3e4bda03',
            city: '深圳',
            district: '龙岗区',
            houseType2: null,
            houseStructure: 'simon房型',
            memo: '店铺备注:12312--客服备注:3123123123123',
            customer_id: 1234,
            customer_name: '爱香',
            bind_with_consultant: false,
            virtual_phone_status: 0,
            house_address: '深圳龙岗区123',
            designer_real_name: '',
            assign_order_date: '2017-03-06 14:40',
            service_status: '待确定服务',
            building_name: '123',
            order_id: '316',
            decoration_type: 'simon全包',
            house_area: 12.00,
            budget_amount: '100.01',
            room_num: 0,
            hall_num: 0,
            bathroom_num: 0,
            kitchen_num: 1,
            balcony_num: 0,
            house_rooms: '1厨',
            house_type2: 'simon现房',
          },
        },
      };

      const mockResOfGetCustomerPhone = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          data: {
            status: 0,
            message: 'success',
            cancel: 0,
            open: 'N',
            has_template: false,
            customer_phone: 18912340001,
            virtual_phone_reach_limit: 0,
          },
        },
      };

      const mockWXAPI = sinon.mock(wxapi);

      // app.checkLogin()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);

      // app.checkWxSession()
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

      // this.fetchDetail()
      mockWXAPI.expects('showNavigationBarLoading')
        .once();
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerDetail(customerId)))
        .returns(mockResOfFetchDetail);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);

      // this.getCustomerPhone()
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerPhone(customerId)))
        .returns(mockResOfGetCustomerPhone);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');
      page.setData({
        customerId,
      });

      yield page.onShow();
      mockWXAPI.verify();
      expect(_.isEqual(page.data.customerDetail, mockResOfFetchDetail.data.customer_detail));
      expect(page.data.customerId).to.equal(mockResOfFetchDetail.data.customer_detail.customer_id);
      expect(page.data.orderId).to.equal(mockResOfFetchDetail.data.customer_detail.order_id);
      expect(page.data.designerStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.designerStatus);
      expect(page.data.serviceStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.service_status);

      expect(page.data.customerPhone).to.equal(mockResOfGetCustomerPhone.data.customer_phone);
      expect(page.data.fetchPhoneCompleted).to.equal(true);

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
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

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

      const mockResOfFetchDetail = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          customer_detail: {
            phone: '150*****628',
            designerStatus: '已接单',
            cancelOrder: false,
            updateDate: '2017-03-06T16:48:40.000+08:00',
            createDate: '2017-03-06T14:40:23.000+08:00',
            income: 0.00,
            phoneEncrypt: '1db7fa4502159a10e3ee930f3e4bda03',
            city: '深圳',
            district: '龙岗区',
            houseType2: null,
            houseStructure: 'simon房型',
            memo: '店铺备注:12312--客服备注:3123123123123',
            customer_id: 1234,
            customer_name: '爱香',
            bind_with_consultant: false,
            virtual_phone_status: 0,
            house_address: '深圳龙岗区123',
            designer_real_name: '',
            assign_order_date: '2017-03-06 14:40',
            service_status: '待确定服务',
            building_name: '123',
            order_id: '316',
            decoration_type: 'simon全包',
            house_area: 12.00,
            budget_amount: '100.01',
            room_num: 0,
            hall_num: 0,
            bathroom_num: 0,
            kitchen_num: 1,
            balcony_num: 0,
            house_rooms: '1厨',
            house_type2: 'simon现房',
          },
        },
      };

      const mockResOfGetCustomerPhone = {
        statusCode: 200,
        data: {
          status: 1,
          message: 'success',
          data: {
            status: 0,
            message: 'success',
            cancel: 0,
            open: 'N',
            has_template: false,
            customer_phone: 18912340001,
            virtual_phone_reach_limit: 0,
          },
        },
      };

      const mockWXAPI = sinon.mock(wxapi);

      // app.checkLogin()
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);

      // app.checkWxSession()
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

      // app.wxLogin()
      mockWXAPI.expects('login')
        .once()
        .returns(mockRes.loginResponse);
      mockWXAPI.expects('getUserInfo')
        .once()
        .returns(mockRes.wxUserInfoToGet);
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
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);
      mockWXAPI.expects('setStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'),
        sinon.match(value => value === mockRes.getOpenIdResponse.data));

      // this.fetchDetail()
      mockWXAPI.expects('showNavigationBarLoading')
        .once();
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerDetail(customerId)))
        .returns(mockResOfFetchDetail);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(mockRes.user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(mockRes.openId);

      // this.getCustomerPhone()
      mockWXAPI.expects('request')
        .once()
        .withExactArgs(
        sinon.match(value => value.url === Api.getCustomerPhone(customerId)))
        .returns(mockResOfGetCustomerPhone);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'user'))
        .returns(user);
      mockWXAPI.expects('getStorageSync')
        .once()
        .withExactArgs(
        sinon.match(value => value === 'openId'))
        .returns(openId);

      const appHolder = global.appHolder;
      registerPage(appHolder);
      const page = appHolder.initPage('../pages/customerDetail/customerDetail');

      yield page.onShow();
      mockWXAPI.verify();
      expect(_.isEqual(page.data.customerDetail, mockResOfFetchDetail.data.customer_detail));
      expect(page.data.customerId).to.equal(mockResOfFetchDetail.data.customer_detail.customer_id);
      expect(page.data.orderId).to.equal(mockResOfFetchDetail.data.customer_detail.order_id);
      expect(page.data.designerStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.designerStatus);
      expect(page.data.serviceStatus).to
        .equal(mockResOfFetchDetail.data.customer_detail.service_status);

      expect(page.data.customerPhone).to.equal(mockResOfGetCustomerPhone.data.customer_phone);
      expect(page.data.fetchPhoneCompleted).to.equal(true);

      done();
    }).then(() => { }, (err) => {
      done(err);
    });
  });
});


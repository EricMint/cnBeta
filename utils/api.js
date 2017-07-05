const HOST_URI = 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://www.cnbeta.com/';
const HOST_URI_SWEETUI = 'https://api.sweetui.com/cnbeta/';
// const HOST_URI = 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://m.cnbeta.com/wap';
// const HOST_URI = 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://rss.cnbeta.com/';
// const HOST_URI = 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Frss.cnbeta.com%2F';

const NEWS_LIST = 'more?page=';

const ARTICLE_DETAIL = 'detail_new';

function getNewsList() {
  return `${HOST_URI}`;
}

function getNewsListFromSweetUI(pageIndex) {
  return `${HOST_URI_SWEETUI}${NEWS_LIST}${pageIndex}`;
}

function getArticleDetail(classify, id) {
  return `${HOST_URI_SWEETUI}${ARTICLE_DETAIL}?classify=${classify}&id=${id}`;
}

module.exports.getNewsList = getNewsList;
module.exports.getNewsListFromSweetUI = getNewsListFromSweetUI;
module.exports.getArticleDetail = getArticleDetail;


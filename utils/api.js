const HOST_URI = 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://www.cnbeta.com/';
const HOST_URI_SWEETUI = 'https://api.sweetui.com/cnbeta/more?page=';
// const HOST_URI = 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://m.cnbeta.com/wap';
// const HOST_URI = 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://rss.cnbeta.com/';
// const HOST_URI = 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Frss.cnbeta.com%2F';

const ARTICLE_DETAIL = 'articles/soft';

function getArticleDetail(id) {
  return `${HOST_URI}${ARTICLE_DETAIL}/${id}`;
}

function getNewsList() {
  return `${HOST_URI}`;
}

function getNewsListFromSweetUI(pageIndex) {
  return `${HOST_URI_SWEETUI}${pageIndex}`;
}

module.exports.getArticleDetail = getArticleDetail;
module.exports.getNewsList = getNewsList;
module.exports.getNewsListFromSweetUI = getNewsListFromSweetUI;


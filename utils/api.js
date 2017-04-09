const HOST_URI = 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://www.cnbeta.com/';

const ARTICLE_DETAIL = 'articles/soft';

function getArticleDetail(id) {
  return `${HOST_URI}${ARTICLE_DETAIL}/${id}`;
}

function getNewsList() {
  return `${HOST_URI}`;
}

module.exports.getArticleDetail = getArticleDetail;
module.exports.getNewsList = getNewsList;


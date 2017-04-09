var html = '<div id="items"><div class="item">1</div><div class="item">2</div></div>';

htmlToJson.parse(html, function () {
  return this.map('.item', function ($item) {
    return $item.text();
  });
}).done(function (items) {
  // Items should be: ['1','2'] 
}, function (err) {
  // Handle error 
});

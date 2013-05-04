var ncp = require('ncp').ncp;

hexo.on('server', function () {
  console.log(11111111);
  ncp('slides', 'public/slides', function () {

  });
});
(function () {
    var oUls = document.getElementsByTagName('ul');
    var container = document.getElementById('container');
    var winHeight = utils.win('clientHeight');
    // 获取到所有 container的图片
    var oImgs = container.getElementsByTagName('img');
    // 将ul集合 转化为 数组
    var oUlArr = utils.likeArray(oUls);
    var data;
    // 请求数据
    var xhr = new XMLHttpRequest;
    // 避免缓存数据 通过随机数 会每次都发送一个新的请求 问号后面查询字符串 有些时候后台会根据 问号后面查询字符串参数 做处理 判断
    xhr.open('get', 'data.txt?_=' + Math.random(), false);
    xhr.onreadystatechange = function () {
        // 200 201 202 都代表请求成功  通过正则匹配 只要是2开头的三位数 都是请求ok
        if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
            data = utils.toJson(this.responseText); // 将数据转化为JSON对象
            // 确保有数据 在进行绑定
            data && data.length ? bindData() : null;
        }
    };
    xhr.send(null);
    // 绑定数据 有多少个对象 就创建多少个li

    delayImgs();
    window.onscroll = function () {
        delayImgs();
        var wScrollHeight = utils.win('scrollHeight'); // 获取scrollHeight
        var sTop = utils.win('scrollTop');
        // 当滚动条快到底部时 继续绑定数据（项目中 再次发送ajax请求向后继续请求数据 一直到后台数据没有数据）
        if(winHeight + sTop >= wScrollHeight-1000){
            bindData();
        }
    };
    // 延迟加载图片
    function delayImgs() {
        winH = utils.win('clientHeight');
       for(var i = 0; i < oImgs.length; i++){
           checkImg(oImgs[i]); // 遍历每一个图片 检测是够符合加载标准
       }
    }
    // 检测图片
    var winH;
    function checkImg(img) {
        if(img.flag) return; // 防止重复加载
        var sTop = utils.win('scrollTop');
        var imgHeight = img.offsetHeight; // 自身高度
        var imgTop = utils.offset(img).top; // img上偏移
        if(winH+sTop >= imgHeight + imgTop){
              var imgSrc = img.getAttribute('data-real');
              // 检测资源有效性
              var Img = document.createElement('img');
              Img.src = imgSrc;
              Img.onload = function () {
                  console.log(132);
                  img.src = imgSrc;
                  Img = null;
                  fadeImg(img); // 每一次加载的时候 将图片传递进来 渐变
                  img.flag = true; // 已经加载过的标记为true
              }
        }
    }
    // 图片渐变
    function fadeImg(img) {
        var timer = setInterval(function () {
                 var op = utils.getCss(img, 'opacity');
                 if(op >= 1) {
                     clearInterval(timer);
                     return;
                 }
                  op += 0.1;
                  utils.setCss(img, 'opacity', op);
        },100);
    }
})();



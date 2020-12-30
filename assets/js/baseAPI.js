$(function () {
  $.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 统一头部信息
    if (options.url.indexOf('/my/') !== -1) {
      options.headers = {
        Authorization: localStorage.getItem('token')
      }
    }
    //每次调用接口时都挂载下面的回调函数
    options.complete = function (res) {
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        localStorage.removeItem('token')
        location.href = '/login.html'
      }
    }
  })
})
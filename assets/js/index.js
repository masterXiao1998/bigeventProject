$(function () {
    getUserInfo()
    //退出功能
    $('#btnLogout').on('click', function () {
        layer.confirm('是否退出', function (index) {
            //先清空token
            localStorage.removeItem('token')
            //然后跳转页面
            location.href = '/login.html'

            layer.close(index);
        });

    })
})

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        /*  headers: {
             Authorization: token
         }, */
        success: function (res) {
            if (res.status != 0) {

                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        },
        /* complete: function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        } */
    })
}
//定义渲染用户头像的名称
function renderAvatar(user) {
    
    var name = user.nickname || user.username 
    $('#welcome').text('欢迎' + name);
    if (user.user_pic !== null) {
  
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        
        $('.layui-nav-img').hide();
        $('.text-avatar').text(name[0].toUpperCase()).show()
    }
}
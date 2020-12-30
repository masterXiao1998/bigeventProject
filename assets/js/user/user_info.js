$(function() {
    //自定义昵称验证规则
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称在1~6位字符之间'
            }
        }
    })
    //初始化用户信息
    initUserInfo()
    //重置用户信息
    $('#resetbtn').on('click' ,function(e) {
        e.preventDefault()
        initUserInfo()
    })
    //提交表单修改信息
    $('#submitbtn').on('click', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('#fm1').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('更新信息成功')
                window.parent.getUserInfo()
            }
        })
    })
})
//定义初始化用户信息函数
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            layui.form.val('formtext', res.data)
        }
    })
}
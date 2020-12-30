$(function() {
    //切换到注册模块
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //切换到登录模块
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })
})

//自定义表单正则
var form = layui.form
//自定义弹窗正则
var layer = layui.layer
form.verify({
    pass: [
        /^[\S]{6,12}$/,
        '密码必须6到12位，且不能出现空格'
      ],
    repass:function(value) {
        var pwd = $('#pwd').val()
        if (value !== pwd) {
            return '两次密码不一致，请重新输入'
        }
    }
})
//注册模块提交
 $('#form-reg').on('submit', function(e) {
    e.preventDefault()
    var data = {username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()}
    $.post('/api/reguser',
        data,
        function(res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $('#link_login').click()
        }
     )
}) 
//登录模块提交
$('#form-login').on('submit', function(e){
    e.preventDefault();
    var data = $('#form-login').serialize()
    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: data,
        success: function(res) {
            if (res.status != 0) {
               return layer.msg(res.message)
            }
            layer.msg(res.message)
            //将token值存入本地存储
            localStorage.setItem('token', res.token)
            location.href = '/index.html'
        }
    })
})
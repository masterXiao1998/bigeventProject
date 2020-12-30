$(function() {
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samepwd: function(value) {
            if(value === $('[name=oldpwd]').val()) {
                return '新密码不能与旧密码相同'
            }
        },
        repwd: function(value) {
            if(value !== $('[name=newpwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    $('#modbtn').on('click', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('[name=oldpwd]').val(),
                newPwd: $('[name=newpwd]').val()
            },
            success: function(res) {
                console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                $('.layui-form')[0].reset()
            }
        })
    })
})
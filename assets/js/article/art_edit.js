$(function () {
    var id = localStorage.getItem('id')
    var state = '已发布'
    //调用获取文章分类的方法
    initCate()
    getArtInfo(id)
     // 2. 裁剪选项
     var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $('#image').cropper(options)
    //打开文件选择框
    $('#selcover').on('click', function () {
        $('#selfile').click()
    })
    //给文件选择框设置监听事件
    $('#selfile').on('change', function (e) {
        //拿到上传的文件的数组
        var files = e.target.files
        //判断数组是否为空，如果为空则return
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $('#image')
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options)
    })
    //为form表单添加提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($('#form-pub')[0])
        fd.append('Id', id)
        fd.append('state', state)
        $('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                editArtPub(fd)
            })
    })
    //点击存为草稿
    $('#btnsave').on('click', function() {
        state = '草稿'
    })
})
//定义编辑功能中获取文章数据的的函数
function getArtInfo(id) {
    $.ajax({
        method: 'GET',
        url: '/my/article/' + id,
        success: function (res) {
            var options = {
                aspectRatio: 400 / 280,
                preview: '.img-preview'
            }
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            $('[name=title]').val(res.data.title);

            var index = res.data.cate_id
            var optarr = $('[name=cate_id]')[0].children
            //默认选中文章类别
            for (var i = 0; i < optarr.length; i++) {
                if (optarr[i].value == index) {
                    optarr[i].selected = true
                    break;
                }
            }
            //给input赋值
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + index,
                success: function (res) {
                    if (res.status != 0) {
                        return layui.layer.msg('获取分类失败')
                    }
                    $('#cateart .layui-input').val(res.data.name)
                }
            })
            // 初始化富文本编辑器
            initEditor()
            $('[name=content]').val(res.data.content)
            //初始化裁剪区的图片
            $('#image')
                .cropper('destroy')
                .attr('src', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
                .cropper(options)
        }
    })
}
//获取文章分类的函数
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('初始化文章分类失败！')
            }
            // 调用模板引擎，渲染分类的下拉菜单
            var htmlStr = template('sel-list', res)
            $('[name=cate_id]').html(htmlStr)
            // 一定要记得调用 form.render() 方法
            layui.form.render()
        }
    })
}
//定义编辑中点击发布的函数
function editArtPub(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/edit',
        data: fd,
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg(res.message)
            }
            layui.layer.msg(res.message)
            location.href = '/article/art_list.html'
        }
    })
}
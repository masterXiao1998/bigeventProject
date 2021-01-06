$(function () {
    //调用获取文章分类的方法
    initCate()
    // 初始化富文本编辑器
    initEditor()

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
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
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
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options)
    })
    //设置state参数的初始值
    var state = '已发布'
    //监听form表单提交事件
    $('#form-pub').on('submit', function(e){
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', state)
        $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 400,
          height: 280
        }) 
        .toBlob(function(blob) {
          // 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          // 5. 将文件对象，存储到 fd 中
          fd.append('cover_img', blob)
          // 6. 发起 ajax 数据请求
          pubArticle(fd)
        }) 
    })
    $('#btnsave').on('click', function() {
        
        state = '草稿'
    })
    //定义发布文章的函数
    function pubArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'   
            }
        })
    }
})
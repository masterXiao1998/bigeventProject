$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //点击上传弹出图片上传功能
    $('#avatarbtn').on('click', function () {
        $('#file').click()
    })
    //更换裁剪区域的图片
    $('#file').on('change', function (e) {
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg('请选择图片')
        }
        //拿到上传的文件
        var file = e.target.files[0]
        //将文件设置转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    $('#btnupload').on('click', function() {
        var dataURL = $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
        .toDataURL('image/png')
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                window.parent.getUserInfo()
                
            }
        })
    })

})
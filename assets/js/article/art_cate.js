$(function() {
    initCateList()
    var indexAdd = null
    //弹窗添加分类
    $('#addcate').on('click', function() {
     indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            ,content: $('#dialog-add').html()
        });
    })
    //提交添加的分类
    $('body').on('click', '#btncate', function(e) {
        e.preventDefault()
        var data = $('.layui-form').serialize()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates', 
            data: data,
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                layer.close(indexAdd);
                initCateList()
            }
        })
    })
    var indexEdit = null
    //点击编辑按钮并弹窗
    $('body').on('click', '#btnEdit', function(e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            ,content: $('#dialog-edit').html()
        });
        let index = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + index,
            success: function(res) {
                if(res.status != 0) {
                    return layui.layer.msg('获取分类失败')
                }
                layui.form.val('form-edit', res.data)
            }
        })
    })
    //修改内容提交
    $('body').on('click', '#btnedit', function(e) {
        e.preventDefault()
        let data = $('#form-edit').serialize();
        $.ajax({
            method: 'POST',
            url:'/my/article/updatecate',
            data: data,
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                layer.close(indexEdit);
                initCateList()
            }
        })
    })
    //删除文章
    $('body').on('click', '#btnDel', function(e) {
        e.preventDefault()
        let id = $(this).siblings().attr('data-id')
        layui.layer.confirm('确认删除?', function(index){
            $.ajax({
                method: 'GET',
                url:'/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message) 
                    layer.close(index);
                    initCateList()
                }
            })
          })
          
    })

})
//定义获取文章类别的函数
function initCateList(){
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg(res.message)
            }
            var cateStr = template('cateList', res)
            $('tbody').html(cateStr)
        }
    })  
}
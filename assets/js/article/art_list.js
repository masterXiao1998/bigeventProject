$(function () {
            var q = {
                pagenum: 1,
                pagesize: 2,
                cate_id: '',
                state: ''
            }
            //定义美化时间的过滤器
            template.defaults.imports.dataFormat = function (date) {
                const dt = new Date(date)

                var y = dt.getFullYear()
                var m = padZero(dt.getMonth() + 1)
                var d = padZero(dt.getDate())

                var hh = padZero(dt.getHours())
                var mm = padZero(dt.getMinutes())
                var ss = padZero(dt.getSeconds())

                return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
            }
            // 定义补零的函数
            function padZero(n) {
                return n > 9 ? n : '0' + n
            }
            initTable(q)
            //初始化下拉选项
            initOpt()
            //筛选功能
            $('#selbtn').on('click', function (e) {
                e.preventDefault()
                q.cate_id = $('[name=cate_id]').val()
                q.state = $('[name=state]').val()
                initTable(q)
            })
            //删除功能
            $('body').on('click', '#delbtn', function () {
                    var id = $(this).attr('data-id')
                    var len = $('.delbtn').length
                    layer.confirm('确认删除?', function (index) { 
                        $.ajax({
                            method: 'GET',
                            url: '/my/article/delete/' + id,
                            success: function(res) {
                                if (res.status != 0) {
                                    return layui.layer.msg(res.message)
                                }
                                layui.layer.msg(res.message)
                                //判断页面删除按钮的个数，如果为1则表示删除完后这个页面就没数据了 页码需要减一
                                if (len === 1) {
                                    //判断等于1 是因为最小页码值是1
                                    q.pagenum = q.pagenum === 1? 1 : q.pagenum - 1
                                }
                                initTable(q)
                            }  
                        })
                        layer.close(index)
                    })

            })
            //编辑功能
            $('body').on('click', '#editbrn', function() {
                location.href = '/article/art_edit.html'
               var id = $(this).attr('data-id')
               localStorage.setItem('id', id)
               
            })
        })
        //定义获取文章列表的函数
        function initTable(q) {
            $.ajax({
                method: 'GET',
                url: '/my/article/list',
                data: q,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    // 使用模板引擎渲染页面的数据
                    var listStr = template('tpl-list', res)
                    $('tbody').html(listStr)
                    renderPage(res.total, q)
                }
            })
        }
        //定义渲染下拉选项的函数
        function initOpt() {
            $.ajax({
                method: 'GET',
                url: '/my/article/cates',
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    var optStr = template('tpl-opt', res)
                    $('[name=cate_id]').html(optStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                    layui.form.render()
                }
            })
        }

        function renderPage(total, q) {
            layui.laypage.render({
                elem: 'pageBox',
                count: total,
                limit: q.pagesize,
                curr: q.pagenum,
                limits: [2, 3, 5, 10],
                jump: function (obj, first) {
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    if (!first) {
                        initTable(q)
                    }
                },
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            })
        }
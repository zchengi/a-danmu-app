/**
 * Created by cheng on 2017/1/20.
 */

$(document).ready(function () {
    /*显示选择颜色*/
    $(".f_inputdiv img").toggle(
        function () {
            $(".f_inputdiv_color").css({display: "block"});
        }, function () {
            $(".f_inputdiv_color").css({display: "none"});
        });
    /*√√√√√√√√*/
    $(".f_inputdiv_color li").click(function () {
        var index = $(this).index();
        $(".f_inputdiv_color li div i").eq(index).css({"display": "block", "margin-left": 0});
        $(".f_inputdiv_color li").eq(index).siblings().children().children().css({"display": "none"});
        //这里选择class为f_inputdiv_color下li标签索引为index的元素的其他同胞元素的孩子元素的孩子元素(即i元素)，的CSS属性。
    });

    //在www.wildog.com 注册一个账号，创建一个应用，自动生成一个url
    var ref=new Wilddog("https://chengcoding.wilddogio.com/message");
    var arr=[];
    //把数据提交到云服务
    $(".f_btn1").click(function () {
        var text=$(".f_input_text").val();
        ref.child("message").push(text);
        $(".f_input_text").val("");
    });
    //响应键盘按键事件
    $(".f_input_text").keypress(function (event) {
        //alert(event.keyCode);
        if (event.keyCode=="13"){
            $(".f_btn1").trigger("click");//在选择的元素上发生某事件
        }
        /*
         * 这里的意思是当键盘到Enter的时候相当于btn按钮单机事件
         * enter的键位为13
         */
    });


    //响应清除事件
    $(".f_btn2").click(function () {
        ref.remove();
        arr=[];
        $(".dm_show").empty();//删除匹配元素中的所有子节点
    });

    //监听云端数据变更，云端数据变化，弹幕框里数据也跟着变化。
    ref.child("message").on("child_added", function(snapshot) {
        var text = snapshot.val();
        arr.push(text);
        var textObj = $("<div class=\"dm_message\"></div>");
        textObj.text(text);
        $(".dm_show").append(textObj);//向每个匹配的元素内部追加内容。
        moveObj(textObj);
    });

    ref.on("child_removed", function() {
        arr = [];
        $(".dm_show").empty();
    });

    //按照时间规律显示弹幕
    var topMin = $(".dm_mask").offset().top;//获取匹配元素在当前视口的上偏移(0)。
    var topMax = topMin + $(".dm_mask").height();//top最大偏移。
    var _top = topMin;

    //移动
    var moveObj = function(obj) {
        var _left = $(".dm_mask").width() - obj.width();
        _top = _top + 50;
        if (_top > (topMax - 50)) {
            _top = topMin;
        }
        obj.css({
            left: _left,
            top: _top,
            color: getRandomColor()
        });
        var time = 15000 + 10000 * Math.random();
        obj.animate({
            left: "-" + _left + "px"
        }, time, function() {
            obj.remove();
        });
    };
    //随机颜色
    var getRandomColor = function() {
        return "#"+ (function(h) {
                return new Array(7 - h.length).join("0") + h
            })((Math.random() * 0x1000000 << 0).toString(16));
    };

    var getAndRun = function() {
        if (arr.length > 0) {
            var n = Math.floor(Math.random() * arr.length + 1) - 1;
            var textObj = $("<div>" + arr[n] + "</div>");
            $(".dm_show").append(textObj);
            moveObj(textObj);
        }

        setTimeout(getAndRun, 3000);
    };

    jQuery.fx.interval = 1;//设置动画的显示帧速。
    getAndRun();



});
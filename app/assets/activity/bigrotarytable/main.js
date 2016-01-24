define([ 'jquery' , './_jQueryRotate'], function($){

    $(function() {
        var rotating = false;
        function lottery() {
            rotating = true;
            $.ajax({
                method: 'POST',
                url: '/activity/odds',
                dataType: 'json',
                cache: false
            }).done(function(json) {
                var angle = json.angle; //指针角度
                var prize = json.prize; //中奖奖项标题
                $(".outer").rotate({
                    angle: 0,
                    duration: 4000,
                    animateTo: angle + 3600,
                    easing: $.easing.easeOutSine,
                    callback: function () {
                        rotating = false;
                        alert(prize);
                    }
                });
            }).fail(function(){
                alert('Sorry，出错了！');
                return false;
            });
        }
        $(".inner").on("click", function() {
            !rotating && lottery();
        });

        $('.product-info').on('click', function(e) {

        });

        $('.lucky-desc').on('click', function(e) {

        });
    });
});
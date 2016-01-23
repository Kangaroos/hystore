var _ = require('lodash');

/*
 * 经典的概率算法，
 * proArr是一个预先设置的数组，
 * 假设数组为：array(100,200,300，400)，
 * 开始是从1,1000 这个概率范围内筛选第一个数是否在他的出现概率范围之内，
 * 如果不在，则将概率空间，也就是k的值减去刚刚的那个数字的概率空间，
 * 在本例当中就是减去100，也就是说第二个数是在1，900这个范围内筛选的。
 * 这样 筛选到最终，总会有一个数满足要求。
 * 就相当于去一个箱子里摸东西，
 * 第一个不是，第二个不是，第三个还不是，那最后一个一定是。
 * 这个算法简单，而且效率非常 高，
 * 关键是这个算法已在我们以前的项目中有应用，尤其是大数据量的项目中效率非常棒。
 */
function get_rand(proArr) {
    var result = '';
    //概率数组的总概率精度
    var proSum = 0;
    for(var i in proArr) {
        proSum += proArr[i];
    }

    //概率数组循环
    for(var k in proArr) {
        var randNum = _.random(1, proSum);
        if (randNum <= proArr[k]) {
            result = k;
            break;
        } else {
            proSum -= proArr[k];
        }
    }
    return result;
}

var lotteryOdds = {
    odds: function(award) {
        var arr = {};
        award.forEach(function(v) {
            arr[v.id] = v.v;
        });

        var rid = get_rand(arr); //根据概率获取奖项id
        var res = award[rid-1]; //中奖项
        var min = res['min'];
        var max = res['max'];

        var data = {};
        data['angle'] = _.random(min, max); //随机生成一个角度
        data['prize'] = res['prize'];
        data['id'] = res['id'];
        return data;
    }
};

exports = module.exports = lotteryOdds;

var formatter = {
	/***
	 *@params money {Number or String} 金额
	 *@params digit {Number} 小数点的位数，不够补0
	 *@returns {String} 格式化后的金额
	 **/
	money: function formatMoney(money, digit){
	    var tpMoney = '0.00';
	    if(undefined != money){
	        tpMoney = money;
	    }
	    tpMoney = new Number(tpMoney);

	    if(isNaN(tpMoney)){
	        return '0.00';
	    }
	    tpMoney = tpMoney.toFixed(digit) + '';
	    var re = /^(-?\d+)(\d{3})(\.?\d*)/;
	    while(re.test(tpMoney)){
	        tpMoney = tpMoney.replace(re, "$1,$2$3")
	    }
	    return tpMoney;
	}
}

exports = module.exports = formatter;

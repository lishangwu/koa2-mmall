class Const {
    static CURRENT_USER = 'currentUser'
    static EMAIL        = 'email'
    static USERNAME     = 'username'
    static Role         = {
        ROLE_CUSTOMER: 0,   //普通用户
        ROLE_ADMIN   : 1    //管理员
    }

    static PRICE_ASC_DESC(){
        let set = new Set()
        set.add('price_desc')
        set.add('price_asc')
        return set
    }

    static Cart = {
        CHECKED : 1,
        UN_CHECKED: 0,
        LIMIT_NUM_FAIL: 'LIMIT_NUM_FAIL',
        LIMIT_NUM_SUCCESS: 'LIMIT_NUM_SUCCESS'
    }

    static ProductStatusEnum = {
        ON_SALE: {
            code: 1,
            value: '在线'
        }
    }

    static OrderStatusEnum = {
        CANCELED : { code: 0, value: '已取消' },
        NO_PAY : { code: 10, value: '未支付' },
        PAID : { code: 20, value: '已付款' },
        SHIPPED : { code:40, value: '已发货' },
        ORDER_SUCCESS : { code: 50, value: '订单完成' },
        ORDER_CLOSE : { code: 60, value: '订单关闭' },

        codeOf : function (code) {
            if(code === 0) {return Const.OrderStatusEnum.CANCELED}
            if(code === 10) {return Const.OrderStatusEnum.NO_PAY}
            if(code === 20) {return Const.OrderStatusEnum.PAID}
            if(code === 40) {return Const.OrderStatusEnum.SHIPPED}
            if(code === 50) {return Const.OrderStatusEnum.ORDER_SUCCESS}
            if(code === 60) {return Const.OrderStatusEnum.ORDER_CLOSE}
        }
    }

    static ftp_server_http_prefix = ''

    static PaymentTypeEnum = {
        ONLINE_PAY : { code: 1, value:'在线支付' },
        codeOf : function (code) {
            if(code === 1){
                return Const.PaymentTypeEnum.ONLINE_PAY
            }
        }
    }

    static AlipayCallback = {
        TRADE_STATUS_WAIT_BUYER_PAY : "WAIT_BUYER_PAY",
        TRADE_STATUS_TRADE_SUCCESS : "TRADE_SUCCESS",

        RESPONSE_SUCCESS : "success",
        RESPONSE_FAILED : "failed"
    }

    static PayPlatformEnum = {
        ALIPAY : {code: 1, value: '支付宝'}
    }

    static Entity = {
        Cart      : 'mmall_cart',
        Category  : 'mmall_category',
        Order     : 'mmall_order',
        Order_item: 'mmall_order_item',
        Pay_info  : 'mmall_pay_info',
        Product   : 'mmall_product',
        Shipping  : 'mmall_shipping',
        User      : 'mmall_user',
    }
}

module.exports = {
    Const
}
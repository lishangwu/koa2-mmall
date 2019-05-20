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
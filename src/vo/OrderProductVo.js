export class OrderProductVo {

    get orderItemVoList(){
        return this._orderItemVoList
    }
    set orderItemVoList(val){
        this._orderItemVoList = val
    }

    get productTotalPrice(){
        return this._productTotalPrice
    }
    set productTotalPrice(val){
        this._productTotalPrice = val
    }

    get imageHost(){
        return this._imageHost
    }
    set imageHost(val){
        this._imageHost = val
    }
}
export class CartVo {

    get cartProductVoList(){
        return this._cartProductVoList
    }
    set cartProductVoList(val){
        this._cartProductVoList = val
    }

    get cartTotalPrice(){
        return this._cartTotalPrice
    }
    set cartTotalPrice(val){
        this._cartTotalPrice = val
    }

    get allChecked(){
        return this._allChecked
    }
    set allChecked(val){
        this._allChecked = val
    }

    get imageHost(){
        return this._imageHost
    }
    set imageHost(val){
        this._imageHost = val
    }
}
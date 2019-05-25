let obj = {}
obj.CartProductVo = `
    private Integer id;
    private Integer userId;
    private Integer productId;
    private Integer quantity;
    private String productName;
    private String productSubtitle;
    private String productMainImage;
    private BigDecimal productPrice;
    private Integer productStatus;
    private BigDecimal productTotalPrice;
    private Integer productStock;
    private Integer productChecked;
    private String limitQuantity;
`
obj.CartVo = `
private List<CartProductVo> cartProductVoList;
private BigDecimal cartTotalPrice;
private Boolean allChecked;
private String imageHost;
`

obj.OrderItemVo = `
private Long orderNo;

    private Integer productId;

    private String productName;
    private String productImage;

    private BigDecimal currentUnitPrice;

    private Integer quantity;

    private BigDecimal totalPrice;

    private String createTime;
`

obj.OrderProductVo = `
private List<OrderItemVo> orderItemVoList;
    private BigDecimal productTotalPrice;
    private String imageHost;
`

obj.OrderVo = `
private Long orderNo;

    private BigDecimal payment;

    private Integer paymentType;

    private String paymentTypeDesc;
    private Integer postage;

    private Integer status;


    private String statusDesc;

    private String paymentTime;

    private String sendTime;

    private String endTime;

    private String closeTime;

    private String createTime;

    //订单的明细
    private List<OrderItemVo> orderItemVoList;

    private String imageHost;
    private Integer shippingId;
    private String receiverName;

    private ShippingVo shippingVo;
`

obj.ProductDetailVo = `
private Integer  id;
    private Integer categoryId;
    private String name;
    private String subtitle;
    private String mainImage;
    private String subImages;
    private String detail;
    private BigDecimal price;
    private Integer stock;
    private Integer status;
    private String createTime;
    private String updateTime;


    private String imageHost;
    private Integer parentCategoryId;
`

obj.ProductListVo = `
private Integer id;
    private Integer categoryId;

    private String name;
    private String subtitle;
    private String mainImage;
    private BigDecimal price;

    private Integer status;

    private String imageHost;
`

obj.ShippingVo = `
private String receiverName;

    private String receiverPhone;

    private String receiverMobile;

    private String receiverProvince;

    private String receiverCity;

    private String receiverDistrict;

    private String receiverAddress;

    private String receiverZip;
`

const fs = require('fs')
const path = require('path')

function createVoFile(voName, vo) {
    let arr = vo.split(';')
    let fileContent = ''
    fileContent += `export class ${voName} {\n`
    arr.forEach(line => {
        let lineArr = line.split(' ')
        let attr = lineArr[lineArr.length - 1]
        if (attr !== '\n') {
            let gs = `
    get ${attr}(){
        return this._${attr}
    }
    set ${attr}(val){
        this._${attr} = val
    }
`
            fileContent += gs
        }
    })

    fileContent += `}`

    fs.writeFileSync( path.resolve(__dirname, '../vo', voName + '.js'), fileContent )

    return fileContent
}

// console.log( createVoFile('OrderItemVo', obj.OrderItemVo) );
for(let o in obj){
    createVoFile(o, obj[o])
}
createIndexFile()
function createIndexFile(){
    let str = ''
    for(let o in obj){
        // createVoFile(o, obj[o])
        let ef = `
export { ${o} } from './${o}'
        `
        str += ef
    }
    console.log(str.replace('\n', ''));
    fs.writeFileSync( path.resolve(__dirname, '../vo' + '/index.js'), str )
}
// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  QuoteferryApi
} from "../../apis/quoteferry.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id = 9;
    super.onLoad(options);

    var now = new Date();//this.Base.util.FormatDateTime(new Date());
    var weekdayofnow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    var startdate = this.Base.util.FormatDate(now);
    var enddate = this.Base.util.FormatDate(weekdayofnow);

    this.Base.setMyData({
      currenttab: 2, startdate: startdate, enddate: enddate, orderdate: startdate, ordertime: "",priceitem:[]
    });
  }
  onMyShow() {
    var that = this;
    var id = this.Base.getMyData().id;
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.info({
      id: this.Base.options.id
    }, (info) => {
      this.Base.setMyData(info);
      that.calcamount();

      quoteferryapi.priceitem({inst_id:info.inst_id},(priceitem)=>{
        var priceitemrange=[];
        for(var i=0;i<priceitem.length;i++){
          priceitemrange.push(priceitem[i].name);
        }
        that.Base.setMyData({ priceitemrange});
      });
    });
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.detail.current
    });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.currentTarget.id
    });
  }
  orderdateChange(e) {
    this.Base.setMyData({ orderdate: e.detail.value });
  }
  ordertimeChange(e) {
    this.Base.setMyData({ ordertime: e.detail.value });
  }
  changequote() {
    wx.navigateTo({
      url: '/pages/quoteferry/quoteferry?id=' + this.Base.options.id,
    })
  }
  copyquote() {
    wx.navigateTo({
      url: '/pages/quoteferry/quoteferry?action=copy&id=' + this.Base.options.id,
    })
  }
  abandonquote() {
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.abandon({
      id: this.Base.options.id
    }, (ret) => {
      if (ret.code == "0") {
        wx.showToast({
          title: '订单放弃成功',
          icon: 'none'
        })
        this.Base.setMyData({ status: 3 });
      } else {
        this.Base.info("放弃失败，请重试");
      }
    });
  }
  confirmOrder(e) {
    var data = this.Base.getMyData();
    if (data.orderdate == undefined) {
      this.Base.setMyData({ scrollfocus: "dateselect" });
      this.Base.info("请选择订单日期");
      return;
    }
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.confirm({
      orderdate: data.orderdate,
      ordertime: data.ordertime,
      id: this.Base.options.id
    }, (ret) => {
      if (ret.code == "0") {
        wx.redirectTo({
          url: '/pages/success/success?title=订单发起成功',
        })
      } else {
        this.Base.info(ret.return);
      }
    });
  }
  openOrder() {
    wx.showToast({
      title: '暂未开放订单跟踪功能',
      icon: 'none'
    })
  }
  addpriceitem(e){
    var that=this;
    var priceitemrange = this.Base.getMyData().priceitemrange;
    var priceitem = this.Base.getMyData().priceitem;
    var name=priceitemrange[e.detail.value];
    
    var json={
      quoteferry_id:this.Base.options.id,
      seq: priceitem.length+1,
      name:name,
      price:0,
      remark:"",
      status:"A"
    };
    
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.updatepriceitem(json,(ret)=>{
      if(ret.code==0){
        json.id=ret.return;
        priceitem.push(json);
        that.Base.setMyData({ priceitem});
      }
    },false);
  }
  nameChange(e){
    var seq=e.currentTarget.id;
    var val=e.detail.value;
    var priceitem = this.Base.getMyData().priceitem;
    var json=priceitem[seq];

    json.primary_id = json.id;
    json.name = val;

    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.updatepriceitem(json, (ret) => {
      
    }, false);
  }
  priceChange(e) {
    var that=this;
    var seq = e.currentTarget.id;
    var val = e.detail.value;
    var priceitem = this.Base.getMyData().priceitem;
    var json = priceitem[seq];

    json.primary_id = json.id;
    json.price = parseInt(val);

    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.updatepriceitem(json, (ret) => {

    }, false);
    priceitem[seq].price = parseInt(val);;
    that.Base.setMyData({ priceitem });
    that.calcamount();
  }
  remarkChange(e) {
    var seq = e.currentTarget.id;
    var val = e.detail.value;
    var priceitem = this.Base.getMyData().priceitem;
    var json = priceitem[seq];

    json.primary_id = json.id;
    json.remark = val;

    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.updatepriceitem(json, (ret) => {

    }, false);
  }
  removeitem(e){
    console.log(e);
    var that=this;
    var seq = e.currentTarget.id;
    var val = e.detail.value;
    var priceitem = this.Base.getMyData().priceitem;
    var json = priceitem[seq];
    console.log(json);

    json.primary_id = json.id;
    json.status = 'D';

    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.updatepriceitem(json, (ret) => {

    }, false);

    priceitem.splice(seq,1);

    that.Base.setMyData({ priceitem });
    that.calcamount();
  }
  calcamount(){
    var that=this;
    var priceitem = this.Base.getMyData().priceitem;
    var quoteamount=0;
    for(var i=0;i<priceitem.length;i++){
      quoteamount+=parseInt(priceitem[i].price);
    }
    that.Base.setMyData({ quoteamount });
  }
  quoteremarkChange(e){
    var val=e.detail.value;
    this.Base.setMyData({quoteremark:val});
  }
  submit(){
    var that=this;
    var priceitem = this.Base.getMyData().priceitem;
    if(priceitem.length==0){
      this.Base.info("请添加报价项目");
      return;
    }
    var quoteamount = parseInt(this.Base.getMyData().quoteamount);
    if (quoteamount<= 0) {
      this.Base.info("报价项目总计金额不能为0");
      return;
    }
    var quoteremark =this.Base.getMyData().quoteremark;
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.quote({ quoteremark: quoteremark,id:this.Base.options.id}, (ret) => {
        if(ret.code==0){
          that.Base.setMyData({status:"2"});
          wx.redirectTo({
            url: '/pages/success/success?title=报价成功',
          })
        }else{
          that.Base.info(ret.return);
        }
    }, false);
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab; 
body.changeTab = content.changeTab;
body.addpriceitem = content.addpriceitem;
body.nameChange = content.nameChange;
body.priceChange = content.priceChange;
body.remarkChange = content.remarkChange;
body.removeitem = content.removeitem; 
body.calcamount = content.calcamount;
body.quoteremarkChange = content.quoteremarkChange;
body.submit = content.submit;
Page(body)
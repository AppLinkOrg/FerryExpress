// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    var now=new Date();
    var tomorrow = now.getTime() + 24 * 60 * 60 * 1000;
    var aftermonth = tomorrow + 30*24 * 60 * 60 * 1000;
    var startdate = this.Base.util.FormatDate(new Date(tomorrow));
    var enddate = this.Base.util.FormatDate(new Date(aftermonth));
    this.Base.setMyData({ mobile: "", realname:"",remark:"", startdate: startdate, enddate: enddate });
  }
  onMyShow() {
    var that = this;

    var mobile = this.Base.getMyData().mobile;
    if (mobile == "") {

      var memberapi = new MemberApi();
      memberapi.info({}, (memberinfo) => {
        console.log(memberinfo);
        this.Base.setMyData({ mobile: memberinfo.mobile });
      });
    }

  }
  phonenoCallback(mobile,e){
    this.Base.setMyData({ mobile: mobile });
  }

  dataReturnCallback(callbackid, data) {
    console.log(callbackid);
    var that = this;
    if(callbackid=="route"){
      that.Base.setMyData(data);
    }
    if (callbackid == "goods") {
      that.Base.setMyData(data);
    }
  }
  openRoute(){
    var route=this.Base.getMyData().route;
    if(route!=undefined){
      wx.navigateTo({
        url: '/pages/route/route?callbackid=route&route='+JSON.stringify(route),
      })
    }else{

      wx.navigateTo({
        url: '/pages/route/route?callbackid=route',
      })
    }
  }
  openGoods(){
    var goods = this.Base.getMyData().goods;
    if (goods != undefined) {
      wx.navigateTo({
        url: '/pages/goodsselect/goodsselect?callbackid=route&goods=' + JSON.stringify(goods),
      })
    } else {

      wx.navigateTo({
        url: '/pages/goodsselect/goodsselect?callbackid=goods',
      })
    }
  }
  confirmQuote(){
    var data = this.Base.getMyData();
    if(data.route==undefined){
      this.Base.info("请选择路线");
      return;
    }
    if (data.goods == undefined) {
      this.Base.info("请选择货物");
      return;
    }
    if (data.mobile.length != 11 || data.mobile[0]!="1") {
      this.Base.info("请正确输入手机号码");
      return;
    }
    if (data.realname.length ==0) {
      this.Base.info("请输入真实姓名");
      return;
    }
  }
  remarkChange(e){
    this.Base.setMyData({remark:e.detail.value});
  }
  realnameChange(e) {
    this.Base.setMyData({ realname: e.detail.value });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.phonenoCallback = content.phonenoCallback;
body.dataReturnCallback = content.dataReturnCallback;
body.openRoute = content.openRoute;
body.openGoods = content.openGoods; 
body.confirmQuote = content.confirmQuote;
body.remarkChange = content.remarkChange;
body.realnameChange = content.realnameChange;
Page(body)
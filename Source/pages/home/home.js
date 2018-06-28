// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { QuoteferryApi } from "../../apis/quoteferry.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ currenttab: 0 });
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.indexbanner({}, (indexbanner) => {
      that.Base.setMyData({ indexbanner: indexbanner });
    });
    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });
    instapi.servicelist({}, (servicelist) => {
      that.Base.setMyData({ servicelist: servicelist });
    });
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.list({status:2},(ret)=>{
      this.Base.setMyData({list_2:ret});
    });
    quoteferryapi.list({ status: 1 }, (ret) => {
      this.Base.setMyData({ list_1: ret });
    });
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.detail.current });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
  gotoFerryQuote(){
    wx.navigateTo({
      url: '/pages/quoteferry/quoteferry',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.gotoSearch = content.gotoSearch;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.switchBrand = content.switchBrand; 
body.switchPrice = content.switchPrice; 
body.switchSize = content.switchSize;
body.gotoFerryQuote = content.gotoFerryQuote;

Page(body)
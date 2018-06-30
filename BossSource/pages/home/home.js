// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
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
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.instlist({}, (instlist)=>{
      this.Base.setMyData({ instlist: instlist});
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
  skyView(e){
    var seq=e.currentTarget.id;
    var instlist=this.Base.getMyData().instlist;
    instlist[seq].skt = instlist[seq].skt==true?false:true;
    this.Base.setMyData({instlist});
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.skyView = content.skyView;

Page(body)
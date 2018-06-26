// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({route:[null,null]});
  }
  onMyShow() {
    var that = this;
    that.Base.getAddress((addressinfo)=>{
      that.Base.setMyData({mylocation:addressinfo});
    });
  }
  selectAddress(e){
    var seq=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/addressselect/addressselect?callbackid='+seq,
    })
  }
  dataReturnCallback(callbackid, data){
    
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.selectAddress = content.selectAddress;
body.dataReturnCallback = content.dataReturnCallback;
Page(body)
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
    this.Base.setMyData({ mobile: "" });
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
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.phonenoCallback = content.phonenoCallback;
Page(body)
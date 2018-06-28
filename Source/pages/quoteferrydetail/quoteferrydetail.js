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
    options.id=4;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.info({ id:this.Base.options.id }, (info) => {
      this.Base.setMyData(info);
    });
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)
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
    instapi.aboutuslist({ inhome: "Y" }, (aboutuslist) => {
      that.Base.setMyData({ aboutuslist: aboutuslist });
    });
    instapi.newslist({ inhome: "Y" }, (newslist) => {
      that.Base.setMyData({ newslist: newslist });
    });
    instapi.servicelist({}, (servicelist) => {
      that.Base.setMyData({ servicelist: servicelist });
    });
    instapi.productlist({ inhome: "Y" }, (productlist) => {
      that.Base.setMyData({ productlist: productlist });
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
Page(body)
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
    this.Base.setMyData({ currenttab:0});
  }
  onMyShow() {
    var that = this;
    this.loaddata();
    
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.detail.current });
    this.loaddata();
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.currentTarget.id });
    this.loaddata();
  }
  loaddata() {
    var that = this;
    var currenttab = this.Base.getMyData().currenttab;
    switch(currenttab){
      case 0: this.updateTab0();break;
      case 1: this.updateTab1(); break;
      case 2: this.updateTab2(); break;
    }
  }
  updateTab0(){

    var that = this;
    var instapi = new InstApi();
    instapi.indexbanner({ ptype: 1 }, (indexbanner) => {
      that.Base.setMyData({ indexbannerhot: indexbanner });
    });
  }
  updateTab1() {

  }
  updateTab2() {
    var that = this;
    var instapi = new InstApi();
    instapi.info({}, (inst) => {
      that.Base.setMyData({ inst: inst });
    });
    instapi.aboutuslist({}, (aboutuslist) => {
      that.Base.setMyData({ aboutuslist: aboutuslist });
    });
    instapi.indexbanner({ptype:2}, (indexbanner) => {
      that.Base.setMyData({ indexbanner: indexbanner });
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loaddata = content.loaddata;
body.updateTab0 = content.updateTab0;
body.updateTab1 = content.updateTab1;
body.updateTab2 = content.updateTab2;
Page(body)
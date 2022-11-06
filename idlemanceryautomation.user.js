// ==UserScript==
// @name         Idlemancery Automation
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Automates Idlemancery
// @author       https://github.com/kalobkalob/idlemancery
// @downloadURL  https://github.com/kalobkalob/idlemancery/raw/main/idlemanceryautomation.user.js
// @updateURL    https://github.com/kalobkalob/idlemancery/raw/main/idlemanceryautomation.user.js
// @match        https://strangemattergaming.itch.io/idlemancery
// @match        https://v6p9d9t4.ssl.hwcdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itch.io
// @grant        none
// @run-at       document-idle
// ==/UserScript==
/* Current Features
   * Will Automatically convert banners to the next tier according to a guide provided in Strange's discord channel.
*/
/* TODO
Tabs
  Action
  Shop
  Learning
    * Cost of increasing is shown in xp. Automatically balance energy to a certain percent to learning.
  Creatures
    * Add switch for what to focus on investing in.
    * Add toggle for auto-buying creatures.
  Banners
    * Auto select temperament.
    * Auto Prestige
      * Set order to invest.
      * Priority invest amount.
        * Invest in smallest amount.
        * Invest in green upto 500 at start.
        * Set some order to invest then increment that color by that amount before switching.
    * Turn tab green if over 51 creatures detected.
    * Total banner count.
  Research
  Battle
  Automator
    * Settings for this script.
*/
class Page {
    constructor(){
        console.clear();
        console.log("<><><><><><><>Start<><><><><><><>");
        this.init();
        this.updateFun={bannerUpdate:()=>this.data.banners.update()};
        this.btnAutoClick={};
        setInterval(()=>{
            Object.keys(this.updateFun).forEach(k=>this.updateFun[k]());
            Object.keys(this.btnAutoClick).forEach(k=>this.btnAutoClick[k].click());
        },1000);
    }
    init(){
        this.data = {
            actions: new Actions(),
            shop: new Shop(),
            learning: new Learning(),
            creatures: new Creatures(),
            banners: new Banners()
        }
    }
}
class Banners {
    constructor(){
        this.bannerContainer = document.getElementsByClassName("banners-container");
        //this.banners = this.bannerContainer.children;
    }
    getBannerData(){
        if(this.bannerContainer.length>0){
            console.log("<><><><><>ParseBanners<><><><><><>");
            let banners = this.bannerContainer[0].children;
            this.banners=[];
            for(let i=1,len=banners.length;i<len;i++){
                this.banners.push({banner: banners[i],
                                   getTierLevels(){
                                       let levels=[[50,[45,1]],[100,[80,4]],[200,[150,10]],[500,[330, 34]],[1000,[540,72,4]],[2000,[965,152,11]],[5000,[2160,373,39]],
                                                   [10000,[3885,673,85,5]],[20000,[6985,1243,182,18]],[50000,[15705,2914,459,51,3]],[100000,[28255,5084,908,139,10]],
                                                   [200000,[50850,10255,1790,285,28]],[500000,[127105,22704,4140,657,88,6]],[1000000,[228785,42358,7832,1374, 202, 21]]];
                                       var out;
                                       var total = this.getTotalTiers();
                                       for(let j=0,len=levels.length;j<len;j++){
                                           out = levels[j][1];
                                           if(levels[j][0]>total) break;
                                       }
                                       return out;
                                   },
                                   getTotalTiers(){
                                       let total = this.tiers[0].amount;
                                       for(let i=1,len=this.tiers.length;i<len;i++){
                                           total+=this.tiers[i].amount*(5*i)
                                       }
                                       return total;
                                   },
                                   tiers: [...banners[i].lastElementChild.children].map((m,j)=>{
                                       let out = {box:m, amount:parseFloat(m.querySelector('.amount').innerText),
                                                  tierNum:j, bannerRow:i-1,
                                                  get buttons(){return this.box.querySelectorAll('.main-action')},
                                                  click(){
                                                      let btn = [...this.buttons].pop();
                                                      if(!btn.disabled)btn.click();
                                                  }};
                                       return out;
                                   }),
                                   convertToUpper(){
                                       console.log("Converting");
                                       for(let i=1,len=this.getTierLevels().length;i<len;i++){
                                           if(this.tiers[i-1].amount>this.getTierLevels()[i-1]&&this.tiers[i].amount<this.getTierLevels()[i])this.tiers[i].click();
                                       }
                                   }
                                  });
                //out.total = [...out.amount].map((a,i)=>a*Math.pow(5,i+1))
            }
            //console.log(this.banners[0].getTotalTiers(),this.banners[0].getTierLevels(0));
            //console.log("banner result");
            //console.log(this.banners[0].tiers[2]);
            //this.banners[0].tiers[0].click();
            //this.banners[0].tiers[2].click();
            this.banners.forEach(b=>b.convertToUpper());
            //console.log();
        } else {
            console.log("<><><><><>GetBanners<><><><><><>");
            this.bannerContainer = document.getElementsByClassName("banners-container");
            console.log(this.bannerContainer);
        }
    }
    update(){
        this.getBannerData();
        //console.log(this);
    }
}
class Actions {
    constructor(){
        /*let actionButtons = document.getElementsByClassName('actions')[0].children;
        for(let i=0,len=actionButtons.length;i<len;i++){
            let action = actionButtons[i].querySelector('.main-action').innerText.split(' ');
            action.pop();
            action = action.join(' ');
            let resourceText = actionButtons[i].querySelector('.custom-gain');
            resourceText = (resourceText)?resourceText.innerText:this.parseResourceItem(actionButtons[i].children[1].lastElementChild);
            this[action] = {
                description:actionButtons[i].children[0].innerText,
                produces:resourceText
            };
            //this[actionButtons[i].querySelector('.main-action')]={
            //    description:actionButtons[i].children[0].innerText,
            //    produces:actionButtons[i].children[1].lastElementChild
            //}
            //console.log(actionButtons[i]);
        }
        console.log(this);*/
    }
    parseResourceItem(item){
        return item;
    }
    nameButton(element){
        //console.log(elem
    }
}
class Shop {
    constructor(){
        //this.updateFun = {};
    }
    update(){
        //Object.keys(this.updateFun).forEach(k=>this.updateFun[k]());
    }
}
class Learning {
    constructor(){
    }
}
class Creatures {
    constructor(){
    }
}
var page;
window.setTimeout(()=> {page = new Page()}, 2000);
//var observer;
/*(function() {
    if(window.location.href=='https://strangemattergaming.itch.io/idlemancery'){
        let placeholder = document.getElementsByClassName("iframe_placeholder");
        console.log(placeholder);
        if(placeholder.length>0){
            let iframeSrc = placeholder[0].dataset.iframe.split(' ').filter(s=>s.indexOf('src')!=-1);
            if(iframeSrc.length>0){
                iframeSrc = iframeSrc[0].split('\"')[1];
                window.open(iframeSrc);
                //window.location.href = iframeSrc[0];
            }
        }
    } else {
        window.setTimeout(()=> {page = new Page()}, 2000);
        window.setTimeout(()=> {page = new Page()}, 2000);
        /*observer = new MutationObserver(()=>{
            page = new Page();
            observer.disconnect();
        });
        observer.observe(document.getElementById('app'), {childList: true, attributes: true, subtree: true});*/
//    }
//})();
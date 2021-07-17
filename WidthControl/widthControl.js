"use strict";function _classCallCheck(o,t){if(!(o instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(o,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(o,n.key,n)}}function _createClass(o,t,i){return t&&_defineProperties(o.prototype,t),i&&_defineProperties(o,i),o}var WidthControl=function(){function WidthControl(o,t){_classCallCheck(this,WidthControl),this.container=o,this.options=t,this.blocks={},this.findsBlocks_In_Container(),this.countsPositionBlocks_Window(),this.complementsOptions_Blocks()}return _createClass(WidthControl,[{key:"complementsOptions_Blocks",value:function complementsOptions_Blocks(){var i=this;Object.keys(this.options).forEach(function(o){for(var t in i.options[o])i.blocks[o][t]=i.options[o][t]})}},{key:"addEventScrollForWindow",value:function addEventScrollForWindow(){var t=this;window.addEventListener("scroll",function(){var o={top:window.pageYOffset,bottom:window.pageYOffset+document.documentElement.clientHeight};t.checks_If_BlcokVisible(o)})}},{key:"checks_If_BlcokVisible",value:function checks_If_BlcokVisible(o){if(o.top-this.blocks[1].block.clientHeight<=this.blocks[1].position.top&&this.blocks[1].position.top<o.bottom){if(this.blocks[1].isVisible)return;this.blocks[1].isVisible=!0}else this.blocks[1].isVisible&&(this.blocks[1].isVisible=!1)}},{key:"findsBlocks_In_Container",value:function findsBlocks_In_Container(){var n=this,o=this.container.children;Array.prototype.forEach.call(o,function(o){for(var t,i=0;i<o.classList.length;i++)o.classList[i].includes("width-control-block")&&(t=(t=o.classList[i].split("-"))[t.length-1],n.blocks[t]={block:o},n.blocks[t].isVisible=!1)})}},{key:"countsPositionBlocks_Window",value:function countsPositionBlocks_Window(){var i=this;Object.keys(this.blocks).forEach(function(o){var t={top:Math.round(window.pageYOffset+i.blocks[o].block.getBoundingClientRect().top),bottom:Math.round(window.pageXOffset+i.blocks[o].block.getBoundingClientRect().bottom)};i.blocks[o].position=t})}},{key:"changeBlock",value:function changeBlock(){}},{key:"run",value:function run(){this.addEventScrollForWindow()}}]),WidthControl}();
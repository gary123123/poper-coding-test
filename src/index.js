var ImageLazyLoad = require("./img-lazy/image-lazy-load.js");
var AutoComplete = require("./auto-complete/auto-complete.js");
var searchSourceData = require("./auto-complete/search-source-data.js");
var dataList = require("./data.js");
window.onload = function () {
  // japan0 america1 china2 有数据
  var filterData = [];
  var pageNo = 2;
  var pageSize = 10;
  var totalPage = 1;
  var imgLoad = new ImageLazyLoad({
    offset: 0,
    throttle: 100,
  });
  var setContentList = function () {
    var containerDom = document.querySelector(".content-list");
    var contentHtml = "";
    var resultData = filterData.slice(
      (pageNo - 1) * pageSize,
      pageNo * pageSize
    );
    for (let index = 0; index < resultData.length; index++) {
      var item = resultData[index];
      contentHtml +=
        '<div class="content-item"><div class="content-text"><div class="content-title">' +
        item.title +
        '</div><img class="content-img" data-lazyLoad="' +
        item.img +
        '" src=""/><div class="content-desc">' +
        item.content +
        "</div></div></div>";
    }
    containerDom.innerHTML = contentHtml;
    window.scrollTo(0, 0);
    imgLoad.render();
  };
  var handleShowPagination = function () {
    if (pageNo === 1) {
      document.querySelector(".prev-page").style.display = "none";
    } else {
      document.querySelector(".prev-page").style.display = "block";
    }
    if (pageNo === totalPage) {
      document.querySelector(".next-page").style.display = "none";
    } else {
      document.querySelector(".next-page").style.display = "block";
    }
  };
  document.querySelector(".next-page").addEventListener("click", function () {
    if (pageNo < totalPage) {
      pageNo++;
    }
    handleShowPagination();
    setContentList();
  });
  document.querySelector(".prev-page").addEventListener("click", function () {
    if (pageNo !== 1) {
      pageNo--;
    }
    handleShowPagination();
    setContentList();
  });
  new AutoComplete({
    selector: ".search-container",
    source: searchSourceData,
    onSearch: function (val) {
      filterData = [];
      if (val.length === 0) {
        pageNo = 1;
        totalPage = 1;
        setContentList();
        handleShowPagination();
        return;
      }
      var valObj = {};
      for (var index = 0; index < val.length; index++) {
        var item = val[index];
        valObj[item.value] = item.text;
      }
      for (let index = 0; index < dataList.length; index++) {
        var item = dataList[index];
        if (valObj[item.country.value] !== undefined) {
          filterData.push(item);
        }
      }

      pageNo = 1;
      totalPage = Math.ceil(filterData.length / pageSize) || 1;
      setContentList();
      handleShowPagination();
    },
  });
};

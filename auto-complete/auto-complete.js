function AutoComplete(options) {
  this.init(options);
}
AutoComplete.prototype = {
  init: function (options) {
    this.selectedValue = {};
    this.options = {
      selector: "",
      source: [],
      pageSize: 10,
      onSearch: function () {},
    };
    for (var k in options) {
      if (options.hasOwnProperty(k)) this.options[k] = options[k];
    }
    this.containerDom = document.querySelector(this.options.selector);
    this.containerDom.classList.add("auto-complete-tag");
    this.inputContainerClass = this.options.selector + " .input-container";
    this.selectedSourceIndex = -1; // 下拉选中状态
    this.initInputDom();
  },
  initInputDom: function () {
    var inputContainer = document.createElement("div");
    inputContainer.className = "input-container";
    var inputDom = document.createElement("input");
    inputDom.setAttribute("autoComplete", false);
    inputDom.setAttribute("type", "text");
    inputDom.className = "input-container-input";
    inputDom.oninput = this.handleInputValueChange();
    inputDom.onkeydown = this.handleInputKeyDown();
    inputDom.onblur = this.handleInputBlur();
    inputContainer.appendChild(inputDom);
    this.containerDom.appendChild(inputContainer);
  },
  initSourceListDom: function (dataList) {
    this.removeSourceListDom();
    if (dataList.length === 0) {
      return;
    }
    var sourceListDom = document.createElement("ul");
    var liFragment = document.createDocumentFragment();
    sourceListDom.className = "source-list";
    for (var index = 0; index < dataList.length; index++) {
      var liDom = document.createElement("li");
      liDom.setAttribute("data-value", dataList[index].value);
      liDom.innerHTML = dataList[index].text;
      liFragment.appendChild(liDom);
      liDom.onclick = this.handleAddSelectValue(dataList[index]);
    }
    sourceListDom.appendChild(liFragment);
    document.querySelector(this.inputContainerClass).appendChild(sourceListDom);
  },
  removeSourceListDom: function () {
    this.querySelector(" .source-list") &&
      document
        .querySelector(this.inputContainerClass)
        .removeChild(this.querySelector(" .source-list"));
  },
  handleAddSelectValue: function (val) {
    var _this = this;
    return function () {
      if (_this.selectedValue[val.value] !== undefined) {
        return;
      }
      _this.addTag(val);
      _this.removeSourceListDom();
      document.querySelector(
        _this.inputContainerClass + " .input-container-input"
      ).value = "";
      _this.handleSearch();
    };
  },
  handleRemoveSelectValue: function (val) {
    var _this = this;
    return function () {
      delete _this.selectedValue[val.value];
      _this.removeTag(val);
    };
  },
  addTag: function (val) {
    var tagItem = document.createElement("div");
    tagItem.className = "selected-tag";
    tagItem.setAttribute("data-value", val.value);
    tagItem.innerHTML = val.text;
    var closeItem = document.createElement("span");
    closeItem.innerHTML = "x";
    closeItem.className = "close-icon";
    closeItem.onclick = this.handleRemoveSelectValue(val);
    tagItem.appendChild(closeItem);
    this.containerDom.insertBefore(
      tagItem,
      document.querySelector(this.inputContainerClass)
    );
    this.selectedValue[val.value] = val.text;
  },
  removeTag: function (val) {
    this.containerDom.removeChild(
      document.querySelector('.selected-tag[data-value="' + val.value + '"]')
    );
  },
  handleInputValueChange: function () {
    var _this = this;
    return function () {
      var textValue = this.value.trim();
      if (textValue === "") {
        _this.initSourceListDom([]);
        return;
      }
      var resultList = [];
      for (var index = 0; index < _this.options.source.length; index++) {
        var item = _this.options.source[index];
        if (resultList.length > _this.options.pageSize) {
          break;
        }
        if (
          item.text.indexOf(textValue) > -1 &&
          _this.selectedValue[item.value] === undefined
        ) {
          resultList.push(item);
        }
      }
      _this.initSourceListDom(resultList);
    };
  },
  handleInputKeyDown: function () {
    var _this = this;
    return function (event) {
      var sourceListDom = _this.querySelector(" .source-list");
      var inputDom = document.querySelector(
        _this.inputContainerClass + " .input-container-input"
      );
      var sourceListLength = sourceListDom ? sourceListDom.children.length : 0;
      if (event.keyCode == 40 && sourceListLength) {
        _this.selectedSourceIndex++;
        if (_this.selectedSourceIndex > sourceListLength - 1) {
          _this.selectedSourceIndex = 0;
        }
        inputDom.value =
          sourceListDom.childNodes[_this.selectedSourceIndex].innerText;
        _this.sourceListItemClassChange();
      } else if (event.keyCode == 38 && sourceListLength) {
        _this.selectedSourceIndex--;
        if (_this.selectedSourceIndex <= -1) {
          _this.selectedSourceIndex = sourceListLength - 1;
        }
        inputDom.value =
          sourceListDom.childNodes[_this.selectedSourceIndex].innerText;
        _this.sourceListItemClassChange();
      } else if (event.keyCode == 13) {
        var selectedSourceItem = _this.querySelector(
          " .source-list li[selected='true']"
        );
        if (selectedSourceItem) {
          _this.addTag({
            value: selectedSourceItem.getAttribute("data-value"),
            text: selectedSourceItem.innerText,
          });
        }
        inputDom.value = "";
        _this.removeSourceListDom();
        _this.handleSearch();
      } else {
        _this.selectedSourceIndex = -1;
      }
      if (event.keyCode === 8) {
        if (inputDom.value === "") {
          var tagsList = document.querySelectorAll(
            _this.options.selector + " .selected-tag"
          );
          if (tagsList.length > 0) {
            var lastTag = tagsList[tagsList.length - 1];
            _this.handleRemoveSelectValue({
              value: lastTag.getAttribute("data-value"),
              text: lastTag.innerText,
            })();
          }
        }
      }
    };
  },
  handleInputBlur: function () {
    var _this = this;
    return function () {
      var that = this;
      setTimeout(function () {
        _this.selectedSourceIndex = -1;
        that.value = "";
        _this.removeSourceListDom();
      }, 200);
    };
  },
  sourceListItemClassChange: function () {
    var sourceListDom = this.querySelector(" .source-list");
    var length = sourceListDom ? sourceListDom.children.length : 0;
    for (var j = 0; j < length; j++) {
      var item = sourceListDom.childNodes[j];
      if (j != this.selectedSourceIndex) {
        item.style.backgroundColor = "";
        item.removeAttribute("selected");
      } else {
        item.style.backgroundColor = "#ccc";
        item.setAttribute("selected", true);
      }
    }
  },
  handleSearch: function () {
    if (this.options.onSearch) {
      var list = [];
      for (var key in this.selectedValue) {
        list.push({
          value: key,
          text: this.selectedValue[key],
        });
      }
      this.options.onSearch(list);
    }
  },
  querySelector: function (selector) {
    return document.querySelector(this.options.selector + selector);
  },
};

var searchSourceData = [];
var contryList = ["japan", "america", "china"];
for (var index1 = 0; index1 < contryList.length; index1++) {
  var item1 = contryList[index1];
  for (var index2 = 0; index2 < 100; index2++) {
    searchSourceData.push({
      value: item1 + index2,
      text: item1 + index2,
    });
  }
}
module.exports = searchSourceData;

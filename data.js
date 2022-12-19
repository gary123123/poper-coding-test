var dataList = [];

var contryList = ["japan", "america", "china"];
for (var index1 = 0; index1 < contryList.length; index1++) {
  var item1 = contryList[index1];
  for (var index2 = 0; index2 < 100; index2++) {
    dataList.push({
      title: "标题" + item1 + index1,
      img: "./img/tab1.png",
      country: {
        value: item1 + index1,
        text: item1 + index1,
      },
      content:
        "第" +
        index2 +
        "个数据，由于React的设计思想极其独特，属于革命性创新，性能出众，代码逻辑却非常简单。所以，越来越多的人开始关注和使用，认为它可能是将来Web开发的主流工具。这个项目本身也越滚越大，从最早的UI引擎变成了一整套前后端通吃的Web App解决方案。衍生的React Native 项目，目标更是宏伟，希望用写Web App的方式去写Native App。如果能够实现，整个互联网行业都会被颠覆，因为同一组人只需要写一次UI ，就能同时运行在服务器、浏览器和手机。",
    });
  }
}

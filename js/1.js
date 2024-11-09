//ajax同步获取json文件数据
var jsonData = {}; //获取的json文件数据
var jsonlistData = [];
var url = "./data/link_list.json"; //json文件路径
$.ajax({
	type: "get",
	url: url,
	dataType: "json", 
	async: false,
	success: function (response) {
		jsonData = response;
		jsonData.sideBar.content.find(item => item.value == "Website").content.forEach(item => {
			item.content.forEach(inner => {
					jsonlistData.push(inner);
			})
		})
	}
});



//配置变量
var sideBarIconFlag = -1; //侧边栏按钮标记

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
var commonData = []; //常用网址数据
var changeWebsiteUrl = "";
//获取本地数据
const bg = getStorage("bg");
const commonUseData = getStorage("commonUseData");
const showCommonUse = getStorage("showCommonUse");
//获取的DOM元素/全局静态DOM元素
const body = document.querySelector("body"); //文档整体
const sideBarButton = document.querySelector("#sideBarButton");
const sideBar = document.querySelector("#sideBar"); //侧边栏
const sideBarTitle = document.querySelector("#sideBarTitle") //侧边栏图标区域
const sideBarContent = document.querySelector("#sideBarContent"); //侧边栏内容
const scrollContent = document.querySelector("#scrollContent"); //侧边栏滚动内容
const commonUse = document.querySelector("#commonUse");
const copyright = document.querySelector("#copyright"); //版权说明
const loading = document.querySelector("#loading"); //加载动画元素
const messageList = document.querySelector("#messageList"); //弹窗列表
//设置本地存储
function setStorage(name, value) {
	window.localStorage.setItem(name, value);
}
// 获取本地存储内容
function getStorage(key) {
	let value = window.localStorage.getItem(key);
	return value;
}
//删除本地存储函数
function removeStorage(key) {
	let value = window.localStorage.removeItem(key);
	return value
}
/* 加载本地存储区域/自动加载区域 */
if (bg && bg !== null && bg !== "setBingImage" && bg !== "moren" && bg !== "suiji") {
	globalImage(bg);
	// WoolGlass(bg);
}

if (bg == "setBingImage") {
	setBingImage(true);
}
if (bg == "moren") {
	setmrImage(true);
}
if (bg == "suiji") {
	globalImage("https://www.dmoe.cc/random.php");
}


//默认设置开启显示常用网址功能
if (showCommonUse == "undefined" || showCommonUse == undefined) {
	setStorage("showCommonUse", "website_open");
}
if (commonUseData == undefined) {
	setStorage("commonUseData", "[]");
	setCommomUse(commonData);
}
if (commonUseData && commonUseData !== null) {
	commonData = JSON.parse(commonUseData);
	setCommomUse(commonData);
}
// 动态创建侧边栏图标
for (let item in jsonData.sideBar.content) {
	
		sideBarTitle.innerHTML +=
			`
            <div id="${jsonData.sideBar.content[item].value}" class="title-icon">
                <svg class="icon"><use xlink:href="#${jsonData.sideBar.content[item].icon}"></use></svg>
                <span>${jsonData.sideBar.content[item].name}</span>
            </div>`

}
//网页文档加载完毕调用动画
/*document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		toggle(loading, 40);
	}
}*/
/* 加载本地存储区域/自动加载区域结束 */
//图标
function iconf(name) {
	return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-'+name+'"></use></svg>';
}

/* 事件监听/事件委托相关 */
//监听点击事件
document.addEventListener("click", function (e) {
	//判断侧边栏
	if (e.target !== sideBarTitle.children && e.target !== sideBarContent && sideBarIconFlag !== -1 && document.querySelector(
			"#dialog") == null) {
		sideBar.className = "moveRight";
		sideBarButton.className = "sideBarButtonMoveRight";
		sideBarButton.innerHTML = iconf("category");
		sideBarIconFlag = -1;
	}
	//监听模态框关闭图标
	if (e.target.id == "closeDialog") {
		closeDialog();
	}
	//模态框提交
	if (e.target.id == "submitDialog") {
		let name = document.querySelector("#nameDialog").children[1].value;
		let url = document.querySelector("#urlDialog").children[1].value;
		if (name == "") {
			openMessage({
				title: "注意",
				type: "error",
				content: `别忘了填写 <b>名称</b> 哦，它不能为空`
			});
			return;
		}
		if (url == "") {
			openMessage({
				title: "注意",
				type: "error",
				content: `别忘了填写 <b>网址</b> 哦，它不能为空`
			});
			return;
		}
		if (url.toLowerCase().slice(0, 8) !== "https://" && url.toLowerCase().slice(0, 7) !== "http://") {
			url = `https://${url}`;
		}
		commonWebsite({
			thisWebsite: {
				name: name,
				url: url,
				color: getRandomColor()
			},
			commonData: commonData,
			add: true
		})
		closeDialog();
	}
	//模态框取消
	if (e.target.id == "cancelDialog") {
		closeDialog();
	}
	//模态框修改
	if (e.target.id == "changeDialog") {
		let id = document.querySelector("#dialog").className;
		let name = document.querySelector("#nameDialog").children[1].value;
		commonWebsite({
			thisWebsite: {
				id: id,
				name: name
			},
			commonData: commonData,
			change: true
		})
		closeDialog();
	}
	//模态框删除
	if (e.target.id == "deleteDialog") {
		let id = document.querySelector("#dialog").className;
		commonWebsite({
			thisWebsite: {
				id: id
			},
			commonData: commonData,
			del: true
		})
		closeDialog();
	}
	//侧边栏保存自定义网址
	if (e.target.id == "saveDialog") {
		let classify = document.querySelector("#dialog").className;
		let name = document.querySelector("#nameDialog").children[1].value;
		let url = document.querySelector("#urlDialog").children[1].value;
		if (name == "") {
			openMessage({
				title: "注意",
				type: "error",
				content: `别忘了填写 <b>名称</b> 哦，它不能为空`
			});
			return;
		}
		if (url == "") {
			openMessage({
				title: "注意",
				type: "error",
				content: `别忘了填写 <b>网址</b> 哦，它不能为空`
			});
			return;
		}
		if (url.toLowerCase().slice(0, 8) !== "https://" && url.toLowerCase().slice(0, 7) !== "http://") {
			url = `https://${url}`;
		}
		let websiteData = JSON.parse(getStorage("sideBarWebsiteData"));
		let thisClassify = websiteData.find(item => {
			if (classify.indexOf(item.value) !== -1) {
				return item;
			}
		});
		let thisWebsite = thisClassify.content.find(item => item.name == name);
		if (thisWebsite == undefined) {
			thisClassify.content.push({
				name: name,
				url: url,
				color: getRandomColor()
			})
			websiteData.forEach(item => {
				if (item.value == thisClassify.value) {
					item = thisClassify;
				}
			})
			setStorage("sideBarWebsiteData", JSON.stringify(websiteData));
			closeDialog();
			openMessage({
				title: "恭喜",
				type: "success",
				content: `添加成功！！！`
			})
			scrollContent.innerHTML = createWebsite();
		} else {
			openMessage({
				title: "注意",
				type: "error",
				content: `请勿添加重复内容！！！`
			})
		}
	}
	//模态框点击背景隐藏
	if (e.target.id == "dialogWrapper") {
		closeDialog();
	}
	//删除网址数据
	if (e.target.className == "deleteData") {
		let key = e.target.getAttribute("data");
		let source = JSON.parse(getStorage(e.target.getAttribute("source")));
		let category = e.target.getAttribute("category");
		let tBody = document.querySelector(".show-data-table").children[1];
		let inHtml = "";
		if (e.target.getAttribute("source") == "commonUseData") {
			source.splice(key, 1);
			source.forEach((item, index) => {
				inHtml +=
					`
	                <tr>
	                    <td>${index+1}</td>
	                    <td><a href="${item.url}" target="_blank" style="color:${item.color};">${item.name}</a></td>
	                    <td>${item.count}次</td>
	                    <td><span class="deleteData" data="${index}" source="commonUseData">删除</span></td>
	                </tr>`;
			})
			setCommomUse(source);
		} else if (e.target.getAttribute("source") == "sideBarWebsiteData") {
			source.forEach(item => {
				if (item.value == category) {
					item.content.splice(key, 1);
				}
			})
			source.forEach(item => {
				if (item.content.length > 0) {
					item.content.forEach((inner, index) => {
						inHtml +=
							`
	                        <tr>
								<td>${index+1}</td>
								<td><a href="${inner.url}" target="_blank" style="color:${inner.color};">${inner.name}</a></td>
								<td>${item.name}</td>
								<td><span class="deleteData" data="${index}" category="${item.name}" source="sideBarWebsiteData">删除</span></td>
							</tr>`;
					})
				}
			})
		}
		setStorage(e.target.getAttribute("source"), JSON.stringify(source));
		tBody.innerHTML = inHtml;
		openMessage({
			title: "提示",
			type: "success",
			content: `删除数据成功！！！`
		})
	}
});
// 监听侧边栏开启，关闭按钮
sideBarButton.addEventListener("click", () => {
	let icon = sideBarTitle.querySelectorAll(".title-icon");
	Array.prototype.forEach.call(icon, item => {
		item.style.background = "";
		item.style.color = item.style.borderColor;
	})
	if (sideBarIconFlag == -1) {
		sideBarButton.className = "sideBarButtonMoveLeft";
		sideBarButton.innerHTML = iconf("categorys");
		sideBar.className = "moveLeft";
		icon[0].style.background = icon[0].style.borderColor;
		icon[0].style.color = "#fff";
		sideBarIconFlag = "Website";
		renderSideBarContent("Website");
	} else {
		sideBarButton.className = "sideBarButtonMoveRight";
		sideBarButton.innerHTML = iconf("category");
		sideBar.className = "moveRight";
		sideBarIconFlag = -1;
	}
})
// 监听侧边栏选项卡
sideBarTitle.addEventListener("click", (e) => {
	stopPropagation();
	let icon = sideBarTitle.querySelectorAll(".title-icon");
	if (e.target.className == "title-icon") {
		Array.prototype.forEach.call(icon, item => {
			item.style.background = "";
			item.style.color = item.style.borderColor;
		})
		e.target.style.background = e.target.style.borderColor;
		e.target.style.color = "#fff";
		renderSideBarContent(e.target.id);
		sideBarIconFlag = e.target.id;
	} else {
		sideBarButton.className = "sideBarButtonMoveRight";
		sideBarButton.innerHTML = iconf("category");
		sideBar.className = "moveRight";
		sideBarIconFlag = -1;
	}
})
// 监听侧边栏内操作
sideBarContent.addEventListener("click", (e) => {
	stopPropagation();
	// 自动记录常用网址
	let thisWebsite = {};
	let websiteData = jsonData.sideBar.content.find(item => item.value == "Website").content;
	for (let item of websiteData) {
		thisWebsite = item.content.find(inner => inner.name == e.target.id);
		if (thisWebsite !== undefined) {
			thisWebsite.count = 1;
			commonWebsite({
				thisWebsite: thisWebsite,
				commonData: JSON.parse(getStorage("commonUseData"))
			});
			return;
		}
	}
	for (let item of JSON.parse(getStorage("sideBarWebsiteData"))) {
		thisWebsite = item.content.find(inner => inner.name == e.target.id);
		if (thisWebsite !== undefined && thisWebsite !== {}) {
			thisWebsite.count = 1;
			commonWebsite({
				thisWebsite: thisWebsite,
				commonData: JSON.parse(getStorage("commonUseData"))
			});
			return;
		}
	}
	// 监听设置操作
	switch (true) {
		// 选择必应壁纸
		case e.target.id == "setBingImage":
			$('#globalImage').remove();
			setBingImage(false);
			break;
		//默认壁纸
		case e.target.id == "moren":
			$('#globalImage').remove();
			setmrImage(false);
			break;
		case e.target.id == "suiji":
			$('#globalImage').remove();
			setStorage("bg", "suiji");
			setStorageBefore(globalImage("https://www.dmoe.cc/random.php"));
			break;
		case e.target.id == "bgnull":
			$('#globalImage').remove();
			setStorageBefore(removeStorage('bg'));
			break;
			// 开启关闭常用网址功能
		case (e.target.id.indexOf("website") !== -1):
			commonWebsite({
				commonData: commonData,
				status: e.target.id
			});
			break;
			// 添加网址
		case (e.target.id.indexOf("AddCapsule") !== -1):
			openDialog({
				id: e.target.id,
				title: "添加自定义网址",
				content: [{
					name: "名称",
					value: "name",
					type: "input",
					defaultValue: ""
				}, {
					name: "URL",
					value: "url",
					type: "input",
					defaultValue: ""
				}],
				button: [{
					name: "添加",
					value: "save"
				}, {
					name: "取消",
					value: "cancel"
				}]
			})
			break;
		case e.target.id == "commonUseData":
			let cData = JSON.parse(getStorage("commonUseData"));
			let cinHtml = "";
			cData.forEach((item, index) => {
				cinHtml +=
					`
					<tr>
						<td>${index+1}</td>
						<td><a href="${item.url}" target="_blank" style="color:${item.color};">${item.name}</a></td>
						<td>${item.count}次</td>
						<td><span class="deleteData" data="${index}" source="commonUseData">删除</span></td>
					</tr>`;
			})
			if (cinHtml == "") {
				cinHtml =
					`
					<tr class="no-data">
						<td colspan="5"><i class="fa fa-window-close"></i> 暂无数据</td>
					</tr>`
			}
			openDialog({
				html: true,
				id: e.target.id,
				title: "常用标签",
				content: `
                        <div class="show-data">
                            <table class="show-data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>名称</th>
                                        <th>使用频率</th>
										<th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>${cinHtml}</tbody>
                            </table>
                        </div>`,
				button: [{
					name: "关闭",
					value: "cancel"
				}]
			})
			break;
		case e.target.id == "sidebarData":
			let sData = JSON.parse(getStorage("sideBarWebsiteData"));
			let sinHtml = "";
			sData.forEach(item => {
				if (item.content.length > 0) {
					item.content.forEach((inner, index) => {
						sinHtml +=
							`
							<tr>
								<td>${index+1}</td>
								<td><a href="${inner.url}" target="_blank" style="color:${inner.color};">${inner.name}</a></td>
								<td>${item.name}</td>
								<td><span class="deleteData" data="${index}" category="${item.value}" source="sideBarWebsiteData">删除</span></td>
							</tr>`;
					})
				}
			})
			if (sinHtml == "") {
				sinHtml =
					`
					<tr class="no-data">
						<td colspan="5"><i class="fa fa-window-close"></i> 暂无数据</td>
					</tr>`
			}
			openDialog({
				html: true,
				id: e.target.id,
				title: "常用网址",
				content: `
                        <div class="show-data">
                            <table class="show-data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>名称</th>
                                        <th>类别</th>
										<th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>${sinHtml}</tbody>
                            </table>
                        </div>`,
				button: [{
					name: "关闭",
					value: "cancel"
				}]
			})
			break;
	}
});
// 监听文件上传change事件设置背景图片
scrollContent.addEventListener("change", function (e) {
	let setBackGround = document.querySelector("#setBackGround");
	if (e.target == setBackGround) {
		setCustomizeImage(setBackGround);
	}
})
// 阻止消息提示事件冒泡
messageList.addEventListener("click", (e) => {
	stopPropagation();
})
// 监听常用网址中相关操作
commonUse.addEventListener("click", (e) => {
	// 添加网址
	if (e.target.className == "commons-addbtn") {
		openDialog({
			title: "添加网址",
			content: [{
				name: "名称",
				value: "name",
				type: "input",
				defaultValue: ""
			}, {
				name: "URL",
				value: "url",
				type: "input",
				defaultValue: ""
			}],
			button: [{
				name: "添加",
				value: "submit"
			}, {
				name: "取消",
				value: "cancel"
			}]
		})
	}
	// 编辑网址
	if (e.target.className == "commons-btn") {
		changeWebsiteUrl = e.target.parentNode.querySelector("a");
		openDialog({
			id: changeWebsiteUrl.id,
			title: "编辑网址",
			content: [{
				name: "名称",
				value: "name",
				type: "input",
				defaultValue: changeWebsiteUrl.innerHTML
			}],
			button: [{
				name: "修改",
				value: "change"
			}, {
				name: "删除",
				value: "delete"
			}, {
				name: "取消",
				value: "cancel"
			}]
		})
	}
})
/* 事件监听/事件委托相关结束 */

/* 设置相关开始 */
//判断渲染设置项
function createHtml(inner) {
	let sideBarHtml = "";
	if (!inner.type) {
		sideBarHtml =
			`
            <div id="${inner.value}" class="setlist">
                <span><img src="${inner.icon}">  ${inner.name}</span>
                <span>${inner.content}</span>
            </div>`;
	}
	if (inner.type == "changebg" && inner.value == "changebg") {
		sideBarHtml =
			`
            <div id="${inner.value}" class="capsule">
                <div style="color:${inner.color}">
                    <span>更换背景</span>
                    <a href="javascript:;" class="changebg"><input id="setBackGround" type="file"></a>
                </div>
            </div>`;
	}
	if (inner.type == "changebg" && inner.value !== "changebg") {
		sideBarHtml = renderSetting(inner.value, inner.color, inner.name);
	}
	if (inner.type == "changeCommonUse") {
		sideBarHtml = renderSetting(inner.value, inner.color, inner.name);
	}
	if (inner.type == "dataManagement") {
		sideBarHtml = renderSetting(inner.value, inner.color, inner.name);
	}
	return sideBarHtml;
}

//创建设置项数据
function createSetting() {
	let settingInfo = "",
		sideBarHtml = "";
	let settingData = jsonData.sideBar.content.find(item => item.value == "Setting").content;
	settingData.forEach(item => {
			settingInfo += `<p><svg class="icon"><use xlink:href="#${item.icon}"></use></svg>  ${item.name}</p>`;
			if (item.content !== "" && typeof item.content !== "string" && item.value !== "about") {
				item.content.forEach(inner => {
						if (typeof inner.content === "string" && inner.content !== "") {
							//content不为空且为字符串时
							sideBarHtml += createHtml(inner);
						} else {
							//content为空时的内容
							sideBarHtml += createHtml(inner);
						}
				})
			} else if (item.value == "about") {
				sideBarHtml += renderAbout(item);
			}
			if (item.value == "about") {
				settingInfo = settingInfo +
					`
                <div class="about-box">
                    ${sideBarHtml}
                </div>`;
			} else {
				settingInfo = settingInfo +
					`
                <div class="capsule-content">
                    ${sideBarHtml}
                </div>`;

			}
			sideBarHtml = "";
	})
	return settingInfo;
}

//可复用渲染项函数
function renderSetting(id, color, name) {
	return `
        <div id="${id}" class="capsule">
            <div style="color:${color};">
                <span>${name}</span>
            </div>
        </div>`;
}
//设置关于渲染
function renderAbout(data) {
	let sideBarHtml = "";
	data.content.forEach(item => {
			if (typeof item.content == "string") {
				sideBarHtml +=
					`
                    <div class="aboutInfo">
                        <span><img src="${item.icon}">  ${item.name}</span>
                        <span><a href='${item.href}' target="_blank">${item.content}</a></span>
                    </div>`;
			} else {
				item.content.forEach(inner => {
					sideBarHtml +=
						`
                        <div class="aboutInfo">
                            <span><img src="${inner.icon}">  ${inner.name}</span>
                            <span><a href='${inner.href}' target="_blank">${inner.content}</a></span>
                        </div>`;
				})
			}

		
	})
	return `<div class="aboutContent" style="border:1px solid ${data.color};">${sideBarHtml}</div>`;
}
//依据选中id渲染侧边栏内容函数
function renderSideBarContent(id) {
	switch (id) {
		case "Gaming":
			scrollContent.innerHTML = "加班加点摸鱼中，敬请期待";
			break;
		case "Website":
			scrollContent.innerHTML = createWebsite();
			break;
		case "Setting":
			scrollContent.innerHTML = createSetting();
			break;
	}
	sideBar.className = "moveLeft";
	stopPropagation();
}
function setmrImage(status) {
	if (getStorage("bg") == "moren" && !status) {
		openMessage({
			title: "提示",
			type: "error",
			content: "请勿重复选择！"
		})
		return;
	}
	let bgurl = templates+'/image/bg.png';
	if (status) {
		globalImage(bgurl);
	} else {
		setStorageBefore(bgurl);
	}
	setStorage("bg", "moren");
	
}
//设置必应壁纸为背景
function setBingImage(status) {
	if (getStorage("bg") == "setBingImage" && !status) {
		openMessage({
			title: "提示",
			type: "error",
			content: "请勿重复选择！"
		})
		return;
	}
	let [clientWidth, clientHeight] = [document.body.clientWidth, document.body.clientHeight];
	let [w, h] = ["", ""];
	if (clientWidth > clientHeight) {
		w = 1920;
		h = 1080;
	} else if (clientWidth < clientHeight) {
		w = 768;
		h = 1280;
	} else {
		w = 1920;
		h = 1200;
	}
	let bingApi = `https://bing.ioliu.cn/v1/?d=0&w=${w}&h=${h}&callback=window.bing.bg`;
	window.bing = {
		bg: function (data) {
			let func = () => {
				globalImage(data.data.url);
			}
			if (status) {
				globalImage(data.data.url);
			} else {
				setStorageBefore(func);
			}
		}
	}
	let script = document.createElement("script");
	script.src = bingApi;
	document.querySelector("head").appendChild(script);
	document.querySelector("head").removeChild(script);
	setStorage("bg", "setBingImage");
}
//自定义上传图片
function setCustomizeImage(setBackGround) {
	let file = setBackGround.files[0];
	let reader = new FileReader();
	reader.onload = function (e) {
		let data = e.target.result; // 'data:image/jpeg;base64,/9j/4AAQSk...(base64编码)...'
		let func = () => {
			globalImage(data);
		}
		// 将文件大小转化成MB
		let size = (file.size / (1024 * 1024)).toFixed(2);
		if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
			openMessage({
				title: "提示",
				type: "error",
				content: `不是有效的图片文件!`
			})
			setBackGround.value = "";
			return;
		}
		if (file.size > 3145728) {
			openMessage({
				title: "提示",
				type: "error",
				content: `当前文件大小为${size}MB，建议不超过3MB！`
			})
			setBackGround.value = "";
			return;
		}
		setStorageBefore(func, "bg", data);
	};
	// 以DataURL的形式读取文件:
	reader.readAsDataURL(file);
}
//全局图片作为背景
function globalImage(url) {
	let style = document.createElement("style");
	style.setAttribute("id", "globalImage");
	style.innerHTML =
		`
        body,#content::before {
            background:url('${url}') no-repeat center/cover;
            position: fixed;
        }

		`;
	document.querySelector("head").appendChild(style);
}
//阻止事件冒泡
function stopPropagation(e) {
	var ev = e || window.event;
	if (ev.stopPropagation) {
		ev.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true; //兼容IE，根本用不到，本来就没打算兼容IE
	}
}
//寻找选中设置项href值函数
function findSettingInfo(value) {
	let href = "";
	let settingData = jsonData.sideBar.content.find(item => item.value == "Setting").content;
	for (let item of settingData) {
		if (item.content !== "" && typeof item.content !== "string") {
			for (let inner of item.content) {
				if (inner.value == value) {
					href = inner.href;
					break;
				}
			}
		}
	}
	return href;
}
//返回随机颜色函数
function getRandomColor() {
	return '#' + Math.random().toString(16).slice(2, 8)
}
//删除标签函数，参数需要删除的标签名
function removeElement(element) {
	let ele = document.querySelector(element);
	if (ele !== null) {
		ele.parentNode.removeChild(ele);
	}
}

/* 动画效果开始 */
//加载动画
/*function toggle(elemt, speed) {
	speed = speed || 16.6; //默认速度为16.6ms
	elemt.style.display = "block"
	if (elemt.style.opacity == 1 || elemt.style.opacity != null) {
		let num = 20;
		let timer = setInterval(function () {
			num--;
			elemt.style.opacity = num / 20;
			if (num <= 0) {
				clearInterval(timer);
				elemt.style.display = "none"
			}
		}, speed);
	}
}*/
//执行本地存储前动画效果
function setStorageBefore(set, name, href) {
	let num = 0;
	let speed = 60;

	function opacity() {
		loading.style.opacity = num / 20;
	}
	loading.style.display = "block"
	let timer = setInterval(function () {
		num++;
		opacity();
		if (num >= 20) {
			let timer2 = setInterval(function () {
				num--;
				opacity();
				if (num <= 0) {
					clearInterval(timer2);
					loading.style.display = "none";
				}
			}, speed);
			clearInterval(timer);
			setTimeout(set, speed);
			if (name && href) {
				setStorage(name, href);
			}
		}
	}, speed);
}
/* 动画效果结束 */

/* 对话框弹窗开始 */
//开启模态框函数
function openDialog(data) {
	let [title, content, btns] = ["", "", "", ""];
	if (data == undefined || data.title == undefined) {
		title = "提示";
	} else {
		title = data.title;
	}
	if (!data.html) {
		data.content.forEach(item => {
			if (item.type == "input") {
				content +=
					`
                    <div id="${item.value}Dialog">
                        <span class="content-label">${item.name}</span>
                        <input placeholder="请输入${item.name}" value="${item.defaultValue}" />
                    </div>`;
			} else if (item.type == "text") {
				content +=
					`
                    <div>
                        <span class="content-label">${item.name}</span>
                        <p>${item.value}</p>
                    </div>`;
			}
		})
	} else {
		content = data.content;
	}
	data.button.forEach(item => {
		btns +=
			`
            <span>
                <button id="${item.value}Dialog">${item.name}</button>
            </span>`
	})
	let dialog =
		`
        <div id="dialog" class="${data.id}">
            <div class="dialog-header">${title}<span id="closeDialog"><svg class="icon" ><use xlink:href="#icon-closeDialog"></use></svg></span></div> 
            <div class="dialog-body">${content}</div>
            <div class="dialog-footer">${btns}</div>
        </div>`;
	let dialogWrapper = document.createElement("div");
	dialogWrapper.setAttribute("id", "dialogWrapper");
	dialogWrapper.innerHTML = dialog;
	body.appendChild(dialogWrapper);
}
//关闭模态框函数
function closeDialog() {
	let dialog = document.querySelector("#dialogWrapper");
	dialog.remove();
}
/* 对话框弹窗结束 */

/* 消息弹窗开始 */
//弹窗开启事件
function openMessage(value) {
	let iconType = ""
	switch (value.type) {
		case "success":
			iconType = "success";
			break;
		case "error":
			iconType = "error";
		default:
			break;
	}
	//动态添加多个消息需要单独创建
	let li = document.createElement("li");
	let icon = document.createElement("div");
	let iconi = document.createElement("i");
	let div = document.createElement("div");
	let title = document.createElement("p");
	let content = document.createElement("p");
	let close = document.createElement("i");
	li.setAttribute("class", "messageMoveLeft");
	li.appendChild(icon);
	icon.setAttribute("class", value.type);
	icon.appendChild(iconi);
	iconi.classList.add(iconType);
	li.appendChild(div);
	div.appendChild(title);
	title.innerHTML = value.title;
	div.appendChild(content);
	content.innerHTML = value.content;
	li.appendChild(close);
	close.classList.add("close");
	close.addEventListener("click", () => {
		closeMessage(li);
	})
	messageList.appendChild(li);
	if (!value.timing || value.timing !== null) {
		setTimeout(() => {
			closeMessage(li)
		}, 3000)
	}
}
//弹窗关闭事件
function closeMessage(elemt) {
	elemt.className = "messageMoveRight";
	if (!elemt) {
		stopPropagation();
	}
	if (elemt.parentNode) {
		setTimeout(() => {
			elemt.parentNode.removeChild(elemt)
		}, 500)
	}
}
/* 消息弹窗结束 */
/* 自定义网址开始 */
//创建书签数据
function createWebsite() {
	let websiteInfo = "",
		sideBarHtml = "";
	let websiteData = jsonData.sideBar.content.find(item => item.value == "Website").content;
	let customizeData = [];
	if (getStorage("sideBarWebsiteData") == undefined) {
		websiteData.forEach(item => {
			customizeData.push({
				name: item.name,
				value: item.value,
				content: []
			})
		})
		setStorage("sideBarWebsiteData", JSON.stringify(customizeData));
	}
	
	websiteData.forEach(item => {
			//右侧网址
			websiteInfo += `<p><svg class="icon"><use xlink:href="#${item.icon}"></use></svg>  ${item.name}</p>`;
			item.content.forEach(inner => {

					sideBarHtml += renderCapsule(inner);
					//jsonlistData.push(inner);
			})
			JSON.parse(getStorage("sideBarWebsiteData")).forEach(outer => {
				if (outer.value == item.value) {
					outer.content.forEach(insite => {
						sideBarHtml += renderCapsule(insite);
					})
				}
			})
			sideBarHtml +=
				`
                <a id='${item.value}AddCapsule' class="capsule">
                    <div style="color:${item.color};">
                        <span><svg class="icon"><use xlink:href="#icon-addWebsite"></use></svg></span>
                    </div>
                </a>`;
			websiteInfo = websiteInfo +
				`
            <div class="capsule-content">
                ${sideBarHtml}
            </div>`;
			sideBarHtml = "";
		
	})
	return websiteInfo;
}
//添加常用书签
function commonWebsite(json) {
	let id = "",
		name = "",
		url = "",
		color = "";
	let flag = true;
	if (json.thisWebsite !== undefined) {
		id = json.thisWebsite.id;
		name = json.thisWebsite.name;
		url = json.thisWebsite.url;
		color = json.thisWebsite.color;
	}
	let commonData = json.commonData,
		status = json.status,
		add = json.add,
		change = json.change,
		del = json.del;
	let data = {
		"name": name,
		"url": url,
		"color": color,
		"count": 1,
		"id": Math.random().toString(36).substr(-8)
	};
	let operate = "";
	if (status !== undefined && status == getStorage("showCommonUse")) {
		let info = "";
		switch (status) {
			case "website_open":
				info = "开启";
				break;
			case "website_close":
				info = "关闭";
				break;
		}
		let type = "error";
		openMessage({
			title: "提示",
			type: type,
			content: `请勿重复${info}！！！`
		})
		return;
	}
	if (add) {
		data.count = 100000;
		operate = "添加";
	} else {
		data.count = 1;
	}
	if (change) {
		commonData.forEach(item => {
			if (item.id == id) {
				item.name = name;
				item.count = 100000;
			}
		})
		flag = false;
		operate = "修改";
	} else if (del) {
		let delData = commonData.findIndex(item => item.id == id);
		commonData.splice(delData, 1);
		flag = false;
		operate = "删除";
	}
	if (flag) {
		let recent = commonData.find(item => item.name == name);
		if (recent == undefined && status == undefined) {
			commonData.push(data);
		} else if (status == undefined && recent.count < 100000) {
			commonData.forEach(item => {
				if (item.name == recent.name) {
					item.count += 1;
				}
			})
		}
	}
	//根据打开次数排序
	commonData.sort(function (obj1, obj2) {
		let minCount = obj1["count"];
		let maxCount = obj2["count"];
		return maxCount - minCount;
	})
	setCommomUse(commonData, status);
	setStorage("commonUseData", JSON.stringify(commonData));
	if (status == undefined && (add !== undefined || change !== undefined || del !== undefined)) {
		openMessage({
			title: "提示",
			type: "success",
			content: `${operate}成功！`
		})
	}
}
//记录常用网址
function setCommomUse(data, status) {
	let commonHtml = "";
	let display = "";
	let isShow = (status !== undefined) ? true : false;
	if (status !== undefined) {
		setStorage("showCommonUse", status);
	}
	if (data !== null) {
		data.forEach((item, index) => {
			if (index < 7) {
				commonHtml += renderData(item.id, item.name, item.url, item.color);
			}
		})
	}
	if (getStorage("showCommonUse") == "website_open" || status == "website_open") {
		display = () => {
			commonUse.style.display = "flex";
		}
	} else if (getStorage("showCommonUse") == "website_close" || status == "website_close") {
		display = () => {
			commonUse.style.display = "none";
		}
	}
	if (isShow) {
		setStorageBefore(display);
	} else if (getStorage("showCommonUse") == "website_close" && !isShow) {
		commonUse.style.display = "none";
	}
	commonUse.innerHTML = commonHtml + addCommonsData();
	iconLoadError();
}
//图标加载失败替换文字函数
function iconLoadError() {
	Array.prototype.forEach.call(commonUse.children, item => {
		if (item.children[0].className == "commons-content") {
			item.children[0].children[0].onerror = () => {
				let textIcon = document.createElement("div");
				textIcon.setAttribute("class", "text-icon");
				textIcon.style.backgroundColor = item.children[0].children[1].style.color;
				let imageIcon = item.children[0].children[0];
				textIcon.innerHTML = item.children[0].children[1].text.substr(0, 1);
				item.children[0].replaceChild(textIcon, imageIcon);
			}
		}
	})
}
//胶囊样式模板
function renderCapsule(data) {
/*	return `
        <a id='${data.name}' href='${data.url}' target="_blank" class="capsule">
            <div style="color:${data.color};">
                <span>${data.name}</span>
            </div>
        </a>`;*/
    return `
        <a id='${data.name}' href='${data.url}' target="_blank" class="capsule">
            <div>
                <span>${data.name}</span>
            </div>
        </a>`;
}
/*<img src="http://www.pp2.com/index.php?c=icon&url=${btoa(encodeURIComponent(url))}"></img>*/
//自定义网址模板
function renderData(id, name, url, color) {
	return `
    <div class="commons">
        <div class="commons-content">
            <img src="${(favicon + url)}"></img>
            <a id="${id}" style="color:${color};" href="${url}" target="_blank">${name}</a>
        </div>
        <div class="commons-btn" title="更多选项">
           <svg class="icon" aria-hidden="true"><use xlink:href="#icon-more"></use></svg>
        </div>
    </div>`
}
//添加网址模板
function addCommonsData() {
	return `
    <div class="commons">
    <div class="commons-addbtn" title="添加站点">
		<svg class="icon" ><use xlink:href="#icon-addWebsite"></use></svg>
    </div>
    </div>`
}
/* 自定义网址结束 */



(
    function () {
    //当浏览器窗口被调整大小时触发
    window.onresize = function () {
        ShowHideElement("i-link-box", "linkList-item", 845);
    }
    window.onload = function () {
        ShowHideElement("i-link-box", "linkList-item", 845);
    }

    function ShowHideElement(Element1, Element2, Vaule) {
        var Person = document.getElementsByClassName(Element1);
        var BoxHeight = document.getElementsByClassName(Element2);
        var WindowHeight = window.innerHeight || document.body.clientHeight;
        //遍历获取到的元素
        for (var i = 6; i < Person.length; i++) {
            if (WindowHeight <= Vaule && deviceVal === "pc") {
                Person[i].style.display = "none";
                BoxHeight[0].style.marginTop = "5px";
            } else {
                Person[i].style.display = "block";
                BoxHeight[0].style.marginTop = "0px";
            }
        }
    }

    window.ShowHideElement = ShowHideElement;
}());

var now = -1;
var resLength = 0;
var listIndex = -1;
var hotList = 0;
var appList = 0;
var thisSearch = 'https://www.baidu.com/s?ie=utf-8&wd=';
$('#search-icon').children().attr('xlink:href', '#icon-baidu')
var thisSearchIcon = './logo.jpg';
var storage = window.localStorage;
if (!storage.stopHot) {
    storage.stopHot = true
}
storage.stopHot == 'false'
    ? $('#hot-btn').attr(
        'style',
        'background: url('+templates+'/image/hotg.svg) no-repeat center/cover;'
    )
    : $('#hot-btn').attr(
        'style',
        'background: url('+templates+'/image/hotk.svg) no-repeat center/cover;'
    );
var ssData = storage.searchEngine;
if (storage.searchEngine != undefined) {
    ssData = ssData.split(',');
    thisSearch = ssData[0];
    $('#search-icon').children().attr('xlink:href', ssData[1])
	$('#txt').attr('placeholder', ssData[2])
}
function getHotkeyword(value) {
	var appval =[];
	jsonlistData.forEach(vallist => {
		-1 !== vallist.name.toLowerCase().indexOf(value.toLowerCase()) && appval.push({
			name: vallist.name,
			icon: vallist.icon,
			url: vallist.url
       })
    })	
    $.ajax({
        type: "GET",
        url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
        async: true,
        data: {
            wd: value
        },
        dataType: "jsonp",
        jsonp: "cb",
        success: function (res) {
            $(".urllist").text("");
			$(".applist").text("");
			appval.forEach((inner,i) => {
					$(".applist").append(`<li><div class="img"><img src="`+favicon+inner.url+`"></div><div class="text">`+inner.name+`</div></li>`);
					$(".applist li").eq(i).click(function () {
							aopen(inner.url);
							$('#box').css('display', 'none')
						});
				})
            hotList = res.s.length;
            if (hotList) {
                $("#box").css("display", "block");
                for (var i = 0; i < hotList; i++) {
                    $(".urllist").append("<li><span>" + (
                        i + 1
                    ) + "</span>" + res.s[i] + "</li>");
                    $(".urllist li")
                        .eq(i)
                        .click(function () {
                            $('#txt').val(this.childNodes[1].nodeValue);
							aopen(thisSearch + this.childNodes[1].nodeValue);
                            //window.open(thisSearch + this.childNodes[1].nodeValue);
                            $('#box').css('display', 'none')
                        });
                    if (i === 0) {
                        $(".urllist li")
                            .eq(i)
                            .css({"border-top": "none"});
                        $(".urllist span")
                            .eq(i)
                            .css({"color": "#fff", "background": "#f54545"})
                    } else {
                        if (i === 1) {
                            $(".urllist span")
                                .eq(i)
                                .css({"color": "#fff", "background": "#ff8547"})
                        } else {
                            if (i === 2) {
                                $(".urllist span")
                                    .eq(i)
                                    .css({"color": "#fff", "background": "#ffac38"})
                            }
                        }
                    }
                }
            } else {
                $("#box").css("display", "none")
            }
        },
        error: function (res) {
           // console.log(res)
        }
    })
}

// 按键松开时执行
$("#txt").keyup(function (e) {
    if ($(this).val()) {
        if (e.keyCode == 38 || e.keyCode == 40 || storage.stopHot != 'true') {
            return
        }
        $("#search-clear").css("display", "block");
        getHotkeyword($(this).val())
    } else {
        $("#search-clear").css("display", "none");
        $("#box").css("display", "none")
    }
});

$("#txt").keydown(function (e) {
    if (e.keyCode === 40) {
        listIndex === (hotList - 1)
            ? listIndex = 0
            : listIndex++;
        $("#box ul li")
            .eq(listIndex)
            .addClass("current")
            .siblings()
            .removeClass("current");
        var hotValue = $("#box ul li")
            .eq(listIndex)[0]
            .childNodes[1]
            .nodeValue;
        $("#txt").val(hotValue)
    }
    if (e.keyCode === 38) {
        if (e.preventDefault) {
            e.preventDefault()
        }
        if (e.returnValue) {
            e.returnValue = false
        }
        listIndex === 0 || listIndex === -1
            ? listIndex = (hotList - 1)
            : listIndex--;
        $("#box ul li")
            .eq(listIndex)
            .addClass("current")
            .siblings()
            .removeClass("current");
        var hotValue = $("#box ul li")
            .eq(listIndex)[0]
            .childNodes[1]
            .nodeValue;
        $("#txt").val(hotValue)
    }
    if (e.keyCode === 13) {
		aopen(thisSearch + $("#txt").val());
        //window.open(thisSearch + $("#txt").val());
        $("#box").css("display", "none");
        $("#txt").blur();
        $("#box ul li").removeClass("current");
        listIndex = -1
    }
});
$("#search-clear").click(function () {
    $('#txt').val("");
    $('#search-clear').css('display', 'none');
    $("#box").css("display", "none");
});
$(".search-btn").click(function () {
	aopen(thisSearch + $("#txt").val());
    //window.open(thisSearch + $("#txt").val());
    $("#box").css("display", "none");
    $("#txt").blur();
    $("#box ul li").removeClass("current");
    listIndex = -1
});
//模拟提交
function aopen(url) {
	window.open(url,'_blank')
}
$("#txt").focus(function () {
   // $(".search-box").css("box-shadow", "0 4px 6px #0000001f");
    $(".search-box").css("border", "1px solid #4068e0");
    if ($(this).val() && storage.stopHot == 'true') {
        getHotkeyword($(this).val())
    }
});
$("#txt").blur(function () {
    //$(".search-box").css("box-shadow", "0 2px 3px #0000000f");
    $(".search-box").removeAttr('style');
    setTimeout(function () {
        $("#box").css("display", "none")
    }, 400)
});
$(function () {
    // $('#box ul').html() === '' ? $('#box').css('height','0px') :
    // $('#box').css('height','auto');
    var search = {
        data: [
            {
                name: '百度',
                icon: 'icon-baidu',
                color: '#3385ff',
                url: 'https://www.baidu.com/s?ie=utf-8&wd='
            }, {
                name: '谷歌',
                icon: 'icon-google',
                color: '#4c8bf5',
                url: 'https://www.google.com/search?q='
            }, {
                name: '必应',
                color: '#0a8583',
                icon: 'icon-bing',
                url: 'https://cn.bing.com/search?q='
            }, {
                name: '好搜',
                icon: 'icon-so',
                color: '#f8b616',
                url: 'https://www.so.com/s?q='
            }, {
                name: '搜狗',
                icon: 'icon-sogou',
                color: '#fe620d',
                url: 'https://www.sogou.com/web?query='
            },{
                name: 'Github',
                icon: 'icon-github',
                color: '#24292e',
                url: 'https://github.com/search?utf8=✓&q='
            },{
                name: '文件加速',
                icon: 'icon-github',
                color: '#24292e',
                url: 'https://github.aci1.com/'
            }, {
                name: '微信',
                icon: 'icon-wechat',
                color: '#ff0030',
                url: 'https://weixin.sogou.com/weixinwap?type=2&query='
            }, {
                name: '知乎',
                icon: 'icon-zhihu',
                color: '#0078d7',
                url: 'https://www.zhihu.com/search?type=content&q='
            }, {
                name: '微博',
                icon: 'icon-weibo',
                color: '#f3131b',
                url: 'https://s.weibo.com/weibo/'
            }, {
                name: '夸克',
                icon: 'icon-quark',
                color: '#03bc11',
                url: 'https://quark.sm.cn/s?q='
            }, {
                name: 'shodan',
                icon: 'icon-safe',
                color: '#148aff',
                url: 'https://www.shodan.io/search?query='
            }
        ]
    }
    /*for (var i = 0; i < search.data.length; i++) {
        var addList = '<li><i style="background: url(' + search
            .data[i]
            .icon + ') no-repeat center/cover;color: ' + search
            .data[i]
            .color + '"></i><span>' + search
            .data[i]
            .name + '</span></li>'
        $('.search-engine-list').append(addList);
    }*/
	for (var i = 0; i < search.data.length; i++) {
        var addList = '<li><svg class="icon"><use xlink:href="#' + search.data[i].icon +'"></use></svg><span>' + search
            .data[i]
            .name + '</span></li>'
        $('.search-engine-list').append(addList);
    }

    $('#search-icon, .search-engine').hover(function () {
        $('.search-engine').css('display', 'block')
    }, function () {
        $('.search-engine').css('display', 'none')
    });

    $('#hot-btn').on('click', function () {
        // $(this).toggleClass('icon-kaiguanclose-copy');
        if (storage.stopHot == 'true') {
            $(this).attr(
                'style',
                'background: url('+templates+'/image/hotg.svg) no-repeat center/cover;'
            )
            storage.stopHot = false
        } else {
            storage.stopHot = true
            $(this).attr(
                'style',
                'background: url('+templates+'/image/hotk.svg) no-repeat center/cover;'
            )
        }
        //console.log(storage.stopHot)
    });

    $('.search-engine-list li').click(function () {
        var _index = $(this).index();
        var thisIcon = $(this).children().children().attr('xlink:href');
        var thisText = $(this).text() + '搜索:输入关键词搜索';
		$('#search-icon use').attr('xlink:href', thisIcon)
        $('#txt').attr('placeholder', thisText)
        thisSearch = search
            .data[_index]
            .url;
        $('.search-engine').css('display', 'none')

        storage.searchEngine = [thisSearch, thisIcon, thisText]
    })
	
	
})

$(document).ready(function () {
    //菜单点击
    $("#menu").click(function (event) {
        $(this).toggleClass('on');
        $(".list").toggleClass('closed');
        $(".mywth").toggleClass('hidden');
    });
    $("#content").click(function (event) {
        $(".on").removeClass('on');
        $(".list").addClass('closed');
        $(".mywth").removeClass('hidden');
    });
});


$(document).ready(function(){$("#menu").click(function(s){$(this).toggleClass("on"),$(".list").toggleClass("closed"),$(".mywth").toggleClass("hidden")}),$("#content").click(function(s){$(".on").removeClass("on"),$(".list").addClass("closed"),$(".mywth").removeClass("hidden")})});
            (function (a, h, g, f, e, d, c, b) {
                  b = function () {
                        d = h.createElement(g);
                        c = h.getElementsByTagName(g)[0];
                        d.src = e;
                        d.charset = "utf-8";
                        d.async = 1;
                        c.parentNode.insertBefore(d, c)
                  };
                  a["SeniverseWeatherWidgetObject"] = f;
                  a[f] || (a[f] = function () {
                        (a[f].q = a[f].q || []).push(arguments)
                  });
                  a[f].l = +new Date();
                  if (a.attachEvent) {
                        a.attachEvent("onload", b)
                  } else {
                        a.addEventListener("load", b, false)
                  }
            }(window, document, "script", "SeniverseWeatherWidget",
                  "//cdn.sencdn.com/widget2/static/js/bundle.js?t=" + parseInt((new Date().getTime() / 100000000)
                        .toString(), 10)));
            window.SeniverseWeatherWidget('show', {
                  flavor: "slim",
                  location: "WX4FBXXFKE4F",
                  geolocation: true,
                  language: "auto",
                  unit: "c",
                  theme: "auto",
                  token: decodeURIComponent(atob(xztqkey)),//95e011fd-5d26-4a2a-a8e9-37aa7cc653c4
                  hover: "enabled",
                  container: "tp-weather-widget"
            })

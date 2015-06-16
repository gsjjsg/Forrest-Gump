//Global函数

// addLoadEvent函数
/*共享onload事件
* 该函数完成的操作为：
* 1、把现有的window。onload事件处理函数的值存入变量oldonload
* 2、如果在这个处理函数上还没有绑定任何函数，就像平时那样把新函数添加给它
* 3、如果在这个处理函数上已经绑定了一些函数，就把新函数追加到现有指令的末尾
* */
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}

//insertAfter函数
/*
* 该函数完成的操作为：
* 将一个新元素插入到一个现有元素的后面，当调用此方法时，必须知道三件事情：
* 1、新元素：你想插入的元素（newElement）.
* 2、目标元素：你想把这个新元素插入到哪个元素（targetElement）之后
* 3、父元素：目标元素的父元素（parentElement）
* 该函数与insertBefore()函数的作用相反。
* */
function insertAfter(newElement,targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement,targetElement.nextSibling);
  }
}

//addClass
/*该函数实现的操作为：
*在需要给一个元素追加新的class时，调用该函数，具体操作为：
* 1、检查className 属性的值是否为null
* 2、如果是，把新class设置值直接赋值给className属性；
* 3、如果不是，把一个空格和新的class设置值追加到className属性上去。
* 该函数带有两个参数：第一个是需要添加新class的元素（element）,第二个是新的
* class设置值value。
* */
function addClass(element,value) {
  if (!element.className) {
    element.className = value;
  } else {
    newClassName = element.className;
    newClassName+= " ";
    newClassName+= value;
    element.className = newClassName;
  }
}

//highlightPage()
/*
* 该函数的作用是在服务器端包含困难的时候，来代替实现该功能，具体操作如下：
* 1、取得导航列表中所有链接
* 2、循环遍历这些链接
* 3、如果发现了与当前URL匹配的链接，为他添加here类
* 4、该函数可以达到一箭双雕的目的，通过给每个页面的body元素
*添加id属性，可以为每个页面应用不同的样式
* */
function highlightPage() {
  if (!document.getElementsByTagName) return false;//检查要使用的DOM方法
  if (!document.getElementById) return false; //检查要使用的DOM方法
  var headers = document.getElementsByTagName('header');
  if (headers.length == 0) return false;
  var navs = headers[0].getElementsByTagName('nav');
  if (navs.length == 0) return false;
  
  var links = navs[0].getElementsByTagName("a");//取得导航链接，然后循环遍历他们
  for (var i=0; i<links.length; i++) {
	  var linkurl;
	  for (var i=0; i<links.length; i++) {
	    linkurl = links[i].getAttribute("href");
	    if (window.location.href.indexOf(linkurl) != -1) {
	      links[i].className = "here";
	      var linktext = links[i].lastChild.nodeValue.toLowerCase();
	      document.body.setAttribute("id",linktext);
	    }
	  }
  }
}


// Home页面相关的函数

//moveElement
/*该函数包含四个参数：
* 1、打算移动的元素的ID
* 2、该元素的目的地的“左"位置。
* 3、该元素的目的地的"上"位置
* 4、两次移动之间的停顿时间
* 作用是实现动画效果：
* 1、获得元素的位置
* 2、如果元素已经到达它的目的地，则退出函数
* 3、如果尚未到达它的目的地，则把它向目的地移动近一点儿
* 4、经过一段时间间隔之后从第一步开始重复上述步骤
* */
function moveElement(elementID,final_x,final_y,interval) {
  if (!document.getElementById) return false;//检查要使用的DOM方法
  if (!document.getElementById(elementID)) return false;//检查要使用的DOM方法
  var elem = document.getElementById(elementID);
  if (elem.movement) {
    clearTimeout(elem.movement);//取消行动
  }
  if (!elem.style.left) {
    elem.style.left = "0px";
  }
  if (!elem.style.top) {
    elem.style.top = "0px";
  }
  var xpos = parseInt(elem.style.left);//负责把给定元素的left和top属性转换为数值。
  var ypos = parseInt(elem.style.top);
  if (xpos == final_x && ypos == final_y) {
    return true;
  }
  if (xpos < final_x) {//根据当前位置和目的地的关系更新位置
    var dist = Math.ceil((final_x - xpos)/10);
    xpos = xpos + dist;
  }
  if (xpos > final_x) {
    var dist = Math.ceil((xpos - final_x)/10);
    xpos = xpos - dist;
  }
  if (ypos < final_y) {
    var dist = Math.ceil((final_y - ypos)/10);
    ypos = ypos + dist;
  }
  if (ypos > final_y) {
    var dist = Math.ceil((ypos - final_y)/10);
    ypos = ypos - dist;
  }
  elem.style.left = xpos + "px";//负责吧字符串”px“追加到变量xpos和ypos的末尾，并将其赋值给elem元素的left 和top样式属性
  elem.style.top = ypos + "px";
  var repeat = "moveElement('"+elementID+"',"+final_x+","+final_y+","+interval+")";
  elem.movement = setTimeout(repeat,interval);
}


//prepareSlideshow()
/*
* 该函数的作用是创建幻灯片元素并准备相应的链接，在此，
* 我把幻灯片直接放在文档中的”intro"段落的后面
* 接着循环遍历“intro”段落中的所有链接，
* 并根据当前鼠标所在的链接来移动preview元素
*
*
*
* */
function prepareSlideshow() {
  if (!document.getElementsByTagName) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById("intro")) return false;
  var intro = document.getElementById("intro");
  var slideshow = document.createElement("div");
  slideshow.setAttribute("id","slideshow");
  var frame = document.createElement("img");//创建一幅150*150的图像
  frame.setAttribute("src","images/frame.gif");//创建一幅150*150的图像
  frame.setAttribute("alt","");//创建一幅150*150的图像
  frame.setAttribute("id","frame");//创建一幅150*150的图像
  slideshow.appendChild(frame);//创建一幅150*150的图像
  var preview = document.createElement("img");
  preview.setAttribute("src","images/slideshow.gif");
  preview.setAttribute("alt","a glimpse of what awaits you");
  preview.setAttribute("id","preview");
  slideshow.appendChild(preview);
  insertAfter(slideshow,intro);
  var links = document.getElementsByTagName("a");//导航div中的链接也能触发幻灯片。
  for (var i=0; i<links.length; i++) {
    links[i].onmouseover = function() {
      var destination = this.getAttribute("href");
      if (destination.indexOf("index.html") != -1) {//动画移动效果
        moveElement("preview",0,0,5);
      }
      if (destination.indexOf("ProjectExperience.html") != -1) {
        moveElement("preview",-150,0,5);
      }
      if (destination.indexOf("educationExperience.html") != -1) {
        moveElement("preview",-300,0,5);
      }
      if (destination.indexOf("about.html") != -1) {
        moveElement("preview",-450,0,5);
      }
      if (destination.indexOf("contact.html") != -1) {
        moveElement("preview",-600,0,5);
      }
    }
  }
}


// About页面相关函数

//showSection()
/*
* 该函数可以选择性地每次只显示其中一部分。即它能够指定的id显示相应<section>，
* 同时隐藏其他部分。它用于修改每个部分的display样式属性，除了与作为参数传入的id
* 对应部分外，其他部分的display属性都将设置为“none”而与传入id对应的那部分的display属性则被设置为“block"
* */
function showSection(id) {
  var sections = document.getElementsByTagName("section");
  for (var i=0; i<sections.length; i++ ) {
    if (sections[i].getAttribute("id") != id) {
      sections[i].style.display = "none";
    } else {
      sections[i].style.display = "block";
    }
  }
}

//prepareInternalnav()
/*
* 具体操作为：先从循环遍历<article>中的<nav>所包含的链接开始，每个
* 链接的href 属性中都包含对应部分的id,开头的”#“表示内部链接。
* 页面越长，这个功能的效果就越明显。
* */
function prepareInternalnav() {
  if (!document.getElementsByTagName) return false;
  if (!document.getElementById) return false;
  var articles = document.getElementsByTagName("article");
  if (articles.length == 0) return false;
  var navs = articles[0].getElementsByTagName("nav");
  if (navs.length == 0) return false;
  var nav = navs[0];
  var links = nav.getElementsByTagName("a");
  for (var i=0; i<links.length; i++ ) {
    var sectionId = links[i].getAttribute("href").split("#")[1];//取得”#“后面的字符串提取出来并保存到sectionId中
    if (!document.getElementById(sectionId)) continue;//测试，以确保真的存在带有相应id的元素，如果不存在，则继续下一次的循环
    document.getElementById(sectionId).style.display = "none";//页面加载后需要默认隐藏所有部分
    links[i].destination = sectionId;
    links[i].onclick = function() {
      showSection(this.destination);
      return false;
    }
  }
}


// ProjectExperience页面相关函数

//showPic()
/*
* 在某个图片链接被点击时，不仅要把占位符图片替换为那个链接
* 的href属性所指向的图片，还要把这段文本同时替换为那个图片链接的title属性值。
* 并实现文本切换
* */

function showPic(whichpic) {
  if (!document.getElementById("placeholder")) return true;
  var source = whichpic.getAttribute("href");
  var placeholder = document.getElementById("placeholder");
  placeholder.setAttribute("src",source);
  if (!document.getElementById("description")) return false;
  if (whichpic.getAttribute("title")) {//获取whichpic对象的title属性值
    var text = whichpic.getAttribute("title");
  } else {
    var text = "";
  }
  var description = document.getElementById("description");//得到id是”description“的<p>元素，并把它保存到变量description里
  if (description.firstChild.nodeType == 3) {
    description.firstChild.nodeValue = text;//把description对象的第一个子节点的nodeValue属性值设置为变量text的值
  }
  return false;
}

//preparePlaceholder()
/*该函数的操作如下：
1、创建一个img元素节点
2、设置这个节点的id、src、alt属性
3、创建一个p元素节点
4、设置这个节点的id属性
5、创建一个文本节点
6、把这个文本节点追加到p元素上
* */
function preparePlaceholder() {
  if (!document.createElement) return false;
  if (!document.createTextNode) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById("imagegallery")) return false;
  var placeholder = document.createElement("img");
  placeholder.setAttribute("id","placeholder");
  placeholder.setAttribute("src","images/placeholder.gif");
  placeholder.setAttribute("alt","my image gallery");
  var description = document.createElement("p");
  description.setAttribute("id","description");
  var desctext = document.createTextNode("选择作品");
  description.appendChild(desctext);
  var gallery = document.getElementById("imagegallery");
  insertAfter(description,gallery);
  insertAfter(placeholder,description);
}

//prepareGallery()
/*
 *为了达到平稳退化的能力，使得js与HTML标记分离，把相关操作关联到
 * onclick事件上，主要完成以下工作：
 * 1、检查当前浏览器是否理解getElementsByTagName 、getElementById
 * 2、检查当前网页是否存在一个id为imagegallery的元素
 * 3、遍历imagegallery元素中的所有链接
 * 4、设置onclick事件，让它在有关链接被点击时完成以下操作：
 * 把这个链接作为参数传递给showPic函数；
 * 取消链接被点击时的默认行为，不让浏览器打开这个链接。
 * */
function prepareGallery() {
  if (!document.getElementsByTagName) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById("imagegallery")) return false;
  var gallery = document.getElementById("imagegallery");
  var links = gallery.getElementsByTagName("a");
  for ( var i=0; i < links.length; i++) {
    links[i].onclick = function() {
      return showPic(this);
    }
  }
}


// educationExperience页面的相关函数

//stripeTables()
/*
* 该函数通过直接改变奇数表格行的背景颜色来
* 实现斑马线效果
* */
function stripeTables() {
  if (!document.getElementsByTagName) return false;
  var tables = document.getElementsByTagName("table");
  for (var i=0; i<tables.length; i++) {
    var odd = false;
    var rows = tables[i].getElementsByTagName("tr");
    for (var j=0; j<rows.length; j++) {
      if (odd == true) {
        addClass(rows[j],"odd");
        odd = false;
      } else {
        odd = true;
      }
    }
  }
}

//highlightRows()
/*
 *该函数的主要功能为：
 * 在鼠标指针悬停在某个表格行的上方时，把
 * 该行文本加黑加粗
 * */
function highlightRows() {
  if(!document.getElementsByTagName) return false;
  var rows = document.getElementsByTagName("tr");
  for (var i=0; i<rows.length; i++) {
    rows[i].oldClassName = rows[i].className
    rows[i].onmouseover = function() {
      addClass(this,"highlight");
    }
    rows[i].onmouseout = function() {
      this.className = this.oldClassName
    }
  }
}

//displayAbbreviations()
/*
* 该函数完成的操作：
* 1、遍历这份文档中的所有abbr元素
* 2、保存每个abbr元素的title属性
* 3、保存每个abbr元素包含的文本
* 4、创建一个”定义列表“元素（即dl元素）
* 5、遍历刚才保存的title属性和abbr元素的文本
* 6、创建一个”定义标题“元素（即dt元素）
* 7、把abbr元素的文本插入到这个dt元素
* 8、创建一个”定义描述“元素（即dd元素）
* 9、把title属性插入到这个dd元素
* 10、把dt元素追加到第四步创建的dl元素上
* 11、把dd元素追加到第四步创建的dl元素上
* 12、把dl元素追加到educationExperience.html文档的body元素上
* */
function displayAbbreviations() {
  if (!document.getElementsByTagName || !document.createElement || !document.createTextNode) return false;
    //取得所有缩略词
  var abbreviations = document.getElementsByTagName("abbr");
  if (abbreviations.length < 1) return false;
  var defs = new Array();
    //遍历这些缩略词
  for (var i=0; i<abbreviations.length; i++) {
    var current_abbr = abbreviations[i];
    if (current_abbr.childNodes.length < 1) continue;
    var definition = current_abbr.getAttribute("title");
    var key = current_abbr.lastChild.nodeValue;
    defs[key] = definition;
  }
    //创建定义列表
  var dlist = document.createElement("dl");
    //遍历定义
  for (key in defs) {
    var definition = defs[key];
      //创建定义标题
    var dtitle = document.createElement("dt");
    var dtitle_text = document.createTextNode(key);
    dtitle.appendChild(dtitle_text);
      //创建定义描述
    var ddesc = document.createElement("dd");
    var ddesc_text = document.createTextNode(definition);
    ddesc.appendChild(ddesc_text);
      //把他添加到定义列表
    dlist.appendChild(dtitle);
    dlist.appendChild(ddesc);
  }
  if (dlist.childNodes.length < 1) return false;
    //创建标题
  var header = document.createElement("h3");
  var header_text = document.createTextNode("Abbreviations");
  header.appendChild(header_text);
  var articles = document.getElementsByTagName("article");
  if (articles.length == 0) return false;
  articles[0].appendChild(header);//把标题添加到页面主体
  articles[0].appendChild(dlist);//把定义列表添加到页面主体
}


// Contact页面的相关函数

//focusLabels()
/*
*该函数主要操作：
* 1、取得文档中的label元素
* 2、如果label有for属性，添加一个事件处理函数
* 3、在label被单击时，提前for属性值，这个值就是相应表单字段的id值
* 4、确保存在相应的表单字段
* 5、让相应的表单字段获得焦点
* */
function focusLabels() {
  if (!document.getElementsByTagName) return false;
  var labels = document.getElementsByTagName("label");
  for (var i=0; i<labels.length; i++) {
    if (!labels[i].getAttribute("for")) continue;
    labels[i].onclick = function() {
      var id = this.getAttribute("for");
      if (!document.getElementById(id)) return false;
      var element = document.getElementById(id);
      element.focus();
    }
  }
}

//resetFields()
/*
* 该函数实现如下功能：
* 1、检查浏览器是否支持placeholder属性。如果不支持，继续
* 2、循环遍历表单中的每个元素
* 3、如果当前元素是提交按钮，跳过
* 4、为元素获得焦点的事件添加一个处理函数，如果字段的值等于占位符文本
* 则将字段的值设置为空
* 5、再为元素失去焦点的事件添加一个处理函数。如果字段的值为空，则为其添加占位符值
* 6、为了应用样式，在字段显示占位符值的时候添加placeholder类
* */
function resetFields(whichform) {
  if (Modernizr.input.placeholder) return;
  for (var i=0; i<whichform.elements.length; i++) {
    var element = whichform.elements[i];
    if (element.type == "submit") continue;
    if (!element.getAttribute('placeholder')) continue;
    element.onfocus = function() {
    if (this.value == this.getAttribute('placeholder')) {
      this.value = "";
     }
    }
    element.onblur = function() {
      if (this.value == "") {
        this.value = this.getAttribute('placeholder');
      }
    }
    element.onblur();
  }
}

//validateForm
/*
* 该函数实现的操作为：
* 1、循环遍历表单的elements数组
* 2、如果发现了required属性，把相应的元素传递给isFilled函数
* 3、如果isFilled函数返回false,显示警告消息，并且validteForm函数也返回false
* 4、如果找到了email类型的字段，把相应的元素传递给isEmail函数
* 5、如果isEmail函数返回false,显示警告消息，并且validateForm函数也返回false
* 6、否则，validateForm函数返回true
* */
function validateForm(whichform) {
  for (var i=0; i<whichform.elements.length; i++) {
    var element = whichform.elements[i];
    if (element.getAttribute("required") == 'required') {
      if (!isFilled(element)) {
        alert("Please fill in the "+element.name+" field.");
        return false;
      }
    }
    if (element.getAttribute("type") == 'email') {
      if (!isEmail(element)) {
        alert("The "+element.name+" field must be a valid email address.");
        return false;
      }
    }
  }
  return true;
}

//isFilled()
/*
* 该函数的参数只有一个，验证用户是否输入了什么内容
* */
function isFilled(field) {
  return (field.value.length > 1 && field.value != field.placeholder);
}

//isEmail()
/*
*验证表单中的内容是不是一个电子邮件地址
* */
function isEmail(field) {
  return (field.value.indexOf("@") != -1 && field.value.indexOf(".") != -1);
}


//prepareForms()
/*
* 如果表单没有通过验证，返回false;因为验证失败，所以不能提交表单
* 如果submitFormWithAjax函数成功发送了Ajax请求并返回true,则让submit事件处理函数返回false,以便阻止浏览器重复提交表单
* 否则，说明submitFormWithAjax函数没有成功发送Ajax请求，因而让submit事件处理函数返回true,让表单像什么都没发生一样继续通关页面提交
* */
function prepareForms() {
  for (var i=0; i<document.forms.length; i++) {
    var thisform = document.forms[i];
    resetFields(thisform);
    thisform.onsubmit = function() {
      if (!validateForm(this)) return false;
      var article = document.getElementsByTagName('article')[0];
      if (submitFormWithAjax(this, article)) return false;
      return true;
    }
  }
}


// Ajax
/*
* 对页面的请求以异步方式发送到服务器。而服务器不会用整个页面来
* 响应请求，它会在后台处理请求，与此同时用户还能继续浏览页面并与
* 页面交互
* */

//getHTTPObject()
function getHTTPObject() {
  if (typeof XMLHttpRequest == "undefined")
    XMLHttpRequest = function () {
        //为了兼容所有浏览器
      try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
        catch (e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
        catch (e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP"); }
        catch (e) {}
      return false;
  }
  return new XMLHttpRequest();
}

//displayAjaxLoading()

function displayAjaxLoading(element) {
    // Remove the existing content.
  while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
  }
  //  Create a loading image.
  var content = document.createElement("img");
  content.setAttribute("src","images/loading.gif");
  content.setAttribute("alt","Loading...");
  // Append the loading element.
  element.appendChild(content);
}

//submitFormWithAjax()
/*
*该函数包含两个参数：第一个参数是一个form对象，第二个参数是一个目标对象
* 执行如下操作：
* 1、调用displayAjaxLoading函数，删除目标元素的子元素，并添加loading.gif图像
* 2、把表单的值组织成URL编码的字符串，以便通过Ajax请求发送
* 3、创建方法为POST的Ajax请求，把表单的值发送给contact.html
* 4、如果请求成功，解析响应并在目标元素中显示结果
* 5、如果请求失败，显示错误结果
* */
function submitFormWithAjax( whichform, thetarget ) {
  
  var request = getHTTPObject();
  if (!request) { return false; }

  // 显示加载信息
  displayAjaxLoading(thetarget);

  // 搜集数据
  var dataParts = [];
  var element;
  for (var i=0; i<whichform.elements.length; i++) {
    element = whichform.elements[i];
    dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
  }
  var data = dataParts.join('&');

  request.open('POST', whichform.getAttribute("action"), true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
        if (request.status == 200 || request.status == 0) {
          var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
          if (matches.length > 0) {
            thetarget.innerHTML = matches[1];
          } else {
            thetarget.innerHTML = '<p>Oops, there was an error. Sorry.</p>';
          }
        } else {
          thetarget.innerHTML = '<p>' + request.statusText + '</p>';
        }
    }
  };

  request.send(data);
   
  return true;
};





function loadEvents() {
  // home
  prepareSlideshow();
  // about
  prepareInternalnav();
  // photos
  preparePlaceholder();
  prepareGallery();
  // live
  stripeTables();
  highlightRows();
  displayAbbreviations();
  // contact
  focusLabels();
  prepareForms();
}

// Load events
addLoadEvent(highlightPage);
addLoadEvent(loadEvents);


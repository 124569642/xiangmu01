//搜索栏
var searchTxt = '请输入您的关键词';
var fwqTime;
$(function(){
	//登录
	var re = /^([\/\?]|[\/index])+(\.[\w]*)*$/gi;
	var str = String(window.location.pathname);
	var hometrack = 0;
	if(re.test(str) || str == "/"){
		 hometrack = 1;
	}
	$.getJSON('/index/helloService/',{hometrack:hometrack},function(data){
		if(data.loginInfo != 0) {
			$("#loginbar").html(data.loginInfo);
			uid = data.uid;
		}
	});

	//关注我们
	$(".focusUs").hover(function(){
		$(this).children(".focusUsBox").show();
	})

	$(".focusUs").mouseleave(function(){
		$(".focusUsBox").hide();
	})

	//手机app
	$(".meiciapp").hover(function(){
		$(this).children(".meiciappBox").show();
	})

	$(".meiciapp").mouseleave(function(){
		$(".meiciappBox").hide();
	})



	//搜索回车
	$("#search-input").keyup(function(event){
		e = event ? event :(window.event ? window.event : null);
		if(e.keyCode==13){ search(); return true; }
	});
	//搜索联想
	/*
	$('#search-input').autocomplete({
		appendTo: '.search_label',
		source:__MC_APP__+'/search/suggest',
		select:function(ev,ui) {
			$('#q-input').val(ui.item.label);
			setTimeout("search()",100);
		},
		open: function(event, ui) {
			$("ul.ui-autocomplete").css({width:"128px",top:"20px",left:"-133px"});
			}
	});*/

    var isIE6= /msie 6/i.test(navigator.userAgent);

	$(".close_btn_sub").click(function(){
		$(this).parent().parent().parent(".ac_box").hide();
		if (isIE6){
			$("select:hidden").show()
		}
	});

	//左筛选栏
	selectAction()

	$(".li_z .main_category_t").toggle(function(){
		var $parentS = $(this).parent()
		var $this = $(this).next(".sub_category")
		if($this.is(":hidden")){
			$this.show()
			$parentS.addClass("li_z_cur")
			}else{
				$this.hide()
				$parentS.removeClass("li_z_cur")
				}
	},function(){
		var $parentS = $(this).parent()
		var $this = $(this).next(".sub_category")
		if($this.is(":visible")){
			$this.hide()
			$parentS.removeClass("li_z_cur")
			}else{
				$this.show()
				$parentS.addClass("li_z_cur")
				}
	})

	//nav
	$(".main_nav li .menu_s").mouseover(function(){
		$(this).css({"background":"#8e0c3a","color":"#fff"});
		$(this).next(".menu_m").show();
	});
	$(".main_nav li").mouseleave(function(){
		$(this).children(".menu_s").css({"background":"#fff","color":"#333"});
		$(this).children(".menu_m").hide();
	});
	//购物袋
	$(".shopping_cart").hover(function(){
		var thisChild = $(this).children(".shopping_cart_sel");						   
		if(thisChild.is(":visible")){
			return false;
		}else{
			loadCartData();
			$(this).children(".shopping_cart_sel").fadeIn(50);
		}
	},function(){
		$(this).children(".shopping_cart_sel").fadeOut(50);
	});
	
	$(".shopping_cart_btn").hover(function(){
		$(this).addClass("shopping_cart_btn_cur");
	});
	$(".shopping_cart").mouseleave(function(){
		$(this).children(".shopping_cart_btn").removeClass("shopping_cart_btn_cur");
	});
	$('.shopping_cart_sel,.shopping_cart .shopping_cart_btn').mouseover(function(){
		$('.shopping_cart .shopping_cart_btn').css({"background-color":"#fff"});
	});
		$('.shopping_cart_sel,.shopping_cart .shopping_cart_btn').mouseleave(function(){
		$('.shopping_cart .shopping_cart_btn').css({"background-color":"#F4F4F4"});
	});
});

//加入购物车触发的事件
function clickAddCart(saleid){
	var t = addCart();
	var from_detail;
	$(".checkButton").attr('value','');
	if(String(t) != 'false'){
		$.get("/cart/checkProNum",{from_detail:'detail',sid:saleid,size:t},function(cdata){
			if(cdata == 1){
				$("#messages_product_view").css("display","none");
				var Post = {
					action : 'ADDCART',
					flatype : 0,
					id : saleid,
					size: t
				};
				$.post(__MC_APP__+"/product/addcart/"+new Date().getTime(),Post,function(data){
					if(data == -1){
						alert("此商品为抢购商品，需要登录抢购。");
						return false;
					}else if(data == -2){
						if(confirm('抱歉，该商品正在参与限时购活动，请购买入场券。')){
							location.href="/bargains/ForOneNightMeici2016.html";
						}
						return false;
					}
					loadCartData();
					getcartcookie();
					$(".shopping_cart").children(".shopping_cart_sel").fadeIn(300);
					$("body,html").animate({scrollTop:0},200);
					$(".shopping_cart_btn").addClass("shopping_cart_btn_cur");	
					$('.shopping_cart .shopping_cart_btn').css({"background-color":"#fff"});															  
				})
			}else{
				var isDisplay	= $(".pro_size").attr("style");
				if(isDisplay.indexOf("none") > -1){
					$(".pro_size").css("display","block"); 	
				}
				$("#messages_product_view").css("display","");
				$("#messages_product_view .error_msg").html("商品库存不足");
			}
		})
	}
}

//实时反应购物商品数量
function getcartcookie(){
	var name = "CART";
	var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    var cart=cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
	if(cart.substr(3,1) != ':'){
		var cartnum = cart.substr(2,2);
	}else{
		var cartnum = cart.substr(2,1);
	}
	
	/*var cartChild = $(".shopping_cart_btn").children('span').attr("class");
	var hasNum = 0
	if(cartChild == "cart_c"){
		hasNum    =  1;
	}*/
	
	if(cartnum != 0){
		$("#cookieCount").show();	
		$("#cookieCount").html(cartnum);
	}else if(cartnum == 0){
		$("#cookieCount").html(0);
	}
	
	/*if(hasNum == 0){
		$(".cart_n").addClass("cart_c").removeClass("cart_n").html("<i>我的购物袋</i>");
	}else if(cartnum == 0){
		$(".cart_c").addClass("cart_n").removeClass("cart_c").html("<i>我的购物袋</i>");
	}else{
		$("#cookieCount").html(cartnum);
	}*/
}

//请求购物车数据
function  loadCartData(){
	$.get(__MC_APP__+"/cart/getCartData/"+new Date().getTime(),function(data){
		$(".shopping_cart_sel").html(data);
	})
}


function searchFocus(e){
	if(e.value == searchTxt){
		e.value='';
		e.style.color='#666';
	}
}
function searchBlur(e){
	if(e.value == ''){
		e.value=searchTxt;
		e.style.color='#999';
	}
}

//头部导航搜索
function search(){
	var searchValue = $("#search-input").val();
	if(searchValue == searchTxt){
		$("#search-input").focus();
		return false;
	}
	if(searchValue == ""){
		$("#search-input").focus();
		return false;
	}
	if(searchValue == "Tod's" || searchValue == "tod's"){
		searchValue = "tods";
	}
	location.href=__MC_APP__+"/search/0-0-0-0-0-60-"+searchValue+"-1-0-0.html";
}

//全站搜索
function searchForAll(){
	var topsearchValue = $("#search-input-top").val();
	if(topsearchValue == ""){
		$("#search-input-top").focus();
		return false;
	}
	if(topsearchValue == "Tod's" || topsearchValue == "tod's"){
		searchValue = "tods";
	}
	location.href=__MC_APP__+"/search/0-0-0-0-0-60-"+topsearchValue+"-1-0-0.html";
}


//在线咨询MSN,QQ
function chatMSN(){
	location.href="msnim:chat?contact=meici@live.com";
}
function chatQQOnclick(){
	var chatUrl = '';
	if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
		chatUrl = 'http://wpa.qq.com/msgrd?v=3&uin=800019121&site=qq&menu=yes';
	}else{
		chatUrl = 'http://b.qq.com/webc.htm?new=0&sid=800019121&o=www.meici.com&q=7';
	}
	window.open(chatUrl, '_blank', 'height=544, width=644,toolbar=no,scrollbars=no,menubar=no,status=no');
}

//重载验证码
function fleshVerify(type){
	var timenow = new Date().getTime();
	if(type){
		$("#verifyImg").src=__MC_APP__+'/services/verify/adv/1/'+timenow;
	}else{
		$('#verifyImg').attr('src',__MC_APP__+'/services/verify/time/'+timenow);
	}
}


//公用弹出框
function boxShow(boxID){
	var isIE6= /msie 6/i.test(navigator.userAgent);
	if (isIE6){
		$("select").hide();
	}
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    var relLeft = ($(window).width() - $("#" + boxID).width())/2;
    var relTop = ($(window).height() - $("#" + boxID).height())/2;
    $(".mask").css({height:maskHeight, width:maskWidth}).show();
	$(".mask_a").css({height:maskHeight, width:maskWidth}).show();
    $("#" + boxID).css({top:$(window).scrollTop() + relTop + "px", left:$(window).scrollLeft() + relLeft + "px"}).show();
	$(".close_btn").click(function(){
		$(".mask, .ac_box, .mask_a").hide();
		if (isIE6){
			$("select:hidden").show()
		}
	});
	$(".mask").click(function(){
		$(".mask, .ac_box").hide();
		if (isIE6){
			$("select:hidden").show()
		}
	});
}
//公用alert框
function showAlert(boxID,boxMsg,boxBtn,boxTitle){
	var $showAlert = $('<div id="'+ boxID +'" class="ac_box rack_case04"><div class="relative"><div class="absolute"><a class="close_btn" href="javascript:void(0);"><img src="http://img.meicicdn.com/skin/df/pic_close_btn.gif" /></a></div></div><div class="ac_box_tit"><span>'+ boxTitle +'</span></div><div class="ac_box_msg">'+ boxMsg +'</div><div class="ac_btn_box"><button class="p_btn_i close_btn">'+ boxBtn +'</button></div></div>')
	var isIE6= /msie 6/i.test(navigator.userAgent);
	if (isIE6){
		$("select").hide();
	}
	$("body").append($showAlert);
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    var relLeft = ($(window).width() - $("#" + boxID).width())/2;
    var relTop = ($(window).height() - $("#" + boxID).height())/2;
    $(".mask").css({height:maskHeight, width:maskWidth}).show();
    $("#" + boxID).css({top:$(window).scrollTop() + relTop + 'px', left:$(window).scrollLeft() + relLeft + 'px'}).show();
	$(".close_btn,.mask").click(function(){
		$(".mask,.ac_box").hide();
		if (isIE6){
			$("select:hidden").show()
		}
	});
}

//公用确认框
function showMsg(boxID,boxMsg,boxBtn,boxTitle,func){
	var $showMsg = $('<div id="'+ boxID +'" class="ac_box rack_case04"><div class="ac_box_tit"><span>'+ boxTitle +'</span></div><div class="ac_box_msg">'+ boxMsg +'</div><div class="ac_btn_box"><button class="p_btn_i close_btn">'+ boxBtn +'</button></div></div>')
	var isIE6= /msie 6/i.test(navigator.userAgent);
	if (isIE6){
		$("select").hide();
	}
	$("body").append($showMsg);
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    var relLeft = ($(window).width() - $("#" + boxID).width())/2;
    var relTop = ($(window).height() - $("#" + boxID).height())/2;
    $(".mask").css({height:maskHeight, width:maskWidth}).show();
    $("#" + boxID).css({top:$(window).scrollTop() + relTop + 'px', left:$(window).scrollLeft() + relLeft + 'px'}).show();
	var cBtn = $("#"+boxID+" "+".close_btn")
	var cMask = $(".mask")
	$(cBtn,cMask).bind("click",function(){func();})
}


//公用tip
function tipsShow(b){
	var $tip=$('<div id="tip"><div class="t_box"><div class="tip_msg">'+ b +'<s><i></i></s></div></div></div>');
    $('body').append($tip);
    $('#tip').show('fast');
	$('.tip').mouseout(function(){
	  $('#tip').remove();
	}).mousemove(function(e){
	  $('#tip').css({"top":(e.pageY-20)+"px","left":(e.pageX+30)+"px"})
	}).mousedown(function(){
	  $('#tip').remove();
	})
}

function selectAction(){
	$(".title_pic").toggle(function(){
		var $select = $(this).next()
		var $siderbarUl = $(this).next().children()
		var $selectLi = $(this).next().next()
		var $selectP =$(this).next().next().children()
		var vHeight = $($siderbarUl).height() + 10
		var $parent = $(this).parent().attr("class")
		if($parent == "title_selected"){
			$($select).animate({height:vHeight},100)
			$($selectLi).animate({height:"0"},100)
			$($siderbarUl).fadeIn(100)
			$($selectP).hide(100)
			$(this).addClass("title_pic_cur")
		}else if($parent == "title_select ta"){ //默认状态下
			$($siderbarUl).fadeOut(100)
			$($selectLi).show().animate({height:"39px"},100)
			$($select).animate({height:"0"},100)
			$($selectP).show(100)
			$(this).removeClass("title_pic_cur")
			$(this).parent().removeClass("open")
		}else if($parent == "title_select"){
			$($select).animate({height:vHeight},100)
			$($siderbarUl).fadeIn(100)
			$(this).addClass("title_pic_cur")
		}else{
			$($siderbarUl).fadeOut(100)
			$($selectLi).show().animate({height:"39px"},100)
			$($select).animate({height:"0"},100)
			$($selectP).show(100)
			$(this).removeClass("title_pic_cur")
		}
	},function(){
		var $select = $(this).next()
		var $siderbarUl = $(this).next().children()
		var $selectLi = $(this).next().next()
		var $selectP =$(this).next().next().children()
		var vHeight = $($siderbarUl).height() + 10
		var $parent = $(this).parent().attr("class")
		if($parent == "title_selected"){
			$($siderbarUl).fadeOut(100)
			$($selectLi).show().animate({height:"39px"},100)
			$($select).animate({height:"0"},100)
			$($selectP).show(100)
			$(this).removeClass("title_pic_cur")
			$(this).parent().removeClass("open")
		}else if($parent == "title_select"){
			$($siderbarUl).fadeOut(100)
			$($select).animate({height:"0"},100)
			$(this).removeClass("title_pic_cur")
			$(this).parent().removeClass("open")
		}else{
			$($select).animate({height:vHeight},100)
			$($selectLi).animate({height:"0"},100)
			$($siderbarUl).fadeIn(100)
			$($selectP).hide(100)
			$(this).addClass("title_pic_cur")
		}
	})
}



//筛选fixed
$(function(){
	var sbLength = $("#sidebar").size();
	if(sbLength > 0){
		var prevTop = 0;
		var	wTop = 0;
		$(window).scroll(function() {
			//判断上下滚动
			var marginTop = 0;
			var headHeight = $("#header").height() + 20;
			var wHeight = $(window).height();
			var dTop = $(document).scrollTop();
			var dHeight = $(document).height();
			var sbTop = $("#sidebar").offset().top;
			var sbHeight = $("#sidebar").height();
			var sbBottom = wHeight - sbHeight;
			var dbHeight = sbHeight - wHeight;
			var btTop = dHeight - headHeight - sbHeight - 280;
			var btsTop = dHeight - sbBottom - sbHeight - 385;
			var rightList = $("#contianer").height();
			var chunjieTip = $(".fix_box_2").height() + 10;
			
			wTop = $(window).scrollTop();
			if(wTop < prevTop){ //判断小于则为向上滚动
				if(sbHeight + 150 > rightList){ //左侧高度大于右侧高度
						
				}else{
					if(wTop > sbTop){ //划到当中向上划
						$("#sidebar").css({"position":"absolute","top":sbTop});
					}else if(wTop <= sbTop){ //划到顶部
						$("#sidebar").css({"position":"fixed","top":"60px"});
					}
					if(sbTop < headHeight + chunjieTip){ //划到header
						$("#sidebar").css({"position":"relative","top":"0"});
					}
				}
			}else{ //向下滚动
				if(wHeight > sbHeight){ //左侧高度小于屏幕高度
					if(sbHeight + 150 > rightList){ //左侧高度大于右侧高度
						
					}else{
						if(wTop > sbTop){
							$("#sidebar").css({"position":"fixed","top":"10px"});
						}
						if (dTop + 385 >= dHeight - wHeight) { //划到footer
							$("#sidebar").css({"position":"absolute","top": btsTop});
						}
					}
				}else if(wHeight < sbHeight){ //左侧高度大于屏幕高度
					if(sbHeight + 150 > rightList){ //左侧高度大于右侧高度
						
					}else{
						if(wTop < sbTop + dbHeight){ //筛选中间向下划
							$("#sidebar").css({"position":"absolute","top": sbTop});
						}else if(wTop >= sbTop + dbHeight){ //划到筛选底部
							$("#sidebar").css({"position":"fixed","top": -dbHeight});
						}
						if (dTop + 385 >= dHeight - wHeight) { //划到footer
							$("#sidebar").css({"position":"absolute","top": btTop});
						}
					}
				}
			}
			//prevTop = wTop; //IE下有BUG，所以用以下方式
			setTimeout(function(){prevTop = wTop},0);
		});
	}else{
	
	}
});

//获取指定的cookie
function getCookieminiChate(c_name){
　　　　if (document.cookie.length>0){
　　　　　　c_start=document.cookie.indexOf(c_name + "=")
　　　　　　if (c_start!=-1){
　　　　　　　　c_start=c_start + c_name.length+1
　　　　　　　　c_end=document.cookie.indexOf(";",c_start)
　　　　　　　　if (c_end==-1) c_end=document.cookie.length
　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))
　　　　　　}
　　　　}
　　　　return ""
　　}


$(function(){
	//在线咨询
    function backTop(){
        $("body,html").animate({scrollTop:0},200)
        return false;
    }
    $(".scroll_top a, .chat_mini .scroll_m_top").bind("click",function(){backTop();})
	
	//在线咨询超出范围显示返回顶部
	$(window).scroll(function() {
		if($(this).scrollTop() > 200) {
			$(".scroll_m_top").fadeIn(300);
		} else {
			$(".scroll_m_top").fadeOut(300);
		}
	});
})

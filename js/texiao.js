
$(document).ready(function(){
  		$('#touch').mousemove(function(){
  		$('.xinpin').slideDown(200);//可以设置切换时间 
  	});
  		$('#touch').mouseleave(function(){
  		$('.xinpin').slideUp("fast");
  	});
});
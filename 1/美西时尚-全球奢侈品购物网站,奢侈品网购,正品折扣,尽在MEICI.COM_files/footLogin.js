$(document).ready(function(){
	$("#dologin").find('input').each(function(i){
		var currentId = $(this).attr('id');
		$("#"+currentId).blur( function() {
			var currentVal = $.trim($("#"+currentId).val());
			$("#"+currentId).attr("style",'');
			$("#errormsg").html("");
			if(currentVal == ''){
				$("#"+currentId).css("border","1px solid #8E0C3A");
				$("#errormsg").html($("#"+currentId).attr("backText1"));
			}
		});
	})	
})

function checklogin(name){
	var id;
	var num = 0;
	$("#"+name).find('input').each(function(i){
		id = $(this).attr('id');
		if(id !=''){
			switch($("#"+id).attr("texttype")){
				case 'text':
					var input = $.trim($("#"+id).val());
					var regXe = $("#"+id).attr("regXe");
					$("#"+id).attr("style",'');
					if(input == ""){
						$("#errormsg").html($("#"+id).attr("backText1"));
						$("#"+id).css("border","1px solid #8E0C3A");
						num = 1;
						return false;
					}
					if(regXe != "" && typeof(regXe) != 'undefined' && input != ''){
						if(!eval(regXe).test(input)){
							$("#errormsg").html($("#"+id).attr("backText2"));
							$("#"+id).css("border","1px solid #8E0C3A"); 
							num  = 1;
							return false;
						}
					}
				break;		
			}
		}
	})
	if(num == 1){
		return false;
	}else{
		return true;
	}
}

$(function(){
	$.Tipmsg.r=null;
	$.Tipmsg.c=null;
	$(".registerform").Validform({
		tiptype:function(msg){
			$('#regInfo_msg').html(msg);
		},
		showAllErrr:true
	});
	
	$('#username').blur(function(){		
		var u		= $(this).val();
		var m_regx 	= /^(13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9})|\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/	
		if(m_regx.test(u) ){
			$('#regInfo_msg').html('');
		}
		return;
	})
	$('#password').blur(function(){
		var p	= $(this).val();
		var p2  = $('#password2').val();
		if( p != '' && p.length >= 6 ){
			$('#regInfo_msg').html('');
		}
		return;
	})
	$('#password2').blur(function(){
		var p1  = $('#password').val();
		var p2  = $(this).val();
		if( p2 != '' && p1 == p2 ){
			$('#regInfo_msg').html('');
		}
		return;
	})

})
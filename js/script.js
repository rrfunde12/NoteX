var clicked_id = 0;
var solution;

$(document).ready(function() {
    $(function () {
        $(window).scroll(function () {
            var winTop = $(window).scrollTop();
            if (winTop >= 30) {
                $("body").addClass("sticky-header");
            } else {
                $("body").removeClass("sticky-header");
            }//if-else
        });//win func.
        $("#search").keyup(function(event){
            if(event.keyCode == 13){
                $("#searchBtn").click();
            }
        });
     });
});

addCollection = function() {
    var Collection = prompt(" enter new subject name").toLocaleLowerCase();
    if (Collection != null) {
        var url = "http://localhost:8080/NoteX/api";
        var params= "Collection="+Collection + "&req=newCollection";
        ajaxRequest(url,"POST",params,function(){
        	 location.reload();
        });
    }
};

addDocument = function () {
    var title = prompt("Enter topic name");
    var subject = location.search.substr(6);
    if(title != "" && title != null) {
        var URL = "http://localhost:8080/NoteX/api";
        var params = "title=" + subject + "&topic=" + title + "&text=<b></b>&linkText=&req=addDocument";
        ajaxRequest(URL,"POST",params,function() {
            location.reload();
        });
     }
};

removeDocument = function (id, collectionName) {
    var choice = confirm("do you want to confirm");
    if(choice) {
        var url = "http://localhost:8080/NoteX/api";
        var params = "req=removeDocument&id="+ id + "&name="+collectionName;
        ajaxRequest(url,"POST",params,function(){
            location.reload();
        });
    }
};

var Search = function() {
	var query = document.getElementById("search").value;
	var coll = getValueFromParameter("name",location.href);
	if(query != "" && coll != null) {
	   location.href =  location.origin + location.pathname +"?name=" + coll	 +"&q=" + query;
	} else {
		  if(coll ==  null) {
			     alert("choose collection and then search");
		  } else {
			     alert("enter some query");
		 }
	}
}

//	FUNCTION TO CONVERT DIV TO TEXTAREA
function clickEvent(clicked_id1, name1) {
    location.href = "#section" + name1;
    document.getElementById(clicked_id1).style.display = "none";
    var div = document.getElementById(name1);
    name= name1;
    clicked_id = clicked_id1;
    var divData = div.innerHTML;
    div.innerHTML = "";
    var input1 = document.createElement("textarea");
    var button1 = document.createElement("button");
    button1.className="waves-effect waves-light btn";
    button1.innerHTML = "Submit";
    input1.innerHTML = divData;
    input1.maxLength = "5000";
    input1.rows = "40";
    input1.name = "input2";
    div.appendChild(input1);
    div.appendChild(button1);

    tinymce.init({
        selector: "textarea",
        content_css: "css/content.css",
        auto_focus : "input2",
        force_br_newlines : true,
        force_p_newlines : false,
        forced_root_block : false,
        theme_advanced_resizing: true,
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt",
        statusbar: false,
        theme: "modern",
        removed_menuitems: "newdocument strikethrough ",
        plugins: [
            "advlist autolink lists link image  print  ",
            "searchreplace  code fullscreen autoresize",
            " media  save table contextmenu example ",
            "  paste textcolor colorpicker textpattern"
        ],
        toolbar1: "undo redo | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist   ",
        toolbar2: "fontselect fontsizeselect | style-p style-h1 style-h2 style-h3 style-pre style-code | link image | fullscreen",
        menubar: 'edit insert view table ',
        image_advtab: true,
        setup: function (editor) {
            editor.addButton('mybutton', {
                text: 'My button',
                icon: false,
                onclick: function () {
                    editor.insertContent('Main button');
                    editor.body.style.fontSize = '24px';
                }
            });
            editor.on('keydown', function (event) {
                if (event.keyCode == 9) { // tab pressed
                    if (event.shiftKey) {
                        editor.execCommand('Outdent');
                    } else {
                        editor.execCommand('Indent');
                    }
                    event.preventDefault();
                    return false;
                }
            });
         }
    });

    //	BUTTON ONCLICK FOR GET TINYmce CONTENT
    button1.onclick = function(){
        var div=document.getElementById(name);
        var temp=tinyMCE.get('input2').getContent();
        document.getElementById('input2').style.display = "none";
        div.innerHTML=temp;
        document.getElementById(clicked_id).style = "";

        //	SEND DATA TO SERVER
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        var url = "http://localhost:8080/NoteX/api";
        var subject = getParameterByName('name');
        var params= "id="+clicked_id+"&Collection="+subject+"&solution="+encodeURIComponent(temp)+"&req=EditServe";
        ajaxRequest(url,"POST",params);
    }
}

var ajaxRequest = function (url,type,params,callback)
{
    var hr = new XMLHttpRequest();
    hr.open(type, url, true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.onreadystatechange = function() {
        if(hr.readyState == 4 && hr.status == 200) {  // ajax request completed
            var return_data = hr.responseText;
		        if(typeof callback == "function") {
		            callback();
            }
        }
     }
    hr.send(params);
}

function getValueFromParameter( name, url ) {					// from stackoverflow   http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
      if (!url) {
          url = location.href;
      }
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( url );
      return results == null ? null : results[1];
    }

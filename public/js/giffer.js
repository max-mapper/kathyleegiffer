var attachments = [];

$(document).ready(function(){   
	
	if (!FileReader) {
		$('#drop').html('<h1 style="color: white; padding: 10px">You need to upgrade to a browser that implements the HTML5 FileReader API in order to use this</h1>');
	}
	
  function updateListCounts() {
    $("#grid li").each(function() {
      var li = this;
      var count = $('li').index($(li)) + 1;
      $(li).find('.digit').text(count);
    });
  };

	function imagesForUpload() {
		var images = $("#grid ul").sortable('toArray');
		return $.map(images, function(image){
			var item = $("#" + image);
      return {
        "content_type" : item.data('content_type'),
        "data" : item.data('data')
      };			
		});
	}
  
  $('.gifit').live('click', function(){
		$('.sweetgif').html('');
		$(this).hide();
		$('.loader').show();
    $.ajax({
      type: 'POST',
      url: '/gifit',
      data: {upload: imagesForUpload()},
      success: function(data) {
				$('.loader').hide();
				$('.sweetgif').html('<img src="' + data + '"/>');
				$('.gifit').show();
				getDraggy();
      }
    });
  })
  
  $('.zoom-minus').click(function(){
    $('#grid .cell')
      .css('width', $('#grid .cell').width() - 50 + 'px')
      .css('height', $('#grid .cell').height() - 50 + 'px');
  });
  
  $('.zoom-plus').click(function(){
    $('#grid .cell')
      .css('width', $('#grid .cell').width() + 50 + 'px')
      .css('height', $('#grid .cell').height() + 50 + 'px');
  });
  
  function addPhoto(file) {
		var image = file.result;
    var newImg = $('.template:first').clone();
    newImg.find('.image').attr('src', image).removeClass('template');
		newImg.data('data', file.result.split(",")[1]);
		newImg.data('content_type', file.file.type);		
		newImg.attr('id', (((1+Math.random())*0x10000)|0).toString(16).substring(1));
    $("#grid ul").append(newImg);
    newImg.show();
  }

  var getBinaryDataReader, file;
  var SPROINGG = (function() {

    function hasStupidChromeBug() { 
      return typeof(FileReader.prototype.addEventListener) !== "function";
    };

    function isImage(type) { 
      return type === "image/png" || type === "image/jpeg";
    };

    function renderAttachments() { 
      $("#grid ul").html('');
      
      var i, tmp, html = "<ul>";
      for (i = 0; i < attachments.length; i += 1) {
        file = attachments[i];
        addPhoto(file);
      }
      
      $("#grid ul").sortable(
        { opacity: 0.8,
          cursor: 'move',
          update: function() { updateListCounts(); }
        }
      );
      
      updateListCounts();
    };

    function fileLoaded(event) { 
      var file = event.target.file, getBinaryDataReader = new FileReader(); 
      attachments.push(event.target);    
      renderAttachments();
    };

    function drop(e) { 
		  $('.instructions').hide();
      $('.gifit').show();
      var i, len, files, file;

      e.stopPropagation();  
      e.preventDefault();  

      files = e.dataTransfer.files;  

      for (i = 0; i < files.length; i++) {
        file = files[i];

        reader = new FileReader();
        reader.index = i;
        reader.file = file;

        if (!hasStupidChromeBug()) {
          reader.addEventListener("loadend", fileLoaded, false);
        } else {
          reader.onload = fileLoaded;
        }
        reader.readAsDataURL(file);
      }
    };

    function doNothing(e) {  
      e.stopPropagation();  
      e.preventDefault();  
    };
		
		function getDraggy() {
	    document.addEventListener("dragenter", doNothing, false);  
	    document.addEventListener("dragover", doNothing, false);  
	    document.addEventListener("drop", drop, false);			
		}
 
		getDraggy();

  })();
});

// var sick_neon_colors = ["#CB3301", "#FF0066", "#FF6666", "#FEFF99", "#FFFF67", "#CCFF66", "#99FE00", "#EC8EED", "#FF99CB", "#FE349A", "#CC99FE", "#6599FF", "#03CDFF", "#FFFFFF"];
// 
// function randomColor(colors) {
//   return colors[Math.floor(Math.random()*colors.length)];
// };
// 
// $('#getcrazy').click(function() {
//   $(this).text('GET CRAZY AGAIN');
//   var i = 0;
//   for (i=0;i<=20;i++) {
//     setTimeout( function(){
//       $('#content').css('background-color', randomColor(sick_neon_colors));
//       $('body').css('background-color', randomColor(sick_neon_colors));
//     }, i*100 );
//   }
//   return false;
// });
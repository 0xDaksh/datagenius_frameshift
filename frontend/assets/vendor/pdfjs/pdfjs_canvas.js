window.apiurl = `https://ad8a2c89.ngrok.io`;
var __PDF_DOC,
	__CURRENT_PAGE,
	__PAGE_RENDERING_IN_PROGRESS = 0,
	__CANVAS = $('#mycanvas').get(0),
	__CANVAS_CTX = __CANVAS.getContext('2d');

function showPDF(pdf_url, pageno) {
	PDFJS.getDocument({ url: pdf_url }).then(function(pdf_doc) {
		__PDF_DOC = pdf_doc;
		// Show the first page
		console.log(pageno);

		showPage(parseInt(pageno));
	}).catch(function(error) {
		// If error re-show the upload button
		//$("#upload-button").show();
		alert(error.message);
	});;
}

function showPage(page_no) {
	__PAGE_RENDERING_IN_PROGRESS = 1;
	__CURRENT_PAGE = page_no;
	// While page is being rendered hide the canvas and show a loading message
	$("#mycanvas").hide();

	// Fetch the page
	__PDF_DOC.getPage(page_no).then(function(page) {
		// As the canvas is of a fixed width we need to set the scale of the viewport accordingly
		var scale_required = __CANVAS.width / page.getViewport(1).width;
		scale_required=(scale_required>1) ? scale_required : 1;
		// Get viewport of the page at required scale
		var viewport = page.getViewport(scale_required);
		// Set canvas height
		__CANVAS.height = viewport.height;
		__CANVAS.width = viewport.width;
		canvas_width=viewport.width;
		canvas_height=__CANVAS.height
		selection_canvaselement[0].width=viewport.width;
		selection_canvaselement[0].height=viewport.height;
		var renderContext = {
			canvasContext: __CANVAS_CTX,
			viewport: viewport
		};
		newcanv.setDimensions({width:canvas_width, height:canvas_height});
		// Render the page contents in the canvas
		page.render(renderContext).then(function() {
			__PAGE_RENDERING_IN_PROGRESS = 0;
			// Show the canvas and hide the page loader
			$("#mycanvas").show();
		});
	});	
}

// Upon click this should should trigger click on the #file-to-upload file input element
// This is better than showing the not-good-looking file input element
$("#upload-button").on('click', function() {
	$("#file-to-upload").trigger('click');
});

// When user chooses a PDF file
$("#file-to-upload").on('change', function() {
	// Validate whether PDF

	// Send the object url of the pdf
	
		if(['application/pdf'].indexOf($("#file-to-upload").get(0).files[0].type) == -1) {
	        alert('Error : Not a PDF');
	        return;
	    }

		//$("#upload-button").hide();
		showPDF(URL.createObjectURL($("#file-to-upload").get(0).files[0]), $('#pdfpageno').val());	

});

function loadnewpage(){
	$('#main_data_table > tr').each(function(){
		$(this).find('.chkbox').prop('checked', true);
		$(this).find('.chkbox').addClass('active-selection');
		upd_coordfunc(0, 0, 0, 0);
		remove_object(newcanv, $(this).find('#removebtn'));
		$(this).find('.chkbox').prop('checked', false);
		$(this).find('.chkbox').removeClass('active-selection');
	});
	$('#items_total_region_table > tr').each(function(){
		$(this).find('.chkbox').prop('checked', true);
		$(this).find('.chkbox').addClass('active-selection');
		upd_coordfunc(0, 0, 0, 0);
		remove_object(newcanv, $(this).find('#removebtn'));
		$(this).find('.chkbox').prop('checked', false);
		$(this).find('.chkbox').removeClass('active-selection');
	});
	$('#items_data_table > tr').each(function(){
		$(this).find('.chkbox').prop('checked', true);
		$(this).find('.chkbox').addClass('active-selection');
		upd_coordfunc(0, 0, 0, 0);
		remove_object(newcanv, $(this).find('#removebtn'));
		$(this).find('.chkbox').prop('checked', false);
		$(this).find('.chkbox').removeClass('active-selection');
	});
	if($("#file-to-upload").get(0).files[0]==undefined){
		showPDF(templatepdfurl, $('#pdfpageno').val());
	}else{
		showPDF(URL.createObjectURL($("#file-to-upload").get(0).files[0]), $('#pdfpageno').val());	
	}
	load_template_data($('#templatename').val(), $('#pdfpageno').val());
	
	
}
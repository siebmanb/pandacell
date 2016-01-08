/**
 * Defining variables
 */
var x1 = null;
var y1 = null;
var count = 0;
var MIN_LENGTH = 3;
var MAX_LENGTH = 60;
var cells = [];
var points = [];
var saved = true;
var lastCell = null;
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

/**
 * Entry point for the application
 */
$( document ).ready(function() {
	// click on a filename
	$('#cells li').on('click', function() {
		openImage($(this));
	});

	// click on an image
	$('#canvas').on('click', function(e) {
		drawPoint(e);
	});

	// key was pressed
	$(document).keypress(function(e) {
		keyPressed(e);
	});

	// click on submit button, or save button in modal
	$('#submit,#saveBeforeClose').on('click', function() {
		generateCSV();
	});

	// click on ignore button in modal
	$('#ignoreSave').on('click', function() {
		ignoreSave();
	});

	// click on cancel button
	$('#cancel').on('click', function() {
		cancelLine();
	});

	// click on next image button in modal
	$('#nextImage').on('click', function() {
		location.reload();
	});
});

/********************************************************************************
 *********************************** CANVAS ************************************* 
 ********************************************************************************/
/**
 * Drawing a point on the canvas
 */
function drawPoint(e) {
	count++;

	// this is the first point, no need to draw a line
	if (x1 == null && y1 == null) {
		x1 = e.offsetX;
		y1 = e.offsetY;
		return;
	}

	// their was a point before, we draw a line
	drawLine(x1,y1,e.offsetX,e.offsetY,true);
	x1 = e.offsetX;
	y1 = e.offsetY;
}

/**
 * Drawing a line on the canvas
 */
function drawLine(x1,y1,x2,y2,push) {
	// drawing on the canvas
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'red';
	ctx.stroke();
	
	// saving the points
	// we actually store coordinates
	// one after another
	// TODO: use a better data structure
	if (push) {
		points.push(x1);
		points.push(y1);
		points.push(x2);
		points.push(y2);
	}
}

/**
 * Redraw the entire canvas and lines
 */
function redrawCanvas() {
	clearCanvas();
	
	// looping through the points
	// four by four (a line is 2 points hence 4 coordinates)
	for (var i = 0 ; i < points.length ; i = i + 4) {
		drawLine(points[i],points[i+1],points[i+2],points[i+3],false);
	}
}

/**
 * Clearing a canvas by removing every objects
 */
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Cancel a line on the image
 */
function cancelLine() {
	// removing as many points as the line length + 1
	for (var i = 0 ; i < lastCell + 1 ; i++) {
		points.pop();
		points.pop();
	}
	redrawCanvas();
	decrementCount(lastCell);
	updateResult();
}

/********************************************************************************
 ************************************** POINTS ********************************** 
 ********************************************************************************/
/**
 * Adding a line to the results
 */
function incrementCount(count) {
	saved = false;

	// line length is above the rule
	if (count > MAX_LENGTH) {
		alert("this chain is too long, it was not expected");
		return;
	}

	// this is the first line of this length
	if (cells[count] == undefined) {
		cells[count] = 1;
	} else {
		cells[count] = cells[count] + 1;
	}
	lastCell = count;
	$('#cancel').removeClass('disabled');
}

/**
 * Removing a line from tje results
 */
function decrementCount(count) {
	cells[count] = cells[count] - 1;
	
	// we can't remove another line, hence disabling
	// the cancel button
	// TODO: allow multiple deletion
	$('#cancel').addClass('disabled');
}

/********************************************************************************
 *********************************** RESULTS ************************************ 
 ********************************************************************************/
/**
 * Update the results displayed
 */
function updateResult() {
	var str = "";
	
	// building the list of occurences
	// TODO: move html out of javascript into templating variables
	for (var i = MIN_LENGTH ; i < MAX_LENGTH ; i++) {
		str += i + " cells " + (cells[i] == undefined || cells[i] == 0 ? '<span class="label label-info">0 times</span>' : '<span class="label label-success">' + cells[i] + ' times</span>') + "<br>";
	}

	$('#results .panel-body').html(str);
	$('#results,#submit,#cancel').show();
}

/**
 * A key was pressed
 */
function keyPressed(e) {
	// Enter key, we finish a line and save the results
	// TODO: listen for another buttons to save, cancel...
	if(e.which == 13) {
		x1 = null;
		y1 = null;
		incrementCount(count);
		updateResult();
		count = 0;
	}
}

/**
 * User does not want to save the results
 */
function ignoreSave() {
	resetValues();
	closeImage();
}

/**
 * Resetting the values to open a new image
 */
function resetValues() {
	x1 = null;
	y1 = null;
	count = 0;
	cells = [];
	points = [];
	lastCell = null;
	saved = true;
	$('#results,#submit,#submit').hide();
	$('h4').html('');
}

/********************************************************************************
 *********************************** IMAGE ************************************** 
 ********************************************************************************/
/**
 * Open an image
 */
function openImage(li) {
	// the image has not been saved yet
	if (!saved) {
		$('#modalUnsaved').modal('show');
		return;
	}

	// resetting all the values to start fresh
	resetValues();

	// setting the size of the canvas to match the image size
	// warning: using attr() is important, width() or height() won't work
	// because it will cause the canvas to have a wrong resolution
	$('#preview img').one("load", function() {
		$("#canvas").attr("width", $('#preview img').width() + "px");
		$("#canvas").attr("height", $('#preview img').height() + "px");
	});

	// saving the filename, displaying it and displaying the image
	var folderAndFile = li.attr('data-folder') + '/' + li.attr('data-file');
	$('#preview img').attr('src',"cells/" + folderAndFile);
	$('#filename').val(li.attr('data-file'));
	$('h4').html(folderAndFile);
}

/**
 * Closing an opened image
 */
function closeImage() {
	$('#preview img').attr('src','');
	clearCanvas();
}

/********************************************************************************
 ************************************** CSV ************************************* 
 ********************************************************************************/
/**
 * Get the content of the CSV file to be generated
 */
function getCSVContent() {
	// building file line by line
	var str = "Longueur;Occurences\n";
	for (var i = MIN_LENGTH ; i < MAX_LENGTH ; i++) {
		str += i + ";" + (cells[i] == undefined ? 0 : cells[i]) + "\n";
	}
	return str;
}

/**
 * Generate a CSV file
 */
function generateCSV() {
	$.ajax({
		type: "POST",
		url: "create-csv.php",
		data: {
			content: getCSVContent(),
			file: $('#filename').val()
		},
		success: function() {
			// TODO: move html out of javascript into templating variables
			$('#modalConfirm .modal-body').html("<img src='img/logo.png'>CSV file generated.");
			$('#modalConfirm').modal('show');
			saved = true;
		},
		error: function() {
			// TODO: move html out of javascript into templating variables
			$('#modalConfirm .modal-body').html("<img src='img/logo.png'>An error occured during CSV file generation. Sorry. Here is the CSV file content, save it yourself before it is too late:<br><textarea>" + getCSVContent() + "</textarea>");
			$('#modalConfirm').modal('show');
		}
	});
}
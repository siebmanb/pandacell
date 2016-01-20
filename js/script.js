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
var currentColor = 0;
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

/**
 * Entry point for the application
 */
$( document ).ready(function() {
	// click on a filename
	$('#cells li[data-folder]').on('click', function() {
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
		cancelChain();
	});

	// click on next image button in modal
	$('#nextImage').on('click', function(e) {
		prepareForNextImage(e);
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
	ctx.strokeStyle = getRedShades();
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
 * Returns a new shade of red
 */
function getRedShades() {
	var colors = ['chocolate','coral','crimson','darkorange','darksalmon','firebrick','hotpink','indianred','marron','mediumvioletred','orangered','red'];
	currentColor++;
	return colors[currentColor % colors.length];
}

/**
 * Redraw the entire canvas and lines
 */
function redrawCanvas() {
	clearCanvas();

	// looping through the points
	// four by four (a line is 2 points hence 4 coordinates)
	for (var i = 0 ; i < points.length ; i++) {
		// if we don't hit a marker, we draw the line
		// if we did, i will be incremented, we do nothing more
		if (points[i] != -1) {
			drawLine(points[i],points[i+1],points[i+2],points[i+3],false);
			i = i + 3;
		}
	}
}

/**
 * Clearing a canvas by removing every objects
 */
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Cancel a chain on the image
 * TODO: improve to avoid change in red shades
 */
function cancelChain() {
	var bool = true;

	// removing potential chain marker to initiate batch remove
	if (points[points.length - 1] == -1) points.pop(); 
	while (bool) { 
		// if we hit a marker or array is empty, we stop
		if (points[points.length - 1] == -1 || points.length == 0) {
			break;
		};

		// poping out a point (2 coordinates)
		points.pop();
		points.pop();
	}

	redrawCanvas();
	recomputeCount();
	updateResult();

	// re-init
	x1 = null;
	y1 = null;
	count = 0;
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
}

/**
 * Removing a line from tje results
 */
function decrementCount(count) {
	cells[count] = cells[count] - 1;
}

/**
 * Recomputes the count after canceling a point
 * TODO: improve to avoid complete recomputation
 */
function recomputeCount() {
	cells = [];
	var count = 0;
	for (var i = 0 ; i < points.length ; i++) {
		// end of chain
		if (points[i] == -1) {
			// how many times do we have 4 coordinates (2 points)
			// this is how many lines we have, then we have one more points
			// than we have lines
			incrementCount(count/4  + 1);
			count = 0;
			continue;
		}
		count++;
	}
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
		points.push(-1); // storing special value to specify line end
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
	saved = true;
	$('#results,#submit,#cancel').hide();
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
	var folderAndFile = li.attr('data-folder') + li.attr('data-file');
	$('#preview img').attr('src',"cells/" + folderAndFile);
	$('#filename').val(li.attr('data-file'));
	$('#dir').val(li.attr('data-folder'));
	$('h4').html(folderAndFile);
}

/**
 * Closing an opened image
 */
function closeImage() {
	$('#preview img').attr('src','');
	clearCanvas();
}

/**
 * Prepare the interface for the next image
 */
function prepareForNextImage(e) {
	// resetting the view
	closeImage();
	resetValues();

	// hide the modal
	$('#modalConfirm').modal('hide');

	// updating the status of the current image in the menu
	var dir = $('#dir').val();
	var filename = $('#filename').val();
	var selector = '#cells li[data-folder="' + dir + '"][data-file="' + filename + '"]';
	$(selector).html("<a><span class='glyphicon glyphicon-check'></span>&nbsp;<small>" + dir + "</small>" + filename + "</a>");
	$(selector).addClass('alert-success');
	
	// opening the menu
	e.stopPropagation();
	$('#cells').dropdown('toggle');
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
			file: $('#filename').val(),
			dir: $('#dir').val()
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
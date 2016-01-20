<?php include "functions.php"; ?>
<!DOCTYPE html>
<html>
<head>
<title>PandaCell</title>
<meta charset="utf-8">
<link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="css/bootstrap-theme.min.css">
<link rel="stylesheet" type="text/css" href="css/style.css"
	media="screen">
</head>
<body>
	<div class="dropdown" id="list">
		<button class="btn btn-primary dropdown-toggle" id="openDropDown" data-toggle="dropdown">
			Files <span class="caret"></span>
		</button>
		<h4></h4>
		
		<ul class="dropdown-menu" id="cells">
		    <?php echo generateListFiles('cells','cells'); ?>
		  </ul>
	</div>

	<!-- Preview of the image -->
	<div id="preview">
		<img>
		<canvas id="canvas"></canvas>
	</div>

	<!-- Results -->
	<div class="panel panel-primary text-center" id="results">
		<div class="panel-heading">
			<h3 class="panel-title">Results</h3>
		</div>
		<div class="panel-body"></div>
	</div>
	<div class="btn btn-primary" id="submit">Submit</div>
	<div class="btn btn-default" id="cancel">Cancel last chain</div>
	<input type="hidden" id="filename">
	<input type="hidden" id="scrollTop">
	<input type="hidden" id="dir">

	<!-- Modal -->
	<div class="modal fade" tabindex="-1" role="dialog" id="modalConfirm">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">Confirmation</h4>
				</div>
				<div class="modal-body text-center"></div>
				<div class="modal-footer">
					<button class="btn btn-primary" id="nextImage">Next picture</button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" tabindex="-1" role="dialog" id="modalUnsaved">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">Warning</h4>
				</div>
				<div class="modal-body text-center"><img src='img/logo.png'>Progress has not been saved!</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal" id="ignoreSave">Ignore</button>
					<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveBeforeClose">Save</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Scripts -->
	<script src="js/jquery.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script language="javascript" src="js/script.js"></script>
</body>
</html>
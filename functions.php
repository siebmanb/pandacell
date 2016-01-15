<?php
// creates the CSV file
function createCSV($contentP, $fileP, $dirP) {
	/* Creates if needed the folders */
	mkdir ( 'csv/' . $dirP, 0777, true );
	
	/* Creates a CSV file based on the content and name given */
	$filename = 'csv/' . $dirP . $fileP . '.csv';
	$file = fopen ( $filename, "w" );
	file_put_contents ( $filename, $contentP );
	http_response_code ( 200 );
}

// treats a file from the loop in the picture folder
function treatFile($path) {
	$filename = basename ( $path );
	$dir = substr ( $path, 0, strlen ( $path ) - strlen ( $filename ) );
	
	if ($filename != '.' && $filename != '..' && $filename != '.DS_Store') {
		// if CSV file exists, we mark it has done
		if (file_exists ( 'csv/' . $dir . $filename . '.csv' )) {
			return "<li class='alert-success' data-folder='" . $dir . "' data-file='" . $filename . "'><a><span class='glyphicon glyphicon-check'></span>&nbsp;<small>" . $dir . "</small>" . $filename . "</a></li>";
		} else {
			return "<li data-folder='" . $dir . "' data-file='" . $filename . "'><a><small>" . $dir . "</small>" . $filename . "</a></li>";
		}
	}
}

// loops into the pictures folder
// Source: http://stackoverflow.com/questions/24783862/list-all-the-files-and-folders-in-a-directory-with-php-recursive-function
function generateListFiles($dir, $basedir) {
	$str = '';
	$files = scandir ( $dir );
	
	foreach ( $files as $key => $value ) {
		if ($value == '.' || $value == '..' || $value == '.DS_Store')
			continue;
		$path = realpath ( $dir . DIRECTORY_SEPARATOR . $value );
		if (! is_dir ( $path )) {
			$str .= treatFile ( substr ( $path, strlen ( realpath ( "" ) . '/' . $basedir . '/' ) ) );
		} else if ($value != "." && $value != "..") {
			generateListFiles ( $path, $basedir );
		}
	}
	
	echo $str;
}
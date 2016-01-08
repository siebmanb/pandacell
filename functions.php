<?php
function createCSV($contentP, $fileP) {
	/* Creates a CSV file based on the content and name given */
	$filename = 'csv/' . $fileP . '.csv';
	$file = fopen ( $filename, "w" );
	file_put_contents ( $filename, $contentP );
	http_response_code ( 200 );
}

function generateListFiles() {
	$dir = 'cells';
	$str = '';
	$dh = opendir ( $dir );
	// looping on the folders
	while ( false !== ($subdir = readdir ( $dh )) ) {
		if ($subdir != '.' && $subdir != '..' && $subdir != '.DS_Store' && $subdir != 'results') {
			$str .= "<li class='dropdown-header'>" . $subdir . "</li>";
			$subdirh = opendir ( 'cells/' . $subdir );
	
			// looping on files in subfolders
			while ( false !== ($filename = readdir ( $subdirh )) ) {
				if ($filename != '.' && $filename != '..' && $filename != '.DS_Store') {
					// if CSV file exists, we mark it has done
					if (file_exists ( 'csv/' . $filename . '.csv' )) {
						$str .= "<li class='alert-success' data-folder='" . $subdir . "' data-file='" . $filename . "'><a><span class='glyphicon glyphicon-check'></span>&nbsp;" . $filename . "</a></li>";
					} else {
						$str .= "<li data-folder='" . $subdir . "' data-file='" . $filename . "'><a>" . $filename . "</a></li>";
					}
				}
			}
		}
	}
	return $str;
}
?>
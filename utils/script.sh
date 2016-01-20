#!/bin/bash
#script to convert tif to jpg in batch

total=$(find $1 -name "*.tif" | wc -l)
echo "Total images: " $total
count=1

find $1 -name "*.tif" -print|while read fname; do
	echo $count/$total
	echo "$fname"
	/opt/ImageMagick/bin/convert "$fname" -resize 2000 "$fname.jpg"
	count=$[$count +1]
  	rm  "$fname"
done

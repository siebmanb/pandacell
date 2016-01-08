# PandaCell

PandaCell is a small webapp that allows you to easily count objects chains lengths. The tool was created to help my wife with her thesis where she took hundreds of pictures from microscope views of cells forming chains. She needed to compare chains length in different scenarii.

![Screenshot](http://siebmanb.com/pandacell/img/screenshot.png)

### How-to
* Upload the archive to your remote server (also works locally with an Apache server)
* Place your images in folders, directly in the "cells" folder under the root. The tool currently does not support files directly in the folder, or in susub folders.
* Load the app.
* Choose a file in the dropdown menu. Files are organized under their folder name, and become green when treated.
* Start clicking on each node of your chain. When a chain is complete, press the "Enter" key to complete the chain. The "Results" menu appears, and updates in real-time.
* Hit the "Cancel" button to cancel the last chain. At the moment, you cannot cancel older chains.
* When you are finished, hit the "Submit" button. A CSV file is generated in the "csv" folder with a name based on the image name.

### Licence

MIT Licence, see http://choosealicense.com/licenses/ for details.

### Contributions
All contributions are very welcome! Create a pull-request to submit one.


LIBRARY_NAME = powerbuttons

current_dir = $(notdir $(shell pwd))
LIBRARY_NAME := $(if $(LIBRARY_NAME),$(LIBRARY_NAME),$(current_dir))
DIST_FOLDER := $(if $(DIST_FOLDER),$(DIST_FOLDER),dist)
FILENAME = $(DIST_FOLDER)/$(LIBRARY_NAME)

PRE = 
POST = 
FILES = js/init.js js/utils.js js/dialoglegacy.js js/dialog.js js/dialogutils.js js/powerbuttons.js js/actions.js js/plugins/*.js

build: rawfile
	mkdir -p $(DIST_FOLDER)
	cat $(FILENAME).raw.js | uglifyjs -e window,document:window,document | js-beautify -t -s 1 -m 1 -j -n | cat notice - > $(FILENAME).full.js
	cat $(FILENAME).raw.js | uglifyjs -e window,document:window,document -b | js-beautify -t -s 1 -m 1 -j -n | cat notice - > $(FILENAME).js
	cat $(FILENAME).raw.js | uglifyjs -e window,document:window,document --toplevel --module -m | cat notice.min - > $(FILENAME).min.js
	cat $(FILENAME).raw.js | uglifyjs -e window,document:window,document --compress passes=3,dead_code=true,toplevel=true --toplevel --module -m -- | cat notice.min - > $(FILENAME).compress.js

rawfile: $(FILES) $(PRE) $(POST)
	mkdir -p $(DIST_FOLDER)
	cat $(PRE) $(FILES) $(POST) > $(FILENAME).raw.js

clean:
	rm -f $(FILENAME).raw.js $(FILENAME).full.js $(FILENAME).min.js $(FILENAME).js $(FILENAME).compress.js
	if [ -d $(DIST_FOLDER) ] && [ -z "$(ls -A $(DIST_FOLDER))" ]; then rm -r $(DIST_FOLDER); fi
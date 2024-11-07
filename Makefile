# Name of the library (if not specified, the name of the current folder will be used)
LIBRARY_NAME = powerbuttons
# The files that compose your library (if not specified, all the .js files in the src folder will be used)
FILES = src/init.js src/utils.js src/dialoglegacy.js src/dialog.js src/dialogutils.js src/powerbuttons.js src/actions.js src/plugins/*.js
# Folder in which the build files will be located (if not specified, the folder "dist" will be used)
DIST_FOLDER =
# Dependencies of your library (if not specified, no dependencies will be used)
DEPENDS =
# Folder in which the dependencies are located
DEPENDS_FOLDER = ./depends
# Files to include before the source files (it is a js file that will be included before the source files)
#	* In most cases, this is not needed, but it is useful for libraries that need to be initialized
PRE = 
# Files to include after the source files
#	* In most cases, this is not needed, but it is useful for libraries that need an epilogue
POST = 

#####################################################################################
# Handle with care from here
#####################################################################################

# Get the current folder name
current_dir = $(notdir $(shell pwd))
# If LIBRARY_NAME is not specified, use the current folder name
LIBRARY_NAME := $(if $(LIBRARY_NAME),$(LIBRARY_NAME),$(current_dir))
# Folder in which the build files will be located
DIST_FOLDER := $(if $(DIST_FOLDER),$(DIST_FOLDER),dist)
# The name of the build files
FILEPATH = $(DIST_FOLDER)/$(LIBRARY_NAME)
FILENAME := $(notdir $(FILEPATH))

# Files of the dependencies to include in the build
DEP_FILES = $(foreach fd, $(DEPENDS), $(DEPENDS_FOLDER)/$(fd)/dist/$(fd).module.js)

# The version of this library (this is intended to track the version of this template)
MAKEFILE_VERSION = 1.1.0

RESULT_FILES = $(FILEPATH).full.js $(FILEPATH).min.js $(FILEPATH).js $(FILEPATH).compress.js $(FILEPATH).module.js

INPUT_FILES = $(FILEPATH).raw.js $(DEP_FILES)

all: $(RESULT_FILES)

module: $(FILEPATH).module.js

clean:
	rm -f $(RESULT_FILES)
	if [ -d $(DIST_FOLDER) ] && [ -z "$(ls -A $(DIST_FOLDER))" ]; then rm -r $(DIST_FOLDER); fi

cleanall: clean
	for fd in $(DEPENDS); do $(MAKE) -C $(DEPENDS_FOLDER)/$$fd clean; done

depends: $(DEP_FILES)

$(FILEPATH).full.js: $(FILEPATH).raw.js
	@mkdir -p $(DIST_FOLDER)
	cat $(FILEPATH).raw.js | uglifyjs -e exports:window | js-beautify -t -s 1 -m 1 -j -n | cat notice - > $(FILEPATH).full.js

$(FILEPATH).js:	$(FILEPATH).raw.js
	@mkdir -p $(DIST_FOLDER)
	cat $(FILEPATH).raw.js | uglifyjs -e exports:window -b | js-beautify -t -s 1 -m 1 -j -n | cat notice - > $(FILEPATH).js

$(FILEPATH).min.js: $(FILEPATH).js
	@mkdir -p $(DIST_FOLDER)
	cd $(DIST_FOLDER) && uglifyjs $(FILENAME).js --toplevel --module -m --source-map "filename='$(FILENAME).min.js.map',includeSources=true" -o $(FILENAME).min.js

$(FILEPATH).compress.js: $(FILEPATH).js
	@mkdir -p $(DIST_FOLDER)
	cd $(DIST_FOLDER) && uglifyjs $(FILENAME).js --compress passes=3,dead_code=true,toplevel=true --toplevel --module -m --source-map "filename='$(FILENAME).compress.js.map',includeSources=true" -o $(FILENAME).compress.js

$(FILEPATH).module.js: $(FILEPATH).raw.js
	@mkdir -p $(DIST_FOLDER)
	( cat notice; echo 'if (typeof imports === "undefined") { var imports = {}; }' ; cat $(FILEPATH).raw.js | uglifyjs -e exports:imports | js-beautify -t -s 1 -m 1 -j -n ) > $(FILEPATH).module.js

%.module.js:
	$(MAKE) -C $(dir $(@D)) module

%.raw.js: $(FILES) $(PRE) $(POST) $(DEP_FILES)
	@mkdir -p $(DIST_FOLDER)
	cat $(DEP_FILES) $(PRE) $(FILES) $(POST) > $(FILEPATH).raw.js

################################################################################
# CHANGELOG
################################################################################
#
# 1.2.0
#	* Add different variables for FILENAME and FILEPATH to avoid problems with the path
#	* Change the creation of the raw file to use the dependencies as a prerequisite and create a true raw file
#	* Add the creation of map source files for the minified and compressed versions
#
# ----------------------------------------------------------------
#
# 1.1.0
#	* Reorder the parameters of the Makefile.
#	* Add targets to build the files by their name so that "make" checks if the 
#     files are up to date, to avoid rebuilding if not needed.
#
# ----------------------------------------------------------------
# 1.0.0
#	* Initial version
#
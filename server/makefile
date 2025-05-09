all: clean build

build: 
	@echo 'removing build dir..'
	npx  del-cli ./build
	@echo 'building app...'
	npx tsc

clean: 
	@echo 'removing build dir..'
	npx del-cli ./build

# copy:
# 	@echo 'copying views to build dir'
# 	cp -r ./views ./build/views
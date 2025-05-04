all: build2
cpanel: clean build copy
# render: clean build2 copy2
local: build
# .DEFAULT_GOAL:=build
# .PHONY: build copy 
# variable
B= npm

build: 
	@echo 'removing build dir..'
	npx  del-cli ./build
	@echo 'building app...'
	npx tsc

build2: 
	@echo 'removing build dir..'
	npx del-cli ./build
	@echo 'building app...'
	npx tsc

clean:
	@echo 'removing deploy dir..'
	npx  del-cli ./deploy

dev:
	@echo 'starting dev server'
	${B} run dev

copy:
	@echo 'making deploy dir...'
	mkdir deploy
	@echo 'copying build dir to deploy dir...'
	xcopy /E /I "C:\Users\Imrany\Desktop\Dev\villebiz\server\build" "C:\Users\Imrany\Desktop\Dev\villebiz\server\deploy\build"
	@echo 'copying public dir to deploy dir...'
	xcopy /E /I "C:\Users\Imrany\Desktop\Dev\villebiz\server\public" "C:\Users\Imrany\Desktop\Dev\villebiz\server\deploy\public"
	@echo 'copying views to deploy dir'
	xcopy /E /I "C:\Users\Imrany\Desktop\Dev\villebiz\server\views" "C:\Users\Imrany\Desktop\Dev\villebiz\server\deploy\views"
	@echo 'copying package.json to deploy dir'
	xcopy "C:\Users\Imrany\Desktop\Dev\villebiz\server\package.json" "C:\Users\Imrany\Desktop\Dev\villebiz\server\deploy"
	@echo 'removing build dir..'
	npx  del-cli ./build

copy2:
	@echo 'making deploy dir...'
	mkdir -p deploy
	@echo 'copying build dir to deploy dir...'
	cp -r ./build ./deploy/build
	@echo 'copying public dir to deploy dir...'
	cp -r ./public ./deploy/public
	@echo 'copying views to deploy dir'
	cp -r ./views ./deploy/views
	@echo 'copying package.json to deploy dir'
	cp ./package.json ./deploy
	@echo 'removing build dir..'
	npx del-cli ./build

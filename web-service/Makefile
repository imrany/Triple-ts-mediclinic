all: build run
dev: build ensure-compile-daemon watch

build:
	go build -o web-service main.go

run:
	./web-service

watch: 
	ensure-compile-daemon
	CompileDaemon --command="./web-service"

ensure-compile-daemon:
	@which go > /dev/null || (echo "Error: Go is not installed or not in PATH" && exit 1)
	@which CompileDaemon > /dev/null || (echo "Installing CompileDaemon..." && go install github.com/githubnemo/CompileDaemon@latest)

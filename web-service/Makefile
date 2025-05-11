build:
    go build -o web-service main.go

run: build
    ./web-service

watch: ensure-compile-daemon
    CompileDaemon --command="./web-service"

ensure-compile-daemon:
    @which CompileDaemon > /dev/null || go install github.com/githubnemo/CompileDaemon@latest
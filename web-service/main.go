package main

import (
    "log"
    "os"
    "os/signal"
    "syscall"

    "web-service/database"
    "web-service/config"
    "web-service/internal/router"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/gofiber/fiber/v2/middleware/cors"
)


func main() {
	// Database connection
	database.Connect()
    app := fiber.New()

    // Middleware configuration
    app.Use(logger.New())
    app.Use(cors.New(cors.Config{
        AllowOrigins: "http://localhost:3000, https://triple-ts-mediclinic.com, https://www.triple-ts-mediclinic.com",
        AllowMethods: "GET,POST,PUT,DELETE,PATCH",
        AllowHeaders: "Origin, Content-Type, Accept, Authorization",
    }))

    // Routes
	router.SetupRoutes(app)

    // Graceful shutdown handling
    go func() {
        port := config.GetVal("PORT")
        if port == "" {
            port = "8000"
        }
        if err := app.Listen("0.0.0.0:" + port); err != nil {
            log.Fatalf("Server error: %v\n", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
    <-quit

    log.Println("Shutting down server...")
    if err := app.Shutdown(); err != nil {
        log.Fatalf("Error shutting down: %v\n", err)
    }
}
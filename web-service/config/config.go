package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

// GetVal retrieves environment variable, attempting multiple .env file locations
func GetVal(key string) string {
    // Try loading local .env file first
    err := godotenv.Load(".env")
    if err != nil {
        log.Printf("Error loading .env file: %v", err)
        
        // If local fails, try loading from /app/.env
        err = godotenv.Load("/app/.env")
        if err != nil {
            log.Printf("Error loading /app/.env file: %v", err)
            return "" 
        }
    }
    // Return the value of the variable
    return os.Getenv(key)
}

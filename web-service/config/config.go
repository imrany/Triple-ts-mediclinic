package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

// GetVal func to get env value
func GetVal(key string) string {
    // load .env file
    err := godotenv.Load(".env")
    if err != nil {
		log.Printf("Error loading .env file: %v", err)
		return ""
	}
    // Return the value of the variable
    return os.Getenv(key)
}
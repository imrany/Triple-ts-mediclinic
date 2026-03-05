package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetVal(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Printf("No .env file found, using environment variables")
	}
	return os.Getenv(key)
}

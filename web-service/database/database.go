package database
import (
    "context"
    "log"

    "web-service/config"
    "github.com/jackc/pgx/v5/pgxpool"
)

var db *pgxpool.Pool

func Connect() {
	dsn := config.GetVal("DATABASE_URL")
    if dsn == "" {
        log.Fatal("DATABASE_URL not defined. Set it in the environment variables.")
    }

    // Connect to PostgreSQL
    var err error
    db, err = pgxpool.New(context.Background(), dsn)
    if err != nil {
        log.Fatalf("Error connecting to database: %v\n", err)
    }
    // defer db.Close()

    log.Println("Connected to PostgreSQL", db)
}

func GetDB() *pgxpool.Pool {
	if db == nil {
		log.Fatal("Database connection is not established. Call Connect() first.")
	}
	return db
}
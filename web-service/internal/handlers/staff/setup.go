package staff

import (
        "context"
        "log"
        "time"
        "fmt"

        "web-service/database"
        "golang.org/x/crypto/bcrypt"
)

func EnsureAdminExists() {
        db := database.GetDB()
        var count int
        err := db.QueryRow(context.Background(), "SELECT COUNT(*) FROM staff").Scan(&count)
        if err != nil {
                log.Printf("Error checking staff count: %v", err)
                return
        }

        if count == 0 {
                log.Println("No staff found. Creating default admin account...")
                
                hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
                
                adminID := "admin001"
                firstName := "System"
                lastName := "Administrator"
                email := "admin@clinic.com"
                phone := "0700000000"
                role := "admin"
                dept := "IT"
                spec := "System Management"
                status := "active"
                now := time.Now()
                dob, _ := time.Parse("2006-01-02", "1990-01-01")

                _, err = db.Exec(context.Background(), 
                        `INSERT INTO staff (
                                id, first_name, last_name, phone_number, date_of_birth, 
                                national_id, address, department, specialty, start_date, 
                                status, role, password, email, created_at, updated_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
                        adminID, firstName, lastName, phone, dob, 
                        0, "Nairobi", dept, spec, now, 
                        status, role, string(hashedPassword), email, now, now,
                )
                if err != nil {
                        log.Printf("Failed to create default admin: %v", err)
                } else {
                        fmt.Println("-------------------------------------------")
                        fmt.Println("Default Admin Created Successfully!")
                        fmt.Println("Email: admin@clinic.com")
                        fmt.Println("Password: admin123")
                        fmt.Println("-------------------------------------------")
                }
        }
}

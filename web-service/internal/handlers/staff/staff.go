package staff

import (
	"context"
	"log"
	"time"

	"web-service/config"
	"web-service/database"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Staff struct {
	ID          string  `json:"id"`
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	PhoneNumber string  `json:"phone_number"`
	DateOfBirth string  `json:"date_of_birth"`
	NationalID  int     `json:"national_id"`
	Address     string  `json:"address"`
	Biography   *string `json:"biography,omitempty"`
	Photo       *string `json:"photo,omitempty"`
	Department  string  `json:"department"`
	Specialty   string  `json:"specialty"`
	StartDate   string  `json:"start_date"`
	EndDate     *string `json:"end_date,omitempty"`
	Status      string  `json:"status"`
	Role        string  `json:"role"`
	Password    string  `json:"-"`
	Email       string  `json:"email"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

func GetStaffByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "staff ID is required",
		})
	}

	db := database.GetDB()
	rows, err := db.Query(context.Background(), "SELECT id, first_name, last_name, phone_number, date_of_birth, national_id, address, biography, photo, department, specialty, start_date, end_date, status, role, email, created_at, updated_at FROM staff WHERE id = $1 OR national_id = $1", id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	defer rows.Close()

	// Check if any rows were returned
	var staff *Staff
	if rows.Next() {
		var s Staff
		if err := rows.Scan(&s.ID, &s.FirstName, &s.LastName, &s.PhoneNumber, &s.DateOfBirth, &s.NationalID, &s.Address, &s.Biography, &s.Photo, &s.Department, &s.Specialty, &s.StartDate, &s.EndDate, &s.Status, &s.Role, &s.Email, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err,
			})
		}
		staff = &s
	}

	// Check if staff was found
	if staff == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "staff not found",
		})
	}

	return c.JSON(staff)
}

func GetAllStaff(c *fiber.Ctx) error {
	db := database.GetDB()
	rows, err := db.Query(context.Background(), "SELECT id, first_name, last_name, department, specialty, role, created_at FROM staff")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	defer rows.Close()

	var staff []Staff
	for rows.Next() {
		var s Staff
		if err := rows.Scan(&s.ID, &s.FirstName, &s.LastName, &s.Department, &s.Specialty, &s.Role, &s.CreatedAt); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err,
			})
		}
		staff = append(staff, s)
	}

	return c.JSON(staff)
}

func AuthMiddleware(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Authorization token is required",
		})
	}

	// Check if the token starts with "Basic "
	if len(tokenString) > 6 && tokenString[:6] == "Basic " {
		tokenString = tokenString[6:] // Remove "Basic " prefix
	}

	token, err := VerifyToken(tokenString)
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	// Token is valid, proceed to the next handler
	return c.Next()
}

func AddStaff(c *fiber.Ctx) error {
	db := database.GetDB()
	var s Staff
	if err := c.BodyParser(&s); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input:" + err.Error(),
		})
	}

	// Encrypt the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(s.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to encrypt password:" + err.Error(),
		})
	}
	s.Password = string(hashedPassword)

	// Insert staff into the database
	_, err = db.Exec(context.Background(), "INSERT INTO staff (first_name, last_name, phone_number, date_of_birth, national_id, address, biography, photo, department, specialty, start_date, end_date, status, role, password, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)", s.FirstName, s.LastName, s.PhoneNumber, s.DateOfBirth, s.NationalID, s.Address, s.Biography, s.Photo, s.Department, s.Specialty, s.StartDate, s.EndDate, s.Status, s.Role, s.Password, s.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.JSON(fiber.Map{
        "message": "Staff added successfully",
        "staff":   s,
    })
}

func UpdateStaff(c *fiber.Ctx) error {
	db := database.GetDB()
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Staff ID or National ID is required",
		})
	}

	var s Staff
	if err := c.BodyParser(&s); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input: " + err.Error(),
		})
	}

	// Update staff in the database
	_, err := db.Exec(context.Background(), "UPDATE staff SET first_name = $1, last_name = $2, phone_number = $3, date_of_birth = $4, national_id = $5, address = $6, biography = $7, photo = $8, department = $9, specialty = $10, start_date = $11, end_date = $12, status = $13, role = $14, email = $15 WHERE id = $16 OR national_id = $16", s.FirstName, s.LastName, s.PhoneNumber, s.DateOfBirth, s.NationalID, s.Address, s.Biography, s.Photo, s.Department, s.Specialty, s.StartDate, s.EndDate, s.Status, s.Role, s.Email, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Staff updated successfully",
		"staff":   s,
	})
}

func DeleteStaff(c *fiber.Ctx) error {
	db := database.GetDB()
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Staff ID or National ID is required",
		})
	}

	// Delete staff from the database
	_, err := db.Exec(context.Background(), "DELETE FROM staff WHERE id = $1 OR national_id = $1", id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Staff deleted successfully",
	})
}

func GetStaffByEmail(c *fiber.Ctx) error {
	id := c.Params("email")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "staff email is required",
		})
	}

	db := database.GetDB()
	rows, err := db.Query(context.Background(), "SELECT id, first_name, last_name, phone_number, date_of_birth, national_id, address, biography, photo, department, specialty, start_date, end_date, status, role FROM staff WHERE email = $1", id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	defer rows.Close()

	// Check if any rows were returned
	var staff *Staff
	if rows.Next() {
		var s Staff
		if err := rows.Scan(&s.ID, &s.FirstName, &s.LastName, &s.PhoneNumber, &s.DateOfBirth, &s.NationalID, &s.Address, &s.Biography, &s.Photo, &s.Department, &s.Specialty, &s.StartDate, &s.EndDate, &s.Status, &s.Role); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err,
			})
		}
		staff = &s
	}

	// Check if staff was found
	if staff == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "staff not found",
		})
	}

	return c.JSON(staff)
}

func DeleteStaffByEmail(c *fiber.Ctx) error {
	db := database.GetDB()
	email := c.Params("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "staff email is required",
		})
	}

	// Delete staff from the database
	_, err := db.Exec(context.Background(), "DELETE FROM staff WHERE email = $1", email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Staff deleted successfully",
	})
}

func UpdateStaffByEmail(c *fiber.Ctx) error {
	db := database.GetDB()
	email := c.Params("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "staff email is required",
		})
	}

	var s Staff
	if err := c.BodyParser(&s); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input: " + err.Error(),
		})
	}

	// Update staff in the database
	_, err := db.Exec(context.Background(), "UPDATE staff SET first_name = $1, last_name = $2, phone_number = $3, date_of_birth = $4, national_id = $5, address = $6, biography = $7, photo = $8, department = $9, specialty = $10, start_date = $11, end_date = $12, status = $13, role = $14 WHERE email = $15", s.FirstName, s.LastName, s.PhoneNumber, s.DateOfBirth, s.NationalID, s.Address, s.Biography, s.Photo, s.Department, s.Specialty, s.StartDate, s.EndDate, s.Status, s.Role, email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Staff updated successfully",
	})
}

func DeleteAllStaff(c *fiber.Ctx) error {
	db := database.GetDB()

	// Delete all staff from the database
	_, err := db.Exec(context.Background(), "DELETE FROM staff")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.JSON(fiber.Map{
		"message": "All staff deleted successfully",
	})
}

func Login(c *fiber.Ctx) error {
	db := database.GetDB()
	var s Staff
	if err := c.BodyParser(&s); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input: " + err.Error(),
		})
	}

	email := s.Email
	password := s.Password
	// Check if email and password are provided
	if email == "" || password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}

	// Check if staff exists in the database
	row := db.QueryRow(context.Background(), "SELECT id, first_name, last_name, phone_number, date_of_birth, national_id, address, biography, photo, department, specialty, start_date, end_date, status, role FROM staff WHERE email = $1", email)
	if err := row.Scan(&s.ID, &s.FirstName, &s.LastName, &s.PhoneNumber, &s.DateOfBirth, &s.NationalID, &s.Address, &s.Biography, &s.Photo, &s.Department, &s.Specialty, &s.StartDate, &s.EndDate, &s.Status, &s.Role); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "staff not found",
		})
	}

	// Check if password is correct
	if err := bcrypt.CompareHashAndPassword([]byte(s.Password), []byte(s.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid password",
		})
	}

	token, err := generateToken(s.ID)
	if err != nil {
		log.Fatal("Error generating user token: " + err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":"Error generating user token: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"token":  token,
		"user_id":	 s.ID,
	})
}

func generateToken(id string) (string, error){
	secretKey := config.GetVal("JWT_SECRET")
	claims := jwt.MapClaims{
		"id": id,
		"exp": time.Now().Add(time.Hour * 24 * 2).Unix(), // Token  expires in 2 day (24 hours * 2)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	secretKey := config.GetVal("JWT_SECRET")
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return secretKey, nil
    })

    if err != nil {
        return nil, err
    }

    return token, nil
}

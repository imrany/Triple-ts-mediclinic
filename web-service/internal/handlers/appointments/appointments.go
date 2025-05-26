package appointments

import (
	"context"
	"time"
	
	"web-service/database"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Appointment struct {
	ID                 string    `json:"id"`
	PatientNationalID  int       `json:"patient_national_id"`
	PatientName        string    `json:"patient_name"`
	PatientAddress     string    `json:"patient_address"`
	PatientPhoneNumber string    `json:"patient_phone_number"`
	PatientEmail       *string   `json:"patient_email,omitempty"`
	AppointmentDate    time.Time `json:"appointment_date"`
	AppointmentTime    string    `json:"appointment_time"`
	Department         string    `json:"department"`
	StaffID           string    `json:"staff_id"`
	Notes              *string   `json:"notes,omitempty"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type Staff struct {
	ID          string  `json:"id"`
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	PhoneNumber string  `json:"phone_number"`
	DateOfBirth time.Time  `json:"date_of_birth"`
	NationalID  int     `json:"national_id"`
	Address     string  `json:"address"`
	Biography   *string `json:"biography,omitempty"`
	Photo       *string `json:"photo,omitempty"`
	Department  string  `json:"department"`
	Specialty   string  `json:"specialty"`
	StartDate   time.Time  `json:"start_date"`
	EndDate     *time.Time `json:"end_date,omitempty"`
	Status      string  `json:"status"`
	Role        string  `json:"role"`
	Password    string `json:"password"`
	Email       string  `json:"email"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	Experience string `json:"experience"`
}

// SELECT orders.*, products.* 
//              FROM orders 
//              INNER JOIN products 
//              ON orders.product_reference = products.product_reference
func GetAppointments(c *fiber.Ctx) error {
	db := database.GetDB()
	rows, err := db.Query(context.Background(), `
		SELECT appointments.id, appointments.patient_national_id, appointments.patient_name, appointments.patient_address, appointments.patient_phone_number, 
			   appointments.patient_email, appointments.appointment_date, appointments.appointment_time, appointments.department, appointments.staff_id, 
			   appointments.notes, appointments.status, appointments.created_at, appointments.updated_at,
			   staff.first_name, staff.last_name, staff.phone_number, staff.photo, staff.department, staff.specialty, 
			   staff.role, staff.email, staff.status, staff.experience
		FROM appointments INNER JOIN staff ON appointments.staff_id = staff.id
		ORDER BY appointments.created_at DESC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	defer rows.Close()

	var appointments []map[string]interface{}
	for rows.Next() {
		var a Appointment
		var s Staff
		if err := rows.Scan(
			&a.ID, &a.PatientNationalID, &a.PatientName, &a.PatientAddress, &a.PatientPhoneNumber, 
			&a.PatientEmail, &a.AppointmentDate, &a.AppointmentTime, &a.Department, &a.StaffID, 
			&a.Notes, &a.Status, &a.CreatedAt, &a.UpdatedAt,
			&s.FirstName, &s.LastName, &s.PhoneNumber, &s.Photo, &s.Department, &s.Specialty,
			&s.Role, &s.Email, &s.Status, &s.Experience); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		appointment := map[string]interface{}{
			"appointment": a,
			"staff": map[string]interface{}{
				"first_name": s.FirstName,
				"last_name":  s.LastName,
				"phone_number": s.PhoneNumber,
				"photo":      s.Photo,
				"department": s.Department,
				"specialty":  s.Specialty,
				"role":       s.Role,
				"email":      s.Email,
				"status":     s.Status,
				"experience": s.Experience,
			},
		}
		appointments = append(appointments, appointment)
	}

	return c.JSON(appointments)
}

func AddAppointment(c *fiber.Ctx) error {
	db := database.GetDB()
	var a Appointment
	if err := c.BodyParser(&a); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input:",
			"details": err.Error(),
		})
	}

	// Validate the appointment date and time
	if a.AppointmentDate.IsZero() || a.AppointmentTime == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid appointment date or time",
		})
	}

	// Validate the department
	if a.Department == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Department is required",
		})
	}

	// Validate the staff ID
	if a.StaffID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Staff ID is required",
		})
	}
	
	a.ID = uuid.New().String()[:8]

	// Insert appointment into the database
	var err error
	_, err = db.Exec(context.Background(), `INSERT INTO appointments 
		(id, patient_national_id, patient_name, patient_address, patient_phone_number, 
		patient_email, appointment_date, appointment_time, department, staff_id, 
		notes, status, created_at, updated_at ) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, 
	a.ID, a.PatientNationalID, a.PatientName, a.PatientAddress, a.PatientPhoneNumber, a.PatientEmail, 
	a.AppointmentDate, a.AppointmentTime, a.Department, a.StaffID, a.Notes, a.Status, a.CreatedAt, a.UpdatedAt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add appointment",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
        "message": "Appointment added successfully",
        "appointment":   a,
    })
}

func GetAppointmentByID(c *fiber.Ctx) error {
	db := database.GetDB()
	id := c.Params("id")

	var a Appointment
	var s Staff
	err := db.QueryRow(context.Background(), `
		SELECT appointments.id, appointments.patient_national_id, appointments.patient_name, appointments.patient_address, appointments.patient_phone_number, 
			appointments.patient_email, appointments.appointment_date, appointments.appointment_time, appointments.department, appointments.staff_id, 
			appointments.notes, appointments.status, appointments.created_at, appointments.updated_at,
			staff.first_name, staff.last_name, staff.phone_number, staff.photo, staff.department, staff.specialty, 
			staff.role, staff.email, staff.status, staff.experience
		FROM appointments INNER JOIN staff ON appointments.staff_id = staff.id WHERE appointments.id = $1`, id).Scan(
		&a.ID, &a.PatientNationalID, &a.PatientName, &a.PatientAddress, &a.PatientPhoneNumber, &a.PatientEmail, 
		&a.AppointmentDate, &a.AppointmentTime, &a.Department, &a.StaffID, &a.Notes, &a.Status, &a.CreatedAt, 
		&a.UpdatedAt,
		&s.FirstName, &s.LastName, &s.PhoneNumber, &s.Photo, &s.Department, &s.Specialty, 
		&s.Role, &s.Email, &s.Status, &s.Experience,
	)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Appointment not found",
			"details": err.Error(),
		})
	}

	appointment := map[string]interface{}{
		"id":                  a.ID,
		"patient_national_id": a.PatientNationalID,
		"patient_name":        a.PatientName,
		"patient_address":     a.PatientAddress,
		"patient_phone_number": a.PatientPhoneNumber,
		"patient_email":       a.PatientEmail,
		"appointment_date":    a.AppointmentDate,
		"appointment_time":    a.AppointmentTime,
		"department":          a.Department,
		"staff_id":            a.StaffID,
		"notes":               a.Notes,
		"status":              a.Status,
		"created_at":          a.CreatedAt,
		"updated_at":          a.UpdatedAt,
		"staff": map[string]interface{}{
			"first_name":  s.FirstName,
			"last_name":   s.LastName,
			"phone_number": s.PhoneNumber,
			"photo":       s.Photo,
			"department":  s.Department,
			"specialty":   s.Specialty,
			"role":        s.Role,
			"email":       s.Email,
			"status":      s.Status,
			"experience":  s.Experience,
		},
	}

	return c.JSON(appointment)
}
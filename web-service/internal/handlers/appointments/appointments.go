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

func GetAppointments(c *fiber.Ctx) error {
	db := database.GetDB()
	rows, err := db.Query(context.Background(), `
		SELECT id, patient_national_id, patient_name, patient_address, patient_phone_number, 
			   patient_email, appointment_date, appointment_time, department, staff_id, 
			   notes, status, created_at, updated_at 
		FROM appointments
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	defer rows.Close()

	var appointment []Appointment
	for rows.Next() {
		var a Appointment
		if err := rows.Scan(&a.ID, &a.PatientNationalID, &a.PatientName, &a.PatientAddress, &a.PatientPhoneNumber, &a.PatientEmail, &a.AppointmentDate, &a.AppointmentTime, &a.Department, &a.StaffID, &a.Notes, &a.Status, &a.CreatedAt, &a.UpdatedAt); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		appointment = append(appointment, a)
	}

	return c.JSON(appointment)
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
	err := db.QueryRow(context.Background(), `
		SELECT id, patient_national_id, patient_name, patient_address, patient_phone_number, 
			   patient_email, appointment_date, appointment_time, department, staff_id, 
			   notes, status, created_at, updated_at 
		FROM appointments WHERE id = $1`, id).Scan(&a.ID, &a.PatientNationalID, &a.PatientName, &a.PatientAddress, &a.PatientPhoneNumber, &a.PatientEmail, &a.AppointmentDate, &a.AppointmentTime, &a.Department, &a.StaffID, &a.Notes, &a.Status, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Appointment not found",
			"details": err.Error(),
		})
	}

	return c.JSON(a)
}
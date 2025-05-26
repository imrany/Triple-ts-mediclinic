package patients

import (
	"context"
	"time"
	
	"web-service/database"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Patient struct {
	ID           string    `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	PhoneNumber  string    `json:"phone_number"`
	DateOfBirth  time.Time    `json:"date_of_birth"`
	NationalID   int       `json:"national_id"`
	Address      string    `json:"address"`
	Gender       string    `json:"gender"`
	Status       string    `json:"status"`
	Department   string    `json:"department"`
	Email        string    `json:"email"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
}

type Appointment struct {
	ID                 string    `json:"id"`
	PatientEmail       *string   `json:"patient_email,omitempty"`
	AppointmentDate    time.Time `json:"appointment_date"`
	AppointmentTime    string    `json:"appointment_time"`
	Department         string    `json:"department"`
	StaffID           string    `json:"staff_id"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

func GetPatient(c *fiber.Ctx) error {
	db := database.GetDB()
	id:=c.Params("id")
	rows, err := db.Query(context.Background(), `
		SELECT 
			p.id, p.first_name, p.last_name, p.phone_number, p.date_of_birth, p.national_id, p.address, p.gender, p.status, p.department, p.email, p.created_at, p.updated_at,
			a.id, a.patient_email, a.appointment_date, a.appointment_time, a.staff_id, a.department, a.status, a.created_at, a.updated_at
		FROM patients p
		LEFT JOIN appointments a
			ON p.id = a.id OR p.email = a.patient_email
		WHERE p.id = $1
	`, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	defer rows.Close()
	patientMap := make(map[string]map[string]any)
	for rows.Next() {
		var p Patient
		var a Appointment
		var apptID *string
		var apptPatientEmail *string
		var apptDate *time.Time
		var apptTime *string
		var apptStaffId *string
		var apptDepartment *string
		var apptStatus *string
		var apptCreatedAt *time.Time
		var apptUpdatedAt *time.Time

		err := rows.Scan(
			&p.ID, &p.FirstName, &p.LastName, &p.PhoneNumber, &p.DateOfBirth, &p.NationalID, &p.Address,
			&p.Gender, &p.Status, &p.Department, &p.Email, &p.CreatedAt, &p.UpdatedAt,
			&apptID, &apptPatientEmail, &apptDate, &apptTime, &apptStaffId, &apptDepartment, &apptStatus, &apptCreatedAt, &apptUpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// Use patient ID as key
		pm, exists := patientMap[p.ID]
		if !exists {
			pm = map[string]any{
				"patient":      p,
				"appointments": []Appointment{},
			}
			patientMap[p.ID] = pm
		}

		// If appointment exists, add it
		if apptID != nil {
			a.ID = *apptID
			a.PatientEmail = nil
			if apptPatientEmail != nil {
				a.PatientEmail = apptPatientEmail
			}
			a.AppointmentDate = time.Time{}
			if apptDate != nil {
				a.AppointmentDate = *apptDate
			}
			a.AppointmentTime = ""
			if apptTime != nil {
				a.AppointmentTime = *apptTime
			}
			a.StaffID = ""
			if apptStaffId != nil {
				a.StaffID = *apptStaffId
			}
			a.Department = ""
			if apptDepartment != nil {
				a.Department = *apptDepartment
			}
			a.Status = ""
			if apptStatus != nil {
				a.Status = *apptStatus
			}
			if apptCreatedAt != nil {
				a.CreatedAt = *apptCreatedAt
			}
			if apptUpdatedAt != nil {
				a.UpdatedAt = *apptUpdatedAt
			}
			pm["appointments"] = append(pm["appointments"].([]Appointment), a)
		}
	}

	var patientsWithAppointments []map[string]any
	for _, v := range patientMap {
		patientsWithAppointments = append(patientsWithAppointments, v)
	}

	return c.JSON(patientsWithAppointments)
}

func AddPatient(c *fiber.Ctx) error {
	db := database.GetDB()
	var p Patient
	if err := c.BodyParser(&p); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input:",
			"details": err.Error(),
		})
	}

	p.ID = uuid.New().String()[:8]

	var err error
	_, err = db.Exec(context.Background(), `INSERT INTO patients 
		(id, first_name, last_name, phone_number, date_of_birth, national_id, address, gender, status, department, email, created_at, updated_at) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, 
		p.ID, p.FirstName, p.LastName, p.PhoneNumber, p.DateOfBirth, p.NationalID, p.Address, p.Gender, p.Status, p.Department, p.Email, p.CreatedAt, p.UpdatedAt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add patient",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
        "message": "Patient added successfully",
        "patient":   p,
    })
}

func EditPatient(c *fiber.Ctx) error {
	db := database.GetDB()
	id := c.Params("id")
	var p Patient

	if err := c.BodyParser(&p); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input",
			"details": err.Error(),
		})
	}

	_, err := db.Exec(context.Background(), `UPDATE patients SET first_name=$1, last_name=$2, phone_number=$3, date_of_birth=$4, national_id=$5, address=$6, gender=$7, status=$8, department=$9, email=$10, updated_at=$11 WHERE id=$12`,
		p.FirstName, p.LastName, p.PhoneNumber, p.DateOfBirth, p.NationalID, p.Address, p.Gender, p.Status, p.Department, p.Email, time.Now(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update patient",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Patient updated successfully",
	})
}

func GetAllPatients(c *fiber.Ctx) error {
	db := database.GetDB()
	rows, err := db.Query(context.Background(), `
		SELECT id, first_name, last_name, phone_number, date_of_birth, national_id, address, gender, status, department, email, created_at, updated_at 
		FROM patients
		ORDER BY created_at DESC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch patients",
			"details": err.Error(),
		})
	}
	defer rows.Close()

	var patients []Patient
	for rows.Next() {
		var p Patient
		err := rows.Scan(
			&p.ID, &p.FirstName, &p.LastName, &p.PhoneNumber, &p.DateOfBirth, &p.NationalID, &p.Address,
			&p.Gender, &p.Status, &p.Department, &p.Email, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan patient",
				"details": err.Error(),
			})
		}
		patients = append(patients, p)
	}

	return c.JSON(patients)
}

func DeletePatient(c *fiber.Ctx) error {
	db := database.GetDB()
	id := c.Params("id")

	_, err := db.Exec(context.Background(), `DELETE FROM patients WHERE id=$1`, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete patient",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Patient deleted successfully",
	})
}

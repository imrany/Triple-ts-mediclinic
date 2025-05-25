package router

import (
	"web-service/internal/handlers/appointments"
	"web-service/internal/handlers/patients"
	"web-service/internal/handlers/staff"
	"web-service/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("api")
	admin := app.Group("admin")

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("welcome to Triple Ts Mediclinic API!")
	})

	api.Post("/signin", staff.Login)
	api.Get("/staff", staff.GetAllStaff)
	api.Post("/staff", middleware.AuthMiddleware, staff.AddStaff)
	api.Get("/staff/:id", middleware.AuthMiddleware,staff.GetStaffByID)
	api.Patch("/staff/:id", middleware.AuthMiddleware, staff.UpdateStaff)
	api.Delete("/staff/:id", middleware.AuthMiddleware, staff.DeleteStaff)

	api.Get("/appointments", middleware.AuthMiddleware, appointments.GetAppointments)
	api.Get("/appointments/:id", middleware.AuthMiddleware, appointments.GetAppointmentByID)
	api.Post("/appointments", middleware.AuthMiddleware, appointments.AddAppointment)

	api.Get("/patients", middleware.AuthMiddleware, patients.GetAllPatients)
	api.Get("/patients/:id", middleware.AuthMiddleware, patients.GetPatient)
	api.Patch("/patients/:id", middleware.AuthMiddleware, patients.EditPatient)
	api.Post("/patients", patients.AddPatient)

	admin.Delete("/staff", middleware.AuthMiddleware, staff.DeleteAllStaff)
}


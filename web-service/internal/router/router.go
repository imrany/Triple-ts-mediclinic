package router

import (
	"web-service/internal/handlers/appointments"
	"web-service/internal/middleware"
	"github.com/gofiber/fiber/v2"
	"web-service/internal/handlers/staff"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("api")
	admin := app.Group("admin")

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("welcom to Triple Ts Mediclinic API!")
	})

	api.Post("/signin", staff.Login)
	api.Get("/staff", staff.GetAllStaff)
	api.Get("/staff/:id", middleware.AuthMiddleware,staff.GetStaffByID)
	api.Patch("/staff/:id", middleware.AuthMiddleware, staff.UpdateStaff)
	api.Delete("/staff/:id", middleware.AuthMiddleware, staff.DeleteStaff)

	api.Get("/appointments", middleware.AuthMiddleware, appointments.GetAppointments)
	api.Get("/appointments/:id", middleware.AuthMiddleware, appointments.GetAppointmentByID)
	api.Post("/appointments", middleware.AuthMiddleware, appointments.AddAppointment)
	
	admin.Get("/staff/:id", middleware.AuthMiddleware, staff.GetStaffByID)
	admin.Post("/staff", middleware.AuthMiddleware, staff.AddStaff)
	admin.Patch("/staff/:id", middleware.AuthMiddleware, staff.UpdateStaff)
	admin.Delete("/staff", middleware.AuthMiddleware, staff.DeleteAllStaff)
}


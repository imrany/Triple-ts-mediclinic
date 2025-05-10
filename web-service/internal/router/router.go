package router

import (
	"github.com/gofiber/fiber/v2"
	"web-service/internal/handlers/staff"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("api")

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("welcom to Triple Ts Mediclinic API!")
	})

	api.Get("/staff", staff.GetAllStaff)
	api.Get("/staff/:id", staff.GetStaffByID)
	api.Post("/signin", staff.Login)
	api.Post("/staff", staff.AddStaff)
	api.Patch("/staff/:id", staff.AuthMiddleware, staff.UpdateStaff)
	api.Delete("/staff/:id", staff.AuthMiddleware,staff.DeleteStaff)
	api.Delete("/staff", staff.AuthMiddleware,staff.DeleteAllStaff)
}


package staff

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"web-service/database"
)

func SetupCheck(c *fiber.Ctx) error {
	db := database.GetDB()
	var count int
	err := db.QueryRow(context.Background(), "SELECT COUNT(*) FROM staff").Scan(&count)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"exists": count > 0})
}

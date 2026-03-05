package pharmacy

import (
	"github.com/gofiber/fiber/v2"
	"web-service/database"
)

type Medicine struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
}

func GetMedicines(c *fiber.Ctx) error {
	db := database.GetDB()
	rows, err := db.Query(c.Context(), "SELECT id, name, description, price, stock FROM pharmacy")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	defer rows.Close()

	var medicines []Medicine
	for rows.Next() {
		var m Medicine
		if err := rows.Scan(&m.ID, &m.Name, &m.Description, &m.Price, &m.Stock); err != nil {
			continue
		}
		medicines = append(medicines, m)
	}
	if medicines == nil {
		medicines = []Medicine{}
	}
	return c.JSON(medicines)
}

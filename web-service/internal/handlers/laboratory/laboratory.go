package laboratory

import (
	"github.com/gofiber/fiber/v2"
	"web-service/database"
)

type Test struct {
	ID          string  `json:"id"`
	TestName    string  `json:"test_name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

func GetTests(c *fiber.Ctx) error {
	db := database.GetDB()
	rows, err := db.Query(c.Context(), "SELECT id, test_name, description, price FROM laboratory")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	defer rows.Close()

	var tests []Test
	for rows.Next() {
		var t Test
		if err := rows.Scan(&t.ID, &t.TestName, &t.Description, &t.Price); err != nil {
			continue
		}
		tests = append(tests, t)
	}
	if tests == nil {
		tests = []Test{}
	}
	return c.JSON(tests)
}

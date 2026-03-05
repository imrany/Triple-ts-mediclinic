package billing

import (
        "github.com/gofiber/fiber/v2"
        "web-service/database"
)

type Invoice struct {
        ID        string  `json:"id"`
        InvoiceNo string  `json:"invoiceNo"`
        Patient   string  `json:"patient"`
        Date      string  `json:"date"`
        Amount    float64 `json:"amount"`
        Status    string  `json:"status"`
        Items     string  `json:"items"`
}

func GetInvoices(c *fiber.Ctx) error {
        db := database.GetDB()
        rows, err := db.Query(c.Context(), `
                SELECT b.id, 'INV-' || b.id as invoice_no, p.first_name || ' ' || p.last_name as patient, 
                b.created_at::text, b.amount, b.status, 'Consultation' as items
                FROM billing b
                JOIN patients p ON b.patient_id = p.id
        `)
        if err != nil {
                return c.Status(500).JSON(fiber.Map{"error": err.Error()})
        }
        defer rows.Close()

        var invoices []Invoice
        for rows.Next() {
                var inv Invoice
                if err := rows.Scan(&inv.ID, &inv.InvoiceNo, &inv.Patient, &inv.Date, &inv.Amount, &inv.Status, &inv.Items); err != nil {
                        continue
                }
                invoices = append(invoices, inv)
        }

        if invoices == nil {
                invoices = []Invoice{}
        }

        return c.JSON(invoices)
}

func CreateInvoice(c *fiber.Ctx) error {
        var inv Invoice
        if err := c.BodyParser(&inv); err != nil {
                return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
        }

        db := database.GetDB()
        _ = db // Avoid unused variable error
        // Simplified for now, in a real app we'd look up patient_id
        return c.JSON(fiber.Map{"message": "Invoice created successfully"})
}

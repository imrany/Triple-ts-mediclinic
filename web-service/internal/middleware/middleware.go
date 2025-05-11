package middleware

import (
    "time"
    "web-service/config"
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v5"
)

// Generate JWT Token
func GenerateToken(id string, role string) (string, error) {
    secretKey := []byte(config.GetVal("JWT_SECRET"))
    claims := jwt.MapClaims{
        "id": id,
        "role": role,
        "exp": time.Now().Add(48 * time.Hour).Unix(), // 2-day expiry
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(secretKey)
}

// Verify JWT Token
func verifyToken(tokenString string) (*jwt.Token, error) {
    secretKey := []byte(config.GetVal("JWT_SECRET"))
    return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return secretKey, nil
    })
}

// JWT Middleware
func AuthMiddleware(c *fiber.Ctx) error {
    tokenString := c.Get("Authorization")

    if tokenString == "" {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Authorization token required",
        })
    }

    // Ensure Bearer token format
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
        tokenString = tokenString[7:] // Remove "Bearer " prefix
    }

    // Verify Token
    token, err := verifyToken(tokenString)
    if err != nil || !token.Valid {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Invalid token",
            "details": err.Error(),
        })
    }

    // Extract Claims
    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Invalid token claims",
        })
    }

    // Validate Role
    role, ok := claims["role"].(string)
    if !ok || (role != "user" && role != "admin") {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Unauthorized role",
        })
    }

    // Proceed to the next request handler
    return c.Next()
}

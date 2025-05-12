# Step 1: Build Stage
FROM golang:1.20-alpine AS builder

WORKDIR /app

# Copy go modules files first (better caching)
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o web-service .

# Step 2: Run Stage (Uses Small Final Image)
FROM alpine:latest

WORKDIR /app

# Copy built binary from builder stage
COPY --from=builder /app/web-service .

# Expose the application port
EXPOSE 8000

# Run the application
CMD ["./web-service"]

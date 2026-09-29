const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Media API",
    version: "1.0.0",
    description: "Teaching API for JWT authentication, media CRUD, filtering, sorting, and pagination."
  },
  servers: [{ url: "http://localhost:3000", description: "Local development server" }],
  tags: [
    { name: "Health", description: "Service availability" },
    { name: "Authentication", description: "User registration and JWT authentication" },
    { name: "Media", description: "Movies and series catalog" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      User: {
        type: "object",
        properties: { id: { type: "integer", example: 1 }, name: { type: "string", example: "Professor" }, email: { type: "string", format: "email", example: "professor@media.dev" } }
      },
      AuthResponse: {
        type: "object",
        properties: { message: { type: "string" }, user: { $ref: "#/components/schemas/User" }, token: { type: "string" } }
      },
      MediaInput: {
        type: "object",
        required: ["type", "title", "year", "genres", "rating", "imageUrl", "synopsis"],
        properties: {
          type: { type: "string", enum: ["movie", "series"], example: "series" },
          title: { type: "string", example: "Loki" },
          year: { type: "integer", example: 2021 },
          duration: { type: "string", example: "2 temporadas" },
          seasons: { type: "integer", example: 2 },
          episodes: { type: "integer", example: 12 },
          genres: { type: "array", items: { type: "string" }, example: ["Ação", "Aventura", "Fantasia"] },
          ageRating: { type: "string", example: "12 anos" },
          rating: { type: "number", format: "float", minimum: 0, maximum: 10, example: 8.2 },
          director: { type: "string", example: "Jon Favreau" },
          creator: { type: "string", example: "Michael Waldron" },
          cast: { type: "array", items: { type: "string" } },
          studio: { type: "string", example: "Marvel Studios" },
          country: { type: "string", example: "Estados Unidos" },
          language: { type: "string", example: "Inglês" },
          imageUrl: { type: "string", format: "uri", example: "https://example.com/poster.jpg" },
          synopsis: { type: "string", example: "Uma série de exemplo para a aula." }
        }
      },
      Media: {
        allOf: [{ $ref: "#/components/schemas/MediaInput" }, { type: "object", properties: { id: { type: "integer", example: 22 } } }]
      },
      MediaSummary: {
        type: "object",
        description: "Compact representation used by GET /media.",
        properties: {
          id: { type: "integer", example: 22 },
          type: { type: "string", enum: ["movie", "series"] },
          title: { type: "string", example: "Loki" },
          year: { type: "integer", example: 2021 },
          genres: { type: "array", items: { type: "string" }, example: ["Ação", "Aventura"] },
          ageRating: { type: "string", example: "12 anos" },
          rating: { type: "number", example: 8.2 },
          imageUrl: { type: "string", format: "uri" }
        }
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" }, fields: { type: "array", items: { type: "string" } } }
      }
    },
    responses: {
      Unauthorized: { description: "Missing, invalid, or expired Bearer token", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      NotFound: { description: "Resource not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
    }
  },
  paths: {
    "/health": {
      get: { tags: ["Health"], summary: "Check API availability", responses: { 200: { description: "Service is available" } } }
    },
    "/auth/register": {
      post: {
        tags: ["Authentication"], summary: "Register a new user",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name", "email", "password"], properties: { name: { type: "string" }, email: { type: "string", format: "email" }, password: { type: "string", format: "password", minLength: 6 } } } } } },
        responses: { 201: { description: "User registered", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } }, 400: { description: "Invalid input" }, 409: { description: "Email already registered" } }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"], summary: "Log in and receive a JWT",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email", example: "professor@media.dev" }, password: { type: "string", format: "password", example: "123456" } } } } } },
        responses: { 200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } }, 401: { description: "Invalid credentials" } }
      }
    },
    "/auth/me": {
      get: { tags: ["Authentication"], summary: "Get the authenticated user", security: [{ bearerAuth: [] }], responses: { 200: { description: "Authenticated user", content: { "application/json": { schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } } } } }, 401: { $ref: "#/components/responses/Unauthorized" } } }
    },
    "/media": {
      get: {
        tags: ["Media"], summary: "List media with filters, sorting, and pagination", security: [{ bearerAuth: [] }],
        parameters: [
          { name: "type", in: "query", schema: { type: "string", enum: ["movie", "series"] } },
          { name: "genre", in: "query", schema: { type: "string" }, example: "Ação" },
          { name: "q", in: "query", schema: { type: "string" }, description: "Search in title and synopsis" },
          { name: "year", in: "query", schema: { type: "integer" } },
          { name: "yearFrom", in: "query", schema: { type: "integer" } },
          { name: "yearTo", in: "query", schema: { type: "integer" } },
          { name: "minRating", in: "query", schema: { type: "number" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["title", "year", "rating"], default: "title" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "asc" } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } }
        ],
        responses: {
          200: {
            description: "Filtered compact media list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/MediaSummary" } },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        total: { type: "integer" },
                        totalPages: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { $ref: "#/components/responses/Unauthorized" }
        }
      },
      post: {
        tags: ["Media"], summary: "Create a movie or series", security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MediaInput" } } } },
        responses: { 201: { description: "Media created", content: { "application/json": { schema: { $ref: "#/components/schemas/Media" } } } }, 400: { description: "Invalid input" }, 401: { $ref: "#/components/responses/Unauthorized" } }
      }
    },
    "/media/genres": {
      get: { tags: ["Media"], summary: "List available genres", security: [{ bearerAuth: [] }], responses: { 200: { description: "Genre list" }, 401: { $ref: "#/components/responses/Unauthorized" } } }
    },
    "/media/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      get: { tags: ["Media"], summary: "Get one media item", security: [{ bearerAuth: [] }], responses: { 200: { description: "Media item", content: { "application/json": { schema: { $ref: "#/components/schemas/Media" } } } }, 401: { $ref: "#/components/responses/Unauthorized" }, 404: { $ref: "#/components/responses/NotFound" } } },
      put: { tags: ["Media"], summary: "Replace one media item", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MediaInput" } } } }, responses: { 200: { description: "Media updated" }, 400: { description: "Invalid input" }, 401: { $ref: "#/components/responses/Unauthorized" }, 404: { $ref: "#/components/responses/NotFound" } } },
      delete: { tags: ["Media"], summary: "Delete one media item", security: [{ bearerAuth: [] }], responses: { 204: { description: "Media deleted" }, 401: { $ref: "#/components/responses/Unauthorized" }, 404: { $ref: "#/components/responses/NotFound" } } }
    }
  }
};

module.exports = openapi;

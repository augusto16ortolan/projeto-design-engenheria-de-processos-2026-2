const json = (schema) => ({ "application/json": { schema } });

const user = {
  type: "object",
  required: ["id", "name", "email"],
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
};

const workInput = {
  type: "object",
  required: ["type", "title", "status"],
  properties: {
    type: { type: "string", enum: ["movie", "series"] },
    title: { type: "string", example: "Duna: Parte Dois" },
    imageUrl: { type: "string", format: "uri", example: "https://example.com/poster.jpg" },
    synopsis: { type: "string", example: "Uma jornada em Arrakis." },
    status: { type: "string", enum: ["want_to_watch", "watching", "watched"] },
  },
};

const work = {
  allOf: [
    workInput,
    {
      type: "object",
      required: ["id", "userId"],
      properties: {
        id: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
      },
    },
  ],
};

const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Cena Marcada API",
    version: "1.0.0",
    description: "API de autenticação e coleção privada de filmes e séries para o aplicativo Cena Marcada.",
  },
  servers: [{ url: "http://localhost:3001" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      User: user,
      AuthRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", description: "JWT válido por uma hora." },
        },
      },
      WorkInput: workInput,
      Work: work,
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          fields: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Verifica se a API está disponível",
        responses: { 200: { description: "API disponível" } },
      },
    },
    "/auth/register": {
      post: {
        summary: "Cria uma conta e retorna o JWT",
        requestBody: { required: true, content: json({ $ref: "#/components/schemas/RegisterRequest" }) },
        responses: {
          201: { description: "Conta criada", content: json({ $ref: "#/components/schemas/AuthResponse" }) },
          400: { description: "Dados inválidos" },
          409: { description: "E-mail já cadastrado" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Autentica uma conta e retorna o JWT",
        requestBody: { required: true, content: json({ $ref: "#/components/schemas/AuthRequest" }) },
        responses: {
          200: { description: "Login realizado", content: json({ $ref: "#/components/schemas/AuthResponse" }) },
          400: { description: "Dados ausentes" },
          401: { description: "Credenciais inválidas" },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Obtém o usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Usuário", content: json({ type: "object", properties: { user: { $ref: "#/components/schemas/User" } } }) },
          401: { description: "Token inválido" },
        },
      },
    },
    "/works": {
      get: {
        summary: "Lista as obras do usuário autenticado",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "type", schema: { type: "string", enum: ["movie", "series"] } },
          { in: "query", name: "status", schema: { type: "string", enum: ["want_to_watch", "watching", "watched"] } },
        ],
        responses: {
          200: { description: "Obras", content: json({ type: "object", properties: { data: { type: "array", items: { $ref: "#/components/schemas/Work" } } } }) },
          401: { description: "Token inválido" },
        },
      },
      post: {
        summary: "Adiciona uma obra à coleção do usuário autenticado",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: json({ $ref: "#/components/schemas/WorkInput" }) },
        responses: {
          201: { description: "Obra criada", content: json({ $ref: "#/components/schemas/Work" }) },
          400: { description: "Dados inválidos" },
          401: { description: "Token inválido" },
        },
      },
    },
    "/works/{id}": {
      parameters: [{ in: "path", name: "id", required: true, schema: { type: "string", format: "uuid" } }],
      get: {
        summary: "Obtém uma obra",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Obra", content: json({ $ref: "#/components/schemas/Work" }) },
          401: { description: "Token inválido" },
          404: { description: "Obra não encontrada" },
        },
      },
      put: {
        summary: "Substitui uma obra",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: json({ $ref: "#/components/schemas/WorkInput" }) },
        responses: {
          200: { description: "Obra atualizada", content: json({ $ref: "#/components/schemas/Work" }) },
          400: { description: "Dados inválidos" },
          401: { description: "Token inválido" },
          404: { description: "Obra não encontrada" },
        },
      },
      delete: {
        summary: "Exclui uma obra",
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: "Obra excluída" },
          401: { description: "Token inválido" },
          404: { description: "Obra não encontrada" },
        },
      },
    },
  },
};

module.exports = openapi;

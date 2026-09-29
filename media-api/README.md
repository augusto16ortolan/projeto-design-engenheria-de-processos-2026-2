# Media API — Express, JSON, and JWT

A small API with English code and endpoints, plus Portuguese catalog data, for teaching registration, login, password hashing, Bearer tokens, CRUD, filtering, sorting, and pagination. It contains the 20 Marvel movies and 6 Marvel series from `react-native-navegacao`.

## Run the project

```bash
cd media-api
npm install
cp .env.example .env
npm run dev
```

The API starts at `http://localhost:3000`.

## Swagger

After starting the server, open [http://localhost:3000/api-docs](http://localhost:3000/api-docs). Use **Authorize** to paste the JWT returned by login; Swagger will send it as a Bearer token to protected routes. The raw OpenAPI document is available at `GET /openapi.json`.

## Demo account

| Email | Password |
| --- | --- |
| `professor@media.dev` | `123456` |

Passwords are stored as a bcrypt hash in `database.json`, never as plain text.

## Authentication flow

1. Send `POST /auth/login` with the demo account.
2. Copy the `token` from the response.
3. Send `Authorization: Bearer YOUR_TOKEN` with every `/media` request.
4. Change data and inspect `database.json` to observe persistence.

## Routes

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | API health check. |
| `POST` | `/auth/register` | No | Register a user and return a token. |
| `POST` | `/auth/login` | No | Login and return a JWT valid for one hour. |
| `GET` | `/auth/me` | Yes | Return the authenticated user. |
| `GET` | `/media` | Yes | List movies and series with filters. |
| `GET` | `/media/genres` | Yes | List available genres. |
| `GET` | `/media/:id` | Yes | Get one item. |
| `POST` | `/media` | Yes | Create a movie or series. |
| `PUT` | `/media/:id` | Yes | Replace one item. |
| `DELETE` | `/media/:id` | Yes | Delete one item. |

## Filtering, sorting, and pagination

`GET /media` accepts these optional query parameters:

| Parameter | Example | Description |
| --- | --- | --- |
| `type` | `movie` or `series` | Filter by media type. |
| `genre` | `Ação` | Match a genre, case-insensitively. |
| `q` | `thor` | Search title and synopsis. |
| `year` | `2021` | Match one release year. |
| `yearFrom` / `yearTo` | `2015` / `2020` | Filter an inclusive year range. |
| `minRating` | `8` | Return ratings greater than or equal to this value. |
| `sort` | `title`, `year`, or `rating` | Select the sorting field. |
| `order` | `asc` or `desc` | Select sorting direction. |
| `page` / `limit` | `2` / `5` | Paginate results; limit is capped at 50. |

Example:

```text
GET /media?type=series&genre=Ação&yearFrom=2020&minRating=7&sort=rating&order=desc&page=1&limit=5
```

The response has `data` and `pagination` (`page`, `limit`, `total`, and `totalPages`).

`GET /media` returns compact card data only: `id`, `type`, `title`, `year`, `genres`, `ageRating`, `rating`, and `imageUrl`. Use `GET /media/:id` to retrieve full details, including `synopsis`, duration, cast, studio, and other optional fields.

## Request examples

### Register

```json
{
  "name": "Maria",
  "email": "maria@example.com",
  "password": "secret123"
}
```

### Create a series

```json
{
  "type": "series",
  "title": "Example Series",
  "year": 2026,
  "duration": "8 episodes",
  "seasons": 1,
  "episodes": 8,
  "genres": ["Action", "Adventure"],
  "ageRating": "12 years",
  "rating": 8.1,
  "creator": "Example Creator",
  "imageUrl": "https://example.com/poster.jpg",
  "synopsis": "An example series used in class."
}
```

Required fields are `type`, `title`, `year`, `genres`, `rating`, `imageUrl`, and `synopsis`. The API returns JSON errors with suitable HTTP status codes: `400`, `401`, `404`, and `409`.

## Tests

```bash
npm test
```

The test suite checks registration, duplicate email handling, login, invalid tokens, filtering, genre discovery, and full CRUD. It always uses a temporary database.

## Postman collection

Import `postman/Media_API.postman_collection.json` into Postman. Run **Login (save token)** before the protected requests; the collection automatically saves both the JWT `token` and the ID returned by **Create Media**.

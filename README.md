<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Teslo API

NestJS-powered REST API for product management. Features CRUD operations, pagination, validation, and PostgreSQL integration.

## Installation

1. Clone the project
```bash
git clone https://github.com/carfdev/teslo-shop.git
```

2. Install the dependencies 
```bash
yarn install
```

3. Rename the file ```.env.template``` to ```.env```

4. Change the environment variables in the ```.env```

5. Start the database
```bash
docker compose up -d
```

6. Run the project in development mode
```bash
yarn start:dev
```

## Environment Variables

* `DB_HOST`: PostgreSQL host
* `DB_PORT`: PostgreSQL port (default: 5432)
* `DB_USER`: Database user
* `DB_PASSWORD`: Database password
* `DB_NAME`: Database name

## Project Structure

```text
src/
├── app.module.ts        # Root module
├── main.ts              # Entry point
├── common/              # Shared utilities
│   ├── dto/             # Data transfer objects
│   └── interfaces/      # Type definitions
└── products/            # Product domain
    ├── entities/        # TypeORM entities
    ├── dto/             # Validation schemas
    ├── controllers/     # REST endpoints
    └── services/        # Business logic
```

## API Endpoints

| Method | Endpoint              | Description                       |
|--------|-----------------------|-----------------------------------|
| POST   | `/api/products`       | Create new product                |
| GET    | `/api/products`       | Get paginated products            |
| GET    | `/api/products/:term` | Get product by UUID or slug       |
| PATCH  | `/api/products/:id`   | Update product                    |
| DELETE | `/api/products/:id`   | Delete product                    |


## Key Features

- **Validation:** `class-validator` DTOs for request payloads  
- **Error Handling:** Custom TypeORM error interception  
- **Pagination:** `?limit=` and `?offset=` query parameters  
- **Slug Generation:** Auto-generate SEO-friendly slugs  
- **Database:** PostgreSQL with Dockerized setup

## Development Commands

| Command           | Description                   |
|-------------------|-------------------------------|
| `yarn build`      | Compile TypeScript to JS      |
| `yarn format`     | Format code with Prettier     |
| `yarn lint`       | Lint code with ESLint         |
| `yarn start:prod` | Run compiled production build |


## Error Responses

### Common error codes:

- `400 Bad Request`: Invalid request body/parameters
- `404 Not Found`: Resource not found
- `500 Internal Error`: Server-side exception (check logs)

### Example error (23505 duplicate key):
```json
{
  "statusCode": 400,
  "message": "Key (slug)=(existing_slug) already exists"
}
```

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

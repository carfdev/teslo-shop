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

7. Create first user admin and get a jwt
```bash
curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
           "email": "admin@google.com",
           "password": "Abc123",
           "fullName": "Admin"
         }'
```

8. Make a GET request to the `SEED` endpoint with jwt to populate the database with test data
```bash
curl -X GET http://localhost:3000/api/seed \
     -H "Authorization: Bearer your_admin_token"
```

## Environment Variables

* `DB_HOST`: PostgreSQL host
* `DB_PORT`: PostgreSQL port (default: 5432)
* `DB_USER`: Database user
* `DB_PASSWORD`: Database password
* `DB_NAME`: Database name
* `PORT`: Server port
* `HOST_API`: Server host URL
* `JWT_SECRET`: Secret key for JWT authentication

## Project Structure

```text
src/
  ├── app.module.ts
  ├── main.ts
  ├── auth/                  # Authentication module
  │   ├── auth.controller.ts
  │   ├── auth.module.ts
  │   ├── auth.service.ts
  │   ├── decorators/
  │   ├── dto/
  │   ├── entities/
  │   ├── guards/
  │   ├── interfaces/
  │   └── strategies/
  ├── common/                # Shared utilities
  │   ├── common.module.ts
  │   ├── common.service.ts
  │   ├── dto/
  │   │   └── pagination.dto.ts
  │   └── interfaces/
  │       └── typeORM-error.interface.ts
  ├── files/                 # File upload module
  │   ├── files.controller.ts
  │   ├── files.module.ts
  │   ├── files.service.ts
  │   └── helpers/
  ├── message-ws/            # WebSockets module
  │   ├── message-ws.gateway.ts
  │   ├── message-ws.module.ts
  │   └── message-ws.service.ts
  ├── products/              # Products module
  │   ├── products.controller.ts
  │   ├── products.module.ts
  │   ├── products.service.ts
  │   ├── dto/
  │   │   ├── create-product.dto.ts
  │   │   └── update-product.dto.ts
  │   └── entities/
  │       ├── index.ts
  │       ├── product-image.entity.ts
  │       └── product.entity.ts
  └── seed/                  # Database seeding
      ├── seed.controller.ts
      ├── seed.module.ts
      ├── seed.service.ts
      └── data/
          └── seed-data.ts
```

## API Endpoints

### Products
| Method | Endpoint                        | Description                       | Auth Required |
|--------|---------------------------------|-----------------------------------|---------------|
| POST   | `/api/products`                 | Create new product                | Admin         |
| GET    | `/api/products`                 | Get paginated products            | User          |
| GET    | `/api/products/:term`           | Get product by UUID or slug       | User          |
| PATCH  | `/api/products/:id`             | Update product                    | Admin         |
| DELETE | `/api/products/:id`             | Delete product                    | Admin         |

### Authentication
| Method | Endpoint                        | Description                       | Auth Required |
|--------|---------------------------------|-----------------------------------|---------------|
| POST   | `/api/auth/register`            | Register new user                 | No            |
| POST   | `/api/auth/login`               | Login user                        | No            |
| GET    | `/api/auth/check-status`        | Get paginated products            | User          |

### Files
| Method | Endpoint                        | Description                       | Auth Required |
|--------|---------------------------------|-----------------------------------|---------------|
| POST   | `/api/files/product`            | Upload product image              | Admin         |
| GET    | `/api/files/product/:imageName` | Get product image                 | User          |

### Seed
| Method | Endpoint                        | Description                       | Auth Required |
|--------|---------------------------------|-----------------------------------|---------------|
| GET    | `/api/seed`                     | Populate the database             | Admin         |


## Authentication

The API uses JWT (JSON Web Token) for authentication. There are three user roles:
- `user`: Regular user with read access
- `admin`: Administrator with full access
- `super-user`: Special role with extended privileges

To authenticate, include the JWT token in the Authorization header:
```bash
Authorization: Bearer <token>
```

## Key Features

- **Authentication:** JWT-based authentication with role-based access control 
- **Validation:** `class-validator` DTOs for request payloads  
- **Error Handling:** Custom TypeORM error interception  
- **Pagination:** `?limit=` and `?offset=` query parameters  
- **Slug Generation:** Auto-generate SEO-friendly slugs  
- **File Uploads:** Support for image uploads with validation
- **WebSockets:** Real-time communication support
- **API Documentation:** Swagger UI available at `/doc` endpoint
- **Database:** PostgreSQL with Dockerized setup

## Development Commands

| Command             | Description                   |
|---------------------|-------------------------------|
| `yarn build`        | Compile TypeScript to JS      |
| `yarn format`       | Format code with Prettier     |
| `yarn lint`         | Lint code with ESLint         |
| `yarn start:dev`    | Run in dev mode               |
| `yarn start:debug`  | Run in debug mode             |
| `yarn start:prod`   | Run compiled production build |


## Error Responses

### Common error codes:

- `400 Bad Request`: Invalid request body/parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
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

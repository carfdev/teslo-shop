# Etapa de dependencias
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Etapa de construcción
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Etapa de obtener el node_modules de prod
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod && yarn cache clean

# Etapa de producción (usando distroless)
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

# Copiar solo los archivos necesarios
COPY package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules

# Cambiar permisos para ejecutar la app
RUN adduser --disabled-password teslouser
RUN chown -R teslouser:teslouser /usr/src/app
USER teslouser

# EXPOSE 3000
CMD ["node", "dist/main"]

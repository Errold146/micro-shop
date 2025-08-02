<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# __Micro-Shop__ __API__

## Descripción del proyecto

Micro-Shop API es una solución backend desarrollada con NestJS que gestiona productos de una tienda en línea a nivel microservicio. Está diseñada con principios de arquitectura limpia, escalabilidad y experiencia de usuario en mente. El sistema permite crear, buscar, actualizar y eliminar productos, integrando funcionalidades como:

- Generación de slugs únicos para evitar duplicados
- Normalización de etiquetas directamente en los DTOs
- Búsqueda flexible por título, id's y slug's
- Operaciones en cascada para imágenes asociadas a productos
- Respuestas robustas para facilitar microinteracciones en el frontend

## Tecnologías utilizadas

- **NestJS** – Framework progresivo para Node.js con arquitectura modular y soporte para TypeScript  
- **TypeORM** – ORM para manejar operaciones con la base de datos de forma sencilla y robusta  
- **PostgreSQL** – Base de datos relacional utilizada para almacenar los productos e imágenes  
- **Docker** – Contenedores para levantar la base de datos de forma rápida y aislada  
- **Yarn** – Gestor de paquetes para instalar dependencias del proyecto  
- **slugify** – Utilidad para generar slugs limpios y consistentes  
- **DTOs y Validaciones** – Para asegurar integridad de datos en cada operación  

# Pasos a seguir

## 1. Clonar el repositorio

```bash
$ git clone [<URL-micro-shop>](https://github.com/Errold146/micro-shop)
```

## 2. Reconstruir los módulos de node

```bash
$ yarn install
```

## 3. Clonar el archivo `.env.template` y renombrarlo a `.env`, rellenando las variables de entorno con los valores a utilizar

## 4. Levantar la base de datos

```bash
$ docker-compose up -d
```

## 5. Correr el proyecto en modo de desarrollo

```bash
$ yarn start:dev
```

## 6. Ejecutar SEED para insertar datos de prueba en la tabla de productos y la tabla de imágenes  
(Cada vez que corra este script se eliminará cualquier dato existente en la base de datos y no se podrá recuperar dicha información)

```bash
$ http://localhost:3000/api/seed
```

# Rutas principales de la API

| Método | Endpoint                     | Descripción                                 |
|--------|------------------------------|---------------------------------------------|
| GET    | `/api/products`              | Obtener todos los productos                 |
| GET    | `/api/products/:term`        | Buscar producto por ID, slug o título       |
| POST   | `/api/products`              | Crear un nuevo producto                     |
| PATCH  | `/api/products/:id`          | Actualizar un producto existente            |
| DELETE | `/api/products/:id`          | Eliminar un producto                        |
| GET    | `/api/seed`                  | Insertar datos de prueba (productos/imágenes) |

## Ejemplo de respuesta: `GET /api/products`

```json
[
  {
    "id": "a1b2c3d4",
    "title": "Camisa de algodón",
    "slug": "camisa-de-algodon",
    "price": 29.99,
    "tags": ["ropa", "algodón", "camisas"],
    "images": [
      {
        "url": "https://example.com/images/camisa.jpg"
      }
    ]
  }
]
```

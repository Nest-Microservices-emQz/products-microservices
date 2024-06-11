# Products Microservice


## Dev
1. Clonar el repositorio
2. instalar dependencias
3. Crear Archivo `.env` basado en el `env.templete`
4. Ejecutar migracion de prima `npx primsma migrate dev`
5. Levantar Nats
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
6. Ejecutar `npm run start:dev`

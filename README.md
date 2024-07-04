# $🔺 FINANCIAL CONTROL

##  🔵💻 Ejecutar proyecto en desarrollo
1. Clonar el repositorio en la carpeta deseada
2. Crear copia del `.env.example` y renombrarlo a `.env` y cambiar las variables
3. Instalar las dependencias
```bash
npm install
# or
yarn install
```
4. Levantar la base de datos `docker compose up -d`, asegurarse que esté arriba el Docker Deamon
5. Correr las migraciones de Prisma `npx prisma migrate dev`
6. Ejecutar el seed
```bash
npm run seed
# or
yarn seed 
```
7. Correr el comando para iniciar el proyecto
```bash
npm run dev
# or
yarn dev
```
8. Abrir [http://localhost:3000](http://localhost:3000) para ver el proyecto
9. Limpiar el Localstorage para que se borre los ID anteriores 

## 🟢💻 Ejecutar proyecto en producción
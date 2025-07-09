# Usa una imagen oficial de Node
FROM node:22-alpine

# Directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto (usa el mismo que en tu app)
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
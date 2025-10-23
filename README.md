# R2 SaaS API - Cloudflare R2 Storage Service

API SaaS para gestión de archivos usando Cloudflare R2 como backend de almacenamiento.

## 🚀 Migración de FTP a Cloudflare R2

Este proyecto ha sido migrado de un sistema FTP a Cloudflare R2 para mejor rendimiento, escalabilidad y costo-efectividad.

## 📋 Requisitos

- Node.js 18+
- PostgreSQL
- Cuenta de Cloudflare con R2 habilitado
- Bucket de R2 configurado

## 🛠️ Configuración de Cloudflare R2

### 1. Crear un Bucket R2

1. Ve a tu dashboard de Cloudflare
2. Navega a R2 Object Storage
3. Crea un nuevo bucket
4. Configura las políticas de acceso público si es necesario

### 2. Generar API Keys

1. Ve a "Manage R2 API tokens"
2. Crea un nuevo token con permisos de:
   - Object:Read
   - Object:Write  
   - Object:Delete

### 3. Configurar dominio personalizado (opcional)

1. En la configuración del bucket, conecta un dominio personalizado
2. Esto te dará una URL pública para acceso directo a los archivos

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configura las variables de entorno en `.env`:

   ```env
   # Configuración de Cloudflare R2
   R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your-r2-access-key-id
   R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
   R2_BUCKET_NAME=your-bucket-name
   R2_PUBLIC_URL=https://your-bucket.your-account.r2.dev
   ```

3. Configura la base de datos PostgreSQL:
   ```env
   DB_HOST=localhost
   DB_NAME=ftp_saas_db
   DB_USERNAME=postgres
   DB_PASSWORD=password
   ```

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar migración de base de datos (si vienes de FTP)
node scripts/migrate-to-r2.js

# Iniciar en modo desarrollo
npm run dev

# Iniciar en producción
npm start
```

## 🔌 API Endpoints

### Subir archivo
```http
POST /file
Headers:
  api-key: your-api-key
  Content-Type: multipart/form-data

Body:
  file: [archivo]
  path: [ruta opcional dentro del prefix]
```

**Ejemplos con cURL:**

```bash
# Ejemplo básico - subir imagen a la raíz del prefix del cliente
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./mi-imagen.jpg"

# Subir archivo a una subcarpeta específica dentro del prefix
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./documento.pdf" \
  -F "path=documentos/contratos"

# Subir múltiples tipos de archivo
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./backup.zip" \
  -F "path=backups/$(date +%Y-%m)"

# Desde Windows PowerShell
curl.exe -X POST "http://localhost:3000/file" `
  -H "api-key: sk_live_abc123xyz789" `
  -F "file=@C:\Users\Usuario\Desktop\archivo.xlsx" `
  -F "path=uploads"
```

**Respuesta exitosa:**
```json
{
  "state": "success",
  "file": "mi-imagen.jpg",
  "path": "https://mi-bucket.mi-cuenta.r2.dev/cliente-a/mi-imagen.jpg"
}
```

**Respuesta de error:**
```json
{
  "state": "error",
  "file": "documento.pdf",
  "error": "Access denied"
}
```

### Eliminar archivo
```http
DELETE /file
Headers:
  api-key: your-api-key
  Content-Type: application/json

Body:
{
  "path": "https://your-bucket.your-account.r2.dev/path/to/file.jpg"
}
```

**Ejemplos con cURL:**

```bash
# Eliminar archivo específico
curl -X DELETE "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "https://mi-bucket.mi-cuenta.r2.dev/cliente-a/documentos/contrato.pdf"
  }'

# Desde Windows PowerShell
curl.exe -X DELETE "http://localhost:3000/file" `
  -H "api-key: sk_live_abc123xyz789" `
  -H "Content-Type: application/json" `
  -d '{"path": "https://mi-bucket.mi-cuenta.r2.dev/cliente-a/imagen.jpg"}'
```

**Respuesta exitosa:**
```json
{
  "message": "File deleted successfully",
  "path": "https://mi-bucket.mi-cuenta.r2.dev/cliente-a/documento.pdf"
}
```

### Probar conexión
```bash
# Verificar que la API esté funcionando
curl -X GET "http://localhost:3000/"

# Respuesta esperada:
{
  "message": "Welcome to the R2 SaaS API - Cloudflare R2 Storage Service",
  "storage": "Cloudflare R2",
  "version": "2.0.0"
}
```

## 🔐 Autenticación y Organización

El sistema usa API Keys para autenticación. Cada API Key está asociada a un "prefix" (prefijo/carpeta) dentro del bucket R2 que determina dónde pueden subir y borrar archivos los usuarios.

### Estructura de un bucket R2:
```
mi-bucket-principal/
├── cliente1/           ← prefix para cliente1
│   ├── documentos/
│   └── imagenes/
├── cliente2/           ← prefix para cliente2
│   ├── uploads/
│   └── backups/
└── sistema-interno/    ← prefix para uso interno
    └── configs/
```

En la tabla `permission`:
- `apiKey`: La clave API del usuario
- `prefix`: El prefijo/carpeta dentro del bucket donde puede operar (ej: "cliente1/", "proyecto-a/")
- `system`: Nombre del sistema cliente
- `responsible`: Responsable del sistema

**Ejemplo de URLs resultantes:**
- `https://mi-bucket.mi-cuenta.r2.dev/cliente1/documentos/contrato.pdf`
- `https://mi-bucket.mi-cuenta.r2.dev/cliente2/uploads/archivo.jpg`

### Ejemplo de configuración de permisos:

```sql
-- Insertar un nuevo cliente con su carpeta asignada
INSERT INTO file.permission (system, responsible, prefix, apiKey) 
VALUES (
    'Sistema Cliente A', 
    'juan.perez@empresa.com', 
    'cliente-a/', 
    'sk_live_abc123xyz789'
);

-- Insertar otro cliente
INSERT INTO file.permission (system, responsible, prefix, apiKey) 
VALUES (
    'Proyecto Especial', 
    'maria.garcia@startup.com', 
    'proyecto-especial/uploads/', 
    'sk_live_def456uvw012'
);
```

## 🌊 Migración desde FTP

Si estás migrando desde el sistema FTP anterior:

1. Ejecuta el script de migración de base de datos:
   ```bash
   node scripts/migrate-to-r2.js
   ```

2. Migra manualmente los archivos existentes del FTP a R2 (puedes usar herramientas como `rclone`)

3. Actualiza las URLs de archivos existentes en tu aplicación cliente

## 🏗️ Estructura del Proyecto

```
├── src/
│   ├── app.js                 # Aplicación principal
│   ├── config/
│   │   └── constants/
│   │       └── indes.js       # Configuración de variables
│   ├── database/
│   │   ├── models/            # Modelos de Sequelize
│   │   └── config/            # Configuración de DB
│   ├── middleware/
│   │   └── auth.middleware.js # Middleware de autenticación
│   ├── routes/
│   │   ├── main.router.js     # Router principal
│   │   └── file.router.js     # Router de archivos
│   └── utils/
│       └── files.js           # Utilidades para R2
├── scripts/
│   └── migrate-to-r2.js       # Script de migración
└── package.json
```

## 🐳 Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## ⚡ Beneficios de R2 vs FTP

- **Rendimiento**: Acceso global y CDN integrado
- **Escalabilidad**: Sin límites de almacenamiento
- **Costo**: Más económico que otros proveedores de object storage
- **Seguridad**: Encriptación automática y control de acceso granular
- **Disponibilidad**: 99.9% de uptime garantizado
- **API**: Compatible con S3, fácil integración
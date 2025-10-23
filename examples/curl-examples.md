# 🧪 Ejemplos de cURL para Testing

Este archivo contiene ejemplos prácticos para probar la API de R2 SaaS.

## 🔧 Configuración Previa

1. Asegúrate de tener la API ejecutándose:
   ```bash
   npm run dev
   ```

2. Configura tus variables de entorno en `.env`

3. Ten listo un API key válido en la base de datos

## 📤 Subir Archivos

### Ejemplo básico
```bash
# Subir una imagen a la raíz del prefix del cliente
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./test-image.jpg"
```

### Subir a subcarpeta
```bash
# Subir archivo a una carpeta específica
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./documento.pdf" \
  -F "path=documentos/importantes"
```

### Subir con fecha automática
```bash
# Organizar archivos por fecha (Linux/Mac)
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./backup.zip" \
  -F "path=backups/$(date +%Y/%m/%d)"
```

### Para Windows PowerShell
```powershell
# Subir archivo desde Windows
curl.exe -X POST "http://localhost:3000/file" `
  -H "api-key: sk_live_abc123xyz789" `
  -F "file=@C:\Users\Usuario\Desktop\archivo.xlsx" `
  -F "path=uploads/excel"

# Con fecha automática en PowerShell
$fecha = Get-Date -Format "yyyy/MM/dd"
curl.exe -X POST "http://localhost:3000/file" `
  -H "api-key: sk_live_abc123xyz789" `
  -F "file=@C:\temp\archivo.pdf" `
  -F "path=daily-uploads/$fecha"
```

### Diferentes tipos de archivo
```bash
# Imagen
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./logo.png" \
  -F "path=assets/images"

# Documento PDF
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./contrato.pdf" \
  -F "path=legal/contratos"

# Archivo comprimido
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./proyecto.zip" \
  -F "path=downloads"

# Video
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -F "file=@./presentacion.mp4" \
  -F "path=media/videos"
```

## 🗑️ Eliminar Archivos

### Eliminar archivo específico
```bash
curl -X DELETE "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "https://mi-bucket.mi-cuenta.r2.dev/cliente-a/documentos/archivo-viejo.pdf"
  }'
```

### Desde Windows PowerShell
```powershell
# Eliminar archivo
curl.exe -X DELETE "http://localhost:3000/file" `
  -H "api-key: sk_live_abc123xyz789" `
  -H "Content-Type: application/json" `
  -d '{"path": "https://mi-bucket.mi-cuenta.r2.dev/cliente-a/temp/archivo.tmp"}'
```

## 🔍 Verificar Estado de la API

### Endpoint de salud
```bash
# Verificar que la API esté funcionando
curl -X GET "http://localhost:3000/"
```

### Respuesta esperada
```json
{
  "message": "Welcome to the R2 SaaS API - Cloudflare R2 Storage Service",
  "storage": "Cloudflare R2",
  "version": "2.0.0"
}
```

## 🚨 Casos de Error Comunes

### API Key inválido
```bash
curl -X POST "http://localhost:3000/file" \
  -H "api-key: invalid_key" \
  -F "file=@./test.jpg"

# Respuesta:
# {
#   "error": "Forbidden: Invalid API Key"
# }
```

### Sin API Key
```bash
curl -X POST "http://localhost:3000/file" \
  -F "file=@./test.jpg"

# Respuesta:
# {
#   "error": "API Key is required"
# }
```

### Sin archivo
```bash
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789"

# Respuesta:
# {
#   "error": "No files uploaded"
# }
```

### Intentar eliminar archivo fuera del prefix
```bash
curl -X DELETE "http://localhost:3000/file" \
  -H "api-key: sk_live_abc123xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "https://mi-bucket.mi-cuenta.r2.dev/otro-cliente/archivo.pdf"
  }'

# Respuesta:
# {
#   "error": "Forbidden: Cannot delete files outside of your assigned folder prefix"
# }
```

## 📊 Script de Testing Automatizado

### Bash Script (Linux/Mac)
```bash
#!/bin/bash
# test-api.sh

API_KEY="sk_live_abc123xyz789"
BASE_URL="http://localhost:3000"

echo "🧪 Testing R2 SaaS API..."

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
curl -s -X GET "$BASE_URL/" | jq .

# Test 2: Upload file
echo "2️⃣ Testing file upload..."
echo "Hello World!" > test-file.txt
UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/file" \
  -H "api-key: $API_KEY" \
  -F "file=@./test-file.txt" \
  -F "path=test-folder")

echo $UPLOAD_RESPONSE | jq .

# Test 3: Delete file (extract path from upload response)
echo "3️⃣ Testing file deletion..."
FILE_PATH=$(echo $UPLOAD_RESPONSE | jq -r '.path')
curl -s -X DELETE "$BASE_URL/file" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"path\": \"$FILE_PATH\"}" | jq .

# Cleanup
rm test-file.txt

echo "✅ Testing completed!"
```

### PowerShell Script (Windows)
```powershell
# test-api.ps1

$API_KEY = "sk_live_abc123xyz789"
$BASE_URL = "http://localhost:3000"

Write-Host "🧪 Testing R2 SaaS API..." -ForegroundColor Green

# Test 1: Health check
Write-Host "1️⃣ Testing health endpoint..." -ForegroundColor Yellow
$healthResponse = curl.exe -s -X GET "$BASE_URL/"
Write-Host $healthResponse

# Test 2: Upload file
Write-Host "2️⃣ Testing file upload..." -ForegroundColor Yellow
"Hello World from PowerShell!" | Out-File -FilePath "test-file.txt" -Encoding UTF8
$uploadResponse = curl.exe -s -X POST "$BASE_URL/file" `
  -H "api-key: $API_KEY" `
  -F "file=@./test-file.txt" `
  -F "path=test-folder"

Write-Host $uploadResponse

# Test 3: Delete file
Write-Host "3️⃣ Testing file deletion..." -ForegroundColor Yellow
$responseObj = $uploadResponse | ConvertFrom-Json
$filePath = $responseObj.path
$deleteResponse = curl.exe -s -X DELETE "$BASE_URL/file" `
  -H "api-key: $API_KEY" `
  -H "Content-Type: application/json" `
  -d "{`"path`": `"$filePath`"}"

Write-Host $deleteResponse

# Cleanup
Remove-Item "test-file.txt"

Write-Host "✅ Testing completed!" -ForegroundColor Green
```

## 🎯 Casos de Uso Reales

### Subir avatar de usuario
```bash
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_cliente_webapp" \
  -F "file=@./avatar-usuario-123.jpg" \
  -F "path=users/avatars"
```

### Subir factura en PDF
```bash
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_sistema_contable" \
  -F "file=@./factura-2024-001.pdf" \
  -F "path=invoices/2024/october"
```

### Backup de base de datos
```bash
curl -X POST "http://localhost:3000/file" \
  -H "api-key: sk_live_backup_system" \
  -F "file=@./db-backup-$(date +%Y%m%d).sql.gz" \
  -F "path=backups/database"
```
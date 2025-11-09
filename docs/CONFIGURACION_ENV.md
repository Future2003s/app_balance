# Configuración de Variables de Entorno

## Archivo .env.local

El archivo `.env.local` ya ha sido creado con las siguientes variables:

```env
MONGODB_URI=mongodb+srv://minhyii:MinhYi1210@application.mhjgmga.mongodb.net/?appName=Application
MONGODB_DB_NAME=quan-ly-chi-tieu
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## ⚠️ IMPORTANTE: Reiniciar el Servidor

Después de crear o modificar el archivo `.env.local`, **DEBES reiniciar el servidor de desarrollo** para que Next.js cargue las nuevas variables de entorno.

### Pasos:

1. **Detén el servidor actual** (Ctrl + C en la terminal)

2. **Reinicia el servidor:**

   ```bash
   npm run dev
   ```

3. **Verifica la conexión:**
   - Deberías ver en la consola: `✅ Connected to MongoDB`
   - Si hay errores, verifica que la URL de MongoDB sea correcta

## Verificación

Si después de reiniciar sigues teniendo problemas, verifica:

1. **El archivo existe:** Debe estar en la raíz del proyecto (mismo nivel que `package.json`)
2. **Sin espacios extra:** Asegúrate de que no haya espacios antes o después del `=`
3. **Sin comillas:** Las variables NO deben tener comillas alrededor del valor
4. **Formato correcto:**
   ```env
   MONGODB_URI=tu_url_aqui
   MONGODB_DB_NAME=nombre_base_datos
   ```

## Solución de Problemas

Si el error persiste después de reiniciar:

1. Elimina la carpeta `.next`:

   ```bash
   rm -rf .next
   ```

2. Reinicia el servidor:

   ```bash
   npm run dev
   ```

3. Verifica que el archivo `.env.local` tenga exactamente este contenido:
   ```
   MONGODB_URI=mongodb+srv://minhyii:MinhYi1210@application.mhjgmga.mongodb.net/?appName=Application
   MONGODB_DB_NAME=quan-ly-chi-tieu
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

## Variables de Entorno Requeridas

- **MONGODB_URI**: URL de conexión a MongoDB Atlas
- **MONGODB_DB_NAME**: Nombre de la base de datos (opcional, por defecto: `quan-ly-chi-tieu`)
- **JWT_SECRET**: Clave secreta para firmar tokens JWT (cambiar en producción)

# Generar Hash de Contraseña

Este script genera el hash bcrypt para una contraseña.

## Uso

```bash
# Navegar al backend
cd backend

# Ejecutar script
node scripts/generate-password-hash.js
```

## Ejemplo
Para la contraseña `ManoloSanchis`, ejecutar el script generará un hash como:
```
$2a$10$FxiJP7/KKs4bYPL7cC9Hl...
```

Copiar este hash y reemplazarlo en `docker/init.sql` en la línea del usuario isaez.

## Notas
- Cada vez que ejecutes el script, genera un hash diferente (debido al salt)
- Todos los hashes son válidos para la misma contraseña
- Los hashes de bcryptjs empiezan con `$2a$`, `$2b$` o `$2y$`

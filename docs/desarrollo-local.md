# Desarrollo local

Requisitos: Node.js, npm y Docker Desktop iniciado.

Desde la carpeta `portafolio-web`:

```sh
docker compose up -d --wait
npm ci
npm run dev -- --hostname 127.0.0.1
```

Sitio: http://localhost:3000/es (también `/en`).
Administración: http://localhost:3000/admin. En una base vacía, crea allí el primer usuario administrador.

La configuración privada está en `.env.local`, excluido de Git:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=mongodb://127.0.0.1:27018/portafolio?replicaSet=rs0&directConnection=true
PAYLOAD_SECRET=<secreto aleatorio>
```

Para generar un secreto en otra instalación: `openssl rand -hex 32`.

MongoDB usa un replica set de un nodo y el volumen persistente `portafolio-web_mongodb_data`. Se publica únicamente en la interfaz local, puerto 27018, sin autenticación; esta configuración es exclusivamente de desarrollo local. No utiliza la instancia existente del puerto 27017.

La base comienza vacía. Puedes introducir contenido desde el panel. Opcionalmente, `npm run seed` carga datos ficticios, incluido un perfil ficticio; úsalo solo si deseas esa demostración.

Para detener Next.js, pulsa Ctrl+C en su terminal. Para detener MongoDB conservando datos:

```sh
docker compose stop
```

Para reiniciar MongoDB: `docker compose up -d --wait`. Evita `docker compose down -v` si deseas conservar los datos.

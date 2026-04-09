# CanchaBook - Reservas Deportivas

**CanchaBook** es una plataforma web para reservar canchas deportivas de manera rápida y sencilla. Conecta a jugadores con las mejores instalaciones locales para Fútbol, Pádel, Tenis y Básquet.

Desarrollado por **sebas**.

## Tecnologías

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos & Auth**: Supabase (PostgreSQL)
- **Animaciones**: Motion

## Primeros Pasos

**Prerrequisitos:** Node.js

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno en [.env.local](.env.local):
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

3. Ejecuta la aplicación:
   ```bash
   npm run dev
   ```

## Base de Datos

Para inicializar el esquema de la base de datos, ejecuta el script `supabase/schema.sql` en el SQL Editor de tu proyecto Supabase.

## Funcionalidades

- 🔐 Autenticación con Google
- 🏟️ Listado y búsqueda de canchas
- 📅 Reservas en tiempo real
- 👤 Gestión de perfiles de usuario
- 🛡️ Panel de administración para dueños de sedes
- 👑 Panel de control maestro (Root)

# 🚗 SF_Usados

Marketplace de autos usados para Santa Fe, Argentina.
Diseño dark racing. Login admin con cookie HTTP-only. Writes admin 100% server-side.

**Stack real (package.json):** Next.js 16 · React 19 · TypeScript 5 · Supabase · Tailwind CSS · Vercel

---

## 🚀 Setup

### 1) Instalar
```bash
git clone https://github.com/TU_USUARIO/sf-usados.git
cd sf-usados
npm install
```

### 2) Crear proyecto Supabase
1. Ir a [supabase.com](https://supabase.com) → New project
2. SQL Editor → ejecutar primero `supabase-schema.sql`
3. Si el proyecto ya existía con políticas viejas, ejecutar además `supabase-secure-policies.sql`

### 3) Variables de entorno
```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...             # solo lectura pública (RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJ...                 # SOLO servidor
ADMIN_PASSWORD=poné-una-password-fuerte
ADMIN_SESSION_SECRET=poné-un-secreto-largo-y-random
NEXT_PUBLIC_SITE_URL=http://localhost:3000       # recomendado para SEO/URLs
```

### 4) Desarrollo local
```bash
npm run dev
```

---

## 🔐 Seguridad y arquitectura (producción)

- `/admin` mantiene login por `ADMIN_PASSWORD` + cookie firmada con `ADMIN_SESSION_SECRET`.
- El cliente del admin **ya no escribe directo** a Supabase.
- Todas las operaciones sensibles pasan por API routes internas:
  - `POST /api/admin/upload`
  - `POST /api/admin/listings`
  - `PATCH /api/admin/listings/[id]`
  - `DELETE /api/admin/listings/[id]`
- Esas rutas validan sesión admin y usan **service role** del lado servidor.
- El backend valida payloads (año/km/precio/moneda), restringe imágenes al bucket público `listings` y sólo acepta MIME permitidos en uploads.
- Público:
  - puede leer solo `listings.is_active = true`
  - puede leer imágenes públicas del bucket `listings`
- No hay políticas públicas de insert/update/delete en `listings` ni upload/delete en `storage.objects`.

### Reglas de despliegue importantes

1. **Nunca** exponer `SUPABASE_SERVICE_ROLE_KEY` en el cliente.
2. Definir todas las env vars en Vercel (Production/Preview según corresponda).
3. Aplicar SQL seguro antes de abrir el panel admin en producción.

---

## 🧪 Checks recomendados antes de deploy

```bash
npm run lint
npm run build
```

Manual:
1. Login en `/admin`
2. Subir imágenes (tipos válidos y tamaño límite)
3. Crear publicación
4. Cambiar activo/destacado
5. Eliminar publicación
6. Verificar que público solo vea activos

---

## 📂 Estructura (resumen)

- `app/admin/page.tsx`: UI admin (solo fetch a API interna)
- `app/api/admin/**`: write flow seguro del admin
- `app/api/listings/**`: lecturas públicas + contador de vistas
- `lib/supabase/public.ts`: cliente público/anon
- `lib/supabase/server.ts`: cliente service-role (server-only)
- `lib/admin/requireAdmin.ts`: guard centralizado de sesión admin
- `supabase-schema.sql` / `supabase-secure-policies.sql`: RLS y policies seguras

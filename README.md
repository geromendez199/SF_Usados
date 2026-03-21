# 🚗 SF_Usados

Marketplace de autos usados para Santa Fe, Argentina.  
Diseño dark racing. Admin-only publishing. Contacto directo por WhatsApp.

**Stack:** Next.js 14 · Supabase · Tailwind CSS · Vercel

---

## 🚀 Setup paso a paso

### 1. Clonar e instalar
```bash
git clone https://github.com/TU_USUARIO/sf-usados.git
cd sf-usados
npm install
```

### 2. Supabase
1. Ir a [supabase.com](https://supabase.com) → New project
2. Región: **South America (São Paulo)**
3. SQL Editor → pegar y ejecutar `supabase-schema.sql`

### 3. Variables de entorno
```bash
cp .env.local.example .env.local
```
Completar con las keys de Supabase (Settings → API):
```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_PASSWORD=sf2024
```

### 4. Dev local
```bash
npm run dev
# → http://localhost:3000
```

### 5. Deploy en Vercel
1. Push a GitHub
2. Vercel → New Project → importar repo
3. Agregar las 5 variables de entorno
4. Deploy 🚀

---

## 🔐 Admin
Entrá en `/admin` — contraseña por defecto: `sf2024`  
Cambiala agregando `NEXT_PUBLIC_ADMIN_PASSWORD` en Vercel.

Desde el admin podés:
- Publicar autos con hasta 8 fotos
- Activar / pausar publicaciones
- Destacar autos (aparecen primero)
- Eliminar publicaciones
- Ver estadísticas de visitas

---

## 📂 Estructura
```
sf-usados/
├── app/
│   ├── page.tsx              # Home con grilla y filtros
│   ├── layout.tsx
│   ├── globals.css           # Design system dark racing
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── listing/[id]/
│   │   ├── page.tsx          # Server component
│   │   └── CarDetail.tsx     # Client component con galería
│   ├── admin/
│   │   └── page.tsx          # Panel completo
│   └── api/listings/
│       └── route.ts
├── components/
│   ├── Navbar.tsx
│   ├── CarCard.tsx
│   └── Filters.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── types/index.ts
└── supabase-schema.sql
```

---

## 💡 Anti-pausa Supabase (gratis)
Configurar en [cron-job.org](https://cron-job.org) un ping cada 3 días a:
```
https://tu-dominio.vercel.app/api/listings
```

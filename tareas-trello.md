# Tareas — Sistema de Gestión de Horas de Servicio

Reorganizado en **fases de flujo continuo**: en la Fase 1 todos arrancan al mismo tiempo sin
depender de nadie (🟢). En la Fase 2 y 3, cada tarea indica de qué depende (🟡) para que sepan
exactamente qué esperar y qué pueden ir adelantando mientras tanto.

> ⚠️ "Progreso del Curso" es una vista requerida por el brief que no tenía card en el Trello —
> está agregada en la lista de Dev C. Avisen al líder para crearla oficialmente en el tablero.

---

## FASE 1 — Cimientos (arrancan todos en paralelo, nadie espera a nadie)

- [ ] **[Líder] Setup del repositorio**
  - Crear repo, rama `main` (protegida) y `develop`, convención `feature/nombre-card` por card
  - README con instrucciones de instalación y `.env` (`VITE_API_URL`)

- [ ] **[Líder] Componente: Loading Spinner / Skeleton** 🟢
  - Un solo componente reutilizable (`<Spinner />` o `<SkeletonCard />`) para los estados de carga
  - Sin dependencias — cualquiera lo puede usar apenas esté listo
  - DoD: acepta un prop de tamaño, se ve bien en botones y en cards completas

- [ ] **[Dev A] AuthContext (sesión/JWT)** 🟢
  - Context con `user`, `role`, `isAuthenticated`, `login()`, `logout()`
  - `GET /api/v1/profile/me` para hidratar sesión al refrescar

- [ ] **[Dev A] Página de Login** 🟢
  - `POST /api/v1/auth/login`, manejo de error de credenciales

- [ ] **[Dev A] Logout** 🟢
  - `POST /api/v1/auth/logout`, limpia Context y cookie

- [ ] **[Dev A] Protección de rutas (Route Guards)** 🟢
  - `<PrivateRoute>` y `<RoleRoute role="ADMIN">`

- [ ] **[Dev A] Layout principal (Sidebar + Navbar)** 🟢
  - Shell básico primero (sin pulir estilos) para que Dev C y Dev D puedan integrar sus páginas ya

- [ ] **[Dev B] Badge de estado de reporte** 🟢
  - Pill de color: PENDING / APPROVED_FULL / APPROVED_PARTIAL / REJECTED
  - `GET /api/v1/enums/report-statuses`

- [ ] **[Dev B] Componente de Paginación** 🟢
  - Recibe `page`, `page_size`, `total`, `onPageChange` — genérico

- [ ] **[Dev B] Modal de confirmación genérico** 🟢
  - Para "¿Eliminar usuario?", "¿Eliminar categoría?", etc.

**Meta de la Fase 1: que al terminar el día 2 existan Layout + Guards + Badge + Paginación + Modal + Spinner, aunque sea sin pulir. Eso es lo mínimo para que el resto no se atasque.**

---

## FASE 2 — Construcción paralela (arranca apenas su dependencia de Fase 1 esté lista)

- [ ] **[Dev A] Página: Mi Perfil**
  - `GET/PATCH /api/v1/profile/me` — 🟡 depende de su propio Layout (Fase 1)

- [ ] **[Dev A] Página: Cambiar contraseña**
  - `PATCH /api/v1/profile/password` — 🟡 depende de Mi Perfil

- [ ] **[Dev B] Sistema de notificaciones (Toast)** 🟢
  - Sin dependencias, se puede hacer en cualquier momento de la Fase 1-2

- [ ] **[Dev B] Componente de carga de archivos PDF** 🟢
  - Drag & drop, valida `.pdf` — sin dependencias, pero Dev C lo necesita pronto (avísenle cuando esté listo)

- [ ] **[Dev B] Dashboard del Estudiante**
  - `GET /api/v1/dashboard/stats` — 🟡 depende de AuthContext + Layout (Dev A, Fase 1)

- [ ] **[Dev B] Visualizar evidencia PDF**
  - `GET /api/v1/reports/{report_id}/evidence/stream` — 🟡 depende de Layout (Dev A)

- [ ] **[Dev C] Gestión de Categorías (CRUD)**
  - `GET/POST /categories/`, `PATCH/DELETE /categories/{id}` — 🟡 depende de Layout + Modal (Fase 1)

- [ ] **[Dev C] Gestión de Cursos (CRUD)**
  - `GET/POST /courses/`, `PATCH/DELETE /courses/{id}` — 🟡 depende de Layout + Modal (Fase 1)

- [ ] **[Dev C] Gestión de Países (CRUD)**
  - `GET/POST /countries/`, `GET/PATCH/DELETE /countries/{id}` — 🟡 depende de Layout + Modal (Fase 1)
  - Nota: no está en la rúbrica, pero `country_id` se usa al crear usuarios — confirmar si el API ya trae países precargados antes de invertir tiempo en el CRUD completo

- [ ] **[Dev D] Listado de Usuarios**
  - `GET /api/v1/users/` — 🟡 depende de Layout + Paginación + Badge (Fase 1)

- [ ] **[Dev D] Estudiantes con horas pendientes (In-Debt)**
  - `GET /api/v1/users/in-debt` — 🟡 depende de Paginación (Fase 1)

**Mientras esperan su dependencia exacta, cada quien puede ir armando su lógica de fetch/estado con datos de prueba (mock) o con un `<table>` sin estilo, y enchufar el componente real de Fase 1 apenas esté disponible — así nadie se queda completamente parado.**

---

## FASE 3 — Integración (depende de piezas de Fase 1 y 2 ya terminadas)

- [ ] **[Dev C] Formulario de envío de reporte**
  - `POST /api/v1/reports/` — 🟡 depende del componente de PDF (Dev B, Fase 2)

- [ ] **[Dev C] Listado de mis reportes**
  - `GET /api/v1/reports/` (paginado) — 🟡 depende de Paginación + Badge (Fase 1)

- [ ] **[Dev C] Editar reporte pendiente**
  - `PATCH /api/v1/reports/{report_id}`, solo si `status === "PENDING"` — 🟡 depende del componente de PDF

- [ ] **[Dev C] Progreso del Curso** *(agregar al Trello)*
  - Mismo endpoint `dashboard/stats` → campo `course_progress` — 🟢 no depende de nadie del equipo

- [ ] **[Dev D] Dashboard de Administrador**
  - `GET /api/v1/dashboard/stats` — 🟡 depende de Layout (Fase 1)

- [ ] **[Dev D] Formulario de creación de usuario**
  - `POST /api/v1/users/` — aviso: contraseña inicial = número de documento

- [ ] **[Dev D] Importación masiva de usuarios (CSV)**
  - `POST /api/v1/users/bulk` — muestra `created`, `skipped`, `errors`

- [ ] **[Dev D] Eliminar usuario**
  - `DELETE /api/v1/users/{user_id}` — 🟡 depende del Modal de confirmación (Fase 1)

- [ ] **[Dev D] Listado de Reportes con filtros**
  - `GET /api/v1/reports/?status=&student_id=` — 🟡 depende de Paginación + Badge (Fase 1)

- [ ] **[Dev D] Revisión y aprobación de reporte (detalle admin)** *(11ª card — confirmar en Trello)*
  - `PATCH /api/v1/reports/{report_id}/review` con `approved_hours` + `reviewer_notes`
  - 🟡 depende del visor de PDF (Dev B, Fase 2) — reutilizar el mismo componente de "Visualizar evidencia"
  - DoD: `approved_hours = 0` → RECHAZADO, `< hours_spent` → parcial, `>= hours_spent` → aprobado total (lo calcula el backend)

---

## Resumen

| Persona | Fase 1 | Fase 2 | Fase 3 | Total |
|---|---|---|---|---|
| Líder | 2 | — | — | 2 |
| Dev A | 5 | 2 | — | 7 |
| Dev B | 3 | 4 | — | 7 |
| Dev C | — | 3 | 4 | 7 |
| Dev D | — | 2 | 6 | 8 |

El líder sigue siendo quien menos código escribe, pero ya no es cero — su componente de Spinner
es chico, aislado y lo usa todo el equipo.

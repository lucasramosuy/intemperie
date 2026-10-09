# intemperie.

El cielo de Uruguay, hecho pintura. Cada departamento tiene una obra generativa que cambia con condiciones reales modeladas por Open-Meteo. La pintura es la interfaz: tocá para leer, deslizá para cambiar de cielo.

## Desarrollo

Node 22 + pnpm 10.18.3. Sin dependencias de runtime, sin API key.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm snapshot
pnpm build
```

Servir `dist/` con un servidor estático. Los módulos requieren HTTP, no `file://`. Todo vive bajo `/intemperie/` tanto en GitHub Pages como en la futura ruta del dominio. Los archivos fuente están en la raíz para mantener el proyecto pequeño. No hay capturas en el repo.

## Datos y costo

- Un punto por departamento en su **capital**, no un promedio territorial. Coordenadas verificadas con geocodificación de Open-Meteo/GeoNames (país UY).
- Una llamada multi-coordenada consulta temperatura, precipitación, nubosidad, velocidad/dirección de viento y código meteorológico: https://open-meteo.com/en/docs . Condiciones actuales de modelos, no lecturas de estaciones.
- Lluvia: milímetros en el intervalo devuelto por la API (habitualmente 15 min), no acumulado diario. Hora en America/Montevideo.
- Snapshot JSON compartido, creado por Actions aproximadamente cada hora. Cero llamadas a Open-Meteo desde visitantes. El sitio pide solo `weather.json` al CDN, con revalidación HTTP. Guarda la última copia local para una visita sin conexión y avisa si tiene más de tres horas.
- Si el proveedor falla, el job falla **antes de publicar**: la versión anterior sigue disponible. No hay fallback a números inventados. Schedules de GitHub no garantizan puntualidad y pueden pausarse en repos sin actividad; README/SRS documentan el aviso visible y la recuperación manual.
- Uso gratuito **no comercial**, sin anuncios/suscripciones: https://open-meteo.com/en/terms . Atribución CC BY 4.0 visible. Multi-coordenadas pueden contar como varias unidades de uso del proveedor; el tráfico sigue acotado a 24 batches diarios más deploys manuales.
- GitHub Actions estándar y Pages en repo público; ningún servicio pago. El cron publica artefactos, no commits automáticos de clima. Sin analítica ni localización del visitante.

## Publicación

El workflow `.github/workflows/site.yml` valida PRs. En merge a main, horario y ejecución manual: obtiene un snapshot, construye y publica GitHub Pages. Configurar **Settings → Pages → Source: GitHub Actions**. El schedule solo corre desde la rama predeterminada. Una PR no publica producción ni invoca la API en CI.

Para el dominio `lucasramos.uy/intemperie/` falta la ruta explícita en el proxy existente a GitHub Pages: su comodín `p-<nombre>` es de Cloudflare Pages, no de GitHub. No se cambia ese proxy desde este repo.

## Diseño y accesibilidad

Space Grotesk + DM Mono, WOFF2 embebidos en el CSS local provenientes del kit de marca. Papel, tinta y terracota. Sin inputs ni estilos del navegador. Targets de 44 px como mínimo, teclado para revelar y navegar, foco visible, nombres accesibles, reduced-motion y pausa fuera de pantalla. Mobile desliza una pintura por vez; desktop muestra tres columnas y los demás departamentos al bajar. Marca hacia el home del proyecto, dominio en el footer. 404 propio.

## Próximos pasos

- Playtest iPhone real y aprobación del PR.
- Activar Pages y verificar el primer workflow tras merge.
- Integrar la ruta del dominio en su propio PR.

Requisitos y decisiones: [SRS.md](./SRS.md).

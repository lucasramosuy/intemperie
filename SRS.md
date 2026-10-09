# SRS: intemperie.

## Objetivo y alcance

Pintar el clima actual modelado de los departamentos de Uruguay como obras abstractas. No es pronóstico, sistema de alertas ni promedio departamental. Una ubicación representativa por departamento: su capital, visible al tocar. Proyecto público no comercial, sin backend ni secretos.

## Requisitos funcionales

1. La colección `departments.json` es la fuente de ubicaciones. Contadores, galería y navegación derivan de sus datos; jamás climas o conteos de UI escritos a mano.
2. `snapshot.mjs` consulta las coordenadas juntas en un solo HTTP a Open-Meteo. Valida cardinalidad, valores finitos y timestamps. Escribe el snapshot solo si todo es válido. Precipitación conserva el intervalo de agregación del proveedor.
3. Temperatura mueve el pigmento entre gris frío y terracota; nubosidad oscurece/espesa; lluvia suma grano y surcos; dirección del viento orienta los trazos y su velocidad ajusta una deriva muy lenta. Cada departamento tiene semilla estable para conservar identidad.
4. Tocar una pintura muestra/oculta datos y capital. Botón nativo con nombre accesible, aria-expanded/controls y teclado. Swipe horizontal con scroll-snap en móvil; miniaturas de 48 × 48 px; flechas de teclado. Desktop: tres columnas que llenan el ancho, colección completa al bajar.
5. Marca `intemperie.` con punto terracota. Space Grotesk y DM Mono locales. Papel/tinta, sin paneles meteorológicos, sombras, iconos emoji ni controles del navegador. 404 con salida útil.
6. Hora visible y aviso de snapshot mayor de tres horas; error si no hay datos, sin llenar pinturas con ejemplos. Reintentar solo solicita el JSON estático. Caché local puede ser denegada sin romper la app.

## Estrategia de caché y publicación

- Un workflow estándar de GitHub Actions ejecuta un batch meteorológico cada hora, lejos del minuto cero, al merge y bajo demanda manual.
- Datos y sitio se publican juntos como artefacto Pages, sin commits de snapshots a main. No se despliega desde PR. Los tests de PR usan fixtures etiquetadas como tests, nunca las serve el sitio.
- Cada visitante consulta únicamente el JSON de Pages. `cache:no-cache` revalida contra CDN; no añade parámetros aleatorios. localStorage conserva la última pintura y selección.
- Cron de GitHub puede demorarse o desactivarse por inactividad. No prometer tiempo real estricto. Timestamp real del snapshot y medición del modelo visibles; después de 3 h aviso de viejo. Un fallo de API interrumpe el job y mantiene el deploy anterior. Recuperación: Run workflow, revisar error y última publicación. No hay polling del visitante ni fallback directo a Open-Meteo.
- 24 batches/día más eventos de deploy. Coordenadas múltiples pueden consumir múltiples unidades; aun multiplicando por los puntos de la colección está lejos de 10 000 diarios. API free solo no comercial. Atribución Open-Meteo / CC BY 4.0.
- Fuente de datos: https://open-meteo.com/en/docs . Condiciones: https://open-meteo.com/en/terms . Un punto de capital no representa todos los microclimas del departamento.

## Calidad

Targets ≥44 px; contenido legible a 320 y 390 px; sin inputs ni zoom forzado; no scroll horizontal de página (solo galería). Foco visible. Canvas decorativo y datos en HTML accesible. Reducir movimiento respeta preferencia del sistema; animación se detiene fuera de pantalla o pestaña oculta. WOFF2 propios, sin Google Fonts. No analítica, cookies, geolocalización ni secretos. JSON validado y textos tratados como texto, no HTML del proveedor.

## Verificación

Tests de ubicaciones, URL multi-punto, normalización horaria y lluvia, rechazo de datos nulos/viejos, obsolescencia y pintura sensible a variables. Playtest de tap/swipe/teclado, reducción de movimiento, error, caché y tamaños 320/390/1440. CI antes de ready. Dominio requiere PR separado del proxy y primera ejecución Pages requiere Source=GitHub Actions. No marcar live antes del primer deploy exitoso.

# Referencia visual de proyectos

La imagen `projects-visual-reference.png` reúne dos vistas: la sección de proyectos destacados dentro del home y la página completa de proyectos.

## Sistema visual

- Azul eléctrico: `#0344DC`
- Azul tinta: `#01203F`
- Papel: `#EEF4ED`
- Rojo de acción: `#FF1700`
- Azul suave: `#A8C3FF`
- Tipografía: display condensada y pesada para títulos; sans geométrica para texto; monoespaciada para índices y metadatos.
- Recursos: carteles inclinados, trazos de brocha, flechas dibujadas y textura de papel. Deben funcionar como acentos y no competir con el contenido.

## Home: proyectos destacados

- Mostrar un máximo de tres proyectos: uno principal y dos secundarios.
- Encabezado con índice de sección, título editorial y una frase breve.
- El proyecto principal ocupa la mayor superficie y comunica la calidad del trabajo mediante una captura real.
- Cada tarjeta incluye índice, nombre, resumen de una línea, año, rol, tecnologías y enlace `VER CASO`.
- Cerrar la sección con un CTA visible: `VER TODOS LOS PROYECTOS →`.
- El orden debe venir de `featured` y `featuredOrder`.

## Página de proyectos

- Hero corto con título `PROYECTOS` y rango temporal.
- Filtros por tipo: todos, full stack, frontend, backend y experimentos.
- Retícula editorial de seis proyectos por primera carga, combinando tarjetas horizontales y verticales sin cambiar su anatomía.
- La primera tarjeta puede tener mayor tamaño para destacar el caso más importante.
- Conservar un CTA de contacto al final de la página.

## Anatomía de tarjeta

1. Imagen o captura real del producto.
2. Índice editorial de dos dígitos.
3. Nombre del proyecto.
4. Resumen concreto de una línea.
5. Año y rol o categoría.
6. Entre dos y cuatro tecnologías principales.
7. Enlace claro al caso de estudio; evitar depender solo del hover.

## Caso de estudio

La ficha individual debe aprovechar los campos existentes del CMS en este orden:

1. Portada, resumen, rol, año y enlaces de demo/repositorio.
2. Problema y contexto.
3. Solución y participación personal.
4. Funciones principales.
5. Arquitectura y decisiones técnicas.
6. Galería de pantallas.
7. Resultados y aprendizajes.
8. Navegación al proyecto anterior/siguiente y CTA de contacto.

## Comportamiento y accesibilidad

- En móvil, apilar las tarjetas y mantener la imagen antes que el texto.
- Los filtros pueden desplazarse horizontalmente, con estado activo visible.
- En hover, usar elevación corta, zoom mínimo de imagen y desplazamiento de la flecha.
- Respetar `prefers-reduced-motion` y estados de foco visibles.
- No incrustar títulos o descripciones dentro de las capturas: deben permanecer como HTML.
- Usar texto alternativo descriptivo para cada imagen de proyecto.

## Prompt final utilizado

```text
Use case: ui-mockup. Create one polished high-fidelity design board for a full-stack developer portfolio that shows two Spanish website views: a homepage section for featured projects and a dedicated projects index page. Use the supplied images only as style references. Preserve the portfolio language of electric cobalt, off-white, deep navy, vivid red, brush strokes, stickers and tilted paper strips. The home section must show “02 / PROYECTOS DESTACADOS”, the headline “TRABAJO QUE HABLA”, three asymmetric project cards named “NÉBULA”, “BRISA” and “ATLAS”, and the CTA “VER TODOS LOS PROYECTOS →”. The projects page must show compact navigation, the title “PROYECTOS”, “SELECCIÓN 2024—2026”, filter chips, and a practical editorial grid of six cards named “NÉBULA”, “BRISA”, “ATLAS”, “PULSO”, “ORBITA” and “TALLER”. Every card includes index, title, short description, year, role/category, technology chips, thumbnail and link affordance. Close with “¿TIENES UNA IDEA? HABLEMOS →”. Realistic shippable web UI, Swiss grid mixed with handmade poster collage, strong hierarchy, accessible contrast, buildable in HTML/CSS. Avoid generic SaaS dashboards, glassmorphism, excessive gradients, cyberpunk, 3D objects, people, illegible microtext and clutter.
```

Generación realizada con la herramienta integrada de ImageGen en modo `ui-mockup`, usando las dos imágenes adjuntas como referencias de estilo.

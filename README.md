# LectuX

LectuX es una aplicación web educativa dirigida a estudiantes de grado 5 de primaria. El objetivo es fortalecer las habilidades de lectoescritura mediante actividades interactivas y personalizadas.

## Características
- **Pantalla de inicio:** selección de perfil (estudiante o docente) con guía por voz.
- **Perfil del estudiante:** registro básico con correo Gmail, avatar e idioma.
- **Actividades:**
  - Lectura con reconocimiento de voz y retroalimentación.
  - Escritura con sugerencias simples.
  - Generador de libros utilizando un modelo de IA.
- **Progreso y recompensas:** barra de progreso y puntos almacenados localmente.
- **Panel del docente:** visualización de progreso y puntos de los estudiantes.
- **Temario:** incluye clases de textos, mitos y leyendas, creación y redacción de textos, gramática, géneros literarios, poesía y más.

La interfaz utiliza tonalidades de azul y plata y se apoya en la Web Speech API para la voz guía y el reconocimiento de voz.

## Uso

Abrir `index.html` en un navegador moderno (se recomienda Chrome). No se requiere servidor.

## Desarrollo

Los estilos y scripts se encuentran en `assets/`. Para extender la funcionalidad, modifique los archivos correspondientes.

## Pruebas

Este proyecto no incluye pruebas automáticas aún. Ejecute `npm test` para verificar la configuración básica.

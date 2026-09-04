# Andes Capital Real Estate Dashboard

## Objetivo del proyecto
Desarrollar un dashboard ejecutivo de análisis comercial inmobiliario para evaluar ventas, ingresos, comisiones, ticket promedio, canales, segmentos de compradores, tipos de propiedad y retención por cohortes.

## Datasets utilizados
El proyecto utiliza un modelo dimensional de ventas inmobiliarias con las siguientes tablas:

- `hecho_ventas_propiedades`: transacciones de venta con precio, cliente, propiedad, canal y fecha.
- `dim_clientes`: información y segmentación de clientes.
- `dim_propiedades`: características de las propiedades como tipo, tamaño, ubicación y atributos comerciales.
- `dim_fecha`: tabla calendario creada para análisis temporal y métricas por periodo.

## Etapas del análisis realizadas
1. Limpieza y validación de tipos de datos, valores nulos y duplicados.
2. Creación de tabla calendario para análisis temporal.
3. Modelado dimensional en esquema estrella.
4. Construcción de medidas principales: ingreso total, cantidad de ventas, ticket promedio y comisión total.
5. Diseño de dashboard en tres vistas: overview ejecutivo, análisis comercial y cohortes.
6. Análisis de desempeño por ciudad, canal, tipo de propiedad, segmento y antigüedad del cliente.
7. Resumen ejecutivo con hallazgos y recomendaciones de negocio.

## Cómo ejecutar o revisar el notebook
Puedes revisar el notebook de dos formas:

- Abrir el archivo `.ipynb` en Google Colab o Jupyter Notebook.
- Abrir la versión `.html` incluida en el portafolio para lectura rápida desde el navegador.

Para abrirlo en Google Colab:
1. Entra a https://colab.research.google.com/
2. Selecciona Upload.
3. Carga el archivo `andes_capital_real_estate_analysis.ipynb`.
4. Revisa las celdas de análisis, modelado y narrativa ejecutiva.

## Guía breve de reproducción
1. Cargar las tablas de ventas, clientes y propiedades.
2. Validar claves, formatos de fecha, campos monetarios y porcentajes.
3. Crear la dimensión calendario y relacionarla con la tabla de hechos.
4. Construir el modelo estrella en Power BI.
5. Crear medidas de ingresos, ventas, ticket promedio, comisión y crecimiento interanual.
6. Replicar las páginas del dashboard usando el archivo `.pbix`.
7. Comparar resultados contra el PDF ejecutivo exportado.

## Entregables incluidos
- Dashboard Power BI en formato `.pbix`.
- Reporte ejecutivo exportado en PDF.
- Notebook Jupyter como evidencia del proceso analítico.
- Vista HTML del notebook para revisión rápida.

## Principales hallazgos
- El ingreso total fue de $6.01B, generado a través de 8,500 ventas.
- El ticket promedio fue de $707K y la comisión total alcanzó $201M.
- El crecimiento interanual fue de 11.1%.
- Casa fue el tipo de propiedad con mayor revenue, con aproximadamente $2.24B.
- Bogotá fue la ciudad con mayor volumen de ventas.
- El canal Corredor concentró aproximadamente 72.8% del revenue.
- El segmento Primera vez representó la mayor contribución de ingresos.
- La retención M1, M3 y M6 se ubicó alrededor de 9%, mostrando oportunidad para fortalecer recurrencia y relación postventa.

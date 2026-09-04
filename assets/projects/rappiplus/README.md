# RappiPlus Business Performance Dashboard

## Objetivo del proyecto
Evaluar el desempeño comercial, rentabilidad, marketing, comportamiento de clientes, conversión y portafolio de productos de RappiPlus para apoyar decisiones de negocio basadas en datos.

## Datasets utilizados
El proyecto integra fuentes transaccionales, comerciales, de marketing, comportamiento digital y experimento A/B:

- `rappiplus_orders_raw.csv`: pedidos, precios, descuentos, cantidades y revenue.
- `rappiplus_catalog.csv`: costos unitarios, categorías, productos y proveedores.
- `rappiplus_marketing_spend.csv`: inversión de marketing por canal y país.
- `events`, `users` y `user_activity`: comportamiento de usuarios, funnel y retención.
- `experiment_checkout_ui.csv`: prueba A/B sobre cambios en checkout.

## Etapas del análisis realizadas
1. Carga, exploración y validación de calidad de datos.
2. Limpieza de fechas, categorías, cantidades, duplicados, nulos y consistencia de montos.
3. Cálculo de KPIs de revenue, costos, marketing, utilidad y margen.
4. Análisis de comportamiento de compra, ticket promedio, producto más vendido y gasto por canal.
5. Construcción de funnel de conversión con SQL.
6. Análisis de retención por cohortes.
7. Evaluación estadística de experimento A/B con test Z de dos proporciones.
8. Construcción de dashboard ejecutivo en Power BI.

## Cómo ejecutar o revisar el notebook
Puedes revisar el notebook de dos formas:

- Abrir el archivo `.ipynb` en Google Colab o Jupyter Notebook.
- Abrir la versión `.html` incluida en el portafolio para lectura rápida desde el navegador.

Para abrirlo en Google Colab:
1. Entra a https://colab.research.google.com/
2. Selecciona Upload.
3. Carga el archivo `rappiplus_business_performance_analysis.ipynb`.
4. Ejecuta las celdas de Python que cargan datasets públicos.
5. Para las celdas SQL, configura credenciales propias mediante variables de entorno antes de ejecutar.

## Guía breve de reproducción
1. Cargar los datasets de pedidos, catálogo, marketing y experimento.
2. Limpiar y validar las tablas base.
3. Unir pedidos con catálogo para calcular costos y rentabilidad.
4. Calcular KPIs: revenue, costos, marketing, utilidad, margen, ticket promedio y unidades.
5. Ejecutar consultas SQL para funnel y cohortes, usando una conexión propia.
6. Replicar el dashboard en Power BI con los CSV limpios.
7. Comparar resultados contra el PDF ejecutivo exportado.

## Entregables incluidos
- Dashboard Power BI en formato `.pbix`.
- Reporte ejecutivo exportado en PDF.
- Notebook Jupyter limpio, sin credenciales ni links de entrega.
- Vista HTML del notebook para revisión rápida.

## Principales hallazgos
- El negocio generó $9.61M en ingresos totales.
- La utilidad total fue de $2.91M, con margen de utilidad de 30.27%.
- La inversión en marketing fue de $2.87M.
- El ticket promedio fue de $385.85.
- Hogar, Electrónica y Moda tuvieron una participación de revenue equilibrada.
- Desktop y mobile mostraron distribución de ingresos muy cercana.
- El producto Laptop-Gaming-16GB presentó margen bruto negativo, señalando riesgo de rentabilidad.
- El experimento de checkout mostró una mejora de 0.60 puntos porcentuales, pero sin significancia estadística.

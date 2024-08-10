# Backend Node.js Konecta

## Descripción
Este proyecto es una aplicación backend desarrollada en Node.js, utilizando PostgreSQL como base de datos. El proyecto está diseñado para ejecutarse en un entorno Docker, facilitando la configuración y el despliegue en diferentes entornos.

## Requisitos de Instalación
### Prerrequisitos
Docker y Docker Compose instalados en tu sistema.
Node.js v16.x o superior.
NPM como gestor de paquetes.

## Variables de Entorno
Por petición de la prueba técnica las variables de entorno fueron incluidas en el repositorio de esta proyecto.

## Instalación
### Clona el repositorio:
```
git clone https://github.com/henaowilmer/backend-konecta.git
cd backend-konecta
```
### Construye y ejecuta los contenedores Docker:
```
docker-compose up --build
```
La aplicación estará disponible en http://localhost:8080.
### Ejecución de Seeds
Automáticamente al levantar la imagen docker se sincronizan los modelos con la base de datos y se crean los usuarios admin@jsonapi.com con clave secret y employee@jsonapi.com también con clave secret.

El script que se ejecuta automáticamente es src/pg/seedData.js

Se añaden script como src/pg/clearDbs.js para limpiar la base de datos que se deben ejecutar manualmente. 


## Mejores Prácticas
Modularización: El código está dividido en módulos separados para cada funcionalidad, lo que facilita el mantenimiento y la escalabilidad.

Gestión de Errores: Todas las rutas y operaciones críticas están envueltas en bloques try-catch para capturar y manejar excepciones adecuadamente.

Seeds: seeds permite mantener la base de datos en un estado consistente y facilita la adición de datos de prueba en diferentes entornos.


## Seguridad
Autenticación y Autorización: La aplicación utiliza JWT (JSON Web Tokens) para la autenticación y autorización de usuarios, asegurando que solo usuarios autorizados puedan acceder a recursos protegidos.

Variables de Entorno: Las credenciales y configuraciones sensibles están gestionadas a través de variables de entorno, evitando la exposición de información sensible en el código fuente.

Política de Seguridad de Contenidos (CSP): Implementar una CSP adecuada en el servidor para mitigar ataques XSS (Cross-Site Scripting).

Validación de Datos: Todos los inputs recibidos por la API son validados y saneados antes de ser procesados, minimizando el riesgo de inyecciones SQL y otros tipos de ataques basados en datos maliciosos.
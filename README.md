## EASY GROUP

Back End del Proyecto Easy Group, el cual permite a un usuario realizar las siguientes funciones:

1. Crear una cuenta mediante el Registro y luego realizar un Login.(CRUD de Usuarios)

2. Con el usuario Logeado usted puede crear una lista de proyectos, y eliminar los proyectos si desea.(CRUD de proyectos)

3. El usuario puede crear personal de trabajos con diferentes caracteristicas.(CRUD de Personal de trabajo)

4. El usuario puede crear grupos de trabajos y luego agregar el personal de trabajo previamente creado dentro de estos grupos de trabajo.(CRUD de grupos)

### Requerimientos

Para ejecutar la API de manera local se requiere clonar el repositorio y tener instalado node v16.14.0

1. Ejecutar el comando `npm i` para instalar los node_modules

2. Ejecutar el comando `npm start` o `npm run start`

3. Ejecutar `Control + C` para detener el proceso

#### Despliegue en Heroku

Esta API se encuentra desplegada en Heroku, puede utilizar el siguiente enlace antes de las rutas para usar la API.

`https://easy-group.herokuapp.com`

Por ejemplo para el registro:

`https://easy-group.herokuapp.com/auth/register`

### End Points

| Route                                                         | HTTP verb | Route Middleware | Description                                                       |
| ------------------------------------------------------------- | --------- | ---------------- | ----------------------------------------------------------------- |
| /auth/register                                                | POST      |                  | Registrarse con email y password                                  |
| /auth/login                                                   | POST      |                  | Logearse con email y password                                     |
| /auth/user                                                    | GET       | validateJWT()    | Obtiene la informacion del usuario                                |
| /auth/renew                                                   | GET       | validateJWT()    | Revalida el token de autenticación                                |
| /auth/edit                                                    | PUT       | validateJWT()    | Edita información del usuario                                     |
| /auth/change-password                                         | PUT       | validateJWT()    | Cambia la contraseña del usuario                                  |
| /api/project                                                  | POST      | validateJWT()    | Crea un nuevo proyecto                                            |
| /api/project                                                  | GET       | validateJWT()    | Obtiene lista de todos los proyectos del usuario                  |
| /api/project/:id                                              | GET       | validateJWT()    | Obtiene un proyecto en especifico                                 |
| /api/project/getproject/:id                                   | GET       | validateJWT()    | Obtiene el proyecto en un formato especifico                      |
| /api/project/:id                                              | DELETE    | validateJWT()    | Elimina un proyecto                                               |
| /api/technician                                               | POST      | validateJWT()    | Crea un nuevo Personal de trabajo                                 |
| /api/technician                                               | GET       | validateJWT()    | Obtiene lista de todo el personal del usuario                     |
| /api/technician/:id                                           | GET       | validateJWT()    | Obtiene un personal en especifico                                 |
| /api/technician/:id                                           | PUT       | validateJWT()    | Actualiza los datos de un personal en especifico                  |
| /api/technician/:id                                           | DELETE    | validateJWT()    | Elimina un Personal                                               |
| /api/project/group                                            | POST      | validateJWT()    | Crea un nuevo nuevo grupo                                         |
| /api/project/group/:projectId                                 | GET       | validateJWT()    | Obtiene la lista de todos los grupos del proyecto                 |
| /api/groups                                                   | GET       | validateJWT()    | Obtiene todos los grupos del usuario                              |
| /api/project/group/:groupId                                   | GET       | validateJWT()    | Obtiene los datos de un grupo en especifico                       |
| /api/project/addTechnician/:groupId/:technicianId             | PUT       | validateJWT()    | Agrega o Elimina un Personal de un proyecto                       |
| /api/project/group/:startGroupId/:finishGroupId/:technicianId | PUT       | validateJWT()    | Elimina un Personal de un grupo y lo agrega al otro grupo         |
| /api/project/group/:groupId/:score                            | PUT       | validateJWT()    | Actualiza la puntuacion de un grupo cuando termina un trabajo     |
| /api/project/dragGroup/:startStateId/:finishStateId/:groupId  | PUT       | validateJWT()    | Actualiza el cambio de estado de un grupo                         |
| /dragTechnician/:groupId/:techId/:startIndex/:endIndex        | PUT       | validateJWT()    | Actualiza el orden del personal dentro de un grupo (/api/project) |
| /dragGroupInStatus/:statusId/:groupId/:startIndex/:endIndex"  | PUT       | validateJWT()    | Actualiza el orden del grupo dentro de un estado (/api/project)   |

### Prueba la API

Puede utilizar la aplicación Postman o similares para probar la API:

#### Register and Login

1. Para crear un nuevo usuario realice un POST al siguiente end point de registro:

`http://localhost:8080/auth/register`

Seleccionar body, tipo raw, formato Json e ingresar por ejemplo:

```json
{
  "email": "correo1@correo.com",
  "password": "123456Aa"
}
```

Los campos Email y Password son requeridos para crear un usuario, si usted no los ingresa obtendra una respuesta negativa (status 400).

De obtener una respuesta exitosa (status 200) en la respuesta podra obtener un token de autenticación el cual le servira para realizar las demas peticiones.

Nota: En este proyecto los token tienen una vigencia de 24 horas.

2. Si usted ya cuenta con una cuenta creada puede realizar una petición POST al siguiente end point de Login:

`http://localhost:8080/auth/login`

Al igual que con el registro debe seleccionar body, tipo raw, formato Json e ingresar por ejemplo:

```json
{
  "email": "correo1@correo.com",
  "password": "123456Aa"
}
```

Los campos Email y Password también son requeridos para ingresar con un usuario, si usted no los ingresa obtendra una respuesta negativa (status 400).

De obtener una respuesta exitosa (status 200) en la respuesta podra obtener un token de autenticación el cual le servira para realizar las demas peticiones.

#### De esa manera se pueden probar los demas end-points

#### END

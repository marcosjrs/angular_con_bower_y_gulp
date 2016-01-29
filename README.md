Angularjs instalado mediante bower y con gulp para tareas típicas
=================================================================


**Se creó una carpeta**

Desde la linea de comandos, situandose en esa carpeta, se tipó: npm init    contestanto a lo que se nos pregunta. Esto creará el package.json

**Se instaló gulp de forma global:**
    

    npm install -g gulp

**Se añadió como requisito en el package.json con**

    npm install --save-dev gulp

**Instalamos gulp-connect. Gracias a lo cual podremos hacer que se actualice continuamente en el servidor, cada vez que hagamos modificaciones...**

    npm install --save-dev gulp-connect

**Instalamos connect-history-api-fallback. Gracias a lo cual podremos utilizar la api nativa de html5 para navegar através del historial, muy útil en SPA**

    npm install --save-dev connect-history-api-fallback

**Creamos archivo gulpfile.js:**

En este archivo vamos a crear todas las tareas necesarias para el desarrollo de nuestra aplicación (el archivo se crea en el directorio principal del proyecto). En el se creará la tarea de crear un servidor, un listener de cambios en archivos con extensión html y de recargar el servidor cuando eso ocurra. Además haremos una tarea inicial, que cuando la llamemos ejecutará las tareas principales. La forma de crear tareas es:

// Incluimos el modulo gulp
var gulp = require("gulp");

// creamos la tarea
gulp.task("nombre_tarea", function () {
    // Proceso de la tarea
});

El contenido del archivo mencionado será:

    var gulp = require("gulp"),
        connect = require("gulp-connect"),
        historyApiFallback = require("connect-history-api-fallback");
    
    gulp.task("server", function () {
        connect.server({
        root: "./app",
        port: 3000,
        livereload: true,
        middleware: function (connect, opt) {
            return [ historyApiFallback({}) ];
        },
        });
    });
    
    gulp.task("html", function () {
        gulp.src("./app/*.html")
        .pipe(connect.reload());
    });
     
    gulp.task("watch", function () {
        gulp.watch(["./app/*.html"], ["html"]);
    });
    
    gulp.task("default", ["server", "watch"]);

Luego crearemos una carpeta llamada app donde pondremos los html que se ejecutarán al llamarlos (ya que así lo decidimos en el gulpfile.js cuando pusimos como atributo root: "./app" en la creación del "server" ).

Una vez hecha la página con AngularJS,  desde la línea de comandos ejecutamos

    gulp

 
para que ejecute el gulpfile.js y por tanto ejecute las tareas mencionadas...


 Avanzando un poco más
====================

**Se creo la estructura de carpetas tal que:**

root-app-folder  (en nuestro caso carpeta app)
    ├── index.html
    ├── scripts
    │   ├── controllers
    │   │   └── main.js
    │   │   └── ...
    │   ├── directives
    │   │   └── myDirective.js
    │   │   └── ...
    │   ├── filters
    │   │   └── myFilter.js
    │   │   └── ...
    │   ├── services
    │   │   └── myService.js
    │   │   └── ...
    │   ├── vendor
    │   │   ├── angular.min.js
    │   └── app.js
    ├── styles
    │   └── ...
    └── views
        ├── main.html
        └── ...

**Instalamos bower (gestor de dependencias que tira de bower.json)**

    npm i -g bower

**y creamos el archivo bower.json mediante la instruccion correspondiente de bower**

    bower init

**Creamos el archivo bower.rc (archivo de configuración de bower, donde por ej. se indica donde se van a instalar las dependencias de bower, en nuestro caso en app/vendor)**

    {
        "directory": "app/vendor"
    }

**Configuramos el proceso que realizará bower, por ejemplo cada vez que instalemos una dependencia con bower la queremos instalar directamente en index.html, con la ayuda de la dependencia wiredep y gulp-inject (que nos ayudará a injectar archivos js y css que crearemos dentro del directorio scripts y styles)**

    npm i -D gulp-connect wiredep

    npm install gulp-inject --save-dev

**Modificamos el gulpfile.js para añadir estas dos dependencias. De tal forma que las dependencias son: **

    var gulp = require("gulp"),
        connect = require("gulp-connect"),
        historyApiFallback = require("connect-history-api-fallback"),
        inject = require('gulp-inject'),
        wiredep = require('wiredep').stream;

**Y moodificamos el gulpfile.js de nuevo, para crear los nuevos task para que haga la injeccion de archivos que mencionabamos**


    gulp.task("inject", ["wiredep"] ,function () {
        var sources = gulp.src(["./app/scripts/**/*.js", "./app/styles/**/*.css"]);

        return gulp.src("index.html", {
        cwd: "./app"
        })
        .pipe(inject(sources, {
        read: false
        }))
        .pipe(gulp.dest("./app"));
    });

    gulp.task("wiredep", function () {
        return gulp.src("index.html", {
        cwd: "./app"
        })
        .pipe(wiredep({
        directory: "./app/vendor",
        read: false,
        onError: function (err) {
            console.log(err.code);
        }
        }))
        .pipe(gulp.dest("./app"));
    });

    gulp.task("watch", function () {
        gulp.watch(["./app/**/*.html"], ["html"]);
        gulp.watch(["./app/scripts/**/*.js"], ["inject"]);
        gulp.watch(["./app/styles/**/*.css"], ["inject"]);
        gulp.watch(["./bower.json"], ["wiredep"]);
    });

    gulp.task("default", ["inject", "server", "watch"]);

**Una vez insertado este codigo en gulpfile.js, hay que recordar crear la carpeta /app/vendor, para que bower descargue a esa carpeta tal como hemos puesto en el codigo anterior.**

**Luego podremos empezar a instalar los paquetes mediante bower**
    bower install --save angular
    bower install --save bootstrap




Para descargar y ejecutar este proyecto
=======================================
Al github no he subido los módulos, por tanto los hay que descargar a posteriori. Los pasos son los siguientes:

Clonar el proyecto
    git clone https://github.com/marcosjrs/angular_con_bower_y_gulp.git

Luego en la carpeta app, crear una carpeta llamada vendor, que es donde se instalaran los modulos mediante bower.

Instalar las dependencias.

    npm install
    bower install

Arrancar las tareas.

    gulp


Al instalar bootstrap con bower notamos que solo se nos inyecta el archivo js a nuestro archivo index.html pero el css no.

Esto sucede por que en el archivo bower.json (ubicado dentro del directorio bootstrap) no viene configurado el archivo css.

Para solucionarlo buscamos esta parte del código en el archivo "bower.json" (en root/app/vendor/bootstrap).-

    "main": [
        "less/bootstrap.less",
        "dist/js/bootstrap.js"
    ],

Y la reemplazamos por esta.-

    "main": [
        "less/bootstrap.less",
        "dist/js/bootstrap.js",
        "dist/css/bootstrap.css"
    ],


Créditos:  **codeando.org**

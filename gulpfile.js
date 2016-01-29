
/*En este archivo vamos a crear todas las tareas necesarias para el desarrollo de nuestra aplicación 
(el archivo se crea en el directorio principal del proyecto).
 En el se creará la tarea de crear un servidor, un listener de cambios en archivos con extensión html y 
 de recargar el servidor cuando eso ocurra. Además haremos una tarea inicial, que cuando la llamemos 
 ejecutará las tareas principales. */

// Incluimos el modulo gulp
var gulp = require("gulp");

// creamos la tarea
gulp.task("nombre_tarea", function () {
    // Proceso de la tarea
});

var gulp = require("gulp"),
	connect = require("gulp-connect"),
	historyApiFallback = require("connect-history-api-fallback"),
	inject = require('gulp-inject'),
	wiredep = require('wiredep').stream;

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
 


//Tarea que conseguirá inyectarnos, en el index.html, los archivos que nosotros creamos manualmente
gulp.task("inject", ["wiredep"] ,function () {
	//indicamos donde se encuentran todos los archivos js y todos los css
    var sources = gulp.src(["./app/scripts/**/*.js", "./app/styles/**/*.css"]);

    //Le indicamos a gulp que estos archivos se van a inyectar en el archivo index.html que lo encontrará
    //en app, le vamos a decir que nos inyecte todos los archivos mencionados, y mediante los parametros
    //le diremos que no queremos que los archivos sean leidos pq. no vamos a modificarlos y le decimos que 
    //y le indicamos con el metodo gulp.dest que el index.html se encuentra en /app
    return gulp.src("index.html", {
	cwd: "./app"
    })
    .pipe(inject(sources, {
	read: false
    }))
    .pipe(gulp.dest("./app"));
});

//Tarea que hará que inserte, en el index.html, todas las dependencias que instalemos con bower.
gulp.task("wiredep", function () {
	//indicamos donde se encuentra el archivo index.html que será el quese utilice para inyectarle los 
	//links de las dependencias que vamos instalando en /app/vendor.
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
    .pipe(gulp.dest("./app"));// le decimos que está en app
});

//Tarea watch para que escuche todos los cambios que van surgiendo en los archivos que nos interesan y
//y le asociamos las tareas correspondientes (que se deben ejecutar ante esos cambios)
gulp.task("watch", function () {
    gulp.watch(["./app/**/*.html"], ["html"]);
    gulp.watch(["./app/scripts/**/*.js"], ["inject"]);
    gulp.watch(["./app/styles/**/*.css"], ["inject"]);
    gulp.watch(["./bower.json"], ["wiredep"]);
});

gulp.task("default", ["inject", "server", "watch"]);
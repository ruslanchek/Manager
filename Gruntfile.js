var js_src = [
    // Libs
    'assets/js/libs/jquery.js',
    'assets/js/libs/underscore.js',
    'assets/js/libs/handlebars.js',
    'assets/js/libs/ember.js',
    'assets/js/libs/ember-data.js',

    // App
    'assets/js/app.js'
];

module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ['assets/less'],
                    sourceMap: true,
                    sourceMapFilename: 'public/css/main.css.map',
                    sourceMapURL: '/css/main.css.map',
                    outputSourceFiles: true
                },
                files: {
                    'public/css/main.css': 'assets/less/main.less'
                }
            },
            production: {
                options: {
                    paths: ['assets/less'],
                    cleancss: true
                },
                files: {
                    'public/css/main.css': 'assets/less/main.less'
                }
            }
        },
        copy: {
            main: {
                flatten: true,
                src: 'assets/js/',
                dest: 'public/js/'
            }
        },
        fileblocks: {
            todos: {
                src: 'views/include/scripts.dev.ejs',
                    blocks: {
                    app: {
                        src: js_src
                    }
                }
            }
        },
        clean: ['public/js/'],
        concat: {
            options: {

            },
            dist: {
                src: js_src,
                dest: 'public/js/app.js'
            }
        },
        uglify: {
            options: {
                sourceMap: false
            },
            files: {
                'public/js/app.js': ['public/js/app.js']
            }
        },
        watch: {
            development: {
                files: ['assets/less/*.less', 'assets/js/*.js'],
                tasks: ['less', 'copy', 'fileblocks']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-file-blocks');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    //grunt.registerTask('default', ['less:development', 'clean', 'copy', 'fileblocks', 'watch']);
    grunt.registerTask('default', ['less:production', 'clean', 'concat', 'uglify']);
    // TODO: сделать копирование img и прочей херни, наладить правильное копирование js файлов, сделать создание ejs со скриптамидля dev/prod отделные чтобы сувались туда правильные файлы
};
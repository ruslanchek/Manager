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
        concat: {
            options: {

            },
            dist: {
                src: [
                    // Libs
                    'assets/js/libs/jquery.js',
                    'assets/js/libs/underscore.js',
                    'assets/js/libs/handlebars.js',
                    'assets/js/libs/ember.js',
                    'assets/js/libs/ember-data.js',

                    // App
                    'assets/js/app.js'
                ],
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
                tasks: ['less', 'concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less:development', 'watch']);
    grunt.registerTask('production', ['less:production', 'concat', 'uglify']);
    // TODO: доделать production и протестить
};
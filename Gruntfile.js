module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ['assets/less']
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
                    'assets/js/app.js'
                ],
                dest: 'public/js/app.js'
            }
        },
        uglify: {
            options: {
                beautify: true,
                sourceMap: false,
                sourceMapName: 'public/app.js.map'
            },
            files: {
                'public/js/app.js': ['public/js/app.js']
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['less/*.less'],
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', 'concat', 'watch']);
};
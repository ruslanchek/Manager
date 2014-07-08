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

var js_src_pub = [];

for(var i = 0; i < js_src.length; i++){
    js_src_pub.push(js_src[i].replace('assets', 'public'));
}

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
            js: {
                cwd: './assets/js/',
                expand: true,
                flatten: false,
                src: ['**/*'],
                dest: './public/js/'
            },
            img: {
                cwd: './assets/img/',
                expand: true,
                flatten: false,
                src: ['**/*'],
                dest: './public/img/'
            },
            views: {
                cwd: './assets/views/',
                expand: true,
                flatten: false,
                src: ['**/*'],
                dest: './public/views/'
            }
        },
        'file-creator': {
            basic: {
                'views/include/scripts.dev.ejs': function(fs, fd, done) {
                    fs.writeSync(fd, '<!-- fileblock:js app --><!-- endfileblock -->');
                    done();
                }
            }
        },
        fileblocks: {
            development: {
                src: 'views/include/scripts.dev.ejs',
                options: {
                    prefix: '/'
                },
                blocks: {
                    app: {
                        src: js_src_pub
                    }
                }
            },
            production: {
                src: 'views/include/scripts.dev.ejs',
                options: {
                    prefix: '/'
                },
                blocks: {
                    app: {
                        src: 'public/js/app.js'
                    }
                }
            }
        },
        clean: [
            'public/js/',
            'views/include/scripts.dev.ejs'
        ],
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
                compress: true,
                sourceMap: false
            },
            my_target: {
                files: {
                    'public/js/app.js': ['public/js/app.js']
                }
            }
        },
        watch: {
            development: {
                files: ['assets/less/*.less', 'assets/js/*.js', 'assets/views/*', 'assets/img/*'],
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
    grunt.loadNpmTasks('grunt-file-creator');

    grunt.registerTask('default', ['less:development', 'copy:js', 'copy:img', 'copy:views', 'fileblocks:development', 'watch']);
    grunt.registerTask('development', ['less:development', 'clean', 'copy:js', 'copy:img', 'file-creator', 'copy:views', 'fileblocks:development']);
    grunt.registerTask('production', ['less:production', 'copy:img', 'copy:views', 'clean', 'file-creator', 'concat', 'uglify', 'fileblocks:production']);
};
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        type: {
            all: {
                files: [
                    { src: ['src/*.ts', 'test/*.ts'], dest: 'build' }
                ],
                options: {
                    sourcemap: false,
                    target: 'es5',
                    nolib: false,
                    declaration: false,
                    comments: false,
                    module: 'commonjs'
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'interpreter.js': ['build/src/*.js']
                }
            }
        },
        nodeunit: {
            all: ['build/test/*.js']
        },
        uglify: {
            all: {
                options: {
                    banner: '/*! <%= pkg.name %>: <%= grunt.template.today("mm-dd-yyyy") %> */\n',
                    mangle: false
                },
                files: {
                    'interpreter.min.js': [
                        'interpreter.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-type');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['type', 'browserify', 'uglify']);
    grunt.registerTask('test', ['type', 'nodeunit']);
};
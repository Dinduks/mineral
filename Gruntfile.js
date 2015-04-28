module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: '-spec'
      },
      all: ['spec/']
    },
    peg: {
      example: {
        src: "src/parser/grammar.pegjs",
        dest: "src/parser/peg.js",
        options: {
          cache: true
        }
      }
    }
    ,
    browserify: {
      dist: {
        files: {
          'javascripts/mineral.js': [
            'src/interpreter.js',
            'src/scope.js',
            'src/parser/parser.js'
          ],
          'javascripts/custom.js': ['examples/custom.js']
        }
        /*
        ,
        options: {
          //transform: ['coffeeify']
        }
        */
      }
    }
  });

  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('specs', ['peg', 'jasmine_node']);
  grunt.registerTask('default', ['specs']);
};

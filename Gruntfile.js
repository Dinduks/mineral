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
        src: "parser/grammar.pegjs",
        dest: "parser/peg.js",
        options: {
          cache: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('specs', ['peg', 'jasmine_node']);
  grunt.registerTask('default', ['specs']);
};

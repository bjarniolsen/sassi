module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			dist: {
				files: {
					'assets/js/dist/base.min.js': ['assets/js/src/base.js']
				}
			}
		},
		watch: {
			js: {
				files: 'assets/js/src/*.js',
				tasks: 'uglify:dist'
			}
		}

	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default', 'uglify');
};

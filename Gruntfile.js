module.exports = function(grunt) {
	//https://www.npmjs.org/doc/json.html
	
	Array.prototype.append = function (item) {
		var length = this.length;
		var index =  (length > 0)?length-1:0;
		this.splice(index, 0, item);
		return this;
	};
		
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin master',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
			}
		},
		jshint: {
			default: ['Gruntfile.js', 'tests/**/*.js', 'bin/**/*.js', 'lib/**/*.js'],
			build: {
				options: {
					reporter: 'checkstyle',
					reporterOutput: 'build/results/jshint-checkstyle-result.xml'
				},
				src: ['Gruntfile.js', 'data/seed_products.js', 'tests/**/*.js', 'server/**/*.js', 'public/app/**/*.js']
			}
		},
		jasmine_node: {
			options: {
				forceExit: true,
				verbose: true,
				match: '.',
				matchall: false,
				extensions: 'js',
				specNameMatcher: '*Spec'
				/*jUnit: {
					report: true,
					savePath : "../build/reports/jasmine-junit.xml",
					useDotNotation: true,
					consolidate: true
				}*/
			},
			unit: ['test/unit/'],
			int: ['test/int/']
		},
		plato: {
			build: {
				files: {
					'build/reports/code-analysis': ['server/**/*.js', 'public/app', 'tests/**/*.js'],
				}
			},
			release: {
				files: {
					'build/reports/code-analysis': ['server/**/*.js', 'public/app', 'tests/**/*.js'],
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		}
	});

	// register tasks.
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-bump');
	
	//testing
	grunt.registerTask('test', ['jshint', 'jasmine_node:unit', 'jasmine_node:int']);
	
	//code quality
	grunt.registerTask('lint', ['jshint:default']);
	grunt.registerTask('cq', ['plato:build']);
	
};
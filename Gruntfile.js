module.exports = function(grunt) {
  // Automatically load required Grunt tasks
  require('load-grunt-tasks')(grunt);

  // Set the path for aplication
  var config = {
    app: 'app',
    src: 'src'
  };

  grunt.initConfig({
    config: config,
    jshint: {
      all: {
        src: [
          'Gruntfile.js', '<%= config.src %>/scripts/{,*/}*.js', '!<%= config.src %>/scripts/plugins/{,*/}*.js']
      }
    },
    clean: {
      css: ["<%= config.app %>/styles/*.css", "!<%= config.app %>/styles/main.min.css"],
      general: ["<%= config.app %>"]
    },
    sass: {
      dist: {
        options: {
          compass: true        
        },
        files: {
          '<%= config.app %>/styles/main.css': '<%= config.src %>/styles/main.scss'
        }
      }
    },
    connect: {
      server: {
        options: {
          open: true,
          port: 8000,
          base: {
            path: '<%= config.app %>',
            options: {
              index: 'index.html',
              maxAge: 300000
            }
          }
        }
      }
    },
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 1
        },
        files: [{
          expand: true,
          cwd: '<%= config.src %>',             // Src matches are relative to this path
          src: ['images/**/*.{png,jpg,gif}'],   // Select all images and folders from images folder
          dest: '<%= config.app %>'             // Destination path prefix
        }]
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/',
          src: ['*.css', '!*.min.css'],
          dest: '<%= config.app %>/styles/',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      my_target: {
        files: {
          '<%= config.app %>/scripts/main.min.js': ['<%= config.src %>/scripts/**/*.js','!<%= config.src %>/scripts/plugins/**/*.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          archive: '<%= config.app %>/archive.zip'
        },
        expand: true,
        cwd: '<%= config.app %>',
        src: ['**/*']
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: '<%= config.src %>',
        src: ['*.html','*.ico'],
        dest: '<%= config.app %>/',
        flatten: true,
        filter: 'isFile'
      },
      jsPlugins: {
        expand: true,
        cwd: '<%= config.src %>/scripts/plugins',
        src: ['*.js'],
        dest: '<%= config.app %>/scripts/plugins',
        flatten: true,
        filter: 'isFile'
      },
      fonts: {
        expand: true,
        cwd: '<%= config.src %>/fonts',
        src: ['*.eot','*.woff','*.ttf','*.svg'],
        dest: '<%= config.app %>/fonts',
        flatten: true,
        filter: 'isFile'
      }
    },
    
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['Chrome >= 35', 'Firefox >= 31', 'Edge >= 12', 'Explorer >= 9', 'iOS >= 8', 'Safari >= 8', 'Android 2.3', 'Android >= 4', 'Opera >= 12']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.app %>/styles/'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['<%= config.src %>/scripts/{,*/}*.js','Gruntfile.js'],
        tasks: ['jshint', 'uglify', 'copy:jsPlugins'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['<%= config.src %>/styles/{,*/}*.scss'],
        tasks: ['sass','cssmin','clean:css','autoprefixer'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['<%= config.src %>/{,*/}*.html'],
        tasks: ['copy'],
        options: {
          livereload: true
        }
      }
    }
  });
  
  grunt.registerTask('default', ['clean:general','imagemin','sass','cssmin','clean:css','autoprefixer','uglify','copy','connect','watch']);
  grunt.registerTask('compress', ['compress']);
};
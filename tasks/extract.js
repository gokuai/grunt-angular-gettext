var Extractor = require('angular-gettext-tools').Extractor;

module.exports = function (grunt) {
    grunt.registerMultiTask('nggettext_extract', 'Extract strings from views', function () {
        var optionsObj = this.options();
        var optionsArr = optionsObj['0'] ? Object.keys(optionsObj).map(i => optionsObj[i]) : [optionsObj];
        var self = this;
        optionsArr.forEach(function(options){
            if (options.extensions) {
                for (var extension in options.extensions) {
                    var strategy = options.extensions[extension];
                    if (!Extractor.isValidStrategy(strategy)) {
                        grunt.log.error("Invalid strategy " + strategy + " for extension " + extension);
                    }
                }
            }

            self.files.forEach(function (file) {
                var extractor = new Extractor(options);
                var failed = false;

                file.src.forEach(function (filename) {
                    grunt.log.debug("Extracting " + filename);
                    try {
                        extractor.parse(filename, grunt.file.read(filename));
                    } catch (e) {
                        console.log(e);
                        grunt.log.error(e.message);
                        failed = true;
                    }
                });

                if (!failed) {
                    grunt.file.write(file.dest, extractor.toString());
                }
            });
        });
    });
};

var minimist = require('minimist');
var util = require('util');
var _ = require('lodash');


// the only available configuration keys
var configKeys = ['api', 'prism', 'serve'];

// the only available environments
var possibleEnvs = [
    // every day development
    'development',
    // not the "real" production environment, but the closer to it
    'production',
    // backend upgrades, tests, etc ...
    'implementation',
    // local overrides thanks to the local-config.js file
    'local'
];

// global configuration for every environment
// the values in the 'default' object are used if no corresponding value is found
// in the object related to the current environment 
var config = {
    api: {
        default: {
            // Config WLS locale
            protocol: 'http',
            host: 'localhost',
            port: '7001',
            basepath: '/sihm-seed/sihm-seed-back',
            // route pour le back-end
            route: '/sihm-seed-back'
        },
        development: {}
        ,
        production: {
            // you should put the configuration for the ci or production backend server here
        },
        implementation: {}
    },
    prism: {
        default: {
            mode: 'mock',
            port: '3000'
        },
        development: {
        },
        production: {
            mode: 'proxy'
        },
        implementation: {
            mode: 'record'
        }
    },
    serve: {
        default: {
            base: '/'
        }
    },
    build: {
        default: {
            minify: true,
            // permet d'avoir la "vraie" source d'un fichier transpilé / minifié
            sourcemap: false
        },
        development: {
            minify: false,
            sourcemap: true
        },
        implementation: {
            minify: true,
            sourcemap: true
        }
    }
};

// environment setter
var setEnv = function (newEnv) {
    // console.info('info : setting environment to ' + newEnv);
    if (possibleEnvs.indexOf(newEnv) > -1) {
        env = newEnv;
    }
};

// Env par défaut
var env = 'development';

// load local environment configuration
try {
    // Permet de surcharger la config : ne pas commiter le local-config car propre à chaque developpeur
    var localConfig = require('./local-config.js');
    if (localConfig.config) {
        configKeys.forEach((key) => {
            if (localConfig.config[key]) {
                config[key].local = localConfig.config[key];
            }
        });
        setEnv(localConfig[env] || 'local');
    } else if (localConfig[env]) {
        setEnv(localConfig[env]);
    }
} catch (ex) {
    console.info('info : no local configuration');
}

// set the default environment from the NODE_ENV environment variable
// Var à positionner sur le jenkins
env = process.env.NODE_ENV || env;

// get the cli options
var knownOptions = {
    string: 'env'
};

var options = minimist(process.argv.slice(2), knownOptions);

// define the environment from the --env cli option if specified
if (options.env) {
    setEnv(options.env);
}

console.info('environment : ' + env);

// Permet de récupérer la valeur d'une clef du config.js : erreur si la clef n'existe pas
module.exports = {
    // get a configuration element from it's string key
    getConfig: function (key) {
        if (typeof config[key] !== 'undefined' && !_.isEmpty(config[key])) {
            var rslt = _.merge(config[key].default, config[key][env]);
            return rslt;
        }
        throw key + ' is not a valid configuration key';
    },
    // get the current environment string
    getEnv: function () {
        return env;
    },
    options
};

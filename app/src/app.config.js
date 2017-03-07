/**
 * Configuration de l'application à partir du fichier de configuration app/config/config.json
 */
import * as CONFIG from 'config/config.json!';

// lib permettant le chargement en lazy
import { lazyLoadStateFactory } from 'common/utils/routes';

// Définition du thème angular utilisé (chargé à partir du fichier de configuration)
export const mdTheming = $mdThemingProvider => {
    $mdThemingProvider.theme(CONFIG.mdTheme.name)
        .backgroundPalette(CONFIG.mdTheme.bg)[CONFIG.mdTheme.color]();
};
mdTheming.$inject = ['$mdThemingProvider'];

// Configuration de la lib permettant le chargement des modules en lazy loading.
export const lazyLoadConfig = ($futureStateProvider, $httpProvider) => {
    $httpProvider.useApplyAsync(true);
    $futureStateProvider.stateFactory('lazy', lazyLoadStateFactory);
};
lazyLoadConfig.$inject = ['$futureStateProvider', '$httpProvider'];

// Activation du mode HTML5
export const html5modeConfig = $locationProvider => {
    $locationProvider.html5Mode(CONFIG.html5mode);
};
html5modeConfig.$inject = ['$locationProvider'];

// Activation du mode debug
export const debugConfig = ($logProvider, $compileProvider, $ocLazyLoadProvider) => {
    $logProvider.debugEnabled(CONFIG.debug);

    // http://ng-perf.com/2014/10/24/simple-trick-to-speed-up-your-angularjs-app-load-time/
    $compileProvider.debugInfoEnabled(CONFIG.debug);
    $ocLazyLoadProvider.config({ debug: CONFIG.debug });
};
debugConfig.$inject = ['$logProvider', '$compileProvider', '$ocLazyLoadProvider'];

// Configuration de la lib restAngular (définition du context root)
export const restAngular = RestangularProvider => {
    RestangularProvider.setBaseUrl(`${CONFIG.api.root}`);
};
restAngular.$inject = ['RestangularProvider'];

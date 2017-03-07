/**
 * Configuration des routes angular.
 */
import angular from 'angular';

/**
 * Classe permettant la configuration des routes du seed.
 */
export class RoutesConfigurator {

    /**
     *
     * @param params
     * @return {function(*)}
     */
    static generateStateConfig(params) {
        const stateConfig = $stateProvider => {
            params.forEach(definition => {
                $stateProvider.state(definition.name, definition.config);
            });
        };
        stateConfig.$inject = ['$stateProvider'];

        return stateConfig;
    }

    /**
     *
     * @param params
     * @return {function(*)}
     */
    static generateFutureStateConfig(params) {
        const futureStateConfig = $futureStateProvider => {
            params.forEach(definition => {
                $futureStateProvider.futureState(definition);
            });
        };
        futureStateConfig.$inject = ['$futureStateProvider'];
        return futureStateConfig;
    }

    /**
     *
     * @param defaultStateUrl
     * @return {function(*)}
     */
    static generateDefaultStateConfig(defaultStateUrl) {
        const defaultStateConfig = $urlRouterProvider => {
            $urlRouterProvider.otherwise(defaultStateUrl);
        };
        defaultStateConfig.$inject = ['$urlRouterProvider'];

        return defaultStateConfig;
    }

    /**
     *
     * @param config
     * @param merge
     * @return {*}
     */
    static transformStateDefinition(config, merge = false) {
        const paramObj = {
            name: config.name || config.component.$$name,
            config: {
                url: config.path,
                template: config.template || `
                <${config.component.$$config.selector}>
                </${config.component.$$config.selector}>
            `
            }
        };

        if (config.parent) {
            paramObj.config.parent = config.parent;
        }

        if (angular.isDefined(config.abstract)) {
            paramObj.config.abstract = !!config.abstract;
        }

        if (config.data) {
            paramObj.config.data = config.data;
        }

        if (config.resolve) {
            paramObj.config.resolve = config.resolve;
        }

        const mergedObj = paramObj.config;
        mergedObj.name = paramObj.name;
        if (merge) {
            return mergedObj;
        } else {
            return paramObj;
        }
    }
}

/**
 * Module principal de l'application.
 */
import { DashboardsComponent } from 'app/dashboards/dashboards.component';
import { DashboardsModule } from 'app/dashboards/dashboards.module';
import { HomeComponent } from 'app/layout/home.component';
import { AppComponent } from 'app/app.component';

// Chargement de la configuration depuis le fichier de configuration JSON
import * as AppConfig from 'app/app.config';

import { generateRoutesConfigurations } from 'common/utils/routes';

import 'angular-resource';

// Définition du module.
export const AppModule = {
    name: 'sihmSeed',
    dependencies: [
        'ui.router',
        'oc.lazyLoad',
        'ct.ui.router.extras',
        'ngMaterial',
        'restangular',
        'ngResource',
        AppComponent.$$config.templateUrl,
        HomeComponent.$$config.templateUrl,
        DashboardsModule.name
    ]
};

// Définition des routes Angular
export const ROUTES = [
    // Module d'administration
    { name: 'admin', path: '/admin', lazy: true, module: 'app/admin/admin.module' },
    // Module du dashboard
    { name: 'dashboards', path: '/dashboards', component: DashboardsComponent },
    // Module du formulaire
    { name: 'forms', path: '/forms', lazy: true, module: 'app/demo-forms/demo-forms.module' },
    // Page d'accueil
    { path: '/', component: HomeComponent, useAsDefault: true }
];

// Génaration des routes Angular
const routesConfigurations = generateRoutesConfigurations(ROUTES, true);

// Configuration du module.
export let module = angular.module(AppModule.name, AppModule.dependencies)
    .config(AppConfig.lazyLoadConfig)
    .config(AppConfig.mdTheming)
    .config(AppConfig.debugConfig)
    .config(AppConfig.restAngular)
    .component(AppComponent.$$name, AppComponent.$$config)
    .component(HomeComponent.$$name, HomeComponent.$$config)
    .config(routesConfigurations.default)
    .config(routesConfigurations.states)
    .config(routesConfigurations.futureStates);

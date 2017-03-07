import 'babel/external-helpers';

// Permet d'importer les fichiers JSON de configuration comme des classes.
import 'json';

// Il est nécessaire d'importer l'emsemble des dépendances du module common qui sont utilisées dans le projet (y compri celles chargées en lazy)
import 'common/REST_PATHS';
import 'common/WORDING';

// Ensemble des libs utilisées dans le projet (y comprit celles utilisées dans un module chargé en lazy loading)
import 'angular-ui-router';
import 'ui-router-extras';
import 'ocLazyLoad';
import 'common/core';
import './app.component.css!';
import 'angular-material';
import 'angular-material/angular-material.min.css!';
import 'restangular';

import 'app/app.component.css!';

import template from 'app/app.component.tpl';

import * as MaterialUtil from 'common/MaterialUtil';

/**
 * Composant principal de l'application.
 */
export class AppComponent {

    /**
     * Contructeur.
     * @param $log Service angular de logging.
     * @param $mdSidenav Service Angular Materials pour intéragir de manière simple avec le menu de gauche.
     */
    constructor($log, $mdSidenav) {
        // Grâce à ng-annotate la depedency injection fonctionnera qd même après minification sans le tableau de strings des dépendances à injecter.
        // Voir le fonctionnement ici : https://github.com/olov/ng-annotate
        'ngInject';

        $log.debug('App Component');
        this.toggleLeftMenu = MaterialUtil.buildToggler($mdSidenav, $log, 'main-left');
    }

}

// Définition du nom du composant principal.
AppComponent.$$name = 'sihmSeed';

// Configuration du composant.
AppComponent.$$config = {
    selector: 'sihm-seed',
    templateUrl: template.name,
    controller: AppComponent
};

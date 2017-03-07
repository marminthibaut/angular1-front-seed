import template from 'app/layout/home.component.tpl';

/**
 * Composant de la page d'accueil.
 */
export class HomeComponent {

    /**
     * Construteur.
     * @param $log Service angular de logging.
     */
    constructor($log) {

        // Injection du composant dans Angular.
        'ngInject';

        // Home page is alive !!!
        $log.debug('home component');
        this.name = 'home';
    }
}

// Définition du nom du composant.
HomeComponent.$$name = 'home';

// Configuration du composant.
HomeComponent.$$config = {
    selector: 'home',
    templateUrl: template.name,
    controller: HomeComponent
};

// Import du template HTML
import template from 'app/admin/builder.component.tpl';

/**
 * Définition du composant builder.
 */
export class BuilderComponent {

    /**
     * Consstructeur.
     * @param $log Service de logging Angular.
     */
    constructor($log) {
        'ngInject';

        // Builder is alive !!!
        $log.debug('builder!');
    }
}

// Nom du composant
BuilderComponent.$$name = 'builder';

// Configuration du composant.
BuilderComponent.$$config = {
    selector: 'builder',
    templateUrl: template.name,
    controller: BuilderComponent
};

import template from 'app/admin/users.component.tpl';

/**
 * Composant utilisateur.
 */
export class UsersComponent {

    /**
     * Construteur
     * @param $log Service angular de logging.
     */
    constructor($log) {
        'ngInject';

        $log.debug('users!');
    }
}

// Configuration du composant
UsersComponent.$$config = {
    selector: 'users',
    templateUrl: template.name,
    controller: UsersComponent
};

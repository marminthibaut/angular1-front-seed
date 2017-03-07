import template from 'app/dashboards/dashboards.component.tpl';

/**
 * Classe pour la gestion du dashboard.
 */
export class DashboardsComponent {

    /**
     * Constructeur.
     * @param $log Service angular de logging.
     */
    constructor($log) {
        'ngInject';

        // Dashboard is alive !!!
        $log.debug('dashboard!');
    }

}

// Définitin du nom du dashboard
DashboardsComponent.$$name = 'dashboards';

// Définition de la configuration du dashboard.
DashboardsComponent.$$config = {
    selector: 'dashboards',
    templateUrl: template.name,
    controller: DashboardsComponent
};



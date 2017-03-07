/**
 * Composant d'administration.
 */
import 'app/admin/admin.component.css!';
import template from 'app/admin/admin.component.tpl';
import { REST_PATHS } from 'common/REST_PATHS';
import * as CONFIG from 'config/config.json!';

export class AdminComponent {

    /**
     * Constructeur.
     * @param $log Service de logging Angular.
     * @param messageService Service de gestion des messages.
     * @param Restangular Service permettant la simplification des appels RESTFull
     * @param $resource Factory Angular pour des appels REST
     */
    constructor($log, messageService, Restangular, $resource) {
        // Injection du composant pour System.js
        'ngInject';

        $log.debug('admin!');
        this.messageService = messageService;
        this.methodValues = ['http', 'resource', 'restangular'];
        this.Restangular = Restangular;
        this.MessageRsc = $resource(`${CONFIG.api.root}/${REST_PATHS.messages}/:id`, { id: '@id' });
    }

    /**
     * Permet d'avoir le message de chargement pendant la lecture ds données en base.
     */
    getMessage() {
        this.message = 'loading ...';
        switch (this.method) {
        case this.methodValues[1]:
            // angular.resource - solution intermédiaire
            // à favoriser pour un back qui n'est pas RESTful à 100%
            // supprimer la dépendance JSPM si non utilisé
            this.MessageRsc.get({ id: 1 }, rslt => {
                this.message = rslt.message;
            });
            break;
        case this.methodValues[2]:
            // restangular - à favoriser au maximum
            // nécessite un back 100% RESTful
            // supprimer la dépendance JSPM si non utilisé
            this.Restangular.one(REST_PATHS.messages, 1).get().then(rslt => {
                this.message = rslt.message;
            });
            break;
        default:
            // basic $http - solution la plus souple
            this.messageService.get(1).then(rslt => {
                this.message = rslt.data.message;
            });
        }

    }

}
// Nom du composant.
AdminComponent.$$name = 'admin';

// Définition de la configuration du composant.
AdminComponent.$$config = {
    selector: 'admin',
    templateUrl: template.name,
    controller: AdminComponent
};

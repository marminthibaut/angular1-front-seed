import * as CONFIG from 'config/config.json!';
import { REST_PATHS } from 'common/REST_PATHS';

/**
 * Service pour le test des messages.
 * Permet d'appeler une ressource REST.
 */
export class MessageService {

    /**
     * Constructeur.
     * @param $http Service angular pour effectuer des appels HTTP.
     */
    constructor($http) {
        // Injection du service dans Angular (notamment pour supporter la minification).
        'ngInject';

        this.$http = $http;
    }

    /**
     * Permet de récupérer un message.
     * @param id L'identifiant du message à récupérer.
     * @return le message représenté par l'identifiant.
     */
    get(id) {
        return this.$http.get(`${CONFIG.api.root}/${REST_PATHS.messages}/${id}`);
    }

    /**
     * Récupération du tous les messages.
     * @return l'ensemble des messages disponibles.
     */
    all() {
        return this.$http.get(`${CONFIG.api.root}/${REST_PATHS.messages}`);
    }
}

MessageService.$$id = 'messageService';


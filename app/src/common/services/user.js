
import angular from 'angular';

/**
 * Service exemple pour la gestion des utilisateurs.
 */
class CurrentUser {
    /**
     * Constructeur.
     * @param $q Service pour requêtes asynchrones (promise).
     */
    constructor($q) {
        'ngInject';

        this.$q = $q;
    }

    /**
     * Récupération de l'utilisateur.
     */
    getUser() {
        // Activation des promise.
        const deferred = this.$q.defer();

        deferred.resolve({
            name: 'Panda'
        });

        return deferred.promise;
    }
}

// configuration du service.
export default angular
    .module('user', [])
    .factory('CurrentUser', CurrentUser);

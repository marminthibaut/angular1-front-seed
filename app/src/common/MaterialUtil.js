/**
 * Utilitaires pour Anglar Materials
 */
export let buildToggler = ($mdSidenav, $log, navID) => {
    return () => {
        // Affichage du menu de gauche.
        $mdSidenav(navID)
        // Affichage du menu.
            .toggle()
            .then(() => {
                // Log pour la démo.
                $log.debug(`toggle ${navID} is done`);
            });
    };
};

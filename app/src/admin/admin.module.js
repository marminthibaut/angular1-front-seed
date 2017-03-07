/**
 * Module angular de la page d'administration.
 */
import angular from 'angular';

import { BuilderComponent } from 'app/admin/builder.component';
import { UsersComponent } from 'app/admin/users.component';
import { MessageService } from 'app/admin/message.service';
import { AdminComponent } from 'app/admin/admin.component';

import { generateRoutesConfigurations } from 'common/utils/routes';

// Définition du module et de ses dépendances.
export const AdminModule = {
    // Nom du module
    name: 'admin',
    // Dépendances utilisées.
    dependencies: [
        BuilderComponent.$$config.templateUrl,
        UsersComponent.$$config.templateUrl,
        AdminComponent.$$config.templateUrl
    ],
    // Composant associé.
    component: AdminComponent
};

// Définition des routes angular.
export const ROUTES = [
    // Navigation vers la page builder
    { name: 'admin.builder', path: '/builder', component: BuilderComponent },
    // Navigation vers la page admin
    { name: 'admin.users', path: '/users', component: UsersComponent }
];

// Génération de la configuration des routes.
const routesConfigurators = generateRoutesConfigurations(ROUTES);

// Configuration du module.
export let module = angular.module(AdminModule.name, AdminModule.dependencies)
    .service(MessageService.$$id, MessageService)
    .component(BuilderComponent.$$name, BuilderComponent.$$config)
    .component(UsersComponent.$$name, UsersComponent.$$config)
    .component(AdminComponent.$$name, AdminComponent.$$config)
    .config(routesConfigurators.states)
    .config(routesConfigurators.futureStates);

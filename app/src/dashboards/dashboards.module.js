/**
 * Module dashboard.
 */
import { DashboardsComponent } from 'app/dashboards/dashboards.component';

// Définition du module
export const DashboardsModule = {
    name: 'dashboards',
    dependencies: [
        DashboardsComponent.$$config.templateUrl
    ]
};

// Création du module.
export let module = angular.module(DashboardsModule.name, DashboardsModule.dependencies)
    .component(DashboardsComponent.$$name, DashboardsComponent.$$config);

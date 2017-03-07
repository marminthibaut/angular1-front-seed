/**
 * Module pour l'exemple des formulaires.
 */
import { DemoFormsComponent } from 'app/demo-forms/demo-forms.component';

// Définition du module.
export const DemoFormsModule = {
    // Nom du module
    name: 'demoForms',
    // Dépendances utilisées pour le module.
    dependencies: [
        DemoFormsComponent.$$config.templateUrl
    ],
    // Composant associé au module.
    component: DemoFormsComponent
};

// Cration du module.
export let module = angular.module(DemoFormsModule.name, DemoFormsModule.dependencies)
    .component(DemoFormsComponent.$$name, DemoFormsComponent.$$config);

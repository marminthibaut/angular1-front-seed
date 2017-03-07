import template from 'app/demo-forms/demo-forms.component.tpl';
/**
 * Composant pour la démo sur les formulaires.
 */
export class DemoFormsComponent {

    /**
     * Constructeur par défaut.
     */
    constructor() {

        // Inhection du composant dans Angular.
        'ngInject';
    }
}

// Nom du composant.
DemoFormsComponent.$$name = 'demoForms';

// Configuration du composant.
DemoFormsComponent.$$config = {
    selector: 'demo-forms',
    templateUrl: template.name,
    controller: DemoFormsComponent
};


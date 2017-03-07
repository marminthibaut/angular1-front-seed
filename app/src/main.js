/* global document */

import angular from 'angular' ;

import { AppComponent } from 'app/app.component';
import { AppModule } from 'app/app.module';

angular.element(document).ready(() => {
    // Création d'un div HTML
    const wrapper = document.createElement('div'),
        componentElmt = document.getElementsByTagName(AppComponent.$$config.selector)[0];
    componentElmt.parentNode.insertBefore(wrapper, componentElmt);
    wrapper.appendChild(componentElmt);
    // Init Angular
    angular.bootstrap(wrapper, [AppModule.name], {
        strictDi: true
    });
});

/**
 * Promesse pour la démo gestion des users.
 */
import angular from 'angular';
import 'angular-mocks';
import userModule from './user';


// définition du test
describe('CurrentUser', () => {
    beforeEach(angular.mock.module(userModule.name));

    let CurrentUser, scope;

    // Configuration
    beforeEach(inject($injector => {
        CurrentUser = $injector.get('CurrentUser');
        scope = $injector.get('$rootScope');
    }));

    // test du get
    describe('.get', () => {
        it('has a user', () => {
            let user;
            CurrentUser.getUser().then(data => {
                user = data;
            });

            scope.$digest();

            // test que l'utilisateur est le bon.
            expect(user).toEqual({ name: 'Panda' });
        });
    });

});

import angular from 'angular';
import ngMock from 'angular-mocks';
import 'app/app.module';
import 'app/app.component';

describe('app component', () => {

    beforeEach(ngMock.module('sihmSeed'));

    let element, ctrl;

    beforeEach(inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        element = angular.element('<sihm-seed></sihm-seed>');
        $compile(element)(scope);
        scope.$digest();
        ctrl = element.controller('sihmSeed');
    }));
    
    describe('controller', () => {
        it('should have a toggleLeftMenu function', () => {
            expect(angular.isFunction(ctrl.toggleLeftMenu)).toBe(true);
        });
    });
});

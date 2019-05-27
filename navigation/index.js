/**
 * this is the main controller for the navigation module. 
 * in this controller we should manage the redirection over all the system.
 */

import { StackActions, NavigationActions } from 'react-navigation';


export class NavigationController{
    constructor(navigator){
        this.navigator = navigator;
    }
    direct(targetName, params){
        this.navigator.navigate({
            routeName: targetName,
            params: params
        })
    }
    reset(targetName, params){
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: targetName })],
          });
        this.navigator.dispatch(resetAction);
    }
}
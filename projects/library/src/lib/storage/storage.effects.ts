import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';

import { StorageActions } from './storage.actions';
import { StorageService } from './storage.service';
import { Action } from '../store/models';
import { toPayload } from '../shared/utils';


@Injectable()
export class StorageEffects {

    actionTypes: string[];

    /**
     * Listens for dispatched actions, updates local storage in response.
     */
    onSyncLocalStorage: Observable<Action> = createEffect(() => this.actions$.pipe(
        filter((action: Action) => this.service.inLocalStorage(action.type)),
        map(action => ({
            type: StorageActions.UPDATE_LOCAL_STORAGE,
            payload: action
        }))
    ));

    /**
     * Listens for dispatched actions, updates session storage in response.
     */
    onSyncSessionStorage: Observable<Action> = createEffect(() => this.actions$.pipe(
        filter((action: Action) => this.service.inSessionStorage(action.type)),
        map(action => ({
            type: StorageActions.UPDATE_SESSION_STORAGE,
            payload: action
        }))
    ));

    /**
     * Stores state to local storage after each action.
     */
    onStoreLocal: Observable<void> = createEffect(() => this.actions$.pipe(
        ofType(StorageActions.UPDATE_LOCAL_STORAGE),
        map(toPayload),
        withLatestFrom(this.state$, (action: Action, state: any) => {
            this.service.storeLocal(state, action);
        })
    ));

    /**
     * Stores state to local storage after each action.
     */
    onStoreSession: Observable<void> = createEffect(() => this.actions$.pipe(
        ofType(StorageActions.UPDATE_SESSION_STORAGE),
        map(toPayload),
        withLatestFrom(this.state$, (action: Action, state: any) => {
            this.service.storeSession(state, action);
        })
    ));

    constructor(
        private actions$: Actions,
        private service: StorageService,
        private state$: Store<any>
    ) { }

}

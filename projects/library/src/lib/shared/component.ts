import { OnDestroy, Directive } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { HasId } from './models';
import { getValue, truthy } from './utils';
import { MessageSubscription } from '../events/events.models';
import { MessagesActions } from '../events/events.actions';
import { HttpActions } from '../http/http.actions';
import { actionsStreamSelector } from './actions';
import { Action } from '../store/models';
import { HubService } from '../hub/hub.service';

@Directive()
export class DumbComponent implements OnDestroy {
  dialog: MatDialog;
  dialogSubscription: Subscription;
  form: FormGroup;
  requestState: 'DEFAULT' | 'SUCCESS' | 'ERROR' = 'DEFAULT';
  subscriptions: Subscription[] = [];

  constructor() { }

  get inErrorState(): boolean {
    return this.requestState === 'ERROR';
  }

  get inSuccessState(): boolean {
    return this.requestState === 'SUCCESS';
  }

  get message(): string {
    return this.inErrorState ? `An error has occurred. Please try again later.` : this.inSuccessState ? `Saved successfully!` : '';
  }

  get showMessage(): boolean {
    return this.inErrorState || this.inSuccessState;
  }

  ngOnDestroy() {
    this.removeSubscriptions();
  }

  addSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  closeDialog(result: any) {
    this.dialogSubscription.unsubscribe();
  }

  openDialog(component: any, config = {}) {
    const dialogRef = this.dialog.open(component, config);
    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      this.closeDialog(result);
    });
  }

  playAudioElement(tag: string) {
    const el = document.getElementById(tag);
    if (el && typeof el['play'] === 'function') {
      el['play']();
    }
  }

  playAudioFile(file: string) {
    const audio = new Audio(file);
    audio.play();
  }

  print(html: string) {
    const iframe = document.createElement('iframe');

    iframe.onload = function () {
      const doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
      doc.getElementsByTagName('body')[0].innerHTML = html;

      iframe.contentWindow.focus(); // This is key, the iframe must have focus first
      iframe.contentWindow.print();
    };

    document.getElementsByTagName('body')[0].appendChild(iframe);
  }

  removeSubscriptions() {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

  subscribe(subscriptions: Subscription[]) {
    subscriptions.forEach(s => {
      this.addSubscription(s);
    });
  }

  sync(keys: string[]) {
    keys.forEach(key => {
      const subscription = (<Observable<any>>this[`${key}$`]).subscribe(e => {
        this[key] = e;
      });
      this.addSubscription(subscription);
    });
  }

  syncKey(key: string, handler?: (e: any) => void) {
    const subscription = (<Observable<any>>this[`${key}$`]).subscribe(e => {
      this[key] = e;
      if (handler && typeof handler === 'function') {
        handler(e);
      }
    });
    this.addSubscription(subscription);
  }

  flashErrorMessage(duration = 5000) {
    this.toErrorState();
    setTimeout(() => {
      this.resetRequestState();
    }, duration);
  }

  flashSuccessMessage(duration = 5000) {
    this.toSucessState();
    setTimeout(() => {
      this.resetRequestState();
    }, duration);
  }

  onError(e: any) {
    this.flashErrorMessage();
  }

  onSuccess(e: any) {
    this.flashSuccessMessage();
  }

  resetRequestState() {
    this.requestState = 'DEFAULT';
  }

  setValue(value: any) {
    if (this.form && this.form.setValue) {
      this.form.setValue(getValue(value));
    }
  }

  toErrorState() {
    this.requestState = 'ERROR';
  }

  toSucessState() {
    this.requestState = 'SUCCESS';
  }
}

@Directive()
export class FormComponent extends DumbComponent {
  form: FormGroup;
  model: HasId;

  get editing(): boolean {
    return truthy(this.id);
  }

  get id(): number | string {
    return this.model.id;
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  getControl(key: string): AbstractControl {
    return this.form.controls[key];
  }

  getControlValue(key: string, defaultValue: any): any {
    return this.form.value[key] || defaultValue;
  }

  getControlValueChanges(key: string, fn: (value: any) => void): Subscription {
    const control = this.getControl(key);
    return control.valueChanges.subscribe(fn);
  }

  getValue(defaultValue = null): any {
    return this.form.value || defaultValue;
  }

  getValueChanges(fn: (value: any) => void): Subscription {
    return this.form.valueChanges.subscribe(fn);
  }

  markAsSubmitted(): void {
    this.form.markAsTouched();
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsTouched();
    });
  }

  setControlValue(key: string, value: any): void {
    const control = this.getControl(key);
    control.setValue(value);
  }

  subscribeToChanges(key: string, fn: (value: any) => void) {
    this.addSubscription(this.getValueChanges(fn));
  }

  subscribeToControlChanges(key: string, fn: (value: any) => void) {
    this.addSubscription(this.getControlValueChanges(key, fn));
  }
}

@Directive()
export class SmartComponent extends DumbComponent implements OnDestroy {
  actions$: Observable<Action>;
  events;
  hubService: HubService;
  messages: MessageSubscription[] = [];
  private channels: string[] = [];

  constructor(public store: Store<any>) {
    super();
    this.actions$ = actionsStreamSelector(store);
  }

  get hasMessages(): boolean {
    return this.messages && Array.isArray(this.messages) && this.messages.length > 0;
  }

  onInit() {
    if (this.hasMessages) {
      this.dispatch(MessagesActions.subscribe(this.messages));
    }
  }

  ngOnDestroy() {
    if (this.hasMessages) {
      this.dispatch(MessagesActions.unsubscribe(this.messages));
    }
    this.removeChannels();
    super.ngOnDestroy();
  }

  addChannel(channel: string, action: string) {
    if (this.hubService && typeof this.hubService.addEffect == 'function' && (this.channels.findIndex(x => x === channel) === -1)) {
      this.hubService.addEffect(channel, action);
      this.channels.push(channel);
    }
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  dispatchAndSubscribe(action: Action, onSuccess?: (e: any) => void, onError?: (e: any) => void) {
    const f1 = onSuccess
      ? onSuccess
      : e => {
        this.flashSuccessMessage();
      };

    const f2 = onError
      ? onError
      : e => {
        this.flashErrorMessage();
      };

    if (this.events && this.events.dispatch) {
      this.addSubscription(this.events.dispatch(action).subscribe(f1, f2));
    } else {
      this.store.dispatch(action);
    }
  }

  httpDelete(path: string, payload: any, onSuccess: string, onError?: string): Observable<Action> {
    this.dispatch(HttpActions.delete(path, payload, onSuccess, onError));
    return this.actions$.pipe(
      filter(x => x && (x.type === onSuccess || x.type === onError)),
      take(1)
    );
  }

  httpGet(path: string, onSuccess: string, onError?: string): Observable<Action> {
    this.dispatch(HttpActions.get(path, onSuccess, onError));
    return this.actions$.pipe(
      filter(x => x && (x.type === onSuccess || x.type === onError)),
      take(1)
    );
  }

  httpPost(path: string, payload: any, onSuccess: string, onError?: string): Observable<Action> {
    this.dispatch(HttpActions.post(path, payload, onSuccess, onError));
    return this.actions$.pipe(
      filter(x => x && (x.type === onSuccess || x.type === onError)),
      take(1)
    );
  }

  httpPut(path: string, payload: any, onSuccess: string, onError?: string): Observable<Action> {
    this.dispatch(HttpActions.put(path, payload, onSuccess, onError));
    return this.actions$.pipe(
      filter(x => x && (x.type === onSuccess || x.type === onError)),
      take(1)
    );
  }

  removeChannel(channel: string) {
    if (this.hubService && typeof this.hubService.removeEffect == 'function') {
      this.hubService.removeEffect(channel);
    }
  }

  removeChannels() {
    if (this.hubService && typeof this.hubService.removeEffect == 'function') {
      this.channels.forEach(x => {
        this.hubService.removeEffect(x);
      });
    }
  }

}

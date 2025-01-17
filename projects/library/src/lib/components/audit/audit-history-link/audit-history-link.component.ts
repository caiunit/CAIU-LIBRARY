import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, switchMap, map, filter } from 'rxjs/operators';
import { AuditHistoryComponent } from '../audit-history/audit-history.component';
import { Audited, AuditHistory } from '../audit.model';
import { HttpService } from '../../../http/http.service';
import { DumbComponent } from '../../../shared/component';
import { ColumnMetadata } from '../../../shared/models';
import {
  build,
  toArray,
  truthy,
  buildColumnsFromMetadata
} from '../../../shared/utils';

@Component({
  selector: 'iu-audit-history-link',
  templateUrl: './audit-history-link.component.html',
  styleUrls: ['./audit-history-link.component.scss']
})

export class AuditHistoryLinkComponent extends DumbComponent implements OnInit {
  @Input() mapper: (data: any) => Audited;
  @Input() preloadData = false;
  @Input() requestUrl = '';
  @Output() dataLoaded = new EventEmitter<Audited[]>();
  columnMetadata$: Observable<ColumnMetadata[]>;
  columnsSubject = new BehaviorSubject<ColumnMetadata[]>([]);
  dataSourceSubject = new BehaviorSubject<Audited[]>([]);
  dataSource$: Observable<Audited[]>;
  requestUrl$: Observable<string>;
  requestUrlClicksSubject = new BehaviorSubject<string>(null);
  _columns: ColumnMetadata[] = [];
  _data: Audited[] = [];
  _placeholderText = '';
  _requestData: Audited[];
  constructor(public dialog: MatDialog, public http: HttpService) {
    super();
    this.requestUrl$ = this.requestUrlClicksSubject.asObservable().pipe(
      filter(x => truthy(x)),
      distinctUntilChanged()
    );
    this.dataSource$ = this.dataSourceSubject
      .asObservable()
      .pipe(map(x => toArray(x)));
    this.columnMetadata$ = combineLatest(
      this.dataSource$,
      this.columnsSubject.asObservable(),
      (dataSource, columns) => {
        return Array.isArray(columns) && columns.length > 1
          ? columns
          : buildColumnsFromMetadata(dataSource, 'history').filter(
              x => x.name !== 'startDate' && x.name !== 'endDate'
            );
      }
    );
  }

  @Input() set columns(value: ColumnMetadata[]) {
    this._columns = value;
    this.columnsSubject.next(value);
  }

  get columns(): ColumnMetadata[] {
    return this._columns;
  }

  @Input() set data(value: Audited[]) {
    this._data = value;
    this.dataSourceSubject.next(value);
  }

  get data(): Audited[] {
    return this._data;
  }

  @Input()
  set placeholderText(value: string) {
    this._placeholderText = value;
  }

  get placeholderText() {
    return this._placeholderText || 'View Audit History';
  }

  set requestData(value: Audited[]) {
    this._requestData = value;
    this.dataSourceSubject.next(value);
    this.dataLoaded.emit(value);
  }

  get requestData(): Audited[] {
    return this._requestData;
  }

  get requestData$(): Observable<Audited[]> {
    return this.requestUrl$.pipe(
      switchMap(url => this.http.get(url)),
      map(x =>
        toArray(x).map(y =>
          this.mapper && typeof this.mapper === 'function'
            ? this.mapper(y)
            : build(Audited, y)
        )
      )
    );
  }

  ngOnInit() {
    this.sync(['requestData']);
    if (this.preloadData) {
      this.refreshData();
    }
  }

  refreshData() {
    this.requestUrlClicksSubject.next(this.requestUrl);
  }

  viewHistory() {
    if (!this.preloadData) {
      this.refreshData();
    }
    this.openDialog(AuditHistoryComponent, {
      data: build(AuditHistory, {
        dataSource: this.dataSource$,
        columns: this.columnMetadata$
      })
    });
  }
}

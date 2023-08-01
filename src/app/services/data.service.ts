import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Element } from '../models/element';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private activeElement = new BehaviorSubject<string>('');
  /**
   * Emits the currently active element
   */
  currentActiveElementID = this.activeElement.asObservable();

  private changeNotifier = new BehaviorSubject<number>(0);
  /**
   * Emits a change notification
   */
  currentChange = this.changeNotifier.asObservable();

  private navigationElements = new BehaviorSubject<string>('');
  currentNavigationElements = this.navigationElements.asObservable();

  private editorElements = new BehaviorSubject<string>('');
  currentEditorElements = this.editorElements.asObservable();

  private isDataImported = new BehaviorSubject<boolean>(false);
  currentImportStatus = this.isDataImported.asObservable();

  constructor() {}

  /**
   * Emits the new active element
   * 
   * @param data the new active element
   */
  changeActiveElement(data: any) {
    this.activeElement.next(data);
  }

  /**
   * Emits a change notification
   */
  notifyChange() {
    let currentValue = this.changeNotifier.value;
    this.changeNotifier.next(currentValue + 1);
  }

  /**
   * Emits the new navigation elements
   * 
   * @param data the new navigation elements
   */
  changeNavigationElements(data: any) {
    this.navigationElements.next(data);
  }

  /**
   * Emits the new editor elements
   * 
   * @param data the new editor elements
   */
  changeEditorElements(data: any) {
    this.editorElements.next(data);
  }

    /**
   * Set the data import status
   * 
   * @param status the data import status
   */
    setDataImportStatus(status: boolean) {
      this.isDataImported.next(status);
    }
}

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

  private navigationElements = new BehaviorSubject<Array<Element>>([]);
  /**
   * Emits the current navigation part elements
   */
  currentNavigationElements = this.navigationElements.asObservable();

  private editorElements = new BehaviorSubject<Array<Element>>([]);
  /**
   * Emits the current editor part elements
   */
  currentEditorElements = this.editorElements.asObservable();

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
}

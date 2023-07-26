import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Element } from '../models/element';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private activeElement = new BehaviorSubject<string>('');
  currentActiveElementID = this.activeElement.asObservable();

  private changeNotifier = new BehaviorSubject<number>(0);
  currentChange = this.changeNotifier.asObservable();

  private navigationElements = new BehaviorSubject<Array<Element>>([]);
  currentNavigationElements = this.navigationElements.asObservable();

  private editorElements = new BehaviorSubject<Array<Element>>([]);
  currentEditorElements = this.editorElements.asObservable();

  constructor() {}

  changeActiveElement(data: any) {
    this.activeElement.next(data);
  }

  notifyChange() {
    let currentValue = this.changeNotifier.value;
    this.changeNotifier.next(currentValue + 1);
  }

  changeNavigationElements(data: any) {
    this.navigationElements.next(data);
  }

  changeEditorElements(data: any) {
    this.editorElements.next(data);
  }
}

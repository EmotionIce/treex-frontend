import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorPartComponent } from '../editor-part/editor-part.component';

@Component({
  selector: 'app-text-editor',
  template: `
    <div *ngIf="!isEditMode" (click)="enterEditMode()">{{ text }}</div>
    <textarea *ngIf="isEditMode" [(ngModel)]="editedText"></textarea>
    <button *ngIf="isEditMode" (click)="saveText()">Save</button>
  `,
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {
  @Input() text: string = '';
  @Output() textUpdated = new EventEmitter<string>();

  isEditMode: boolean = false;
  editedText: string = '';

  enterEditMode() {
    this.isEditMode = true;
    this.editedText = this.text;
  }

  saveText() {
    this.isEditMode = false;
    this.text = this.editedText;
    this.textUpdated.emit(this.text);
  }
}
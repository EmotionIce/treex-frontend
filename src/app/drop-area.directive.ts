import { Directive, Output, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDropArea]'
})
export class DropAreaDirective {
  @Input() layerElementId!: string; // ID of the element above the drop area
  @Output() dropped = new EventEmitter<string>();

  @HostBinding('class.hovered') isHovered = false;

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.isHovered = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isHovered = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isHovered = false;
    this.dropped.emit(this.layerElementId); // Emit the ID of the element above the drop area
  }
}
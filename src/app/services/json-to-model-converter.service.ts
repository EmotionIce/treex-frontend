import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Root } from '../models/root';
import { Element } from '../models/element';
import { Label } from '../models/label';
import { Child } from '../models/child';
import { Parent } from '../models/parent';
import { Input } from '../models/input';
import { Sectioning } from '../models/sectioning';
import { Environment } from '../models/environment';
import { Figure } from '../models/environments/figure';
import { Caption } from '../models/caption';

import { ErrorPopupService } from './error-popup.service';

/**
 * Service responsible for converting JSON data into a composite data structure model.
 */
@Injectable({
  providedIn: 'root',
})
export class JsonToModelConverterService {
  /**
   * Constructs the JsonToModelConverterService with the given error popup service.
   *
   * @param errorPopupService Service to handle error popup messages
   */
  constructor(private errorPopupService: ErrorPopupService) {}

  /**
   * Converts the given JSON data to a composite data structure starting with the root.
   *
   * @param jsonData$ input JSON data
   * @returns {Observable<boolean>} true if the conversion was successful, false if not
   */
  public convert(jsonData$: Observable<Object>): Observable<boolean> {
    return jsonData$.pipe(
      map((jsonData) => {
        try {
          console.log('Received json data:');
          console.log(jsonData);
          const root = Root.createRoot();
          root.clear();
          const items: any = (jsonData as any)['editor'];

          for (const item of items) {
            this.processItem(item, root);
          }

          console.log(root);
          return true;
        } catch (error) {
          console.error(`Error during conversion: ${(error as Error).message}`);
          return false;
        }
      })
    );
  }

  /**
   * Generates an element from the given JSON data and adds it to the given parent.
   *
   * @param item JSON data of the element to be processed
   * @param parent Parent of the element to be processed
   */
  private processItem(item: any, parent: Parent | Root): void {
    let createdElement: Element | null = null;
    const { id, type, content, comment, summary } = item;

    switch (type) {
      case 'Label':
        createdElement = new Label(id, type, content, comment, summary, parent);
        break;
      case 'Child':
        createdElement = new Child(id, type, content, comment, summary, parent);
        break;
      case 'Sectioning':
        createdElement = new Sectioning(
          id,
          type,
          content,
          comment,
          summary,
          parent
        );
        break;
      case 'Environment':
        createdElement = new Environment(
          id,
          type,
          content,
          comment,
          summary,
          parent
        );
        break;
      case 'Figure':
        const { image, captions, mimeType } = item;
        const figure = new Figure(
          id,
          type,
          content,
          comment,
          summary,
          parent,
          image,
          mimeType
        );
        if (captions) {
          captions.forEach((caption: any) => {
            const captionModel = new Caption(caption.content);
            figure.addCaption(captionModel);
          });
        }
        createdElement = figure;
        break;
      case 'Input':
        createdElement = new Input(id, type, content, comment, summary, parent);
        break;
      default:
        console.error(`Unknown item type: ${type}`);
    }

    if (createdElement !== null) {
      parent.addChild(createdElement);

      if (item.children && item.children.length > 0) {
        for (const childItem of item.children) {
          if (
            createdElement instanceof Parent ||
            createdElement instanceof Root
          ) {
            this.processItem(childItem, createdElement);
          } else {
            console.error(
              `Attempted to add children to a non-parent Element: ${type}`
            );
          }
        }
      }
    }
  }
}

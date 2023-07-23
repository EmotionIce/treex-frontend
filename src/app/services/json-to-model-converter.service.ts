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
import { Algorithm } from '../models/environments/algorithm';
import { Equation } from '../models/environments/equation';
import { Caption } from '../models/caption';

@Injectable({
  providedIn: 'root',
})
export class JsonToModelConverterService {
  constructor() {}

  public convert(jsonData$: Observable<Object>): Observable<boolean> {
    return jsonData$.pipe(
      map((jsonData) => {
        try {
          const root = Root.createRoot();
          const items: any = (jsonData as any)['editor'];

          for (const item of items) {
            this.processItem(item, root);
          }

          return true;
        } catch (error) {
          console.error(`Error during conversion: ${(error as Error).message}`);
          return false;
        }
      })
    );
  }

  private processItem(item: any, parent: Parent | Root): void {
    let createdElement: Element | null = null;
    const { id, type, content, comment, summary } = item;

    switch (type) {
      case 'Label':
        createdElement = new Label(id, content, comment, summary, parent);
        break;
      case 'Child':
        createdElement = new Child(id, content, comment, summary, parent);
        break;
      case 'Sectioning':
        createdElement = new Sectioning(id, content, comment, summary, parent);
        break;
      case 'Environment':
        createdElement = new Environment(id, content, comment, summary, parent);
        break;
      case 'Figure':
        const { fileLocation, captions } = item;
        const figure = new Figure(
          id,
          content,
          comment,
          summary,
          parent,
          fileLocation
        );
        captions.forEach((caption: any) => {
          const captionModel = new Caption(caption.content);
          figure.addCaption(captionModel);
        });
        createdElement = figure;
        break;
      case 'Algorithm':
        createdElement = new Algorithm(id, content, comment, summary, parent);
        break;
      case 'Equation':
        createdElement = new Equation(id, content, comment, summary, parent);
        break;
      case 'Input':
        createdElement = new Input(id, content, comment, summary, parent);
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

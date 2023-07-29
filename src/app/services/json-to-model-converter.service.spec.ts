import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { JsonToModelConverterService } from './json-to-model-converter.service';
import { Root } from '../models/root';
import { Sectioning } from '../models/sectioning';
import { Environment } from '../models/environment';
import { Child } from '../models/child';

describe('JsonToModelConverterService', () => {
  let service: JsonToModelConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonToModelConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Helper function to compare JSON data with model instance
  // Helper function to compare JSON data with model instance
  function compareModelAndJson(model: any, json: any): void {
    // log the jsonified-model and json for debugging

    // Ensure type is same (e.g. Label, Child, Sectioning, etc.)
    expect(model.constructor.name).toEqual(json.type);

    // Ensure ID is same
    expect(model.getId()).toEqual(json.id);

    // Ensure content is same
    expect(model.getContent()).toEqual(json.content);

    // Ensure comments are same
    expect(model.getComment()).toEqual(json.comment);

    // Ensure summary is same
    expect(model.getSummary()).toEqual(json.summary);

    // If there are children, compare them as well
    if (json.children) {
      expect(model.getChildren().length).toEqual(json.children.length);
      for (let i = 0; i < json.children.length; i++) {
        compareModelAndJson(model.getChildren()[i], json.children[i]);
      }
    }

    // Check special fields for certain types
    switch (json.type) {
      case 'Figure':
        expect(JSON.stringify(model.getCaptions())).toEqual(
          JSON.stringify(json.captions)
        );
        expect(model.getFileLocation()).toEqual(json.fileLocation);
        break;
    }
  }

  it('should correctly convert JSON data to model structure', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // If necessary, increase the timeout limit
    const root = Root.createRoot();
    root.clear();
    const depth: number = randomInt(2) + 1;
    const elementsPerLayer: number = randomInt(3) + 1;
    const arrayOfJson: Array<any> = generateTestJSON(depth, elementsPerLayer);

    // generate tree using generateTestJSON()
    const json = {
      editor: arrayOfJson,
    };

    //log the stringify-json for debugging
    console.log(JSON.stringify(json));

    // Convert and test
    const result = await service.convert(of(json)).toPromise();

    // test if elements of layer 0 (root children) are correct
    expect(root.getChildren().length).toEqual(json.editor.length);
    for (let i = 0; i < json.editor.length; i++) {
      compareModelAndJson(root.getChildren()[i], json.editor[i]);
    }
  });

  // HELPER FUNCTIONS TO GENERATE RANDOM JSON DATA
  // HELPER FUNCTIONS TO GENERATE RANDOM JSON DATA

  function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  function generateLabelJSON(
    id: string,
    content: string,
    comment: string = '',
    summary: string = ''
  ) {
    return {
      id: id,
      type: 'Label',
      content: content,
      comment: comment,
      summary: summary,
    };
  }

  function generateChildJSON(
    id: string,
    content: string,
    comment: string = '',
    summary: string = ''
  ) {
    return {
      id: id,
      type: 'Child',
      content: content,
      comment: comment,
      summary: summary,
    };
  }

  function generateSectioningJSON(
    id: string,
    content: string,
    children: Array<any> = [],
    comment: string = '',
    summary: string = ''
  ) {
    return {
      id: id,
      type: 'Sectioning',
      content: content,
      comment: comment,
      summary: summary,
      children: children,
    };
  }

  function generateEnvironmentJSON(
    id: string,
    content: string,
    children: Array<any> = [],
    comment: string = '',
    summary: string = ''
  ) {
    return {
      id: id,
      type: 'Environment',
      content: content,
      comment: comment,
      summary: summary,
      children: children,
    };
  }

  function generateFigureJSON(
    id: string,
    content: string,
    captions: Array<any>,
    fileLocation: string,
    comment: string = '',
    summary: string = '',
    children: Array<any> = []
  ) {
    return {
      id: id,
      type: 'Figure',
      content: content,
      comment: comment,
      summary: summary,
      captions: captions,
      fileLocation: fileLocation,
      children: children,
    };
  }

  function generateInputJSON(
    id: string,
    content: string,
    comment: string = '',
    summary: string = '',
    children: Array<any> = []
  ) {
    return {
      id: id,
      type: 'Input',
      content: content,
      comment: comment,
      summary: summary,
      children: children,
    };
  }

  function generateTestJSON(
    depth: number,
    elementsPerLayer: number
  ): Array<any> {
    let result = [];

    for (let i = 0; i < elementsPerLayer; i++) {
      if (depth === 0) {
        // Create a leaf node, which can be any type
        let leafTypes = [
          'Label',
          'Child',
          'Sectioning',
          'Environment',
          'Input',
        ];
        let randomType = leafTypes[randomInt(leafTypes.length)];
        result.push(generateNodeJSON(randomType, i));
      } else {
        // Create a parent node, which can be any type except Label and Child
        let parentTypes = ['Sectioning', 'Environment', 'Figure', 'Input'];
        let randomType = parentTypes[randomInt(parentTypes.length)];
        let parentNode = generateNodeJSON(randomType, i);

        // Generate children nodes recursively
        (parentNode as any).children = generateTestJSON(
          depth - 1,
          elementsPerLayer
        );
        result.push(parentNode);
      }
    }

    return result;
  }

  function generateNodeJSON(type: string, idSuffix: number) {
    switch (type) {
      case 'Label':
        return generateLabelJSON(`label${idSuffix}`, `labelContent${idSuffix}`);
      case 'Child':
        return generateChildJSON(`child${idSuffix}`, `childContent${idSuffix}`);
      case 'Sectioning':
        return generateSectioningJSON(
          `section${idSuffix}`,
          `sectionContent${idSuffix}`
        );
      case 'Environment':
        return generateEnvironmentJSON(
          `env${idSuffix}`,
          `envContent${idSuffix}`
        );
      case 'Figure':
        return generateFigureJSON(
          `fig${idSuffix}`,
          `figContent${idSuffix}`,
          [
            { content: `captionContent${idSuffix}1` },
            { content: `captionContent${idSuffix}2` },
          ],
          `fileLocation${idSuffix}`
        );
      case 'Input':
        return generateInputJSON(`input${idSuffix}`, `inputContent${idSuffix}`);
      default:
        throw new Error(`Invalid type: ${type}`);
    }
  }
});

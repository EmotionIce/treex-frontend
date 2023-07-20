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

  it('should correctly convert JSON data to model structure', (done: DoneFn) => {
    const root = Root.createRoot();
    root.clear();
    const json = {
      editor: [
        {
          id: '73253ea7-9d8f-4e68-924b-6e195f3cbf07',
          type: 'Sectioning',
          parent: 'null',
          content: 'sectioning1',
          comment: 'comment',
          summary: 'summary',
          chooseManualSummary: false,
          children: [
            {
              id: 'de5c6ffa-a792-43a9-ab9e-d42ba0984d34',
              type: 'Sectioning',
              parent: '73253ea7-9d8f-4e68-924b-6e195f3cbf07',
              content: 'sectioning2',
              comment: 'comment',
              summary: 'summary',
              chooseManualSummary: false,
              children: [
                {
                  id: 'f1115132-c33e-49e3-b2e8-59fc220f8756',
                  type: 'Sectioning',
                  parent: 'de5c6ffa-a792-43a9-ab9e-d42ba0984d34',
                  content: 'sectioning5',
                  comment: 'comment',
                  summary: 'summary',
                  chooseManualSummary: false,
                },
                {
                  id: '07968e51-3f5b-44f6-813c-96af661eb18e',
                  type: 'Environment',
                  parent: 'de5c6ffa-a792-43a9-ab9e-d42ba0984d34',
                  content: 'environment1',
                  comment: 'comment',
                  summary: 'summary',
                  chooseManualSummary: false,
                  children: [
                    {
                      id: 'ccc884ed-fc8e-4291-a9a7-ce77b02a8aa9',
                      type: 'Sectioning',
                      parent: '07968e51-3f5b-44f6-813c-96af661eb18e',
                      content: 'sectioning6',
                      comment: 'comment',
                      summary: 'summary',
                      chooseManualSummary: false,
                    },
                  ],
                },
                {
                  id: 'c377d1b7-919b-4113-9ce8-7b85f5ca1885',
                  type: 'Child',
                  parent: 'de5c6ffa-a792-43a9-ab9e-d42ba0984d34',
                  content: 'child2',
                  comment: 'comment',
                  summary: 'summary',
                  chooseManualSummary: false,
                },
                {
                  id: 'b868adda-6175-4224-ae07-e6a6b4b8360a',
                  type: 'Child',
                  parent: 'de5c6ffa-a792-43a9-ab9e-d42ba0984d34',
                  content: 'child3',
                  comment: 'comment',
                  summary: 'summary',
                  chooseManualSummary: false,
                },
                {
                  id: 'b40b54b9-8d9d-46b8-bbca-f41633d2031e',
                  type: 'Child',
                  parent: 'de5c6ffa-a792-43a9-ab9e-d42ba0984d34',
                  content: 'child4',
                  comment: 'comment',
                  summary: 'summary',
                  chooseManualSummary: false,
                },
              ],
            },
            {
              id: '0f0f2f9c-0f35-4314-9c74-345563ee1fca',
              type: 'Sectioning',
              parent: '73253ea7-9d8f-4e68-924b-6e195f3cbf07',
              content: 'sectioning3',
              comment: 'comment',
              summary: 'summary',
              chooseManualSummary: false,
              children: [
                {
                  id: '482fba3c-dfe5-463d-a557-359dd3548d60',
                  type: 'Child',
                  parent: '0f0f2f9c-0f35-4314-9c74-345563ee1fca',
                  content: 'child5',
                  comment: 'comment',
                  summary: 'summary',
                  chooseManualSummary: false,
                },
              ],
            },
            {
              id: '5596bc5a-6989-4ba8-b579-86e1c2924750',
              type: 'Sectioning',
              parent: '73253ea7-9d8f-4e68-924b-6e195f3cbf07',
              content: 'sectioning4',
              comment: 'comment',
              summary: 'summary',
              chooseManualSummary: false,
              children: [
                {
                  id: '0be501fd-52da-4632-b238-864f71552368',
                  type: 'Environment',
                  parent: '5596bc5a-6989-4ba8-b579-86e1c2924750',
                  content: 'environment2',
                  comment: 'comment',
                  summary: 'summary',
                  chooseManualSummary: false,
                },
              ],
            },
            {
              id: 'cb2c4491-3b3b-4a4d-b32e-b111f100dcb9',
              type: 'Child',
              parent: '73253ea7-9d8f-4e68-924b-6e195f3cbf07',
              content: 'child1',
              comment: 'comment',
              summary: 'summary',
              chooseManualSummary: false,
            },
          ],
        },
      ],
    };
    service.convert(of(json)).subscribe((result) => {
      expect(result).toBeTrue();
      const root = Root.createRoot();
      // test layer 1
      expect(root.getChildren().length).toEqual(1);
      const sectioning1 = root.getChildren()[0] as Sectioning;
      expect(sectioning1).toBeInstanceOf(Sectioning);
      expect(sectioning1.getId()).toEqual(
        '73253ea7-9d8f-4e68-924b-6e195f3cbf07'
      );

      // test layer 2
      expect(sectioning1.getChildren().length).toEqual(4);

      const sectioning2 = sectioning1.getChildren()[0] as Sectioning;
      const sectioning3 = sectioning1.getChildren()[1] as Sectioning;
      const sectioning4 = sectioning1.getChildren()[2] as Sectioning;
      const child1 = sectioning1.getChildren()[3] as Child;

      expect(sectioning2).toBeInstanceOf(Sectioning);
      expect(sectioning2.getId()).toEqual(
        'de5c6ffa-a792-43a9-ab9e-d42ba0984d34'
      );
      expect(sectioning3).toBeInstanceOf(Sectioning);
      expect(sectioning3.getId()).toEqual(
        '0f0f2f9c-0f35-4314-9c74-345563ee1fca'
      );
      expect(sectioning4).toBeInstanceOf(Sectioning);
      expect(sectioning4.getId()).toEqual(
        '5596bc5a-6989-4ba8-b579-86e1c2924750'
      );
      expect(child1).toBeInstanceOf(Child);
      expect(child1.getId()).toEqual('cb2c4491-3b3b-4a4d-b32e-b111f100dcb9');

      done();
    });
  });
});

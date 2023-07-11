import { Environment } from '../environment';

export class Figure extends Environment {
    private fileLocation: string;
  
    constructor(
      id: string,
      content: string,
      comment: string,
      summary: string,
      parent: Environment,
      fileLocation: string
    ) {
      super(id, content, comment, summary, parent);
      this.fileLocation = fileLocation;
    }
  
    public getFileLocation(): string {
      return this.fileLocation;
    }
  }
import { Environment } from '../environment';

export class Algorithm extends Environment {
    private algorithmType: string;
  
    constructor(
      id: string,
      content: string,
      comment: string,
      summary: string,
      parent: Environment,
      algorithmType: string
    ) {
      super(id, content, comment, summary, parent);
      this.algorithmType = algorithmType;
    }
  
    public getAlgorithmType(): string {
      return this.algorithmType;
    }
  }
  
  
  
  
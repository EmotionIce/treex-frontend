import { Environment } from '../environment';
import { Parent } from '../parent';
import { Root } from '../root';

export class Algorithm extends Environment {
    private algorithmType: string;
  
    constructor(
      id: string,
      content: string,
      comment: string,
      summary: string,
      parent: Parent | Root | null = null,
      algorithmType: string
    ) {
      super(id, content, comment, summary, parent);
      this.algorithmType = algorithmType;
    }
  
    public getAlgorithmType(): string {
      return this.algorithmType;
    }
  }
  
  
  
  
import React, {Component} from 'react';

export interface GenericCanvasExperimentViewProps {
  aliasName: string,
  canvasId: string,
  fileName: string
}

export default class GenericCanvasExperimentView extends Component<GenericCanvasExperimentViewProps> {
  static defaultProps = {
    aliasName: 'experiment-alias-name',
    canvasId: 'experiment-canvas',
    fileName: 'FileNameGoesHere.jsx'
  };

  canvasElm: HTMLCanvasElement;
  canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  render() {
    const {props: {fileName, canvasId}} = this;

    return (
      <div>
        <header>
          <h3>{fileName}</h3>
        </header>
        <canvas width="377" height="377"
                id={canvasId} ref={this.canvas}>
          <p>Html canvas element not supported</p>
        </canvas>
      </div>
    );
  }

}

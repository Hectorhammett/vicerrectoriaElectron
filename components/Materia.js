import React, {Component} from 'react';

class Materia extends Component {
  render() {
    return (
      <div>
        <div className="col s12 m6">
          <div className="card white">
            <div className="card-content">
              <span className="card-title">Materia</span>
              <div>
                <input placeholder="Nombre de la materia" value={this.props.subjectName} type="text" onChange={this.props.updateSubjectName.bind(this,this.props.identifier)}/>
              </div>
            </div>
            <div className="card-action">
              <a className="waves-effect waves-teal btn-flat" onClick={this.props.deleteSubject.bind(this,this.props.identifier)}>Eliminar Materia</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Materia;
import React, {Component} from 'react';

class Search extends Component {
  render() {
    return (
      <div>
        <div className="row">
            <div className="col s12">
              <table id="students" className="table bordered highlight responsive-table">
                <thead>
                    <tr>
                        <th>Matrícula</th>
                        <th>Nombre del Alumno</th>
                        <th>Correo Electrónico</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            </div>
          </div>
      </div>
    );
  }
}

export default Search;
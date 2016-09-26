import React, {Component} from 'react';
import Table from "./Table";
let PouchDB = require("pouchdb");
let programas = new PouchDB("programas");
let estudiantes = new PouchDB("estudiantes");
window.estudiantes = estudiantes;
window.programas = programas;
window.getTest = function(){
  programas.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
}

class Programs extends Component {
  constructor(){
    super();
    this.state = {
      selectedProgram: {},
      loading: true,
      programs: [],
      headers: [
        'Nombre del programa','Tipo','Orientación','Formato'
      ]
    }
  }  

  clickProgram(program){
    let selectedProgram = program;
    this.setState({selectedProgram});
    $('#modal-program').openModal();
  }

  componentDidMount() {
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    let loading = true;
    this.setState({loading});
    let that = this;
    programas.allDocs({include_docs: true, descending: true}).then(function(docs){
      loading = false;
      let programs = [];
      docs.rows.map(function(document){
        programs.push(document.doc);
      })
      that.setState({loading,programs});
      console.log(that.state);
    })
  }
  
  render() {
    return (
      <div className="row">
        <div id="modal-program" className="modal">
          <div className="modal-content">
            <h4>{this.state.selectedProgram.nombre}</h4>
            <ul className="collapsible" data-collapsible="accordion">
              <li>
                <div className="collapsible-header"><i className="material-icons">filter_drama</i>Información del programa</div>
                <div className="collapsible-body">
                  <p>
                    <h5>Nombre del Programa</h5>
                    {this.state.selectedProgram.nombre}
                    <h5>Tipo de programa</h5>
                    {this.state.selectedProgram.tipo}
                    <h5>Formato de programa</h5>
                    {this.state.selectedProgram.formato}
                    <h5>Alumnos Registrados en Programa</h5>
                    {(this.state.selectedProgram.studentsInProgram != undefined) ? this.state.selectedProgram.studentsInProgram.length : ""}
                  </p>               
                </div>
              </li>
              <li>
                <div className="collapsible-header"><i className="material-icons">place</i>Alumnos en el programa</div>
                <div className="collapsible-body">
                  <p>
                    <Table headers={["Matricula","Nombre del Alumno","Correo Electrónico","Teléfono"]} rows={(this.state.selectedProgram.studentsInProgram != undefined) ? this.state.selectedProgram.studentsInProgram : []} values={["matricula","nombre","email","telefono"]} />
                  </p>
                </div>
              </li>
              <li>
                <div className="collapsible-header"><i className="material-icons">whatshot</i>Eliminar programa</div>
                <div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
              </li>
            </ul>
          </div>
        </div>
        <Table onRowClick={this.clickProgram.bind(this)}  rows={this.state.programs} headers={["Nombre","Tipo","Orientación","Formato"]} values={['nombre','tipo','orientacion','formato']}/>
      </div>
    );
  }
}

export default Programs;
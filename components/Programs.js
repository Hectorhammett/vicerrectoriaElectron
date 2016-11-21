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
    $('#modal-program').modal('open');
  }

  componentDidMount() {
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $(this.refs.modalProgram).modal();
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
    })
  }
  
  clickedStudent(student){
    $('#modal-program').modal('close');
    this.props.history.push("overview/" + student._id);
  }

  deleteProgram(){
    let {selectedProgram} = this.state;
    let response = confirm("¿Desea borrar el programa?");
    if(response === true){
      let students = [];
      let promises = [];
      selectedProgram.studentsInProgram.map(function(student){
        let promise = estudiantes.get(student._id);
        promises.push(promise);
      })
      Promise.all(promises).then(function(results){
        results.map(function(student){
          let indexOfProgram = student.programas.indexOf(selectedProgram._id);
          if(indexOfProgram > -1)
            student.programas.splice(indexOfProgram,1);
        })
        return estudiantes.bulkDocs(results);
      })
      .then(function(){
        return programas.remove(selectedProgram);
      })
      .then(function(){
        return programas.allDocs({include_docs: true, descending: true})
      })
      .then(function(docs){
        $('#modal-program').modal('close');
        let programs = [];
        docs.rows.map(function(document){
          programs.push(document.doc);
        })
        this.setState({programs});
      }.bind(this))
      .catch(function(err){
        alert("Error");
        console.log(err);
      })
    }  
  }

  addStudent(){
    alert("AA");
  }

  editProgram(){
    let {selectedProgram} = this.state;
    $('#modal-program').modal('close');
    this.props.history.push("editProgram/" + selectedProgram._id);
  }

  render() {
    return (
      <div className="row">
        <div id="modal-program" className="modal" ref="modalProgram">
          <div className="modal-content">
            <h4>{this.state.selectedProgram.nombre}</h4>
            <ul className="collapsible" data-collapsible="accordion">
              <li>
                <div className="collapsible-header"><i className="material-icons">info_outline</i>Información del programa</div>
                <div className="collapsible-body">
                  <p>
                    <button className="waves-effect waves-light btn teal right"><i className="material-icons left">mode_edit</i>Editar Programa</button>
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
                <div className="collapsible-header"><i className="material-icons">account_circle</i>Alumnos en el programa</div>
                <div className="collapsible-body">
                  <p>
                    <Table onRowClick={this.clickedStudent.bind(this)} headers={["Matricula","Nombre del Alumno","Correo Electrónico","Teléfono"]} rows={(this.state.selectedProgram.studentsInProgram != undefined) ? this.state.selectedProgram.studentsInProgram : []} values={["matricula","nombre","email","telefono"]} />
                  </p>
                </div>
              </li>
              <li>
                <div className="collapsible-header"><i className="material-icons">settings</i>Opciones</div>
                <div className="collapsible-body">
                  <p>
                    <button className="waves-effect waves-light btn" onClick={this.editProgram.bind(this)}><i className="material-icons left">edit</i>Editar Programa</button>
                    <button className="waves-effect waves-light btn red" onClick={this.deleteProgram.bind(this)}><i className="material-icons left">delete_forever</i>Eliminar Programa</button>
                  </p>
                </div>
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
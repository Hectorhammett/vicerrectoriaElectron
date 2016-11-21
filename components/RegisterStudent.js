import React, {Component} from 'react';
import Materia from "./Materia";
var PouchDB = require('pouchdb');
var estudiantes = new PouchDB('estudiantes');
var programas = new PouchDB("programas");
var Validator = require('validatorjs');
Validator.useLang('es');

class RegisterStudent extends Component {
  constructor(){
    super();
    this.state = {
      student:{
        matricula:"",
        nombre:"",
        paterno:"",
        materno:"",
        email:"",
        telefono:"",
        programa:"",
        programas:[],
        becario:"",
        campus:"",
        materias: [],
        semestres: [],
        tutor:"",
        linea:"",
        tipoTrabajo: "",
        nombreTrabajo:""
      },
      programs: []
    }
  }

  componentDidMount() {
    let that = this;
    programas.allDocs({include_docs: true, descending: true},function(err,doc){
      if(!err){
        let programs = doc.rows;
        console.log(programs);
        that.setState({programs});
        console.log(that.state);
      }
      else
        Materialize.toast(err,3000,"red");
       $('select').material_select();
       if(that.state.programs.length > 0){
         let student = that.state.student;
         student.programa = 0;
         that.setState({student});
       }
    })
    $(this.refs.selectProgram).on('change',this.changeStudent.bind(this,'programa'))
  }
  
  addSubject(){
     let student = this.state.student;
     student.materias.push({
       nombre: ""
     });
     this.setState({student});
  }

  changeStudent(field,e){
    let student = this.state.student;
    student[field] = e.target.value;
    this.setState({student});
  }

  renderSubjects(){
    let that = this;
    return this.state.student.materias.map(function(subject,index){
      return <Materia key={index} subjectName={subject.nombre} identifier={index} deleteSubject={that.deleteSubject.bind(that)} updateSubjectName={that.updateSubjectName.bind(that)} />
    });
  }

  renderPrograms(){
    if(this.state.programs.length > 0)
      return this.state.programs.map(function(program,index){
        return <option value={index}>{program.doc.nombre}</option>
      });
    return <option value="">No hay programas registrados en el sistema</option>
  }

  updateSubjectName(index,e){
    let student = this.state.student;
    student.materias[index].nombre = e.target.value;
    this.setState({student});
  }

  deleteSubject(index){
    let student = this.state.student;
    let subjects = [...student.materias];
    subjects.splice(index,1);
    student.materias = subjects;
    this.setState({student});
  }

  saveStudent(){
    console.log("saving");
    let student = this.state.student;
    let rules = {
      matricula:"required",
      nombre:"required",
      paterno:"required",
      materno:"required",
      email:"required|email",
      telefono:"required",
      programa:"required",
      campus:"required",
      tutor:"required",
      linea:"required",
      tipoTrabajo: "required",
      nombreTrabajo: "required"
    }
    let validation = new Validator(student,rules);
    validation.setAttributeNames({
      matricula:"Matrícula",
      nombre:"Nombre(s)",
      paterno:"Apellido Paterno",
      materno:"Apellido Materno",
      email:"Correo Electrónico",
      telefono:"Teléfono",
      programa:"Programa",
      campus:"Campus",
      tutor:"Nombre del Tutor",
      linea:"Línea de generación y Ampliación del Conocimiento",
      tipoTrabajo: "Tipo de trabajo",
      nombreTrabajo: "Nombre del Trabajo"
    });
    let errorString = "";
    if(validation.fails()){
      let errors = validation.errors.all()
      for(let x in errors)
        errorString += errors[x] + "<br/>";
      Materialize.toast(errorString, 3000, 'red');
    }
    else{
      if(student.materias.length <= 0 ){
        Materialize.toast("El estudiante debe de tener al menos una materia registrada",3000,'red');
      }
      else{
        student._id = student.matricula;
        student.semestres.push(student.materias);
        student.programas = [];
        let that = this;
        estudiantes.get(student._id, function(err, resp) {
          if (err) {
            if (err.status = '404') { // if the document does not exist
              that.storeStudentInProgram(student);
            }
            else {
              Materialize.toast(err,3000,'red');
            }
          }
          else{
            if(student)
              Materialize.toast('Esta matrícula ya está en uso. Favor de registrar otra',3000,'red');
            else
              estudiantes.put(student,that.storeStudentInProgram(student));
          }
        });
      }
    }
  }

  storeStudentInProgram(student){
    let {programs} = this.state;
    let program = this.state.programs[this.state.student.programa].doc;
    let that = this;
    program.studentsInProgram.push(student);
    student.programas.push(program._id);
    Promise.all([
      estudiantes.put(student),
      programas.put(program)
    ])
    .then(function(results){
      program._rev = results[1].rev
      // programs[that.state.student.programa] = program;
      let student = {
        matricula:"",
        nombre:"",
        paterno:"",
        materno:"",
        email:"",
        telefono:"",
        programa:"0",
        becario:"",
        campus:"",
        materias: [],
        tutor:"",
        linea:"",
        tipoTrabajo: "",
        nombreTrabajo:"",
        programas:[],
        semestres:[]
      };
      that.setState({student});
      $('label.active').removeClass('active');
      $('input.valid').removeClass('valid');
      Materialize.toast('El Alumno se ha registrado correctamente.',3000,'teal');
    })
    .catch(function(err){
      Materialize.toast("Hubo un error, favor de reiniciar la aplicación",3000,'red');
      console.log(err);
    });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <div className="row">
          <form className="col s12">
            <div className="col s12"><h4>Datos personales del Alumno</h4></div>
            <div className="input-field col s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.matricula} onChange={this.changeStudent.bind(this,'matricula')}/>
              <label for="first_name">Matricula</label>
            </div>
            <div className="input-field col s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.nombre} onChange={this.changeStudent.bind(this,'nombre')}/>
              <label for="first_name">Nombre(s)</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.paterno} onChange={this.changeStudent.bind(this,'paterno')}/>
              <label for="first_name">Apellido Paterno</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.materno} onChange={this.changeStudent.bind(this,'materno')}/>
              <label for="first_name">Apellido Materno</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.email} onChange={this.changeStudent.bind(this,'email')}/>
              <label for="first_name">Correo Electrónico</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.telefono} onChange={this.changeStudent.bind(this,'telefono')}/>
              <label for="first_name">Teléfono</label>
            </div>
            <div className="col s12"><h4>Programa</h4></div>
             <div className="input-field col s12">
              <select ref="selectProgram" value={this.state.student.programa} onChange={this.changeStudent.bind(this,'programa')}>
                {this.renderPrograms()}                
              </select>
              <label>Seleccionar Programa</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.becario} onChange={this.changeStudent.bind(this,'becario')}/>
              <label for="first_name">Numero de becario(Opcional)</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.campus} onChange={this.changeStudent.bind(this,'campus')}/>
              <label for="first_name">Campus</label>
            </div>
            <div className="col s12"><h4>Carga Académica</h4></div>
            <div className="col s12">
              <a className="waves-effect waves-light btn" onClick={this.addSubject.bind(this)}><i className="material-icons left">add</i>Agregar Materia</a>
            </div>
            {this.renderSubjects()}
            <div className="col s12"><h4>Trabajo de Titulación</h4></div>
            <div className="input-field col s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.nombreTrabajo} onChange={this.changeStudent.bind(this,'nombreTrabajo')}/>
              <label for="first_name">Nombre del trabajo</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.tutor} onChange={this.changeStudent.bind(this,'tutor')}/>
              <label for="first_name">Nombre del tutor</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="validate" value={this.state.student.linea} onChange={this.changeStudent.bind(this,'linea')}/>
              <label for="first_name">Línea de Generación y Ampliación del Conocimiento</label>
            </div>
            <div className="col s12">
              <p>
                <input name="group1" type="radio" id="test1" value="Tesis" checked={this.state.student.tipoTrabajo == "Tesis"} onChange={this.changeStudent.bind(this,'tipoTrabajo')}/>
                <label htmlFor="test1">Tesis</label>
              </p>
              <p>
                <input name="group1" type="radio" id="test2" value="Tesina" checked={this.state.student.tipoTrabajo == "Tesina"} onChange={this.changeStudent.bind(this,'tipoTrabajo')}/>
                <label htmlFor="test2">Tesina</label>
              </p>
              <p>
                <input name="group1" type="radio" id="test3" value="Trabajo terminal" checked={this.state.student.tipoTrabajo == "Trabajo terminal"} onChange={this.changeStudent.bind(this,'tipoTrabajo')}/>
                <label htmlFor="test3">Trabajo Terminal</label>
              </p>
            </div>
            <div className="col s12">
              <br/>
              <a className="waves-effect waves-light btn-large" onClick={this.saveStudent.bind(this)}><i className="material-icons left">save</i>Guardar Alumno</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterStudent;
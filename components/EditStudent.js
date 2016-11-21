import React, {Component} from 'react';
import Materia from "./Materia";
var PouchDB = require('pouchdb');
var estudiantes = new PouchDB('estudiantes');
var programas = new PouchDB("programas");
var Validator = require('validatorjs');
Validator.useLang('es');

class EditStudent extends Component {
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
    estudiantes.get(this.props.params.matricula).then(function(student){
      this.setState({student},function(){
        $('input').change();
      });
    }.bind(this))
    .catch(function(err){
      Materialize.toast("Hubo un error en la consulta del estudiante",3000,"red");
      console.error(err);
    });
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
    }
    let validation = new Validator(student,rules);
    validation.setAttributeNames({
      matricula:"Matrícula",
      nombre:"Nombre(s)",
      paterno:"Apellido Paterno",
      materno:"Apellido Materno",
      email:"Correo Electrónico",
      telefono:"Teléfono"
    });
    let errorString = "";
    if(validation.fails()){
      let errors = validation.errors.all()
      for(let x in errors)
        errorString += errors[x] + "<br/>";
      Materialize.toast(errorString, 3000, 'red');
    }
    else{
       estudiantes.put(student).then(function(){
         let promises = [];
         student.programas.map(function(programa){
           promises.push(programas.get(programa));
         })
         return Promise.all(promises);
       }.bind(this))
       .then(function(programs){
        let promises = [];
        programs.map(function(programa){
          let index = programa.studentsInProgram.map(function(row){return row.matricula}).indexOf(student.matricula);
          let studentInProgram = programa.studentsInProgram[index];
          studentInProgram.nombre = student.nombre;
          studentInProgram.paterno = student.paterno;
          studentInProgram.materno = student.materno;
          studentInProgram.email = student.email;
          studentInProgram.telefono = student.telefono;
          promises.push(programas.put(programa));
          return Promise.all(promises);
        })
       }.bind(this))
       .then(function(){
        Materialize.toast("El alumno se ha actualizado correctamente",3000,"teal");
        this.props.history.push("overview/" + student._id);
       }.bind(this))
       .catch(function(err){
         Materialize.toast("Hubo un error actualizando al estudiante",3000,"red");
         console.error(err);
       });
    }
  }

  deleteStudent(){
    let {student} = this.state;
    let response = confirm(`¿Desea eliminar todos los datos del alumno ${student.nombre} ${student.paterno} ${student.materno}`);
    if(response === true){
      estudiantes.remove(student).then(function(response){
        let promises = [];
        student.programas.map(function(programId){
          let promise = programas.get(programId);
          promises.push(promise);
        })
        return Promise.all(promises);
      })
      .then(function(programs){
        let promises = [];
        programs.map(function(program){
          let index = program.studentsInProgram.map(function(row){return row.matricula}).indexOf(student.matricula);
          program.studentsInProgram.splice(index,1);
          let promise = programas.put(program);
          promises.push(promise);
        })
        return Promise.all(promises);
      })
      .then(function(){
        Materialize.toast("El alumno ha sido eliminado.",3000,"teal");
        this.props.history.push("search");
      }.bind(this))
      .catch(function(err){
        Materialize.toast("Hubo un error eliminando al alumno.",3000,"red");
        console.error(err);
      })
    }
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <div className="row">
          <form className="col s12">
            <div className="col s12"><h4>Datos personales del Alumno</h4></div>
            <div className="input-field col s12">
              <input id="first_name" type="text" className="" value={this.state.student.matricula} onChange={this.changeStudent.bind(this,'matricula')} readOnly={true}/>
              <label for="first_name" className="active">Matricula</label>
            </div>
            <div className="input-field col s12">
              <input id="first_name" type="text" className="" value={this.state.student.nombre} onChange={this.changeStudent.bind(this,'nombre')}/>
              <label for="first_name" className="active">Nombre(s)</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="" value={this.state.student.paterno} onChange={this.changeStudent.bind(this,'paterno')}/>
              <label for="first_name" className="active">Apellido Paterno</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="" value={this.state.student.materno} onChange={this.changeStudent.bind(this,'materno')}/>
              <label for="first_name" className="active">Apellido Materno</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="" value={this.state.student.email} onChange={this.changeStudent.bind(this,'email')}/>
              <label for="first_name" className="active">Correo Electrónico</label>
            </div>
            <div className="input-field col m6 s12">
              <input id="first_name" type="text" className="" value={this.state.student.telefono} onChange={this.changeStudent.bind(this,'telefono')}/>
              <label for="first_name" className="active">Teléfono</label>
            </div>
            <div className="col s12">
              <br/>
              <a className="waves-effect waves-light btn-large" onClick={this.saveStudent.bind(this)}><i className="material-icons left">save</i>Guardar Alumno</a>
              <a className="waves-effect waves-light btn-large red" onClick={this.deleteStudent.bind(this)}><i className="material-icons left">delete</i>Eliminar Alumno</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditStudent;
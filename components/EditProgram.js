import React, {Component} from 'react';
let PouchDB = require("pouchdb");
let programas = new PouchDB("programas");
let Validator = require("validatorjs");

const HACKY_FIX = {
  overflowX: "hidden"
}

class EditProgram extends Component {
  constructor(){
    super();
    this.state = {
      program:{
        nombre: "",
        tipo:"",
        formato: "",
        orientacion: "",
        studentsInProgram: []
      }
    }
  }

  componentWillMount() {
      programas.get(this.props.params.id).then(function(program){
          this.setState({program},function(){ $('input').change() });
      }.bind(this)) 
      .catch(function(err){
          Materialize.toast("Hubo un error en la consulta del programa",3000,"red");
          console.error(err);
      })
  }
  
  changeProgram(field, e){
    let program = this.state.program;
    program[field] = e.target.value;
    this.setState({program});
  }

  saveProgram(){
    let rules = {
      nombre: "required",
      tipo: "required",
      formato: "required",
      orientacion: "required"
    }

    let program = this.state.program;

    let validation = new Validator(program,rules);
    validation.setAttributeNames({
      nombre: "Nombre",
      tipo: "Tipo de programa",
      formato: "Formato del programa",
      orientacion: "Orientación del programa"
    });

    if(validation.fails()){
      let errorString = "";
      let errors = validation.errors.all();
      for(var x in errors)
        errorString += errors[x] + "<br/>";
      Materialize.toast(errorString,3000,'red');
    }
    else{
      programas.put(program, function callback(err, result) {
        console.log("Salvado",program);
        if (!err) {
          Materialize.toast("El programa se ha actualizado correctamente", 3000, 'teal');
          this.props.history.push("programs");
        }
        else{
          Materialize.toast((err),3000,'red');
        }
      }.bind(this));
    }

  }
  
  checked(field,value){
    return this.state.program[field] == value;
  }

  render() {
    console.log(this.state);
    return (
      <div className="row" style={HACKY_FIX}>
        <div className="col s12">
          <h4>Datos del programa</h4>
        </div>
        <div className="input-field col s12">
          <input id="first_name" type="text" className="" value={this.state.program.nombre} onChange={this.changeProgram.bind(this,'nombre')}/>
          <label for="first_name">Nombre del programa</label>
        </div>
        <div className="col s12">
          <h5>Tipo de programa</h5>
          <p>
            <input name="group1" type="radio" id="test1" value="Especialidad" checked={this.state.program.tipo == 'Especialidad'} onChange={this.changeProgram.bind(this,'tipo')}/>
            <label htmlFor="test1">Especialidad</label>
          </p>
          <p>
            <input name="group1" type="radio" id="test2" value="Maestría" checked={this.state.program.tipo == 'Maestría'} onChange={this.changeProgram.bind(this,'tipo')}/>
            <label htmlFor="test2">Maestría</label>
          </p>
          <p>
            <input name="group1" type="radio" id="test3" value="Doctorado" checked={this.state.program.tipo == 'Doctorado'} onChange={this.changeProgram.bind(this,'tipo')}/>
            <label htmlFor="test3">Doctorado</label>
          </p>
        </div>
        <div className="col s12">
          <h5>Formato del programa</h5>
          <p>
            <input name="group2" type="radio" id="formato1" value="Cuatrimestral" checked={this.state.program.formato == 'Cuatrimestral'} onChange={this.changeProgram.bind(this,'formato')}/>
            <label htmlFor="formato1">Cuatrimestral</label>
          </p>
          <p>
            <input name="group2" type="radio" id="formato2" value="Semestral" checked={this.state.program.formato == 'Semestral'} onChange={this.changeProgram.bind(this,'formato')}/>
            <label htmlFor="formato2">Semestral</label>
          </p>
        </div>
        <div className="col s12">
          <h5>Orientación del programa</h5>
          <p>
            <input name="group3" type="radio" id="orientacion1" value="Profesional" checked={this.state.program.orientacion == 'Profesional'} onChange={this.changeProgram.bind(this,'orientacion')}/>
            <label htmlFor="orientacion1">Profesional</label>
          </p>
          <p>
            <input name="group3" type="radio" id="orientacion2" value="Investigación" checked={this.state.program.orientacion == 'Investigación'} onChange={this.changeProgram.bind(this,'orientacion')}/>
            <label htmlFor="orientacion2">Investigación</label>
          </p>
          <p>
            <input name="group3" type="radio" id="orientacion3" value="Industria/Empresa" checked={this.state.program.orientacion == 'Industria/Empresa'} onChange={this.changeProgram.bind(this,'orientacion')}/>
            <label htmlFor="orientacion3">Industria/Empresa</label>
          </p>
        </div>
        <div className="col s12">
          <br/>
          <a className="waves-effect waves-light btn-large" onClick={this.saveProgram.bind(this)}><i className="material-icons left">save</i>Guardar Programa</a>
        </div>
      </div>
    );
  }
}

export default EditProgram;
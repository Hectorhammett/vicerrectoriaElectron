import React, {Component} from 'react';
import ProgramsGrid from "./ProgramsGrid";
import AddSemester from "./AddSemester";
import EditSemester from "./EditSemester";
import EditJob from "./EditJob";
import AddNote from "./AddNote";

var PouchDB = require('pouchdb');
var estudiantes = new PouchDB('estudiantes');
let programas = new PouchDB("programas");

window.programas = programas;
window.estudiantes = estudiantes;

const CURSOR_PONTER = {
    cursor: "pointer"
}

const MENU = {
    height: 215,
    overflowX: "auto",
}

class Overview extends Component {
    constructor(){
        super();
        this.state = {
            addSemester: false,
            editSemester: false,
            editJob: false,
            addNote: false,
            alumno: {},
            programas: [],
            programa: null,
            alumnoEnPrograma:null,
            loading: true,
            subjects: [],
            semesterIndex: 0
        }
    }

    componentWillMount() {
        let that = this;
        let alumno = null;
        estudiantes.get(this.props.params.matricula)
        .then(function(alumnFetch){
            alumno = alumnFetch;
            let promises = [];
            alumno.programas.map(function(programId){
                let promise = programas.get(programId);
                promises.push(promise);
            });
            that.setState({alumno});
            return promises;
        })
        .then(function(promises){
            return Promise.all(promises);
        })
        .then(function(programas){
            that.setState({programas});
        })
        .catch(function(err){
            Materialize.toast(err,3000,"red");
        })
    }
    
    renderPersonalInfo(){
        return <div className="row">
            <div className="col s12">
                <h2 className="header red-text text-lighten-2 light">Información Personal</h2>
                <h5>Matrícula</h5>
                {this.state.alumno._id}
                <h5>Nombre del Alumno</h5>
                {this.state.alumno.nombre +" "+ this.state.alumno.paterno + " " + this.state.alumno.materno}
                <h5>Correo</h5>
                {this.state.alumno.email}
                <h5>Teléfono</h5>
                {this.state.alumno.telefono}
            </div>
        </div>
    }
    
    storeSemester(subjects){
        let {alumnoEnPrograma,programa} = this.state;
        alumnoEnPrograma.semestres.push(subjects);
        let that = this;
        programas.put(programa).then(function(response){
            Materialize.toast("Se ha agregado el semestre.",3000,'teal');
            programa._rev = response.rev;
            that.setState({alumnoEnPrograma,programa});
        })
        .catch(function(err){
            Materialize.toast(err,3000,'red');
        })
    }

    updateSemester(updatedSemester){
        let {subjects,alumnoEnPrograma,semesterIndex,programa} = this.state;
        alumnoEnPrograma.semestres[semesterIndex] = updatedSemester;
        subjects = alumnoEnPrograma.semestres[semesterIndex];
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            this.setState({alumnoEnPrograma,subjects,programa});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error actualizando al estudiante",3000,"red");
            console.log(err);
        })
    }

    programStats(index){
        let {programas,programa,alumno,alumnoEnPrograma} = this.state;
        programa = programas[index];
        alumnoEnPrograma = programa.studentsInProgram.find(function(row){ return row._id === alumno._id });
        this.setState({programa,alumnoEnPrograma});
    }

    setSemester(index){
        let {semesterIndex} = this.state;
        semesterIndex = index;
        let subjects = this.state.alumnoEnPrograma.semestres[index];
        this.setState({subjects,semesterIndex});
    }

    renderSemesters(){
        const {alumnoEnPrograma} = this.state;
        let that = this;
        return alumnoEnPrograma.semestres.map(function(semester,index){
            return <li className="collection-item" style={CURSOR_PONTER} onClick={that.setSemester.bind(that,index)}>Unidad {index + 1}</li>
        })
    }

    renderSubjectsInSemester(){
        const {subjects} = this.state;
        return subjects.map(function(row,index){
            return (
                <div className="col s12">
                    <div className="card white">
                        <div className="card-content">
                            <span className="card-title">{row.nombre}</span>
                            <p>Calificación: {row.calificacion == undefined? "Sin Calificación" : row.calificacion}</p>
                        </div>
                    </div>
                </div>
            )
        })
    }

    showModal(modal){
        let state = this.state;
        let that = this;
        state[modal] = true;
        this.setState(state,function(){
            setTimeout(function(){
                state[modal] = false;
                that.setState(state);
            })
        },1);
    }

    renderStats(){
        const {programa,subjects} = this.state;
        if(programa == null)
            return (<h5 className="center-align"> No se ha seleccionado programa del alumno </h5>)
        else
        return(
            <div className="row">
                <div className="col s12">
                    <div className="row">
                        <div className="col s12"><h4>{programa.formato === "Cuatrimestral" ? "Cuatrimestres" : "Semestres"}</h4></div>
                    </div>
                </div>
                <div className="col s6">
                    <div className="row">
                        <div className="col s12">
                            <b>Unidades Académicas en programa</b>
                        </div>
                    </div>
                     <div className="row" style={MENU}>
                        <div className="col s12">
                            <ul className="collection">
                                {this.renderSemesters()}
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"addSemester")}><i className="material-icons right">add</i>AGREGAR UNIDAD</button>
                        </div>
                    </div>
                </div>
                <div className="col s6">
                    <div className="row">
                        <div className="col s12">
                            <b>Materias en Unidad del semestre</b>
                        </div>
                    </div>
                    <div className="row" style={MENU}>
                        {this.renderSubjectsInSemester()}
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"editSemester")} disabled={subjects.length == 0 ? true : false}><i className="material-icons right">add</i>EDITAR UNIDAD</button>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }

    renderProgramsGrid(){
        const {programas} = this.state;
        return(
            <div className="row">
                <div className="col s12">
                    <ProgramsGrid programs={programas} onProgramClick={this.programStats.bind(this)}/>
                </div>
            </div>
        )
    }

    /* Functions for the job */

    returnJob(trabajo){
        let {alumnoEnPrograma,programa} = this.state;
        alumnoEnPrograma.nombreTrabajo = trabajo.nombreTrabajo;
        alumnoEnPrograma.tipoTrabajo = trabajo.tipoTrabajo;
        alumnoEnPrograma.tutor = trabajo.tutor;
        alumnoEnPrograma.linea = trabajo.linea;
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            this.setState({alumnoEnPrograma,programa});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error actualizando el programa.",3000,"red");
            console.log(err);
        })
    }

    renderNotes(){
        let {alumnoEnPrograma} = this.state;
        if(alumnoEnPrograma.notas != undefined){
            return alumnoEnPrograma.notas.map(function(note,index){
               return (
                <div className="col s12">
                    <div className="card white">
                        <div className="card-content">
                            <span className="card-title">Nota {index + 1}</span>
                            <p>{note}</p>
                        </div>
                    </div>
                </div>
               )
            })
        }
    }

    renderJob(){
        const {programa,alumnoEnPrograma} = this.state;
        if(programa == null)
            return null
        else{
            return(
                <div className="row">
                <div className="col s12">
                    <div className="row">
                        <div className="col s12"><h4>Trabajo de Titulación</h4></div>
                    </div>
                </div>
                <div className="col s6">
                     <div className="row">
                        <div className="col s12">
                            <b>Información del programa</b>
                        </div>
                     </div>
                     <div className="row" style={MENU}>
                        <div className="col s12">
                            <h5>Nombre del trabajo</h5>
                            <p>{alumnoEnPrograma.nombreTrabajo}</p>
                        </div>
                         <div className="col s12">
                            <h5>Tipo de trabajo</h5>
                            <p>{alumnoEnPrograma.tipoTrabajo}</p>
                        </div>
                         <div className="col s12">
                            <h5>Tutor</h5>
                            <p>{alumnoEnPrograma.tutor}</p>
                        </div>
                         <div className="col s12">
                            <h5>Línea de Generación y Ampliación del Conocimiento</h5>
                            <p>{alumnoEnPrograma.linea}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"editJob")}><i className="material-icons right">edit</i>EDITAR TRABAJO</button>
                        </div>
                    </div>
                </div>
                <div className="col s6">
                    <div className="row">
                        <div className="col s12">
                            <b>Notas</b>
                        </div>
                    </div>
                    <div className="row" style={MENU}>
                        {this.renderNotes()}
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"addNote")}><i className="material-icons right">add</i>AGREGAR NOTA</button>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }

    returnNote(note){
        let {alumnoEnPrograma,programa} = this.state;
        if(alumnoEnPrograma.notas == undefined){
            alumnoEnPrograma.notas = [];
        }
        alumnoEnPrograma.notas.push(note);
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            this.setState({alumnoEnPrograma,programa});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error dando de alta la nota.",3000,"red");
            console.log(err);
        })
    }

    render() {
        const {addSemester,editSemester,subjects,alumnoEnPrograma,editJob,addNote} = this.state;
        return (
            <div>
                <AddSemester display={addSemester} returnSubjects={this.storeSemester.bind(this)}/>
                <EditSemester display={editSemester} semester={subjects} returnSubjects={this.updateSemester.bind(this)}/>
                <EditJob display={editJob} alumno={alumnoEnPrograma} returnJob={this.returnJob.bind(this)}/>
                <AddNote display={addNote} returnNote={this.returnNote.bind(this)}/>
                {this.renderPersonalInfo()}
                {this.renderProgramsGrid()}
                <div className="row">
                    <div className="col s12">
                        <h2 className="header red-text text-lighten-2 light">Estadísticas del alumno en programa</h2>
                    </div>
                    {this.renderStats()}
                    <div className="divider"></div>
                    {this.renderJob()}
                </div>
            </div>
        );
    }
}

export default Overview;
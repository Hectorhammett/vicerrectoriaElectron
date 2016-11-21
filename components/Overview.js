import React, {Component} from 'react';
import ProgramsGrid from "./ProgramsGrid";
import AddSemester from "./AddSemester";
import EditSemester from "./EditSemester";
import EditJob from "./EditJob";
import AddNote from "./AddNote";
import AddMovility from "./AddMovility";
import AddProductivity from './AddProductivity';
import EditNote from './EditNote';
import EditMovility from './EditMovility';
import EditProductivity from './EditProductivity';
import AddProgramToStudent from "./AddProgramToStudent";

var PouchDB = require('pouchdb');
var estudiantes = new PouchDB('estudiantes');
let programas = new PouchDB("programas");
let _ = require("lodash");

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
            addProgram: false,
            addSemester: false,
            editSemester: false,
            editJob: false,
            addNote: false,
            editNote: false,
            addMovility: false,
            editMovility: false,
            addProductivity: false,
            editProductivity: false,
            alumno: {},
            programas: [],
            programa: null,
            alumnoEnPrograma:null,
            loading: true,
            subjects: [],
            semesterIndex: 0,
            movility:{},
            movilityIndex: 0,
            productivity: {},
            productivityIndex: 0,
            noteIndex: 0,
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
                            <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"editSemester")} disabled={subjects.length == 0 ? true : false}><i className="material-icons right">edit</i>EDITAR UNIDAD</button>
                            <button className="waves-effect waves-light btn red" onClick={this.deleteUnit.bind(this)} disabled={subjects.length == 0 ? true : false}><i className="material-icons right">delete</i>ELIMINAR UNIDAD</button>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }

    deleteUnit(){
        let {alumnoEnPrograma,semesterIndex,subjects} = this.state;
        if(alumnoEnPrograma.semestres.length == 1){
            Materialize.toast("El alumno no puede querdarse sin Semestres/Cuatrimestres,",3000,'red');
        }
        else{
            let response = confirm(`¿Desea borrar el semestre/cuatrimeste ${semesterIndex + 1}?`);
            if(response === true){
                alumnoEnPrograma.semestres.splice(semesterIndex,1);
                subjects = [];
                this.setState({alumnoEnPrograma,subjects});
            }
        }
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
                        <div className="card-action">
                            <a href="#" onClick={this.editNote.bind(this,index)}>Editar Nota</a>
                            <a href="#" onClick={this.deleteNote.bind(this,index)}>Eliminar Nota</a>
                        </div>
                    </div>
                </div>
               )
            }.bind(this))
        }
    }

    editNote(index,e){
        e.preventDefault();
        let {alumnoEnPrograma,noteToEdit,noteIndex,editNote} = this.state;
        noteToEdit = alumnoEnPrograma.notas[index];
        noteIndex = index;
        this.setState({noteToEdit,noteIndex},this.showModal.bind(this,'editNote'));
    }

    deleteNote(index,e){
        e.preventDefault();
        let {alumnoEnPrograma,programa} = this.state;
        let response = confirm("¿Desea eliminar la nota del Estudiante?");
        if(response === true){
            alumnoEnPrograma.notas.splice(index,1);
            programas.put(programa).then(function(response){
                programa._rev = response.rev;
                this.setState({alumnoEnPrograma});
            }.bind(this))
            .catch(function(err){
                Materialize.toast("Hubo un error eliminando la nota.",3000,"red");
                console.log(err);
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

    updateNote(note){
        let {alumnoEnPrograma,programa,noteIndex} = this.state;
        alumnoEnPrograma.notas[noteIndex] = note;
        console.log(alumnoEnPrograma.notas[noteIndex]);
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            this.setState({programa,alumnoEnPrograma});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error actualizando la Nota",3000,"red");
            console.log(err)
        })
    }

    /* Movility functions */
    renderMovility(){
        const {programa,alumnoEnPrograma,movility} = this.state;
        if(programa == null)
            return null
        else{
            if(alumnoEnPrograma.movilidades == undefined || alumnoEnPrograma.movilidades.length == 0){
                return(
                <div className="row">
                    <div className="col s12">
                        <div className="row">
                            <div className="col s12"><h4>Movilidad Estudiantil</h4></div>
                        </div>
                    </div>
                    <div className="col s6">
                        <div className="row">
                            <div className="col s12">
                                <b>Movilidades Registradas</b>
                            </div>
                        </div>
                        <div className="row" style={MENU}>
                           <h5 className="center-align">No hay movilidades registradas</h5>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"addMovility")}><i className="material-icons right">add</i>Agregar Movilidad</button>
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
            return(
                <div className="row">
                <div className="col s12">
                    <div className="row">
                        <div className="col s12"><h4>Movilidad Estudiantil</h4></div>
                    </div>
                </div>
                <div className="col s6">
                     <div className="row">
                        <div className="col s12">
                            <b>Movilidades Registradas</b>
                        </div>
                     </div>
                     <div className="row" style={MENU}>
                        <div className="col s12">
                           <ul className="collection">
                                {this.renderMovilities()}
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"addMovility")}><i className="material-icons right">add</i>Agregar Movilidad</button>
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
                        {this.renderSelectedMovility()}
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"editMovility")} disabled={_.isEmpty(movility) ? true : false}><i className="material-icons right">edit</i>Editar Movilidad</button>
                            <button className="waves-effect waves-light btn red" onClick={this.deleteMovility.bind(this)} disabled={_.isEmpty(movility) ? true : false}><i className="material-icons right">delete</i>Eliminar Movilidad</button>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }

    renderMovilities(){
        let {alumnoEnPrograma} = this.state;
        return alumnoEnPrograma.movilidades.map(function(movility,index){
            return <li className="collection-item" style={CURSOR_PONTER} onClick={this.setMovility.bind(this,index)}>{movility.nombre}</li>
        }.bind(this))
    }

    setMovility(index){
        let {movility,movilityIndex,alumnoEnPrograma} = this.state;
        movilityIndex = index;
        movility = alumnoEnPrograma.movilidades[movilityIndex];
        this.setState({movility,movilityIndex,alumnoEnPrograma});
    }

    renderSelectedMovility(){
        let {movility} = this.state;
        if(_.isEmpty(movility))
            return null
        return(
            <div className="col s12">
                <h5>Nombre</h5>
                <p>{movility.nombre}</p>
                <h5>Fecha de Inicio</h5>
                <p>{movility.fechaInicio}</p>
                <h5>Fecha de Finalización</h5>
                <p>{movility.fechaFinal}</p>
                <h5>Destino</h5>
                <p>{movility.destino}</p>
                <h5>Resultado</h5>
                <p>{movility.resultado}</p>
            </div>
        )
    }

    returnMovility(movility){
        let {programa,alumnoEnPrograma} = this.state;
        if(alumnoEnPrograma.movilidades === undefined){
            alumnoEnPrograma.movilidades = [];
        }
        alumnoEnPrograma.movilidades.push(movility);
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            this.setState({alumnoEnPrograma,programa});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error guardando la Movilidad",3000,"red");
            console.log(err);
        })
    }

    updateMovility(movilityUpdate){
        let {alumnoEnPrograma,movilityIndex,programa,movility} = this.state;
        alumnoEnPrograma.movilidades[movilityIndex] = movilityUpdate;
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            movility = movilityUpdate;
            this.setState({programa,alumnoEnPrograma,movility});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error editando la movilidad del estudiante.",3000,"red");
            console.log(err);
        });
    }

    deleteMovility(){
        let {movility,movilityIndex,alumnoEnPrograma,programa} = this.state;
        let response = confirm("¿Desea borrar esta movilidad estudiantil?");
        if(response === true){
            alumnoEnPrograma.movilidades.splice(movilityIndex,1);
            movility = {};
            programas.put(programa).then(function(response){
                programa._rev = response.rev;
                this.setState({movility,alumnoEnPrograma,programa});
            }.bind(this))
            .catch(function(err){
                alert("Hubo un error eliminando la movilidad del estudiante",3000,"red");
                console.log(err);
            })
        }
    }

    /* Productivities Section */

    renderProductivity(){
        const {programa,alumnoEnPrograma,productivity} = this.state;
        if(programa == null)
            return null;
        if(alumnoEnPrograma.productividad === undefined || alumnoEnPrograma.productividad.length == 0){
            return(
                <div className="row">
                    <div className="col s12">
                        <div className="row">
                            <div className="col s12"><h4>Productividad</h4></div>
                        </div>
                    </div>
                    <div className="col s6">
                        <div className="row">
                            <div className="col s12">
                                <b>Trabajos de productividad registrados</b>
                            </div>
                        </div>
                        <div className="row" style={MENU}>
                           <h5 className="center-align">No hay trabajos registrados</h5>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"addProductivity")}><i className="material-icons right">add</i>Agregar Trabajo de Productividad</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="row">
                    <div className="col s12">
                        <div className="row">
                            <div className="col s12"><h4>Productividad</h4></div>
                        </div>
                    </div>
                    <div className="col s6">
                        <div className="row">
                            <div className="col s12">
                                <b>Trabajo de productividad registrados</b>
                            </div>
                        </div>
                        <div className="row" style={MENU}>
                            <div className="col s12">
                                <ul className="collection">
                                    {this.renderAllProductivities()}
                                </ul>
                            </div>  
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"addProductivity")}><i className="material-icons right">add</i>Agregar Trabajo de Productividad</button>
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
                            {this.renderSelectedProductivity()}
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,"editProductivity")} disabled={_.isEmpty(productivity) ? true : false}><i className="material-icons right">edit</i>Editar trabajo de Productividad</button>
                                <button className="waves-effect waves-light btn red" onClick={this.deleteProductivity.bind(this)} disabled={_.isEmpty(productivity) ? true : false}><i className="material-icons right">delete</i>Eliminar trabajo de Productividad</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

    renderAllProductivities(){
        const {alumnoEnPrograma} = this.state;
        return alumnoEnPrograma.productividad.map(function(row, index){
            return <li className="collection-item" style={CURSOR_PONTER} onClick={this.setProductivity.bind(this,index)}>{row.nombre}</li>
        }.bind(this))
    }  

    setProductivity(index){
        let {alumnoEnPrograma,productivity,productivityIndex} = this.state;
        productivity = alumnoEnPrograma.productividad[index];
        productivityIndex = index;
        this.setState({productivity,productivityIndex});
    }

    renderSelectedProductivity(){
        const {productivity} = this.state;
        if(_.isEmpty(productivity)){
            return null;
        }
        return(
            <div className="col s12">
                <h5>Nombre</h5>
                <p>{productivity.nombre}</p>
                <h5>Fecha</h5>
                <p>{productivity.fecha}</p>
                <h5>Categoria</h5>
                <p>{productivity.categoria}</p>
                <h5>Tipo</h5>
                <p>{productivity.tipo}</p>
            </div>
        )
    }

    returnProductivity(productivity){
        let {programa,alumnoEnPrograma} = this.state;
        if(alumnoEnPrograma.productividad === undefined){
            alumnoEnPrograma.productividad = [];
        }
        alumnoEnPrograma.productividad.push(productivity);
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            this.setState({programa,alumnoEnPrograma});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error actualizando los trabajos de productividad",3000,"red");
            console.log(err)
        });
    }

    updateProductivity(updatedProductivity){
        let {programa,alumnoEnPrograma,productivity,productivityIndex} = this.state;
        alumnoEnPrograma.productividad[productivityIndex] = updatedProductivity;
        productivity = updatedProductivity;
        programas.put(programa).then(function(response){
            programa._rev = response.rev;
            this.setState({alumnoEnPrograma,productivity});
        }.bind(this))
        .catch(function(err){
            Materialize.toast("Hubo un error actualizando el trabajo de productividad",3000,'red');
            console.log(err);
        });
    }

    deleteProductivity(){
        let {productivity,alumnoEnPrograma,productivityIndex,programa} = this.state;
        let response = confirm("¿Desea borrar este trabajo de productividad?");
        if(response === true){
            alumnoEnPrograma.productividad.splice(productivityIndex,1);
            productivity = {};
            programas.put(programa).then(function(response){
                programa._rev = response.rev;
                this.setState({alumnoEnPrograma,productivity,programa});
            }.bind(this))
            .catch(function(err){
                Materialize.toast("Hubo un eliminando el trabajo.",3000,"red");
                console.log(err);
            })
        }
    }

    returnProgram(program){
        let response = confirm(`¿Desea agregar el programa ${program.nombre} al alumno?`);
        if(response === true){
            let {alumno} = this.state;
            if(alumno.programas.indexOf(program._id) > -1){
                Materialize.toast("El alumno ya se encuentra en este programa",3000,"red");
            }
            else{
                alumno.programas.push(program._id);
                estudiantes.put(alumno).then(function(response){
                    alumno._rev = response.rev;
                    alumno.semestres = [];
                    alumno.materias = [];
                    alumno.nombreTrabajo = "";
                    alumno.tipoTrabajo = "";
                    alumno.tutor = "",
                    alumno.linea = "",
                    alumno.movilidades = undefined;
                    alumno.productividad = undefined;
                    alumno.notas = undefined;
                    program.studentsInProgram.push(alumno);
                    return programas.put(program);
                }.bind(this))
                .then(function(){
                    let promises = [];
                    alumno.programas.map(function(programId){
                        let promise = programas.get(programId);
                        promises.push(promise);
                    });
                    this.setState({alumno});
                    return promises;
                }.bind(this))
                .then(function(promises){
                    return Promise.all(promises);
                })
                .then(function(programas){
                    this.setState({programas});
                }.bind(this))
                .catch(function(err){
                    Materialize.toast("Hubo un error agregando al alumno al programa",3000,"red");
                    console.error(err);
                })
            }
        }
    }

    renderDelete(){
        const {programa,alumnoEnPrograma,productivity} = this.state;
        if(programa == null)
            return null;
        return <div className="row">
            <div className="col s12">
                <a className="waves-effect waves-light btn red" onClick={this.deleteStudentFromProgram.bind(this)}><i className="material-icons right">delete</i>ELIMINAR ALUMNO DEL PROGRAMA</a>
            </div>
        </div>
    }

    deleteStudentFromProgram(){
        let {alumno,programa} = this.state;
        let response = confirm(`¿Desea eliminar al alumno ${alumno.nombre} ${alumno.paterno} ${alumno.materno} del programa ${programa.nombre}?`);
        if(response === true){
            let index = alumno.programas.indexOf(programa._id);
            alumno.programas.splice(index,1);
            estudiantes.put(alumno).then(function(response){
                alumno._rev = response;
                index = programa.studentsInProgram.indexOf(alumno._id);
                programa.studentsInProgram.splice(index,1);
                return programas.put(programa);
            })
            .then(function(response){
                programa = {};
                this.setState({alumno, programas: [],
                programa: null,
                alumnoEnPrograma:null,
                loading: true,
                subjects: [],
                semesterIndex: 0,
                movility:{},
                movilityIndex: 0,
                productivity: {},
                productivityIndex: 0,
                noteIndex: 0,});
            }.bind(this))
            .then(function(){
                let promises = [];
                alumno.programas.map(function(programId){
                    let promise = programas.get(programId);
                    promises.push(promise);
                });
                this.setState({alumno});
                return promises;
            }.bind(this))
            .then(function(promises){
                return Promise.all(promises);
            })
            .then(function(programas){
                this.setState({programas});
            }.bind(this))
            .catch(function(err){
                Materialize.toast("Hubo un error eliminando al alumno del programa",3000,"red");
                console.error(err);
            })
        }
    }

    editStudent(){
        let {alumno} = this.state;
        this.props.history.push("editStudent/" + alumno._id);
    }

    render() {
        const {addProgram,editProductivity,productivity,movility,editMovility,noteToEdit,editNote,addProductivity,addSemester,editSemester,subjects,alumnoEnPrograma,editJob,addNote,addMovility} = this.state;
        console.log(this.state);
        return (
            <div>
                <AddProgramToStudent display={addProgram} returnProgram={this.returnProgram.bind(this)} />
                <AddSemester display={addSemester} returnSubjects={this.storeSemester.bind(this)}/>
                <EditSemester display={editSemester} semester={subjects} returnSubjects={this.updateSemester.bind(this)}/>
                <EditJob display={editJob} alumno={alumnoEnPrograma} returnJob={this.returnJob.bind(this)}/>
                <AddNote display={addNote} returnNote={this.returnNote.bind(this)}/>
                <EditNote display={editNote} returnNote={this.updateNote.bind(this)} note={noteToEdit} />
                <AddMovility display={addMovility} returnMovility={this.returnMovility.bind(this)} />
                <EditMovility display={editMovility} updateMovility={this.updateMovility.bind(this)} movility={movility}/>
                <AddProductivity display={addProductivity} returnProductivity={this.returnProductivity.bind(this)} />
                <EditProductivity display={editProductivity} updateProductivity={this.updateProductivity.bind(this)} productivity={productivity} />
                {this.renderPersonalInfo()}
                <div className="row">
                    <div className="col s12">
                        <button className="waves-effect waves-light btn" onClick={this.showModal.bind(this,'addProgram')}><i className="material-icons right">add</i>Agregar alumno a programa</button>
                        <button className="waves-effect waves-light btn" onClick={this.editStudent.bind(this)}><i className="material-icons right">edit</i>Editar Alumno</button>
                    </div>
                </div>
                {this.renderProgramsGrid()}
                <div className="row">
                    <div className="col s12">
                        <h2 className="header red-text text-lighten-2 light">Estadísticas del alumno en programa</h2>
                    </div>
                    {this.renderStats()}
                    {this.renderJob()}
                    {this.renderMovility()}
                    {this.renderProductivity()}
                    {this.renderDelete()}
                </div>
            </div>
        );
    }
}

export default Overview;
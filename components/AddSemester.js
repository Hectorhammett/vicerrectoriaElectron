import React, {Component} from 'react';
import Materia from './Materia';
let Validator = require("validatorjs");

class AddSemester extends Component {
    constructor(){
        super();
        this.state = {
            subjects: []
        }
    }

    componentDidMount(){
        let that = this;
        $(this.refs.semesterModal).modal({
            complete: function() { 
                let subjects = [];
                that.setState({subjects});
             }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.display == true){
            $(this.refs.semesterModal).modal('open');
        }
    }
    
    addSubject(){
        let {subjects} = this.state;
        let subject = {nombre:""};
        subjects.push(subject);
        this.setState({subjects});
    }

    updateSubjectName(index,e){
        let {subjects} = this.state;
        subjects[index].nombre = e.target.value;
        this.setState({subjects});
    }

     deleteSubject(index){
        let {subjects} = this.state;
        subjects.splice(index,1);
        this.setState({subjects});
    }

    renderSubjects(){
        const {subjects} = this.state;
        let that = this;
        return subjects.map(function(subject,index){
            return <Materia key={index} subjectName={subject.nombre} identifier={index} deleteSubject={that.deleteSubject.bind(that)} updateSubjectName={that.updateSubjectName.bind(that)} />
        });
    }

    storeSemester(){
        let {subjects} = this.state;
        if(subjects.length <= 0){
            Materialize.toast("El Semestre/Cuatrimestre debe de tener al menos una materia.",3000,"red");
        }
        else{
            if(!this.validateSubjects(subjects)){
                Materialize.toast("Las materias registradas deben de tener un nombre.",3000,"red");
            }
            else{
                this.props.returnSubjects(subjects);
                $(this.refs.semesterModal).modal('close');
            }
        }
    }

    validateSubjects(subjects){
        let result = true;
        subjects.map(function(subject){
            if(subject.nombre === "")
                result = false;
        })
        return result;
    }

    render() {
        return (
            <div id="modal1" className="modal" ref="semesterModal">
                <div className="modal-content">
                    <h4>Agregar Semestre</h4>
                    <p><button className="waves-effect waves-light btn" onClick={this.addSubject.bind(this)}><i className="material-icons right">add</i>AGREGAR MATERIA</button></p>
                    <div className="row">
                        {this.renderSubjects()}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-action waves-effect waves-green btn-flat" onClick={this.storeSemester.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default AddSemester;
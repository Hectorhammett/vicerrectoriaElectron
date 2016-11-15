import React, {Component} from 'react';
let _ = require("lodash");
class EditSemester extends Component {
    constructor(props){
        super(props);
        let {semester} = this.props;
        semester = semester.slice(0);
        this.state = {
            semester,
            addSubject: false,
            nombre:""
        }
    }

     componentDidMount() {
        let that = this;
        $(this.refs.semesterModal).modal({
            complete: function() { 
                let semester = [];
                that.setState({semester});
             }
        });
    }

    componentWillReceiveProps(nextProps) {
        let {semester} = this.state;
        if(nextProps.display == true){
            $(this.refs.semesterModal).modal('open');
        }
        if(!_.isEqual(semester,nextProps.semester)){
            semester = nextProps.semester.slice(0);
            this.setState({semester});
        }
    }

    updateGrade(index,e){
        let {semester} = this.state;
        semester[index].calificacion = e.target.value;
        this.setState({semester});
    }

    removeSubject(index){
        let {semester} = this.state;
        semester.splice(index,1);
        this.setState({semester});
    }

    renderSubjects(){
        const {semester,addSubject} = this.state;
        if(semester == undefined){
            return null;
        }
        return semester.map(function(subject,index){
            return (
                <div className="col s12 m6">
                    <div className="card white">
                        <div className="card-content">
                        <span className="card-title">{subject.nombre}</span>
                        <div>
                            <input placeholder="Calificación" value={subject.calificacion} type="text" onChange={this.updateGrade.bind(this,index)}/>
                        </div>
                        </div>
                        <div className="card-action">
                        <a className="waves-effect waves-teal btn-flat black-text" onClick={this.removeSubject.bind(this,index)}>Eliminar Materia</a>
                        </div>
                    </div>
                </div>
            );
        }.bind(this));
    }

    addSubject(){
        let {addSubject} = this.state;
        addSubject = true;
        this.setState({addSubject});
    }

    saveNewSubject(e){
        e.preventDefault();
        let {nombre,semester,addSubject} = this.state;
        let newSubject = {nombre};
        semester.push(newSubject);
        addSubject = false;
        nombre = "";
        this.setState({semester,addSubject,nombre});
    }

    updateName(e){
        let {nombre} = this.state;
        nombre = e.target.value;
        this.setState({nombre});
    }

    returnSubjects(){
        let {semester} = this.state;
        if(semester.length < 1){
            Materialize.toast("No se puede guardar una unidad sin Materias.",3000,"red");
        }
        else{
            this.props.returnSubjects(semester);
            $(this.refs.semesterModal).modal('close');
        }
    }

    renderContent(){
        const {addSubject,nombre,semester} = this.state;
        if(addSubject)
            return(
                <div>
                    <div className="modal-content">
                        <h4>Agregar Materia</h4>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="newSubject" type="text" value={nombre} onChange={this.updateName.bind(this)}/>
                                <label htmlFor="newSubject">Nombre de la materia</label>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="!#" className="modal-action waves-effect waves-green btn-flat" onClick={this.saveNewSubject.bind(this)}>Guardar</a>
                        <a href="!#" type="button" className=" modal-action waves-effect waves-green btn-flat" onClick={(e) => { e.preventDefault(); let {addSubject} = this.state; addSubject = false; this.setState({addSubject}) }}>Cancelar</a>
                    </div>
                </div>
            )
        return(
            <div>
                <div className="modal-content">
                    <h4>Editar Semestre</h4>
                    <p><button className="waves-effect waves-light btn" onClick={this.addSubject.bind(this)}><i className="material-icons right">add</i>AGREGAR MATERIA</button></p>
                    <div className="row">
                        {this.renderSubjects()}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.returnSubjects.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat" onClick={() => { $(this.refs.semesterModal).modal('close') }}>Cancelar</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div id="modal1" className="modal" ref="semesterModal">
                {this.renderContent()}
            </div>
        );
    }
}

export default EditSemester;
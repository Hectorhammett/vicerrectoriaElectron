import React, {Component} from 'react';
let _ = require("lodash");

class EditJob extends Component {
    constructor(){
        super();
        this.state = {
            trabajo: {
                nombreTrabajo: "",
                tipoTrabajo: "",
                tutor: "",
                linea: ""
            }
        }
    }

    componentDidMount() {
        $(this.refs.jobModal).modal({
            complete: function() { 
                let trabajo = {};
                this.setState({trabajo});
             }.bind(this)
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.display == true){
            $(this.refs.jobModal).modal('open');
        }
        if(nextProps.alumno != null){
            let {trabajo} = this.state;
            let {nombreTrabajo,tipoTrabajo,tutor,linea} = nextProps.alumno;
            let newTrabajo = {
                nombreTrabajo,tipoTrabajo,tutor,linea
            }
            if(!_.isEqual(trabajo,newTrabajo)){
                trabajo = newTrabajo;
                this.setState({trabajo});
            }
        }
    }

    changeJob(field,e){
        let {trabajo} = this.state;
        trabajo[field] = e.target.value;
        this.setState({trabajo});
    }

    returnJob(){
        let {trabajo} = this.state;
        this.props.returnJob(trabajo);
         trabajo =  {
            nombreTrabajo: "",
            tipoTrabajo: "",
            tutor: "",
            linea: ""
        }
        $(this.refs.jobModal).modal('close');
        this.setState({trabajo});
    }

    render() {
        const {trabajo} = this.state;
        return (
            <div id="modal2" className="modal" ref="jobModal">
                <div className="modal-content">
                    <h4>Editar Trabajo de Titulación</h4>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="nombre" type="text"  value={trabajo.nombreTrabajo} onChange={this.changeJob.bind(this,'nombreTrabajo')}/>
                            <label className="active" htmlFor="nombre">Nombre del trabajo</label>
                        </div>
                        <div className="input-field col m6 s12">
                            <input id="tutor" type="text"  value={trabajo.tutor} onChange={this.changeJob.bind(this,'tutor')}/>
                            <label className="active" htmlFor="tutor">Nombre del tutor</label>
                        </div>
                        <div className="input-field col m6 s12">
                            <input id="linea" type="text"  value={trabajo.linea} onChange={this.changeJob.bind(this,'linea')}/>
                            <label className="active" htmlFor="linea">Línea de Generación y Ampliación del Conocimiento</label>
                        </div>
                        <div className="col s12">
                            <p>
                                <input name="group1" type="radio" id="test1" value="Tesis" checked={trabajo.tipoTrabajo == "Tesis"} onChange={this.changeJob.bind(this,'tipoTrabajo')}/>
                                <label htmlFor="test1">Tesis</label>
                            </p>
                            <p>
                                <input name="group1" type="radio" id="test2" value="Tesina" checked={trabajo.tipoTrabajo == "Tesina"} onChange={this.changeJob.bind(this,'tipoTrabajo')}/>
                                <label htmlFor="test2">Tesina</label>
                            </p>
                            <p>
                                <input name="group1" type="radio" id="test3" value="Trabajo terminal" checked={trabajo.tipoTrabajo == "Trabajo terminal"} onChange={this.changeJob.bind(this,'tipoTrabajo')}/>
                                <label htmlFor="test3">Trabajo Terminal</label>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.returnJob.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default EditJob;
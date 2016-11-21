import React, {Component} from 'react';
let _ = require("lodash");

class EditMovility extends Component {
    constructor(){
        super();
        this.state = {
            nombre: "",
            fechaInicio: "",
            fechaFinal: "",
            destino: "",
            resultado: ""
        }
    }

    componentDidMount() {
         $(this.refs.movilityModal).modal({
            complete: function() { 
                let state = {
                    nombre: "",
                    fechaInicio: "",
                    fechaFinal: "",
                    destino: "",
                    resultado: ""
                };
                this.setState(state);
             }.bind(this)
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.display === true){
            $(this.refs.movilityModal).modal('open');
        }
        if(!_.isEqual(this.state,nextProps.movility)){
            let movility = nextProps.movility;
            this.setState(movility);
        }
    }

    updateMovility(){
        let movility = this.state;
        this.props.updateMovility(movility);
        this.setState({
            nombre: "",
            fechaInicio: "",
            fechaFinal: "",
            destino: "",
            resultado: ""
        });
    }

    updateField(field, e){
        let state = this.state;
        state[field] = e.target.value;
        this.setState(state);
    }

    render() {
        const {nombre,fechaInicio,fechaFinal,destino,resultado} = this.state;
        return (
            <div id="modal2" className="modal" ref="movilityModal">
                <div className="modal-content">
                    <h4>Editar Movilidad Estudiantil</h4>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="nombre" type="text" value={nombre} onChange={this.updateField.bind(this,'nombre')}/>
                            <label htmlFor="nombre">Nombre</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="inicio" type="text" value={fechaInicio} onChange={this.updateField.bind(this,'fechaInicio')}/>
                            <label htmlFor="inicio">Fecha de Inicio</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="final" type="text" value={fechaFinal} onChange={this.updateField.bind(this,'fechaFinal')}/>
                            <label htmlFor="final">Fecha de Finalización</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="destino" type="text" value={destino} onChange={this.updateField.bind(this,'destino')}/>
                            <label htmlFor="destino">Destino</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="resultado" type="text" value={resultado} onChange={this.updateField.bind(this,'resultado')}/>
                            <label htmlFor="resultado">Resultado</label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.updateMovility.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default EditMovility;
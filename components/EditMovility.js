import React, {Component} from 'react';
let _ = require("lodash");
let Validator = require('validatorjs');

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
         jQuery.extend( jQuery.fn.pickadate.defaults, {
            monthsFull: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
            monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
            weekdaysFull: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
            weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
            today: 'hoy',
            clear: 'borrar',
            close: 'cerrar'
        });
        let that = this;
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
         $('.dates').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            onSet: function(){
                let state = that.state;
                state[this.get('id')] = this.get();
                that.setState(state);
                this.close();
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.display === true){
            $(this.refs.movilityModal).modal('open');
        }
        if(!_.isEqual(this.state,nextProps.movility)){
            let movility = nextProps.movility;
            this.setState(movility,function(){ $('input').change() });
        }
    }

    updateMovility(){
        let movility = this.state;
        let rules = {
            nombre: "required",
            fechaInicio: "required",
            fechaFinal: "required",
            destino: "required",
            resultado: "required"
        }

        let validator = new Validator(movility,rules);

        validator.setAttributeNames({
            nombre: "Nombre",
            fechaInicio: "Fecha de Inicio",
            fechaFinal: "Fecha de Finalización",
            destino: "Destino",
            resultado: "Resultado"
        });

        if(validator.fails()){
            let errors = validator.errors.all();
            let errorString = "";
            for( var x in errors ){
                errorString += errors[x][0] + "<br/>";
            }
            Materialize.toast(errorString,3000,"red");
            return;
        }

        this.props.updateMovility(movility);
        this.setState({
            nombre: "",
            fechaInicio: "",
            fechaFinal: "",
            destino: "",
            resultado: ""
        });
        $(this.refs.movilityModal).modal('close');
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
                            <input id="inicio" type="text" className="dates" id="fechaInicio" value={fechaInicio} onChange={this.updateField.bind(this,'fechaInicio')}/>
                            <label htmlFor="inicio">Fecha de Inicio</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="final" type="text" className="dates" id="fechaFinal" value={fechaFinal} onChange={this.updateField.bind(this,'fechaFinal')}/>
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
                    <button className="modal-action waves-effect waves-green btn-flat" onClick={this.updateMovility.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default EditMovility;
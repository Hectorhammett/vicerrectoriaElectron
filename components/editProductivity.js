import React, {Component} from 'react';
let _ = require("lodash");
let Validator = require('validatorjs');

const ORIGINAL_STATE = {
    nombre: "",
    fecha: "",
    categoria: "",
    tipo: ""
}

class EditProductivity extends Component {
    constructor(){
        super();
        this.state = ORIGINAL_STATE;
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
         $(this.refs.productivityModal).modal({
            complete: function() { 
                let state = ORIGINAL_STATE;
                this.setState(state);
             }.bind(this)
        });
        $('.dateos').pickadate({
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
            $(this.refs.productivityModal).modal('open');
        }
        if(!_.isEqual(this.state,nextProps.productivity)){
            let productivity = nextProps.productivity;
            this.setState(productivity);
        }
    }

    updateField(field, e){
        let state = this.state;
        state[field] = e.target.value;
        this.setState(state);
    }

    updateProductivity(){
        let productivity = this.state;
        let rules = {
            nombre: "required",
            fecha: "required",
            categoria: "required",
            tipo: "required"
        }

        let validator = new Validator(productivity,rules);

        validator.setAttributeNames({
            nombre: "Nombre",
            fecha: "Fecha",
            categoria: "Categoría",
            tipo: "Tipo"
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
        this.props.updateProductivity(productivity);
        this.setState(ORIGINAL_STATE);
    }

    render() {
        const {nombre,fecha,categoria,tipo} = this.state;
        return (
            <div id="modal3" className="modal" ref="productivityModal">
                <div className="modal-content">
                    <h4>Editar trabajo de Productividad</h4>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="nombreas" type="text" value={nombre} onChange={this.updateField.bind(this,'nombre')}/>
                            <label htmlFor="nombreas">Nombre</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="inicioas" className="dateos" id="fecha" type="text" value={fecha} onChange={this.updateField.bind(this,'fecha')}/>
                            <label htmlFor="inicioas">Fecha</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="destinoa" type="text" value={categoria} onChange={this.updateField.bind(this,'categoria')}/>
                            <label htmlFor="destinoas">Categoría</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="resultadoas" type="text" value={tipo} onChange={this.updateField.bind(this,'tipo')}/>
                            <label htmlFor="resultadoas">Tipo</label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-action waves-effect waves-green btn-flat" onClick={this.updateProductivity.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default EditProductivity;
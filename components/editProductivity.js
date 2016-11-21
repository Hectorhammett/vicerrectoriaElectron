import React, {Component} from 'react';
let _ = require("lodash");

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
         $(this.refs.productivityModal).modal({
            complete: function() { 
                let state = ORIGINAL_STATE;
                this.setState(state);
             }.bind(this)
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
                            <input id="inicioas" type="text" value={fecha} onChange={this.updateField.bind(this,'fecha')}/>
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
                    <button className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.updateProductivity.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default EditProductivity;
import React, {Component} from 'react';

const ORIGINAL_STATE = {
    nombre: "",
    fecha: "",
    categoria: "",
    tipo: ""
}

class AddProductivity extends Component {
    constructor(){
        super();
        this.state = ORIGINAL_STATE;
    }

    componentDidMount() {
         $(this.refs.productivityModal).modal({
            complete: function() { 
                this.setState( {
                    nombre: "",
                    fecha: "",
                    categoria: "",
                    tipo: ""
                });
             }.bind(this)
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.display === true){
            $(this.refs.productivityModal).modal('open');
        }
    }

    updateField(field, e){
        let state = this.state;
        state[field] = e.target.value;
        this.setState(state);
    }

    returnProductivity(){
        let productivity = this.state;
        this.props.returnProductivity(productivity);
        this.setState(ORIGINAL_STATE);
    }

    render() {
        const {nombre,fecha,categoria,tipo} = this.state;
        return (
           <div id="modal3" className="modal" ref="productivityModal">
                <div className="modal-content">
                    <h4>Nuevo trabajo de Productividad</h4>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="nombrea" type="text" value={nombre} onChange={this.updateField.bind(this,'nombre')}/>
                            <label htmlFor="nombrea">Nombre</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="inicioa" type="text" value={fecha} onChange={this.updateField.bind(this,'fecha')}/>
                            <label htmlFor="inicioa">Fecha</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="destinoa" type="text" value={categoria} onChange={this.updateField.bind(this,'categoria')}/>
                            <label htmlFor="destinoa">Categoría</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="resultadoa" type="text" value={tipo} onChange={this.updateField.bind(this,'tipo')}/>
                            <label htmlFor="resultadoa">Tipo</label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.returnProductivity.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default AddProductivity;
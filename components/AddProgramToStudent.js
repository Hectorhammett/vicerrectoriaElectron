import React, {Component} from 'react';
import Table from './Table';

var PouchDB = require('pouchdb');
let programas = new PouchDB("programas");

class AddProgramToStudent extends Component {
    constructor(){
        super();
        this.state = {
            programs: []
        };
    }

    componentWillMount() {
        programas.allDocs({
            include_docs: true,
            attachments: true,
        }).then(function(results){
            let programs = [];
            results.rows.map(function(program){
                programs.push(program.doc);
            })
            this.setState({programs});
        }.bind(this))
    }   

    componentDidMount() {
        $(this.refs.programModal).modal();
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.display == true){
            $(this.refs.programModal).modal('open');
        }
    }

    returnProgram(program){
        $(this.refs.programModal).modal('close');
        this.props.returnProgram(program);
    }

    render() {
        const {programs} = this.state;
        return (
            <div id="modal1" className="modal" ref="programModal">
                <div className="modal-content">
                    <h4>Escoger Programa para el alumno</h4>
                    <Table rows={programs} onRowClick={this.returnProgram.bind(this)} headers={["Nombre del programa","Tipo","Orientación","Formato"]} values={['nombre','tipo','orientacion','formato']} />
                </div>
                <div className="modal-footer">
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">CANCELAR</button>
                </div>
            </div>
        );
    }
}

export default AddProgramToStudent;
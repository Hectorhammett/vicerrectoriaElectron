import React, {Component} from 'react';
import Table from "./Table";
let PouchDB = require("pouchdb");
let programas = new PouchDB("programas");

class Programs extends Component {
  constructor(){
    super();
    this.state = {
      selectedProgram: {},
      loading: false,
      programs: {},
      headers: [
        'Nombre del programa','Tipo','Orientación','Formato'
      ]
    }
  }  

  clickProgram(program){
    let selectedProgram = program;
    this.setState({selectedProgram});
    $('#modal-program').openModal();
  }

  componentDidMount() {
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    let loading = true;
    this.setState({loading});
    let that = this;
    programas.allDocs({include_docs: true, descending: true}).then(function(docs){
      loading = false;
      let programs = docs;
      that.setState({loading,programs});
      console.log(that.state);
    })
  }
  
  render() {
    return (
      <div className="row">
        <div id="modal-program" className="modal">
          <div className="modal-content">
            <h4>{this.state.selectedProgram.nombre}</h4>
            <ul className="collapsible" data-collapsible="accordion">
              <li>
                <div className="collapsible-header"><i className="material-icons">filter_drama</i>Información del programa</div>
                <div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
              </li>
              <li>
                <div className="collapsible-header"><i className="material-icons">place</i>Alumnos en el programa</div>
                <div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
              </li>
              <li>
                <div className="collapsible-header"><i className="material-icons">whatshot</i>Eliminar programa</div>
                <div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
              </li>
            </ul>
          </div>
        </div>
        <Table handleRowClick={this.clickProgram.bind(this)} loading={this.state.loading} headers={this.state.headers} rows={this.state.programs.rows} keys={['nombre','tipo','orientacion','formato']}/>
      </div>
    );
  }
}

export default Programs;
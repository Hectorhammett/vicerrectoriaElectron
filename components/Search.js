import React, {Component} from 'react';
import Table from "./Table";
let PouchDB = require("pouchdb");
let programas = new PouchDB("programas");
let estudiantes = new PouchDB("estudiantes");
let _ = require("lodash");

class Search extends Component {
  constructor(){
    super();
    this.state = {
      students: [],
      clickedStudent: {},
      loading: true
    };
  }

  componentDidMount() {
    let that = this;
    estudiantes.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (documents) {
      let students = [];
      let loading = false;
      documents.rows.map(function(document){
        students.push(document.doc);
      });
      that.setState({students,loading});
    }).catch(function (err) {
      console.log(err);
    });
  }

  redirectToOverview(student){
    this.props.history.push("overview/" + student._id);
  }

  render() {
    return (
      <div>
        <div className="row">
            <div className="col s12">
              <Table onRowClick={this.redirectToOverview.bind(this)} headers={["Matricula","Nombre del Alumno","Correo Electrónico","Teléfono"]} values={["matricula","nombre","email","telefono"]} rows={this.state.students} loading={this.state.loading}/>
            </div>
          </div>
      </div>
    );
  }
}

export default Search;
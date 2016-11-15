import React, {Component} from 'react';

class AddSubjectInSemester extends Component {
    constructor(){
        super();
        this.state = {
            nombre: ""
        };
    }

    changeName(e){
        let {nombre} = this.state;
        nombre = e.target.value;
        this.setState({nombre});
    }

    render() {
        const {nombre} = this.state;
        return (
            <div className="col s12 m6">
                <div className="card white">
                    <div className="card-content">
                    <span className="card-title">Materia</span>
                    <div>
                        <input placeholder="Nombre de la Materia" value={nombre} onChange={this.changeName.bind(this)} type="text"/>
                    </div>
                    </div>
                    <div className="card-action">
                    <a className="waves-effect waves-teal btn-flat" onClick={this.props.deleteSubject.bind(this,this.props.identifier)}>Eliminar Materia</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddSubjectInSemester;
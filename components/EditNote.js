import React, {Component} from 'react';
let _ = require("lodash");


class AddNote extends Component {
    constructor(){
        super();
        this.state = {
            newNote:""
        };
    }

    componentDidMount() {
         $(this.refs.noteModal).modal({
            complete: function() { 
                let newNote = "";
                this.setState({newNote});
             }.bind(this)
        });
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.display == true){
            $(this.refs.noteModal).modal('open');
        }
        if(!_.isEqual(this.state,nextProps.note)){
            let newNote = nextProps.note;
            this.setState({newNote});
        }
    }
    
    updateNote(e){
        let {newNote} = this.state;
        newNote = e.target.value;
        this.setState({newNote});
    }

    returnNote(){
        let {newNote} = this.state;
        this.props.returnNote(newNote);
        newNote = "";
        this.setState({newNote});
    }

    render() {
        const {newNote} = this.state;
        return (
            <div id="modal2" className="modal" ref="noteModal">
                <div className="modal-content">
                    <h4>Editar Nota</h4>
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="textarea1v" className="materialize-textarea active" value={newNote} onChange={this.updateNote.bind(this)}></textarea>
                            <label for="textarea1v">Nota</label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.returnNote.bind(this)}>Guardar</button>
                    <button className=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</button>
                </div>
            </div>
        );
    }
}

export default AddNote;
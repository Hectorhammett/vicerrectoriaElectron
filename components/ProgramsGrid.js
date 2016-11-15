import React, {Component} from 'react';


class ProgramsGrid extends Component {
    componentDidMount() {
        $('.collapsible').collapsible({
            accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }
    
    renderCollection(){
        let that = this;
        return this.props.programs.map(function(program,index){
            return(
                <li className="collection-item" style={{cursor: "pointer"}} onClick={that.props.onProgramClick.bind(this,index)}>{program.nombre}</li>
            )
        })
    }

    render() {
        return (
            <div>
                <h2 className="header red-text text-lighten-2 light">Programas del Estudiante</h2>
                <ul className="collection">
                    {this.renderCollection()}
                </ul>
            </div>
        );
    }
}

export default ProgramsGrid;
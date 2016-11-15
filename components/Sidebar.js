import React, {Component} from 'react';
import { Link } from "react-router";

class Sidebar extends Component {
  handleClick(title){
    this.props.setTitle(title);
  }

  render() {
    return (
      <div>
        <ul id="slide-out" className="side-nav fixed " style={{zIndex: "0"}}>
          <li className="center-align" id="title-holder">SSTEP</li>
          <li><div className="divider"></div></li>
          <li><a className="subheader">Menú Principal</a></li>
          <li><Link className="waves-effect" to="search" onClick={() => {this.handleClick("Búsqueda de Alumnos")}}>Búsqueda de Alumnos</Link></li>
          <li><Link className="waves-effect" to="registerStudent" onClick={() => {this.handleClick("Registro de Alumnos")}}>Registro de Alumnos</Link></li>
          <li><Link className="waves-effect" to="programs" onClick={() => {this.handleClick("Programas Registrados")}}>Programas Registrados</Link></li>
          <li><Link className="waves-effect" to="registerProgram" onClick={() => {this.handleClick("Registro de Programa")}}>Registro de Programa</Link></li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
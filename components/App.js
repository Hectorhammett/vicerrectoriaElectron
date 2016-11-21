import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

/* All the components */
import Sidebar from "./Sidebar";
import Container from "./Container";
import Search from "./Search";
import RegisterStudent from "./RegisterStudent";
import RegisterProgram from "./RegisterProgram";
import Programs from "./Programs";
import Overview from "./Overview";
import EditProgram from "./EditProgram";
import EditStudent from "./EditStudent";

class App extends Component {
  constructor(){
    super();
    this.state = {
      title: "Inicial",
      alumno: {}
    }
  }
  
  componentDidMount() {
    $(".button-collapse").sideNav();
  }
  
  setTitle(title){
    this.setState({title});
  }

  render() {
    return (
      <div>
        <Sidebar setTitle={this.setTitle.bind(this)}/>
        <main>
          <nav>
            <div className="nav-wrapper">
              <a href="#" className="brand-logo">{this.state.title}</a>
              <a href="#" data-activates="slide-out"  className="button-collapse"><i className="material-icons">menu</i></a>
            </div>
          </nav>
          <div>
            <section className="content">
              { this.props.children }
            </section>
          </div>
        </main>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Search}></IndexRoute>
      <Route path="search" component={Search}></Route>
      <Route path="registerStudent" component={RegisterStudent}></Route>
      <Route path="registerProgram" component={RegisterProgram}></Route>
      <Route path="programs" component={Programs}></Route>
      <Route path="overview/:matricula" component={Overview}></Route>
      <Route path="editProgram/:id" component={EditProgram}></Route>
      <Route path="editStudent/:matricula" component={EditStudent}></Route>
    </Route>
  </Router>
,document.getElementById("app"));
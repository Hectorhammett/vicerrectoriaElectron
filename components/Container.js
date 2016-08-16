import React, {Component} from 'react';

class Container extends Component {
  componentDidMount() {
    $(".button-collapse").sideNav();
  }
  
  render() {
    return (
      <div>
         <main>
            <nav>
              <div className="nav-wrapper">
                <a href="#" className="brand-logo">Current Section</a>
                <a href="#" data-activates="slide-out"  className="button-collapse"><i className="material-icons">menu</i></a>
              </div>
            </nav>
            <div className="container">
              <section className="content">
                
              </section>
            </div>
          </main>
      </div>
    );
  }
}

export default Container;
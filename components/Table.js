import React, {Component} from 'react';

class Table extends Component {
  renderHeaders(){
    return this.props.headers.map(function(value){
      return <th>{value}</th>
    })
  }

  renderRows(){
    if(this.props.loading)
      return(
        <tr>
          <td className="center-align" colSpan={this.props.headers.length}>
            <div className="preloader-wrapper big active">
              <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div><div className="gap-patch">
                  <div className="circle"></div>
                </div><div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )
    if(this.props.rows != undefined){
      console.log('rows',this.props.rows);
      let that = this;
      return this.props.rows.map(function(row){
          return <tr key={row.doc._id} onClick={that.props.handleRowClick.bind(this,row.doc)}>
            {
              that.props.keys.map(function(head){
                return <td>{row.doc[head]}</td>
              })
            }
          </tr>
        });
      }
  }

  render() {
    return (
      <div>
       <div className="row">
        <div className="col s12">
           <table className="striped highlight">
            <thead>
              {this.renderHeaders()}
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>
       </div>
       <div className="row">
       </div>        
      </div>
    );
  }
}

export default Table;
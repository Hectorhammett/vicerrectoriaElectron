import React, {Component} from 'react';

class Table extends Component {
  constructor(props){
    super(props);
    let loading = true;
    if(this.props.loading != undefined)
      loading = this.props.loading;
    this.state ={
      results: 10,
      page: 1,
      filtered: [],
      loading: loading,
      rows:[],
      widths:[],
      orderBy: "",
      orderState: 0 //0 = not sorting, 1 = ASC, 2 = DESC
    };
  }
  
  componentDidMount() {
    this.createURLRequest();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.request){
      this.createURLRequest();
    }
    if(this.props.url == undefined){
      let rows = [];
      let filtered = [];
      let loading = true;
      if(nextProps.rows != undefined){
        rows = nextProps.rows;
        filtered = nextProps.rows.slice(0);
        loading = false;
      }
      this.setState({rows,filtered,loading},this.getWidthForColumns);
    }
    if(nextProps.loading != undefined){
      let loading = nextProps.loading.loading;
      this.setState({loading});
    }
  }
  
  createURLRequest(){
    if(this.props.url != undefined){
      let that = this;
      $.get(this.props.url,this.props.parameters,function(rows){
        let filtered = rows.slice(0);
        that.setState({rows,filtered},that.getWidthForColumns.bind(that));
      })
      .fail(function(response){
        Materialize.toast(response.responseText,3000,'red');
      })
      .always(function(){
        let loading =false;
        that.setState({loading});
      });
    }
  }

  getWidthForColumns(){
    if(this.props.values != undefined && this.state.rows.length > 0){
      let rows = this.state.rows.slice(0);
      let widths = {};
      let that = this;
      for(var x in this.props.values){
        rows.sort(function(a,b){
          return b[that.props.values[x]].length - a[that.props.values[x]].length;
        })
        widths[this.props.values[x]] = rows[0][that.props.values[x]];
      }
      let filtered = [widths];
      this.setState({filtered},function(){
        let totalWidth = $(this.refs.dataTable).width();
        let filtered = this.state.rows.slice(0);
        widths = [];
        $('th',this.refs.dataTable).each(function(index){
          widths.push(($(this).width() * 100)/totalWidth);
        })
        this.setState({widths,filtered});
      });
    }
  }

  renderHeaders(){
    let that = this;
    return this.props.headers.map(function(header,i){
      return <th onClick={that.orderByHeader.bind(that,i)} style={(that.state.widths.length > 0) ? {width:(that.state.widths[i] + "%")} : {}}>{header}{that.renderChevron(i)} </th>
    })
  }

  renderChevron(index){
    if(this.state.orderBy == this.props.values[index]){
      switch(this.state.orderState){
        case 1: return <i className="material-icons right table-chevron">arrow_drop_up</i>
        case 2: return <i className="material-icons right table-chevron">arrow_drop_down</i>
        default: return null
      }
    }
    return null
  }

  renderRows(){
    if(this.state.loading){
      return (
        <tr><td colSpan={this.props.headers.length}>
          <div className="progress">
            <div className="indeterminate"></div>
          </div>
        </td></tr>
      )
    }
    if(this.state.filtered.length == 0){
      return <tr><td colSpan={this.props.values.length} style={{textAlign: "center"}}> No results found </td></tr>
    }
    let that = this;
    let begin = (this.state.results * this.state.page) - this.state.results;
    return this.state.filtered.slice(begin, parseInt(begin) + parseInt(this.state.results)).map(function(row){
      return <tr onClick={(that.props.onRowClick != undefined) ? that.props.onRowClick.bind(this,row) : null}>{that.renderCells(row)}</tr>
    });
  }

  renderCells(row){
    let that = this;
    if(this.props.values)
      return this.props.values.map(function(key){
        return <td style={that.props.style}>{row[key]}</td>
      });

    let keys = Object.keys(this.props.rows[0]);
    return keys.map(function(key){
      return <td style={that.props.style}>{row[key]}</td>
    });
  }

  renderPagination(){
    let pages = Math.ceil(this.state.filtered.length / this.state.results);
    let pills = [];
    for(let i = 1; i <= pages; i++){
      pills.push(<li className={(this.state.page == i)? "active" : null} onClick={this.changePage.bind(this,i)}><a href="#">{i}</a></li>);
    }
    return pills.map(function(li){
      return li
    });
  }

  renderTotal(){
    return(
      <span>
        {this.state.filtered.length} Results
      </span>
    )
  }

  changeResultsPerPage(e){
    let results = e.target.value;
    this.setState({results});
  }

  changeFilter(e){
    let filter = e.target.value;
    let page = 1;
    if(filter != ""){
      let filtered = this.state.rows.filter(this.applyFilter.bind(this,filter));
      this.setState({filtered});
    }
    else{
      let filtered = this.state.rows;
      this.setState({filtered});
    }
  }

  applyFilter(filter,row){
    if(this.props.filter != undefined && this.props.filter.length > 0){
      for(var x in this.props.filter){
        if(row[this.props.filter[x]].match(new RegExp(filter,"i")))
          return row;
      }
    }
    else{
      for(var prop in row){
        if(typeof row[prop].match == 'function')
          if(row[prop].match(new RegExp(filter,"i")))
            return row;
      }
    }
  }

  orderByHeader(index){
    let orderBy = this.props.values[index]
    let orderState = this.state.orderState;
    if(orderBy === this.state.orderBy)
      orderState = (++orderState%3);
    else
      orderState = 1;
    let filtered = this.state.rows.slice(0);
    if(orderState != 0){
      filtered.sort(this.applyOrderState.bind(this,orderState,orderBy));
    }
    this.setState({filtered,orderBy,orderState});
  }

  applyOrderState(orderState,orderBy,a,b){
    let x = parseFloat(a[orderBy]);
    let y = parseFloat(b[orderBy]);
    if(isNaN(x) && isNaN(y)){
      if(orderState == 1)
        return a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;
      return a[orderBy] < b[orderBy] ? 1 : a[orderBy] > b[orderBy] ? -1 : 0;
    }
    if(orderState == 1)
      return (x-y) * -1;
    return x-y;
  }

  changePage(i,e){
    e.preventDefault();
    let page = i;
    this.setState({page});
  }

  upPage(e){
    e.preventDefault();
    if(this.state.page < Math.ceil(this.props.rows.length/this.state.results)){
      let page = this.state.page + 1;
      this.setState({page});
    }
  }

  downPage(e){
    e.preventDefault();
    if(this.state.page != 1){
      let page = this.state.page - 1;
      this.setState({page});
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col s12">
          <div className="row">
            <div className="col l2 m4 s12">
              <label>Results per page</label>
              <select className="browser-default" value={this.state.results} onChange={this.changeResultsPerPage.bind(this)}>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="input-field right col l3 m4 s12">
              <input id="last_name" type="text" onChange={this.changeFilter.bind(this)}/>
              <label htmlFor="last_name">Search</label>
            </div>
          </div>
          <div className="row">
            <table className={this.props.className} ref="dataTable">
              <tbody>
                {this.renderHeaders()}
                {this.renderRows()}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col s12">
              {this.renderTotal()}
              <ul className="pagination right">
                <li className="waves-effect"><a href="#!" onClick={this.downPage.bind(this)}><i className="material-icons">chevron_left</i></a></li>
                {this.renderPagination()}
                <li className="waves-effect"><a href="#!" onClick={this.upPage.bind(this)}><i className="material-icons">chevron_right</i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';

import Form from './Form';

class Home extends React.Component {
  constructor(props) {
  super(props);

  this.handleDelete = this.handleDelete.bind(this);
  this.handleEdit = this.handleEdit.bind(this);
}

componentDidMount() {
  const { onLoad } = this.props;
  //Set the state of articles when loading(before rendering)
  axios('/api/articles')
    .then((res) => onLoad(res.data));
}

handleDelete(id) {
  const { onDelete } = this.props;
  //Delete the article by id and then return new state of articles (form reducer)
  return axios.delete(`/api/articles/${id}`)
    .then(() => onDelete(id));
}

handleEdit(article) {
  const { setEdit } = this.props;
  //set articleToEdit true
  setEdit(article);
}

  render() {
    const { articles } = this.props;

    return (
      <div className="container">
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            <h1 className="text-center">Binglog</h1>
          </div>
          <Form />
        </div>
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            {articles.map((article) => {
              return (
                <div className="card my-3">
                  <div className="card-header">
                    {article.title}
                  </div>
                  <div className="card-body">
                    {article.body}
                    <p className="mt-5 text-muted"><b>{article.author}</b> {moment(new Date(article.createdAt)).fromNow()}</p>
                  </div>
                  <div className="card-footer">
                    <div className="row">
                      <button onClick={() => this.handleEdit(article)} className="btn btn-primary mx-3">
                        Edit
                      </button>
                      <button onClick={() => this.handleDelete(article._id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  articles: state.home.articles,
});
//Note: actions are here
const mapDispatchToProps = dispatch => ({
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
  onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
  setEdit: article => dispatch({ type: 'SET_EDIT', article })
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

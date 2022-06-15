const { addBookandler, getAllBookandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler } = require('./handler');
const routes = [
    {
    method: 'POST',
    path: '/books',
    handler: addBookandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler ,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler ,
  },
];

module.exports = routes;
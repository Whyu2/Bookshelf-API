
const books = require('./books');
const { nanoid } = require('nanoid');

// Kriteria 1 : API dapat menyimpan buku
const addBookandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    //Validasi nama kosong
    if(!name){ 
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
          });
          response.code(400);
          return response;
     };
    //Validasi readpage
     if(readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
          });
          response.code(400);
          return response;
     };
    //Membuat random id
    const id = nanoid(16);
    //Observasi buku dibaca
    let finished  = false;
    if (pageCount === readPage){
        finished = true;
    };
    //Pembuatan tanggal baru
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    //inisiasi array baru
    const newBook = {
       id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };
    //masukkan array
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    //pengecekan kondisi bila id lebih dari 0 maka proses simpan berhasil
    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
        
      });
      response.code(500);
      return response;

}

// Kriteria 2 : API dapat menampilkan seluruh buku
// const getAllBookandler = () => ({
//     status : 'success',
//     data : {
//         books:books.map((book) => ({
//             id: book.id,
//             name: book.name,
//             publisher: book.publisher,
//           })),
//     },
// });

// Kriteria 2 : API dapat menampilkan seluruh buku dan berdasarkan query paramaters (opsional)
const getAllBookandler = (request, h) => {
    //mendapatkan query parameters
    const {name,reading,finished } = request.query;
    //deklarasi object untuk filtering
    let fil = null;
    if (name!==undefined){
        //fiilter berdasarkan nama
        fil = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
        const response = h.response({
          status: 'success',
          data : {
                //Tampilkan data sesuai kebutuhan
                books:fil.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
        });
        response.code(200);
        return response;
    }
    if (reading){
        //fiilter berdasarkan reading 
        fil = books.filter((b) => b.reading == reading);
         const response = h.response({
           status: 'success',
           data : {
            //Tampilkan data sesuai kebutuhan
            books:fil.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
         response.code(200);
         return response;
     }
     if (finished ){
        //fiilter berdasarkan finished 
        fil = books.filter((b) => b.finished  == finished );
         const response = h.response({
           status: 'success',
           data : {
            //Tampilkan data sesuai kebutuhan
            books:fil.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
         response.code(200);
         return response;
     }

    const response = h.response({
        status: 'success',
         data : {
        books:books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
    },
      });
      response.code(200);
      return response;
};

//Kriteria 3 : API dapat menampilkan detail buku
const getBookByIdHandler = (request, h) => {
    //mendapatkan paramater id
    const {id} = request.params;
    //array select dengan parameter id
    const book = books.filter((n) => n.id === id)[0];

    if(book !== undefined){
       return{
            status: 'success', 
            data: {
              book,
            },
          };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      });
      response.code(404);
      return response;
    };

// Kriteria 4 : API dapat mengubah data buku
const editBookByIdHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
      //Validasi nama kosong
      if(!name){ 
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
          });
          response.code(400);
          return response;
     };
       //Validasi readpage
       if(readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
          });
          response.code(400);
          return response;
     };
    //mengambil paramater id
    const {id} = request.params;
    //mencari buku bedasarkan id
    const findbook = books.findIndex((book) => book.id === id);
    const updatedAt = new Date().toISOString();
    //respon apabila ketemu
    if (findbook !== -1 ){
        books[findbook] = {
            ...books[findbook],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
        };
        const response = h.response({
            status : 'success',
            message : 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;}
    //respon apabila tidak ketemu
    const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}
// Kriteria 5 : API dapat menghapus buku
const deleteBookByIdHandler = (request, h) =>{
  //mengambil paramater id
  const {id} = request.params;
  //mencari buku bedasarkan id
  const findbook = books.findIndex((book) => book.id === id);
  if(findbook !== -1){
    books.splice(findbook, 1);
    const response = h.response({
        status :'success',
        message : 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
    }
    const response = h.response({
        status : 'fail',
        message : 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

module.exports = {addBookandler, getAllBookandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
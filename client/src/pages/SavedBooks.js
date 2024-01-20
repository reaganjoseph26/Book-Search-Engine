import React, { useEffect, useState } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ME } from "../utils/queries";
import { DELETE_BOOK, GET_SAVEDBOOKS } from "../utils/mutations";
import { removeBookId } from "../utils/localStorage";
import LoginForm from "../components/LoginForm";

const SavedBooks = () => {
  
  const [books] = useMutation(GET_SAVEDBOOKS);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  let email = localStorage.getItem('email')
  let password = localStorage.getItem('password')

  useEffect(() => {
    try {
      books({
        variables: { email, password },
        refetchQueries: [{ query: GET_ME }],
      }).then((data) => {
        //console.log(data);
        if (data) {
          setData([data.data.login.user.savedBooks]);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const [deleteBook] = useMutation(DELETE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database

  const userData = data || {};
  //console.log(userData, loading);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook({
        variables: { bookId },
        refetchQueries: [{ query: GET_ME }],
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.length
            ? `Viewing ${userData[0].length} saved ${
                userData[0].length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData[0].map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;

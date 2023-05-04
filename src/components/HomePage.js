import { auth, getImages } from "../services/firebase";
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "../App.css";

const Home = ({ user }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const imagesData = await getImages();
      setImages(imagesData);
    };

    fetchImages();
  }, []);
  
  const getDateFromImageUrl = (imageUrl) => {
    const imageName = imageUrl.split("/").slice(-1)[0];
    const nameParts = imageName.split(".")[0].split("_");
    const date = nameParts[1] + "_" + nameParts[2];
    return date;
  };
  
  

  

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Welcome, {user.email}</Navbar.Brand>
        <Nav className="ml-auto">
          <Button
            style={{ marginRight: "auto" }}
            variant="outline-danger"
            type="submit"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        </Nav>
      </Navbar>
      <div className="container-fluid" style={{ marginTop: "5%" }}>
        <div className="row justify-content-center">
          {images.map((image) => (
            <div className="col-md-4" key={image.id}>
              <Card>
                <Card.Body>
                  <Card.Title>Date </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                  {getDateFromImageUrl(image.url)}
                  </Card.Subtitle>
                  <Card.Title>Location </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {image.place}
                  </Card.Subtitle>
                  <img
                    src={image.url}
                    alt={image.name}
                    className="img-fluid"
                  />
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

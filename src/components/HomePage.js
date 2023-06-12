import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { auth, getImages, deleteImage } from "../services/firebase";

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
  const handleDeleteImage = async (imageId) => {
    try {
      await deleteImage(imageId);
      const updatedImages = images.filter((image) => image.id !== imageId);
      setImages(updatedImages);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Welcome, {user.email} </Navbar.Brand>
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
          {images.length > 0 ? (
            images.map((image) => (
              <div className="col-md-4" key={image.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>Date</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {getDateFromImageUrl(image.url)}
                    </Card.Subtitle>
                    <Card.Title>Location</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {image.place}
                    </Card.Subtitle>
                    <img src={image.url} alt={image.name} className="img-fluid" />
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteImage(image.id)}
                      style={{ marginTop: "1rem" }}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

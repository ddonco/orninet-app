import React from "react";
import Card from "react-bootstrap/Card";

const images = require.context("../../images", true);

export default function ImageCard(image) {
  const imageCategories = JSON.parse(image.value.categories);

  return (
    <Card key={image.value.id} style={{ width: '18rem' }}>
      <Card.Img variant="top" src={images("./" + image.value.name)} />
      <Card.Body>
        <Card.Title>{image.value.name}</Card.Title>
        <Card.Text>
          Detections:&nbsp;
          {Array.prototype.map
            .call(imageCategories.detections, (s) => s.species)
            .toString(", ")}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">{image.timestamp}</small>
      </Card.Footer>
    </Card>
  );
}

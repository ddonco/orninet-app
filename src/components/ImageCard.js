import React from "react";
import Card from "react-bootstrap/Card";

const images = require.context("../../images", true);

export default function ImageCard(image) {
  const imageCategories = JSON.parse(image.value.categories);
  const date = new Date(image.value.timestamp);

  return (
    <Card key={image.value.id} style={{ width: '20rem' }}>
      <Card.Img variant="top" src={images("./" + image.value.name)} />
      <Card.Body>
        <Card.Title>{image.value.name}</Card.Title>
        <Card.Text>
          Detections:&nbsp;
          {Array.prototype.map
            .call(imageCategories.detections, (s) => s.species)
            .join(", ")}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">{`${date.getMonth()}/${date.getDay()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</small>
      </Card.Footer>
    </Card>
  );
}

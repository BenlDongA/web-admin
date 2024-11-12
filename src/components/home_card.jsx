import React from 'react';
import { Card, Button } from 'react-bootstrap';

const HomeCard = ({ homeId, image, title, price, duration, onDelete, onEdit }) => {
  return (
    <Card className="mb-4">
      <Card.Img 
        variant="top" 
        src={image} 
        alt={title} 
        style={{
          width: '100%', 
          height: '200px', // Fixed height  
          objectFit: 'cover', // Ensures the image covers the area without distortion
        }} 
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {price} | {duration}
        </Card.Text>
        <Button variant="primary" onClick={() => onEdit(homeId)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(homeId)} className="ml-2">
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default HomeCard;

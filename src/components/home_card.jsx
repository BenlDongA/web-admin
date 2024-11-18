import React from 'react';
import { Card, Button } from 'react-bootstrap';
import {FaEdit, FaTrash, } from 'react-icons/fa';
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
        <Button   
    variant="outline-warning"   
    onClick={() => onEdit(homeId)}   
    style={{ marginRight: '8px' }}>  
    <FaEdit className="me-1" /> Edit  
</Button>  
<Button variant="outline-danger" onClick={() => onDelete(homeId)}>   
    <FaTrash className="me-1" /> Delete  
</Button>
      </Card.Body>
    </Card>
  );
};

export default HomeCard;

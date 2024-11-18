import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaStar, FaEdit, FaTrash, FaThumbsUp, FaCalendarAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import './siba.css';

const TripCard = ({ image, title, price, duration, likes, date, tripId, onDelete, onEdit, countryName  }) => {
  const handleDelete = () => {
    console.log("Deleting trip with ID:", tripId);
    axios.delete(`https://api-flutter-nper.onrender.com/api/trip/${tripId}`)
      .then(response => {
        console.log('Trip deleted:', response.data);
        alert("Trip deleted successfully!");
        if (onDelete) {
          onDelete(tripId); // Chỉ gọi hàm onDelete từ TripList
        }
      })
      .catch(error => {
        console.error('Error deleting trip:', error);
      });
  };
  
  

  const handleEdit = () => {
    if (onEdit) {
      onEdit(tripId); 
    }
  };

  return (
    <Card style={{ width: '23rem' }} className="mb-4 shadow-sm">
      <Card.Img
        variant="top"
        src={image}
        className="trip-card-img"
        alt={title}
      />
      <Card.Body>
      <Card.Title>
          {title} <span className="text-muted">- {countryName}</span>
          <span className="ms-2 text-warning">
            <FaStar />
          </span>
        </Card.Title>
        <Card.Text>
          <span className="text-muted">
            <FaThumbsUp className="me-1 text-primary" /> {likes} likes
          </span> - 
          <span className="text-muted ms-2">
            <FaCalendarAlt className="me-1 text-info" /> {date}
          </span>
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-danger fw-bold">${price}</span>
          <span className="text-muted">
            <FaClock className="me-1 text-secondary" /> {duration} days
          </span>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-warning" onClick={handleEdit}>
            <FaEdit className="me-1" /> Edit
          </Button>
          <Button variant="outline-danger" onClick={handleDelete}>
          <FaTrash className="me-1" /> Delete
        </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TripCard;
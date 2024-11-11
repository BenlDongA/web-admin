import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import TripCard from './TripCard';
import { FaPlus } from 'react-icons/fa'; // Icon for the Create button

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    price: '',
    duration: '',
    solike: '',
    date: '',
  }); // State to hold the form data
  const [editingTripId, setEditingTripId] = useState(null); // Track which trip is being edited

  // Fetch trips when the component mounts
  useEffect(() => {
    axios.get('https://api-flutter-nper.onrender.com/api/trip')
      .then((response) => {
        setTrips(response.data);  
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });
  }, []);  // Empty dependency to only run once on mount

  const handleCreateTrip = () => {
    // Open the modal
    setEditingTripId(null); // Set null to signify creating a new trip
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTripId) {
      // If editing an existing trip, update it
      axios.put(`https://api-flutter-nper.onrender.com/api/trip/${editingTripId}`, formData)
        .then((response) => {
          const updatedTrips = trips.map((trip) => 
            trip._id === editingTripId ? response.data : trip
          );
          setTrips(updatedTrips);
          setShowModal(false); // Close modal
          alert("Trip updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating trip:", error.response || error.message);
        });
    } else {
      // If creating a new trip, submit as a new entry
      axios.post('https://api-flutter-nper.onrender.com/api/trip', formData)
        .then((response) => {
          setTrips([...trips, response.data]);
          setShowModal(false); // Close modal
          alert("Trip created successfully!");
        })
        .catch((error) => {
          console.error("Error creating trip:", error.response || error.message);
        });
    }
  };

  const handleDelete = (id) => {
    // Gọi API để xóa chuyến đi
    axios.delete(`https://api-flutter-nper.onrender.com/api/trip/${id}`)
      .then(() => {
        // Cập nhật lại trạng thái trips bằng cách loại bỏ chuyến đi đã xóa
        setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting trip:", error);
      });
  };

  const handleEdit = (tripId) => {
    const tripToEdit = trips.find((trip) => trip._id === tripId);
    setFormData({
      name: tripToEdit.name,
      avatar: tripToEdit.avatar,
      price: tripToEdit.price,
      duration: tripToEdit.duration,
      solike: tripToEdit.solike,
      date: tripToEdit.date,
    });
    setEditingTripId(tripId);
    setShowModal(true);
  };

  // Render trips only if it's not an empty array or undefined
  if (!Array.isArray(trips)) {
    console.error("Trips data is not in the expected array format", trips);
    return <div>Failed to load trips. Please try again later.</div>;
  }

  return (
    <Container>
      {/* Create Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={handleCreateTrip}>
          <FaPlus className="me-2" /> Create Trip
        </Button>
      </div>

      {/* List of trips */}
      <Row>
        {trips.length > 0 ? trips.map((trip) => (
          <Col md={4} key={trip._id}>
            <TripCard
              tripId={trip._id} // Pass the tripId here
              image={trip.avatar}
              title={trip.name}
              price={trip.price}
              duration={trip.duration}
              likes={trip.solike}
              date={trip.date ? trip.date.slice(0, 10) : ''}
              onDelete={handleDelete} // Pass onDelete function
              onEdit={handleEdit} // Pass onEdit function to handle editing
            />
          </Col>
        )) : <p>No trips available.</p>}
      </Row>

      {/* Modal for creating or editing a trip */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTripId ? 'Edit Trip' : 'Create New Trip'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Trip Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAvatar">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDuration">
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSolike">
              <Form.Label>Likes</Form.Label>
              <Form.Control
                type="number"
                name="solike"
                value={formData.solike}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {editingTripId ? 'Update Trip' : 'Create Trip'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TripList;
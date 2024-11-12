import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import TripCard from './TripCard';
import { FaPlus } from 'react-icons/fa';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    price: '',
    duration: '',
    solike: '',
    date: '',
  });
  const [editingTripId, setEditingTripId] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null); // New state for date filter

  useEffect(() => {
    axios.get('https://api-flutter-nper.onrender.com/api/trip')
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });
  }, []);

  const handleCreateTrip = () => {
    setEditingTripId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
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
      axios.put(`https://api-flutter-nper.onrender.com/api/trip/${editingTripId}`, formData)
        .then((response) => {
          const updatedTrips = trips.map((trip) => 
            trip._id === editingTripId ? response.data : trip
          );
          setTrips(updatedTrips);
          setShowModal(false);
          alert("Trip updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating trip:", error.response || error.message);
        });
    } else {
      axios.post('https://api-flutter-nper.onrender.com/api/trip', formData)
        .then((response) => {
          setTrips([...trips, response.data]);
          setShowModal(false);
          alert("Trip created successfully!");
        })
        .catch((error) => {
          console.error("Error creating trip:", error.response || error.message);
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`https://api-flutter-nper.onrender.com/api/trip/${id}`)
      .then(() => {
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

  const filteredTrips = trips.filter((trip) => {
    if (priceFilter === 'above' && trip.price <= 10) return false;
    if (priceFilter === 'below' && trip.price > 10) return false;
    if (dateFilter && trip.date.slice(0, 10) !== dateFilter) return false; // Filter by date
    return true;
  });

  return (
    <Container>
      <div className="d-flex justify-content-between mb-3">
        {/* Filter Dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Filter by Price
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setPriceFilter('above')}>Above $10</Dropdown.Item>
            <Dropdown.Item onClick={() => setPriceFilter('below')}>Below $10</Dropdown.Item>
            <Dropdown.Item onClick={() => setPriceFilter(null)}>All</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Date Picker */}
        <Form.Control
          type="date"
          value={dateFilter || ''}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ maxWidth: '200px' }}
        />

        {/* Create Button */}
        <Button variant="success" onClick={handleCreateTrip}>
          <FaPlus className="me-2" /> Create Trip
        </Button>
      </div>

      <Row>
        {filteredTrips.length > 0 ? filteredTrips.map((trip) => (
          <Col md={4} key={trip._id}>
            <TripCard
              tripId={trip._id}
              image={trip.avatar}
              title={trip.name}
              price={trip.price}
              duration={trip.duration}
              likes={trip.solike}
              date={trip.date ? trip.date.slice(0, 10) : ''}
              onDelete={handleDelete}
              onEdit={handleEdit}
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal, Form} from 'react-bootstrap';
import TripCard from './TripCard';
import { FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import ReactSlider from 'react-slider';
import { BsCashCoin } from "react-icons/bs";
import './trip.css'
import { FaFilterCircleDollar } from "react-icons/fa6";
const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState(null);
const [endDateFilter, setEndDateFilter] = useState(null); 
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    price: '',
    duration: '',
    solike: '',
    date: '',
    countryName: '', 
  });
  const [editingTripId, setEditingTripId] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 200]); 
  const [countryFilter, setCountryFilter] = useState(null);

  useEffect(() => {
    axios.get('https://api-flutter-nper.onrender.com/api/trip')
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });
    axios.get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryOptions = [
          { value: null, label: 'All' },
          ...response.data.map((country) => ({
            value: country.name.common,
            label: country.name.common,
          })),
        ];
        setCountries(countryOptions);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, [trips]);

  const handleCreateTrip = () => {
    setEditingTripId(null);
    setFormData({
      name: '',
      avatar: '',
      price: '',
      duration: '',
      solike: '',
      date: '',
      countryName: '',
    });
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

  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      countryName: selectedOption ? selectedOption.value : '',
    });
  };
  const handleCountryFilterChange = (selectedOption) => {
    setCountryFilter(selectedOption ? selectedOption.value : null);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về 0 để so sánh chính xác
  
    if (selectedDate < today) {
      alert('The selected date cannot be in the past.');
      return; // Ngăn submit
    }
  
    if (editingTripId) {
      axios
        .put(`https://api-flutter-nper.onrender.com/api/trip/${editingTripId}`, formData)
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
          alert(
            error.response?.data?.message ||
            "An error occurred while updating the trip."
          );
        });
    } else {
      axios
        .post('https://api-flutter-nper.onrender.com/api/trip', [formData])
        .then((response) => {
          setTrips([...trips, response.data]);
          setShowModal(false);
          alert("Trip created successfully!");
        })
        .catch((error) => {
          console.error("Error creating trip:", error.response || error.message);
          alert(
            error.response?.data?.message ||
            "An error occurred while creating the trip."
          );
        });
    }
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
      countryName: tripToEdit.countryName, 
    });
    setEditingTripId(tripId);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    axios.delete(`https://api-flutter-nper.onrender.com/api/trip/${id}`)
      .then(() => {
        setTrips(prevTrips => prevTrips.filter(trip => trip._id !== id));
        alert("Trip deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting trip:", error);
      });
  };

  const filteredTrips = trips.filter((trip) => {
    if (trip.price < priceRange[0] || trip.price > priceRange[1]) return false;
    const tripDate = trip.date ? new Date(trip.date.slice(0, 10)) : null;
    if (tripDate && startDateFilter && new Date(startDateFilter) > tripDate) return false;
    if (tripDate && endDateFilter && new Date(endDateFilter) < tripDate) return false;

    if (countryFilter && trip.countryName !== countryFilter) return false;

    return true;
  });
  const handlePriceRangeChange = (value) => setPriceRange(value);
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Filter by Price */}
        <div className="me-3">
          <h5><FaFilterCircleDollar style={{ marginRight: 10 }} /> Filter by Price</h5>
          <ReactSlider
            className="slider"
            thumbClassName="slider-thumb"
            trackClassName="slider-track"
            value={priceRange}
            onChange={handlePriceRangeChange}
            min={0}
            max={200}
            step={1}
            renderTrack={(props, state) => {
              const trackClass =
                state.index === 1 ? 'slider-track-middle' : 'slider-track';
              return <div {...props} className={trackClass} />;
            }}
          />
          <div className="price-range-text">
            <BsCashCoin style={{ fontSize: 20, fontWeight: 'bold' }} /> ${priceRange[0]} - ${priceRange[1]}
          </div>
        </div>

        {/* Date Filters */}
        <div className="d-flex flex-wrap justify-content-between">
          <div className="me-3 d-flex align-items-center">
            <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Start Date:</span>
            <Form.Control
              type="date"
              value={startDateFilter || ''}
              onChange={(e) => setStartDateFilter(e.target.value)}
              style={{ maxWidth: '160px' }}
            />
          </div>
          <div className="d-flex align-items-center">
            <span style={{ fontWeight: 'bold', marginRight: '5px' }}>End Date:</span>
            <Form.Control
              type="date"
              value={endDateFilter || ''}
              onChange={(e) => setEndDateFilter(e.target.value)}
              style={{ maxWidth: '160px' }}
            />
          </div>
        </div>

        {/* Country Filter */}
        <div className="me-3" style={{ Width: '120%' }}>
        <Select
          options={countries}
          value={countries.find(option => option.value === countryFilter)}
          onChange={handleCountryFilterChange}
          isClearable={true}
          placeholder="Filter by Country"
          styles={{
            menu: (base) => ({
              ...base,
              maxHeight: 200,
              overflowY: 'auto',
            }),
            control: (base) => ({
              ...base,
              width: 200,
            }),
          }}
        />
        </div>

        {/* Create Trip Button */}
        <Button variant="success" onClick={handleCreateTrip}>
          <FaPlus className="me-2" /> Create Trip
        </Button>
      </div>

      <Row className="g-4">
        {filteredTrips.length > 0 ? filteredTrips.map((trip) => (
          <Col lg={4} md={6} sm={12}  key={trip._id}>
            <TripCard
              tripId={trip._id}
              image={trip.avatar}
              title={trip.name}
              price={trip.price}
              duration={trip.duration}
              likes={trip.solike}
              date={trip.date ? trip.date.slice(0, 10) : ''}
              countryName={trip.countryName} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Col>
        )) : <p>No trips available.</p>}
      </Row>

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
            <Form.Group controlId="formCountryName">
              <Form.Label>Country Name</Form.Label>
              <Select
                options={countries}
                value={countries.find(option => option.value === formData.countryName)}
                onChange={handleCountryChange}
                isClearable={true}
                placeholder="Select a country"
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
            <Form.Group controlId="formLikes">
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
            <Button variant="primary" type="submit">
              {editingTripId ? 'Update Trip' : 'Create Trip'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TripList;

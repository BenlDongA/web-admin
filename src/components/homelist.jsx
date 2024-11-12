import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import HomeCard from './home_card';

const HomeList = () => {
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    locationName: '',
    imageUrl: '',
    countryName: '',
    tpye_home: '',  // Default filter for type of home
  });
  const [editingHomeId, setEditingHomeId] = useState(null);

  useEffect(() => {
    // Fetch homes data
    axios.get('https://api-flutter-nper.onrender.com/api/home')
      .then((response) => {
        setHomes(response.data);
        setFilteredHomes(response.data);  // Set all homes as the initial filtered list
      })
      .catch((error) => {
        console.error("Error fetching homes:", error);
      });

    // Fetch countries data from RESTCountries API
    axios.get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryNames = response.data.map((country) => country.name.common);
        const sortedCountryNames = countryNames.sort(); // Sort alphabetically
        const countryOptions = sortedCountryNames.map((country) => ({
          label: country,
          value: country,
        }));
        setCountries(countryOptions); // Set sorted and formatted countries
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Handle filtering homes based on type
  const handleTypeFilterChange = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      tpye_home: selectedType,  // Update filter type
    });

    filterHomes(formData.countryName, selectedType);  // Apply filters
  };

  // Handle filtering homes based on country
  const handleCountryFilterChange = (selectedOption) => {
    const selectedCountry = selectedOption ? selectedOption.value : '';
    setFormData({
      ...formData,
      countryName: selectedCountry,  // Update filter country
    });

    filterHomes(selectedCountry, formData.tpye_home);  // Apply filters
  };

  // Filter homes based on both country and type
  const filterHomes = (country, type) => {
    let filtered = homes;

    if (country && country !== 'All') {  // Skip filtering if 'All' is selected
      filtered = filtered.filter((home) => home.countryName === country);
    }

    if (type) {
      filtered = filtered.filter((home) => home.tpye_home === type);
    }

    setFilteredHomes(filtered);
  };

  const handleCreateHome = () => {
    setEditingHomeId(null);
    setFormData({
      locationName: '',
      imageUrl: '',
      countryName: '',
      tpye_home: '',
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

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      countryName: selectedOption ? selectedOption.value : '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { imageUrl, locationName, countryName, tpye_home } = formData;

    const newHome = {
      imageUrl,
      locationName,
      countryName,
      tpye_home,
    };

    if (editingHomeId) {
      axios.put(`https://api-flutter-nper.onrender.com/api/home/${editingHomeId}`, newHome)
        .then((response) => {
          const updatedHomes = homes.map((home) =>
            home._id === editingHomeId ? response.data : home
          );
          setHomes(updatedHomes);
          setFilteredHomes(updatedHomes);  // Update filtered homes
          setShowModal(false);
          alert("Home updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating home:", error.response || error.message);
        });
    } else {
      axios.post('https://api-flutter-nper.onrender.com/api/home', newHome)
        .then((response) => {
          const newHomes = [...homes, response.data];
          setHomes(newHomes);
          setFilteredHomes(newHomes);  // Update filtered homes
          setShowModal(false);
          alert("Home created successfully!");
        })
        .catch((error) => {
          console.error("Error creating home:", error.response || error.message);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this home?")) {
      axios.delete(`https://api-flutter-nper.onrender.com/api/home/${id}`)
        .then(() => {
          const remainingHomes = homes.filter((home) => home._id !== id);
          setHomes(remainingHomes);
          setFilteredHomes(remainingHomes);  // Update filtered homes after deletion
        })
        .catch((error) => {
          console.error("Error deleting home:", error);
        });
    }
  };

  const handleEdit = (homeId) => {
    const homeToEdit = homes.find((home) => home._id === homeId);
    setFormData({
      locationName: homeToEdit.locationName,
      imageUrl: homeToEdit.imageUrl,
      countryName: homeToEdit.countryName,
      tpye_home: homeToEdit.tpye_home,
    });
    setEditingHomeId(homeId);
    setShowModal(true);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="success" onClick={handleCreateHome}>
          Add New Home
        </Button>
      </div>

      {/* Filters on the same row */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Filter by Home Type</Form.Label>
          <Form.Control as="select" value={formData.tpye_home} onChange={handleTypeFilterChange}>
            <option value="">All</option>
            <option value="DreamTrip">DreamTrip</option>
            <option value="PopularTrip">PopularTrip</option>
          </Form.Control>
        </Col>

        <Col md={6}>
          <Form.Label>Filter by Country</Form.Label>
          <Select
            options={[{ label: 'All', value: 'All' }, ...countries]}  // Add 'All' option
            value={countries.find(option => option.value === formData.countryName) || { label: 'All', value: 'All' }}  // Default to 'All' if no country selected
            onChange={handleCountryFilterChange}
            isClearable={true}
          />
        </Col>
      </Row>

      <Row>
        {filteredHomes.map((home) => (
          <Col md={4} key={home._id}>
            <HomeCard
              homeId={home._id}
              image={home.imageUrl}
              title={home.locationName}
              price={home.countryName}
              duration={home.tpye_home}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Col>
        ))}
      </Row>

      {/* Modal for creating or editing a home */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingHomeId ? 'Edit Home' : 'Create New Home'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLocationName">
              <Form.Label>Location Name</Form.Label>
              <Form.Control
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formImageUrl">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCountryName">
              <Form.Label>Country Name</Form.Label>
              <Select
                options={countries}
                value={countries.find(option => option.value === formData.countryName)}
                onChange={handleSelectChange}
                required
                isClearable={true}
              />
            </Form.Group>

            <Form.Group controlId="formTpyeHome">
              <Form.Label>Home Type</Form.Label>
              <Form.Control
                as="select"
                name="tpye_home"
                value={formData.tpye_home}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                <option value="DreamTrip">DreamTrip</option>
                <option value="PopularTrip">PopularTrip</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              {editingHomeId ? 'Save Changes' : 'Create Home'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HomeList;

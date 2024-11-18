import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import Select from 'react-select';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);  // State for create modal
  const [editingUser, setEditingUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    password: '',
    countryName: '',
  });
  const [newUser, setNewUser] = useState({ // State for new user
    name: '',
    email: '',
    password: '',
    countryName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({});

  // Fetch users and countries data
  useEffect(() => {
    axios.get('https://api-flutter-nper.onrender.com/api/user')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

    axios.get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryOptions = response.data.map((country) => ({
          value: country.name.common,
          label: country.name.common,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Handle delete user
  const handleDelete = (userId) => {
    axios.delete(`https://api-flutter-nper.onrender.com/api/user/${userId}`)
      .then((response) => {
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  // Open the edit modal for the selected user
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedUser({
      name: user.name,
      email: user.email,
      password: user.password,
      countryName: user.countryName || '',
    });
    setShowEditModal(true);
  };

  // Save changes after editing
  const handleSaveChanges = () => {
    axios.put(`https://api-flutter-nper.onrender.com/api/user/${editingUser._id}`, editedUser)
      .then((response) => {
        setUsers(users.map(user => user._id === editingUser._id ? response.data : user));
        setShowEditModal(false);
        alert('User updated successfully');
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  // Handle create user
  const handleCreateUser = () => {
    axios.post('https://api-flutter-nper.onrender.com/api/user', newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        setShowCreateModal(false);
        alert('User created successfully');
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (userId) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  // Handle country change in the form
  const handleCountryChange = (selectedOption) => {
    setEditedUser({
      ...editedUser,
      countryName: selectedOption ? selectedOption.value : '',
    });
  };

  // Handle country change for new user
  const handleCountryChangeNewUser = (selectedOption) => {
    setNewUser({
      ...newUser,
      countryName: selectedOption ? selectedOption.value : '',
    });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h3>User Manager</h3>
          <Button variant="primary" className="mb-3" onClick={() => setShowCreateModal(true)}>
            Create User
          </Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Country</th>
                <th>CreatedAt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span>
                        {passwordVisibility[user._id] ? user.password : '*****'}
                      </span>
                      <Button
                        variant="link"
                        className="ms-2"
                        onClick={() => togglePasswordVisibility(user._id)}
                      >
                        {passwordVisibility[user._id] ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </td>
                  <td>{user.countryName}</td>
                  <td>{user.createdAt}</td>

                  <td>
                    <Button variant="outline-warning" className="me-2" onClick={() => handleEdit(user)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleDelete(user._id)}>
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editPassword">
              <Form.Label>Password</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={editedUser.password}
                  onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                />
                <Button
                  variant="link"
                  className="ms-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>
            <Form.Group controlId="editCountry">
              <Form.Label>Country</Form.Label>
              <Select
                value={countries.find(country => country.value === editedUser.countryName)} // Set the selected country
                onChange={handleCountryChange}
                options={countries} // List of countries
                placeholder="Select country"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="createName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="createEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="createPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="createCountry">
              <Form.Label>Country</Form.Label>
              <Select
                value={countries.find(country => country.value === newUser.countryName)} // Set the selected country
                onChange={handleCountryChangeNewUser}
                options={countries} // List of countries
                placeholder="Select country"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManager;

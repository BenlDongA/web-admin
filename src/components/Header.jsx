import React from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { FaMoon, FaSun, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => (
  <Navbar bg="light" expand="lg" className="justify-content-between">
    <Navbar.Brand as={Link} to="/">Benl Travel Ap</Navbar.Brand>
    <Form className="d-flex">
      <FormControl type="text" placeholder="Search" className="mr-2" />
      <Button variant="outline-primary">Search</Button>
    </Form>
    <Nav>
      <Nav.Link as={Link} to="/dark-mode"><FaMoon /></Nav.Link>
      <Nav.Link as={Link} to="/cart"><FaShoppingCart /></Nav.Link>
      <Nav.Link as={Link} to="/profile"><FaUserCircle /></Nav.Link>
    </Nav>
  </Navbar>
);

export default Header;
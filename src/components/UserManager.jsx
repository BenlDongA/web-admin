import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // state để điều khiển ẩn/hiện mật khẩu trong form chỉnh sửa

  // Thêm một state để quản lý mật khẩu mỗi người dùng trong bảng
  const [passwordVisibility, setPasswordVisibility] = useState({});

  // Lấy dữ liệu người dùng từ API khi component mount
  useEffect(() => {
    axios.get('https://api-flutter-nper.onrender.com/api/user')
      .then((response) => {
        setUsers(response.data); // Lưu dữ liệu người dùng vào state
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Xóa người dùng
  const handleDelete = (userId) => {
    axios.delete(`https://api-flutter-nper.onrender.com/api/user/${userId}`)
      .then((response) => {
        setUsers(users.filter(user => user._id !== userId)); // Cập nhật danh sách sau khi xóa
        alert('User deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  // Mở modal chỉnh sửa người dùng
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedUser({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    setShowEditModal(true);
  };

  // Cập nhật thông tin người dùng
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

  // Hàm để chuyển đổi trạng thái ẩn/hiện mật khẩu của người dùng
  const togglePasswordVisibility = (userId) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Đảo trạng thái mật khẩu của người dùng
    }));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h3>User Manager</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>PassWord</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
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
                        {passwordVisibility[user._id] ? user.password : '*****'} {/* Hiển thị mật khẩu hoặc dấu sao */}
                      </span>
                      <Button
                        variant="link"
                        className="ms-2"
                        onClick={() => togglePasswordVisibility(user._id)} // Thay đổi trạng thái mật khẩu
                      >
                        {passwordVisibility[user._id] ? <FaEyeSlash /> : <FaEye />} {/* Mắt mở/đóng */}
                      </Button>
                    </div>
                  </td>
                  <td>{user.createdAt}</td>
                  <td>{user.updatedAt}</td>
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

      {/* Modal chỉnh sửa người dùng */}
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
                  type={showPassword ? 'text' : 'password'} // Dùng 'text' khi hiển thị, 'password' khi ẩn
                  placeholder="Enter password"
                  value={editedUser.password}
                  onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                />
                <Button
                  variant="link"
                  className="ms-2"
                  onClick={() => setShowPassword(!showPassword)} // Chuyển đổi trạng thái ẩn/hiện
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Hiển thị mắt mở/đóng */}
                </Button>
              </div>
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
    </Container>
  );
};

export default UserManager;
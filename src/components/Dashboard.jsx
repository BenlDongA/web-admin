import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Registering necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // months
    datasets: [
      {
        label: 'Booked Tours',
        data: [120, 150, 100, 300, 250, 190, 210, 180, 230, 160, 280, 320], // number of tours booked each month
        fill: false,
        borderColor: 'rgba(0, 255, 255, 0.7)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Ensures the chart is not constrained by aspect ratio
    aspectRatio: 2,  // Makes the chart shorter (you can adjust this value as needed)
  };

  return (
    <div className="container mt-0">
      <h2 style={{ marginBottom: '0px', paddingTop: '0px' }}>Dashboard</h2>
      <Row className="mb-4">
        {/* Total Tours Card */}
        <Col md={3}>
          <Card className="text-center bg-light border rounded p-3 shadow card-hover" style={{ width: '300px', height: '150px' }}>
            <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/6213/6213814.png" alt="icon" style={{ width: '50px', height: '50px', marginRight: '20px' }} />
              <div>
                <Card.Text className="font-weight-bold text-secondary" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
                  Total Tours
                </Card.Text>
                <h3 className="font-weight-bold text-primary" style={{ fontSize: '2rem' }}>
                  356
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Saved to Wishlist Tours Card */}
        <Col md={3}>
          <Card className="text-center bg-light border rounded p-3 shadow card-hover" style={{ width: '300px', height: '150px' }}>
            <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/6194/6194068.png" alt="icon" style={{ width: '50px', height: '50px', marginRight: '20px',  }} />
              <div>
                <Card.Text className="font-weight-bold text-secondary" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
                 Wishlist Tours
                </Card.Text>
                <h3 className="font-weight-bold text-primary" style={{ fontSize: '2rem' }}>
                  220
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Tours Card */}
        <Col md={3}>
          <Card className="text-center bg-light border rounded p-3 shadow card-hover" style={{ width: '300px', height: '150px' }}>
            <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://i.pinimg.com/736x/f8/8c/93/f88c9387ee7eb7d094feb28d96b1b471.jpg" alt="icon" style={{ width: '60px', height: '60px', marginRight: '20px' }} />
              <div>
                <Card.Text className="font-weight-bold text-secondary" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
                  Upcoming Tours
                </Card.Text>
                <h3 className="font-weight-bold text-primary" style={{ fontSize: '2rem' }}>
                  75
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* New Card */}
        <Col md={3}>
          <Card className="text-center bg-light border rounded p-3 shadow card-hover" style={{ width: '300px', height: '150px' }}>
            <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://i.pinimg.com/736x/85/03/b6/8503b63f0ee64478067d99a190cf19bf.jpg" alt="icon" style={{ width: '50px', height: '50px', marginRight: '25px' }} />
              <div>
                <Card.Text className="font-weight-bold text-secondary" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
                  New Tours
                </Card.Text>
                <h3 className="font-weight-bold text-primary" style={{ fontSize: '2rem' }}>
                  50
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Line Chart for Booked Tours */}
      <Card>
        <Card.Body>
          <Card.Title>Booked Tours</Card.Title>
          <div style={{ height: '300px' }}> {/* Adjust height of the chart container */}
            <Line data={data} options={chartOptions} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
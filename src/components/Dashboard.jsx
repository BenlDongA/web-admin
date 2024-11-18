import React, { useRef } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { RxDashboard } from "react-icons/rx";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import './ds.css'
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const chartRef = useRef(null);

  // Set up the data with gradient border directly
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Booked Tours',
        data: [120, 150, 100, 300, 250, 190, 210, 180, 230, 160, 280, 320],
        fill: true,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderColor: chartRef.current
          ? (() => {
              const ctx = chartRef.current.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, 'rgba(0, 255, 255, 0.7)');
              gradient.addColorStop(1, 'rgba(0, 123, 255, 0)');
              return gradient;
            })()
          : 'rgba(0, 255, 255, 0.7)', // fallback color
        pointBorderColor: 'rgba(0, 123, 255, 1)',
        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
        pointHoverRadius: 8,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };



  return (
    <div className="container mt-0">
      <h2 style={{ marginBottom: '20px', paddingTop: '0px' }}> <RxDashboard style={{marginRight:10, marginTop: -7}}/>Dashboard </h2>
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

      <Card>
        <Card.Body>
          <Card.Title>Booked Tours</Card.Title>
          <div style={{ height: '350px' }}>
            <Line ref={chartRef} data={data} options={chartOptions} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
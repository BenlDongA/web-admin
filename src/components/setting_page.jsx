import React, { useState, useEffect } from 'react';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { LiaSaveSolid } from "react-icons/lia";
import * as XLSX from 'xlsx';

const SettingsPage = () => {
  const [tripData, setTripData] = useState([]);
  const [homData, setHomData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, homRes, userRes] = await Promise.all([
          fetch('https://api-flutter-nper.onrender.com/api/trip'),
          fetch('https://api-flutter-nper.onrender.com/api/home'),
          fetch('https://api-flutter-nper.onrender.com/api/user'),
        ]);

        const tripData = await tripRes.json();
        const homData = await homRes.json();
        const userData = await userRes.json();

        setTripData(tripData);
        setHomData(homData);
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Export data to Excel
  const exportToExcel = () => {
    // Kiểm tra nếu dữ liệu rỗng
    if (!tripData.length && !homData.length && !userData.length) {
      alert('No data to export');
      return;
    }

    // Tạo sheet cho từng loại dữ liệu
    const tripSheet = XLSX.utils.json_to_sheet(tripData);
    const homSheet = XLSX.utils.json_to_sheet(homData);
    const userSheet = XLSX.utils.json_to_sheet(userData);

    // Tạo workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, tripSheet, 'Trip Data');
    XLSX.utils.book_append_sheet(wb, homSheet, 'Home Data');
    XLSX.utils.book_append_sheet(wb, userSheet, 'User Data');

    // Xuất file Excel
    XLSX.writeFile(wb, 'data_admin_export.xlsx');
  };

  // Handle theme change
  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    const isDark = selectedTheme === 'dark';
    setIsDarkMode(isDark);
  };

  // Save dark mode preference to localStorage and apply dark mode class to body
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Dynamic styles based on dark mode
  const themeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <div style={{ ...styles.container, backgroundColor: themeStyles.background }}>
      <h1 style={{ ...styles.header, color: themeStyles.textColor }}>Settings</h1>
      <div style={{ ...styles.section, backgroundColor: themeStyles.sectionBackground }}>
        <h2 style={{ ...styles.sectionHeader, color: themeStyles.textColor }}>Account</h2>
        <label style={{ ...styles.label, color: themeStyles.textColor }}>
          Username:
          <input
            type="text"
            style={{ ...styles.input, backgroundColor: themeStyles.inputBackground, color: themeStyles.inputColor }}
            placeholder="Enter username"
          />
        </label>
        <label style={{ ...styles.label, color: themeStyles.textColor }}>
          Email:
          <input
            type="email"
            style={{ ...styles.input, backgroundColor: themeStyles.inputBackground, color: themeStyles.inputColor }}
            placeholder="Enter email"
          />
        </label>
        <label style={{ ...styles.label, color: themeStyles.textColor }}>
          Password:
          <input
            type="password"
            style={{ ...styles.input, backgroundColor: themeStyles.inputBackground, color: themeStyles.inputColor }}
            placeholder="Enter password"
          />
        </label>
        <button style={{ ...styles.button, backgroundColor: themeStyles.buttonBackground }}>Save Changes<LiaSaveSolid style={{fontSize: 30, marginLeft: 10}}/>

        </button>
      </div>
      <div style={{ ...styles.section, backgroundColor: themeStyles.sectionBackground }}>
        <h2 style={{ ...styles.sectionHeader, color: themeStyles.textColor }}>General Settings</h2>
        <label style={{ ...styles.label, color: themeStyles.textColor }}>
          Theme:
          <select
            style={{ ...styles.select, backgroundColor: themeStyles.inputBackground, color: themeStyles.inputColor }}
            onChange={handleThemeChange}
            value={isDarkMode ? 'dark' : 'light'}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <button onClick={exportToExcel} style={{ ...styles.button, backgroundColor: themeStyles.buttonBackground }}>
           Export to Excel     <PiMicrosoftExcelLogoFill style={{fontSize: 25 ,marginLeft: 5}} /> 
        </button>
      </div>
    </div>
  );
};

// Light mode styles
const lightModeStyles = {
  background: '#f7f7f7',
  textColor: '#333',
  inputBackground: '#fff',
  inputColor: '#333',
  buttonBackground: '#007BFF',
  sectionBackground: '#fff',
};

// Dark mode styles
const darkModeStyles = {
  background: '#333',
  textColor: '#fff',
  inputBackground: '#444',
  inputColor: '#fff',
  buttonBackground: '#0056b3',
  sectionBackground: '#555',
};

const styles = {
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '30px',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  },
  sectionHeader: {
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: '600',
  },
  label: {
    display: 'block',
    margin: '10px 0',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginTop: '5px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginTop: '5px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
  },
};

export default SettingsPage;

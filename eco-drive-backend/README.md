# 🚗 EcoDrive Backend API

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg?style=flat-square)](https://github.com/psf/black)

A powerful FastAPI backend service for analyzing driving patterns and calculating eco-scores. This service provides real-time analysis of driving behavior to help users improve their eco-friendly driving habits.

### 👥 Team Information
<table>
<tr>
<td width="50%">

#### Team Details
- **Team Number**: 138
- **Project Name**: EcoDrive

</td>
<td width="50%">

#### Team Lead
- **Name**: Shivam Singh
- **Registration**: 24BCE11052

</td>
</tr>
</table>

[Getting Started](#-getting-started) •
[Features](#-features) •
[API Documentation](#-api-documentation) •
[Contributing](#-contributing)

</div>

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🎯 Core Features
- Real-time driving pattern analysis
- Eco-score calculation based on multiple parameters
- Detailed driving metrics and recommendations
- RESTful API with comprehensive documentation
- Fast and efficient data processing

</td>
<td width="50%">

### 🛠 Technical Features
- FastAPI for high performance
- Pydantic for data validation
- Async/await support
- OpenAPI documentation
- CORS enabled

</td>
</tr>
</table>

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ecodrive.git
cd ecodrive/eco-drive-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000` 🎉

## 📚 API Documentation

### Interactive Documentation
<div align="center">

[![Swagger UI](https://img.shields.io/badge/Swagger_UI-OpenAPI-85EA2D?style=for-the-badge&logo=swagger)](http://localhost:8000/docs)
[![ReDoc](https://img.shields.io/badge/ReDoc-Documentation-85EA2D?style=for-the-badge&logo=redoc)](http://localhost:8000/redoc)

</div>

### Endpoints

#### 🔍 POST /analyze-driving

Analyzes driving data and returns an eco-score with detailed analysis.

<details>
<summary>Request Body</summary>

```json
{
    "speed": [50.0, 55.0, 45.0],      // Speed measurements in km/h
    "acceleration": [2.0, 1.5, -1.0],  // Acceleration measurements in m/s²
    "braking": [0.5, 0.3, 0.8],       // Braking force measurements in m/s²
    "timestamp": "2024-02-20T10:00:00",
    "trip_id": "trip123"
}
```
</details>

<details>
<summary>Response</summary>

```json
{
    "eco_score": 75.5,                // Score between 0-100
    "trip_id": "trip123",
    "timestamp": "2024-02-20T10:00:01",
    "analysis": {
        "average_speed": 50.0,        // Average speed in km/h
        "average_acceleration": 0.83,  // Average acceleration in m/s²
        "average_braking": 0.53,      // Average braking force in m/s²
        "speed_variability": 0.25,     // Speed variation coefficient
        "acceleration_variability": 0.35, // Acceleration variation coefficient
        "braking_variability": 0.15,   // Braking variation coefficient
        "recommendations": [           // Personalized driving recommendations
            "Maintain steady speed between 45-55 km/h",
            "Use regenerative braking more effectively",
            "Avoid sudden acceleration"
        ]
    }
}
```
</details>

#### 👋 GET /

Welcome endpoint that returns API information.

<details>
<summary>Response</summary>

```json
{
    "message": "Welcome to EcoDrive API",
    "version": "1.0.0",
    "endpoints": {
        "analyze-driving": "/analyze-driving"
    }
}
```
</details>

## 📊 Eco-Score Calculation

The eco-score is calculated based on several factors:

<table>
<tr>
<td width="50%">

### 🎯 Scoring Factors
- Average speed and speed consistency
- Acceleration patterns
- Braking patterns
- Overall driving smoothness

</td>
<td width="50%">

### 📈 Score Ranges
- 90-100: 🌟 Excellent eco-driving
- 70-89: 👍 Good eco-driving
- 50-69: ⚠️ Average eco-driving
- Below 50: 🔧 Needs improvement

</td>
</tr>
</table>

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:

<table>
<tr>
<td width="33%">

### 200
Success

</td>
<td width="33%">

### 400
Bad Request
(invalid input data)

</td>
<td width="33%">

### 500
Internal Server Error

</td>
</tr>
</table>

## 🛠 Development

### Project Structure
```
eco-drive-backend/
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py          # API route definitions
│   │   └── endpoints.py       # API endpoint handlers
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py         # Configuration settings
│   │   └── security.py       # Security utilities
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py        # Pydantic models and schemas
│   ├── services/
│   │   ├── __init__.py
│   │   └── eco_score.py      # Eco-score calculation logic
│   └── utils/
│       ├── __init__.py
│       └── helpers.py        # Helper functions
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test configuration
│   ├── test_api.py          # API endpoint tests
│   └── test_services.py     # Service layer tests
├── main.py                  # Application entry point
├── requirements.txt         # Project dependencies
├── requirements-dev.txt     # Development dependencies
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
└── LICENSE                 # MIT License
```

### Key Components

<table>
<tr>
<td width="50%">

#### 🎯 Core Components
- **API Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Models**: Data validation and serialization
- **Utils**: Helper functions and utilities

</td>
<td width="50%">

#### 🧪 Testing
- **Unit Tests**: Component-level testing
- **Integration Tests**: API endpoint testing
- **Test Fixtures**: Reusable test data
- **Test Configuration**: Test environment setup

</td>
</tr>
</table>

### Adding New Features

1. 🎯 Create a new branch for your feature
2. 💻 Implement the changes
3. 📝 Update the API documentation
4. 🧪 Test thoroughly
5. 🔄 Submit a pull request

## 🧪 Testing

Run tests using pytest:
```bash
pytest
```

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch
3. 💾 Commit your changes
4. 📤 Push to the branch
5. 🔄 Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, please:
- 📝 Open an issue in the GitHub repository
- 📧 Contact the development team

## 🙏 Acknowledgments

<table>
<tr>
<td width="33%">

### 🚀 Frameworks
- FastAPI framework
- Pydantic for data validation

</td>
<td width="33%">

### 👥 Contributors
- All contributors to this project

</td>
<td width="33%">

### 🛠 Tools
- Black for code formatting
- Pytest for testing

</td>
</tr>
</table>

---

<div align="center">

Made with ❤️ by the EcoDrive Team

</div> 
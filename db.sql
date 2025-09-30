create database weather;
use weather;
CREATE TABLE cities (
    name VARCHAR(255) NOT NULL,          -- Name of the city
    Latitude DECIMAL(9, 6) NOT NULL,    -- Latitude with 6 decimal precision
    Longitude DECIMAL(9, 6) NOT NULL    -- Longitude with 6 decimal precision
);
INSERT INTO cities (name, latitude, longitude) VALUES
('Agra', 27.1767, 78.0081),
('Ahmedabad', 23.0225, 72.5714),
('Amritsar', 31.5497, 74.3436),
('Bangalore', 12.9716, 77.5946),
('Bhopal', 23.2599, 77.4126),
('Bhubaneswar', 20.2961, 85.8189),
('Chennai', 13.0827, 80.2707),
('Faridabad', 28.4089, 77.3188),
('Gandhinagar', 23.2156, 72.6369),
('Guwahati', 26.1445, 91.7362),
('Hyderabad', 17.3850, 78.4867),
('Indore', 22.7196, 75.8577),
('Jaipur', 26.9124, 75.7873),
('Jodhpur', 26.2389, 73.0247),
('Kanpur', 26.4499, 80.3319),
('Kolkata', 22.5726, 88.3639),
('Lucknow', 26.8467, 80.9462),
('Ludhiana', 30.9008, 75.8573),
('Meerut', 28.9845, 77.7040),
('Mumbai', 19.0760, 72.8777),
('Nagpur', 21.1458, 79.0882),
('Nashik', 19.9975, 73.7898),
('New Delhi', 28.6139, 77.2090),
('Patna', 25.5941, 85.1376),
('Pune', 18.5204, 73.8567),
('Rajkot', 22.3039, 70.8022),
('Ranchi', 23.3441, 85.3096),
('Srinagar', 34.0836, 74.7973),
('Surat', 21.1702, 72.8311),
('Varanasi', 25.3176, 82.9739),
('Vadodara', 22.3072, 73.1812);
SELECT * FROM cities;
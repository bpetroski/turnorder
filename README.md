# Sales Representatives Turn Order Tracker

This project is a web application designed to manage and track the turn order for sales representatives. It enables users to add representatives, start and finish customer interactions, and view the current turn order and customer counts. The application also includes a feature to clear all data at the end of the day, ensuring a fresh start for the next day.

---

## Features

- **Add New Sales Representatives**: Easily add new representatives to the system.
- **Start and Finish Customer Interactions**: Track customer interactions by starting and finishing them for each representative.
- **View Current Turn Order**: See the order in which representatives are serving customers.
- **Customer Count Tracking**: Monitor the number of customers each representative has served.
- **End-of-Day Data Clearance**: Clear all data at the end of the day to reset the system for the next day.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (jQuery)
- **Backend**: PHP
- **Data Storage**: JSON

---

## Getting Started

### Installation

1. To set up this web application for use, simply clone the repository to a web server that supports PHP (e.g., Apache or Nginx)
2. Make sure the `data.json` file has read and write permissions for the web server

### Running the Application

1. Open your web browser and navigate to the URL where the application is hosted (e.g., `http://localhost:8080` or `https://bjpetroski.com/examples/turn_order`).
2. Use the interface to:
   - Add representatives.
   - Start and finish customer interactions.
   - View the current turn order and customer counts.
---
## Usage

### Adding a Representative
1. Click the "+" button.
2. Enter the representative's name.
3. Click "Confirm" to add them to the system.

### Starting a Customer Interaction
1. Click the "Start Customer" button next to a representative's name.

### Finishing a Customer Interaction
1. Click the "Finish Customer" button next to a representative's name in the "Currently Working" section.

### Clearing Data
1. Click the settings button (cog icon).
2. Click "End Day" to clear all data and reset the system.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Font Awesome** for the settings icon.
- **jQuery** for simplifying JavaScript interactions.
- **Xfinity Color Palette** for the color scheme.

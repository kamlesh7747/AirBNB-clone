# AirBNB Clone Major Project

A full-stack web application inspired by Airbnb, built with **Node.js**, **Express**, **MongoDB**, and **EJS**. This project allows users to create, view, edit, and delete listings, upload images, and add reviews.

---

## Features

- User authentication and authorization  
- Create, read, update, and delete (CRUD) listings  
- Image upload support with Multer and Cloudinary  
- Validation of listing data using Joi  
- Review system linked to listings  
- Error handling with custom `ExpressError` class  
- Responsive UI rendered via EJS templates  

---

## Technologies Used

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose ODM  
- **Validation:** Joi for request data validation  
- **Templating Engine:** EJS  
- **Image Upload:** Multer + Cloudinary  
- **Authentication:** Passport.js 
- **Other:** dotenv for environment variables, method-override for PUT/DELETE support  

---

## Project Folder Structure
AirBNB project folder

├── models/ # Mongoose schemas

├── routes/ # Express route handlers

├── views/ # EJS templates

├── public/ # Static assets (CSS, JS, images)

├── middleware/ # Custom middleware (validation, auth)

├── utils/ # Utility modules (e.g., ExpressError)

├── app.js # Main application file

├── package.json # Dependencies and scripts

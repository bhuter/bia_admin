const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'duugzydli', // Replace with your actual Cloudinary cloud name
  api_key: '252361433938591', // Replace with your actual Cloudinary API key
  api_secret: '8EUyzLtuFB_6zlSyyrUDeWs-dBk', // Replace with your actual Cloudinary API secret
});

module.exports = cloudinary;

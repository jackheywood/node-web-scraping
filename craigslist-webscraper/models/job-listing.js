const mongoose = require('mongoose');

const jobListing = new mongoose.Schema({
  title: String,
  datePosted: Date,
  location: String,
  companyName: String,
  jobTitle: String,
  compensation: String,
  employmentType: String,
  description: String,
  url: String,
});

module.exports = mongoose.model('JobListing', jobListing);
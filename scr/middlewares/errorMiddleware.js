module.exports = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err.stack);
  
    // Set the default status and message
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';
  
    // Handle specific types of errors
    if (err.name === 'ValidationError') {
      status = 400;
      message = Object.values(err.errors).map(val => val.message);
    } else if (err.name === 'CastError') {
      status = 400;
      message = 'Invalid ID';
    } else if (err.code === 11000) {
      status = 400;
      message = 'Duplicate field value';
    }
  
    // Send the error response
    res.status(status).json({
      status: 'error',
      message: message
    });
  };
  
  
  
  
  
  
  
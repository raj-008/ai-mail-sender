module.exports = {
  sendResponse: (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      status: "success",
      message: message || "Opreantion Success",
      data: data,
      statusCode: statusCode,
    });
  },
};

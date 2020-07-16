module.exports = (res, status, data, type, token) => {
  if (token) {
    return res.status(status).json({
      status,
      token,
      [type]: data,
    });
  }

  return res.status(status).json({
    status,
    [type]: data,
  });
};

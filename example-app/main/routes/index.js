const router = require('express').Router();

router.get('/test/:id', (req, res) => {
  res.send({
    params: req.params,
    query: req.query
  });
});

module.exports = router;

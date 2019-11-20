const router = require('express').Router();

router.get('/test/:id', (req, res) => {
  res.send(req.params.id);
});

module.exports = router;

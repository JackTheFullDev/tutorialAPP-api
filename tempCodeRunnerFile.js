app.get('/tutorials/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const sql = 'SELECT * FROM tutorial WHERE user_id = ?';
  const values = [userId];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error retrieving tutorials:', err);
      res.status(500).json({ error: 'Failed to retrieve tutorials' });
      return;
    }

    res.json(results);
  });
});
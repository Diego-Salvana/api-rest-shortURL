export const register = (req, res) => {
   console.log(req.body);
   res.json({ ok: 'soy register' });
};

export const login = (req, res) => {
   console.log(req.body);
   res.json({ ok: 'pepelandia' });
};

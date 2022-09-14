import { Link } from '../models/Link.js';
import { nanoid } from 'nanoid';

export const getLinks = async (req, res) => {
   try {
      const links = await Link.find({ uid: req.uid });

      return res.json({ links });
   } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error de servidor' });
   }
};

export const getLink = async (req, res) => {
   try {
      const { nanoLink } = req.params;
      const link = await Link.findOne({ nanoLink });

      if (!link) return res.status(404).json({ error: 'No existe el link' });

      return res.status(200).json({ longLink: link.longLink });
   } catch (err) {
      console.log('Error: ' + err.message);
      return res.status(404).json({ error: err.message });
   }
};

export const deleteLink = async (req, res) => {
   try {
      const { id } = req.params;
      const link = await Link.findById(id);

      if (!link) return res.status(404).json({ error: 'No existe el link' });

      if (!link.uid.equals(req.uid)) return res.status(401).json({ error: 'Link no autorizado' });

      await link.remove();

      return res.status(200).json({ linkEliminado: link });
   } catch (err) {
      console.log('Error: ' + err.message);
      return res.status(404).json({ error: err.message });
   }
};

export const createLink = async (req, res) => {
   try {
      let { longLink } = req.body;
      if (!longLink.startsWith('https://')) longLink = `https://${longLink}`;

      const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid });
      const newLink = await link.save();

      return res.status(201).json({ newLink });
   } catch (err) {
      return res.json({ error: 'Error de servidor' });
   }
};

export const updateLink = async (req, res) => {
   try {
      const { id } = req.params;
      let { longLink } = req.body;
      if (!longLink.startsWith('https://')) longLink = `https://${longLink}`;

      let link = await Link.findById(id);
      if (!link) return res.status(404).json({ error: 'No existe el link' });
      if (!link.uid.equals(req.uid)) return res.status(401).json({ error: 'Link no autorizado' });

      link.longLink = longLink;
      await link.save();

      return res.status(204).json({ linkModificado: link });
   } catch (err) {
      console.log(err.message);
      if (err.kind === 'ObjectId') return res.status(403).json({ error: 'Formato id no válido' });

      return res.status(500).json({ error: err.message });
   }
};
